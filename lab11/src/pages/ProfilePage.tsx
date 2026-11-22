import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import './ProfilePage.scss'

/** Захищений маршрут /profile: сюди потрапляє лише користувач, якого пропустив loader requireUser. */
function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    document.title = 'Профіль — Study Planner'
  }, [])

  // після logout loader не пропустить сюди знову; null — короткий момент перед переходом
  if (!user) return null

  function handleLogout() {
    logout()
    toast.info('Ви вийшли з акаунта')
    navigate('/login', { replace: true })
  }

  return (
    <section className="profile-page">
      <div className="profile-page__card">
        {user.image && <img className="profile-page__avatar" src={user.image} alt="" width={96} height={96} />}
        <div className="profile-page__info">
          <h1 className="profile-page__name">
            {user.firstName} {user.lastName}
          </h1>
          <dl className="profile-page__list">
            <dt className="profile-page__term">Username</dt>
            <dd className="profile-page__value">{user.username}</dd>
            <dt className="profile-page__term">Email</dt>
            <dd className="profile-page__value">{user.email}</dd>
            <dt className="profile-page__term">Роль</dt>
            <dd className="profile-page__value">{user.role}</dd>
            <dt className="profile-page__term">Статус</dt>
            <dd className="profile-page__value profile-page__value--active">Авторизовано</dd>
          </dl>
          <button type="button" className="button button--danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </section>
  )
}

export default ProfilePage
