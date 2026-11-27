import { useLoaderData } from 'react-router'
import type { adminLoader } from '../routes/loaders'
import './AdminPage.scss'

/** Адміністративний маршрут (роль admin). Дані приходять з loader-а маршруту. */
function AdminPage() {
  const { users, total } = useLoaderData<typeof adminLoader>()

  return (
    <section className="admin-page">
      <h1 className="admin-page__title">Адмін-панель</h1>
      <p className="admin-page__caption">
        Користувачі DummyJSON: показано {users.length} з {total}
      </p>
      <table className="admin-page__table">
        <thead>
          <tr>
            <th className="admin-page__cell admin-page__cell--head">Username</th>
            <th className="admin-page__cell admin-page__cell--head">Ім’я</th>
            <th className="admin-page__cell admin-page__cell--head">Email</th>
            <th className="admin-page__cell admin-page__cell--head">Роль</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="admin-page__cell">{user.username}</td>
              <td className="admin-page__cell">
                {user.firstName} {user.lastName}
              </td>
              <td className="admin-page__cell">{user.email}</td>
              <td className="admin-page__cell">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default AdminPage
