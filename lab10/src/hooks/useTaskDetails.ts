import { useCallback, useEffect, useState } from 'react'
import { getErrorMessage, isAbortError } from '../api/errors'
import { taskRepository } from '../repositories/taskRepository'
import type { AsyncStatus } from '../types/async'
import type { Task } from '../types/task'

interface DetailsState {
  status: AsyncStatus
  task: Task | null
  error: string | null
}

/** Деталі завдання — локальний state компонента, без дублювання в глобальному Context. */
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

    // закриття деталей або вибір іншого завдання скасовує попередній GET
    return () => controller.abort()
  }, [id, reloadKey])

  const reload = useCallback(() => {
    setState({ status: 'loading', task: null, error: null })
    setReloadKey((key) => key + 1)
  }, [])

  return { ...state, reload }
}
