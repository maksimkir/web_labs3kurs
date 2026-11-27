import { useCallback, useEffect, useReducer, useState } from 'react'
import { getErrorMessage, isAbortError } from '../api/errors'
import { initialTaskListState, taskListReducer } from '../reducers/taskListReducer'
import { taskRepository } from '../repositories/taskRepository'
import type { NewTask, Task, TaskAuthor } from '../types/task'

/**
 * Server state списку завдань: завантаження сторінки з можливістю скасування
 * і CRUD-операції через taskRepository. Хук не знає про URL і fetch.
 */
export function useTaskList(page: number, pageSize: number) {
  const [state, dispatch] = useReducer(taskListReducer, initialTaskListState)
  // зміна значення перезапускає ефект завантаження (кнопка «Спробувати ще»)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    dispatch({ type: 'fetchStart' })

    taskRepository
      .getPage({ page, pageSize, signal: controller.signal })
      .then((result) => dispatch({ type: 'fetchSuccess', tasks: result.tasks, total: result.total }))
      .catch((error: unknown) => {
        // скасований запит (перехід на іншу сторінку, unmount) — не помилка для користувача
        if (isAbortError(error)) return
        dispatch({ type: 'fetchError', error: getErrorMessage(error) })
      })

    // cleanup: попередній GET скасовується, якщо сторінка змінилася до отримання відповіді
    return () => controller.abort()
  }, [page, pageSize, reloadKey])

  const reload = useCallback(() => setReloadKey((key) => key + 1), [])

  const createTask = useCallback(async (newTask: NewTask, author: TaskAuthor): Promise<Task> => {
    const task = await taskRepository.create(newTask, author)
    dispatch({ type: 'taskCreated', task })
    return task
  }, [])

  /** Optimistic update: UI змінюється одразу, при помилці — відкат до попереднього стану. */
  const toggleTask = useCallback(async (task: Task): Promise<void> => {
    const optimistic = { ...task, completed: !task.completed }
    dispatch({ type: 'taskUpdated', task: optimistic })
    try {
      const saved = await taskRepository.update(task.id, { completed: optimistic.completed })
      dispatch({ type: 'taskUpdated', task: saved })
    } catch (error) {
      dispatch({ type: 'taskUpdated', task })
      throw error
    }
  }, [])

  const deleteTask = useCallback(async (id: number): Promise<void> => {
    await taskRepository.delete(id)
    dispatch({ type: 'taskRemoved', id })
  }, [])

  return { ...state, reload, createTask, toggleTask, deleteTask }
}
