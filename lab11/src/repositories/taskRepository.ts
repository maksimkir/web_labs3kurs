import { ApiError } from '../api/errors'
import { hasAccessToken, httpClient } from '../api/httpClient'
import type {
  ApiDeletedTodo,
  ApiTodo,
  CreateTodoPayload,
  TodosResponse,
  UpdateTodoPayload,
} from '../types/api'
import {
  DEFAULT_CATEGORY,
  type NewTask,
  type Task,
  type TaskAuthor,
  type TaskChanges,
  type TaskPage,
} from '../types/task'

/**
 * Repository для Task. Приховує від UI:
 *  - endpoint-и DummyJSON (/todos, /todos/add, /todos/:id);
 *  - формат DTO (ApiTodo.todo → Task.title тощо);
 *  - обмеження навчального API (див. нижче).
 *
 * Компоненти й хуки викликають лише getPage / getById / create / update / delete.
 *
 * DummyJSON лише симулює POST/PUT/PATCH/DELETE: відповідь приходить, але сервер нічого не
 * зберігає. Щоб після переходу між сторінками зміни не «зникали», repository запам'ятовує
 * в пам'яті результат успішних mutation-операцій і накладає його на відповіді сервера.
 * Поля description, priority, category, createdAt API не підтримує — це client-only metadata.
 *
 * Створення, оновлення й видалення — захищені операції: запит іде з auth: true,
 * і httpClient додає Authorization: Bearer <token> (без токена запит не відправиться).
 */

const TODOS_PATH = 'todos'
/** Зміни й client-only metadata для завдань, які є на сервері. */
const patches = new Map<number, TaskChanges>()
/** Створені завдання: сервер повертає їх у відповіді POST, але не зберігає. */
let createdTasks: Task[] = []
const deletedIds = new Set<number>()

function isCreatedLocally(id: number): boolean {
  return createdTasks.some((task) => task.id === id)
}

/** Mapping DTO → domain model. */
function toTask(todo: ApiTodo): Task {
  const task: Task = {
    id: todo.id,
    title: todo.todo,
    description: '',
    completed: todo.completed,
    priority: 'medium',
    category: DEFAULT_CATEGORY,
    createdBy: `Користувач #${todo.userId}`,
    createdAt: null,
  }
  return { ...task, ...patches.get(todo.id) }
}

/** Mapping domain → DTO: у запит потрапляють лише поля, які існують у контракті API. */
function toUpdatePayload(changes: TaskChanges): UpdateTodoPayload {
  const payload: UpdateTodoPayload = {}
  if (changes.title !== undefined) payload.todo = changes.title
  if (changes.completed !== undefined) payload.completed = changes.completed
  return payload
}

function notFound(id: number): ApiError {
  return new ApiError('http', `Todo with id '${id}' not found`, 404)
}

/** DummyJSON повертає для кожного нового todo той самий id (total + 1), тож робимо його унікальним. */
function uniqueId(serverId: number): number {
  const taken = createdTasks.map((task) => task.id)
  return Math.max(serverId, ...taken.map((id) => id + 1))
}

/**
 * Для локально створених завдань HTTP-запиту немає (сервер про них не знає),
 * але дія однаково дозволена лише авторизованому користувачу.
 */
function requireAuth(): void {
  if (!hasAccessToken()) throw new ApiError('unauthorized', 'Authentication required')
}

export interface GetPageParams {
  page: number
  pageSize: number
  signal?: AbortSignal
}

export const taskRepository = {
  /** GET /todos?limit=&skip= — сторінка завдань. */
  async getPage({ page, pageSize, signal }: GetPageParams): Promise<TaskPage> {
    const response = await httpClient.get<TodosResponse>(TODOS_PATH, {
      query: { limit: pageSize, skip: (page - 1) * pageSize },
      signal,
    })
    const serverTasks = response.todos.filter((todo) => !deletedIds.has(todo.id)).map(toTask)
    // нові (не збережені сервером) завдання показуємо на початку першої сторінки
    const tasks = page === 1 ? [...createdTasks, ...serverTasks] : serverTasks
    return {
      tasks,
      total: response.total + createdTasks.length - deletedIds.size,
      page,
      pageSize,
    }
  },

  /** GET /todos/:id — актуальні дані одного завдання. */
  async getById(id: number, signal?: AbortSignal): Promise<Task> {
    if (deletedIds.has(id)) throw notFound(id)
    // створене завдання сервер не зберіг: GET /todos/:id поверне 404, тож віддаємо локальну копію
    const created = createdTasks.find((task) => task.id === id)
    if (created) return created
    const todo = await httpClient.get<ApiTodo>(`${TODOS_PATH}/${id}`, { signal })
    return toTask(todo)
  },

  /** POST /todos/add */
  async create(newTask: NewTask, author: TaskAuthor): Promise<Task> {
    const payload: CreateTodoPayload = { todo: newTask.title, completed: false, userId: author.id }
    const todo = await httpClient.post<ApiTodo>(`${TODOS_PATH}/add`, payload, { auth: true })
    const task: Task = {
      ...newTask,
      id: uniqueId(todo.id),
      title: todo.todo,
      completed: todo.completed,
      createdBy: author.username,
      createdAt: new Date().toISOString(),
    }
    createdTasks = [task, ...createdTasks]
    return task
  },

  /** PATCH /todos/:id — часткове оновлення (назва, completed, metadata). */
  async update(id: number, changes: TaskChanges): Promise<Task> {
    requireAuth()
    if (deletedIds.has(id)) throw notFound(id)

    if (isCreatedLocally(id)) {
      // сервер про це завдання не знає (PATCH поверне 404) — оновлюємо локальну копію
      createdTasks = createdTasks.map((task) => (task.id === id ? { ...task, ...changes } : task))
      return createdTasks.find((task) => task.id === id)!
    }

    const payload = toUpdatePayload(changes)
    const todo =
      Object.keys(payload).length > 0
        ? await httpClient.patch<ApiTodo>(`${TODOS_PATH}/${id}`, payload, { auth: true })
        : await httpClient.get<ApiTodo>(`${TODOS_PATH}/${id}`)
    // З відповіді беремо лише поля, які відправили: решту DummyJSON повертає з бази,
    // де попередні (симульовані) зміни не збереглися.
    const confirmed: TaskChanges = {}
    if (payload.todo !== undefined) confirmed.title = todo.todo
    if (payload.completed !== undefined) confirmed.completed = todo.completed
    patches.set(id, { ...patches.get(id), ...changes, ...confirmed })
    return toTask(todo)
  },

  /** DELETE /todos/:id */
  async delete(id: number): Promise<void> {
    requireAuth()
    if (isCreatedLocally(id)) {
      createdTasks = createdTasks.filter((task) => task.id !== id)
      return
    }
    const response = await httpClient.delete<ApiDeletedTodo>(`${TODOS_PATH}/${id}`, { auth: true })
    if (!response.isDeleted) throw new ApiError('unknown', 'Todo was not deleted')
    deletedIds.add(id)
    patches.delete(id)
  },
}
