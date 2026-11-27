/** DTO — формат даних DummyJSON. Використовується лише в repository. */
export interface ApiTodo {
  id: number
  todo: string
  completed: boolean
  userId: number
}

export interface TodosResponse {
  todos: ApiTodo[]
  total: number
  skip: number
  limit: number
}

export interface ApiDeletedTodo extends ApiTodo {
  isDeleted: boolean
  deletedOn: string
}

export interface CreateTodoPayload {
  todo: string
  completed: boolean
  userId: number
}

export type UpdateTodoPayload = Partial<Pick<ApiTodo, 'todo' | 'completed'>>
