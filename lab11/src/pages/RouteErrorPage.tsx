import { isRouteErrorResponse, useRouteError } from 'react-router'
import { getErrorMessage } from '../api/errors'
import NotFoundPage from './NotFoundPage'

/** errorElement: помилка loader-а або рендеру маршруту. */
function RouteErrorPage() {
  const error = useRouteError()

  if (isRouteErrorResponse(error) && error.status === 404) return <NotFoundPage />

  const message = isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : getErrorMessage(error)
  return <NotFoundPage title="Щось пішло не так" message={message} />
}

export default RouteErrorPage
