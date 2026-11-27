import { Link } from 'react-router'
import './NotFoundPage.scss'

interface NotFoundPageProps {
  title?: string
  message?: string
}

/** Сторінка 404 (додаткове завдання); також використовується для помилок маршрутів. */
function NotFoundPage({
  title = 'Сторінку не знайдено',
  message = 'Такої адреси немає. Можливо, посилання застаріло.',
}: NotFoundPageProps) {
  return (
    <section className="not-found">
      <p className="not-found__code" aria-hidden="true">
        404
      </p>
      <h1 className="not-found__title">{title}</h1>
      <p className="not-found__text">{message}</p>
      <Link to="/tasks" className="button button--primary">
        До списку завдань
      </Link>
    </section>
  )
}

export default NotFoundPage
