import { useCallback, useEffect, useState } from 'react'
import { getErrorMessage, isAbortError } from '../api/errors'
import { taskRepository } from '../repositories/taskRepository'
import type { AsyncStatus } from '../types/async'
import type { Task, TaskChanges } from '../types/task'

interface DetailsState {
  status: AsyncStatus
  task: Task | null
  error: string | null
}

/** Деталі завдання за id з URL — локальний state сторінки, без дублювання в Context. */
export function useTaskDetails(id: number) {
  const [state, setState] = useState<DetailsState>({ status: 'loading', task: null, error: null })
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    taskRepository
      .getById(id, controller.signal)
      .then((task) => setState({ status: 'success', task, error: null }))
      .catch((error: unknown) => {
        if (isAbortError(error)) return
        setState({ status: 'error', task: null, error: getErrorMessage(error) })
      })

    // перехід на інше завдання або unmount скасовує попередній GET
    return () => controller.abort()
  }, [id, reloadKey])

  const reload = useCallback(() => {
    setState({ status: 'loading', task: null, error: null })
    setReloadKey((key) => key + 1)
  }, [])

  /** Оновлення через repository; після успіху — новий стан без повторного GET. */
  const update = useCallback(
    async (changes: TaskChanges): Promise<Task> => {
      const task = await taskRepository.update(id, changes)
      setState({ status: 'success', task, error: null })
      return task
    },
    [id],
  )

  const remove = useCallback(() => taskRepository.delete(id), [id])

  return { ...state, reload, update, remove }
}
