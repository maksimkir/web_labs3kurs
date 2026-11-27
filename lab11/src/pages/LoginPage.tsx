import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router'
import { getErrorMessage, normalizeError } from '../api/errors'
import { safeRedirect } from '../auth/redirect'
import StatusMessage from '../components/StatusMessage'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { loginSchema, type LoginFormData } from '../schemas/authSchema'
import './LoginPage.scss'

function loginErrorMessage(error: unknown): string {
  // DummyJSON на невірні дані відповідає 400 «Invalid credentials»
  const apiError = normalizeError(error)
  if (apiError.status === 400 || apiError.status === 401) return 'Невірний username або пароль.'
  return getErrorMessage(error)
}

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { toast } = useToast()
  const id = useId()
  const redirectTo = safeRedirect(searchParams.get('redirectTo'))

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  })

  useEffect(() => {
    document.title = 'Вхід — Study Planner'
  }, [])

  const onSubmit = handleSubmit(async (data) => {
    try {
      const user = await login(data)
      toast.success(`Вітаємо, ${user.firstName || user.username}!`)
      // повернення на маршрут, з якого користувача перенаправили на вхід
      navigate(redirectTo, { replace: true })
    } catch (error) {
      setError('root', { message: loginErrorMessage(error) })
    }
  })

  return (
    <section className="login-page">
      <form className="login-page__form" onSubmit={onSubmit} noValidate>
        <h1 className="login-page__title">Вхід</h1>
        {searchParams.has('redirectTo') && (
          <p className="login-page__hint">Щоб продовжити, увійдіть в акаунт.</p>
        )}

        <div className={`field${errors.username ? ' field--invalid' : ''}`}>
          <label className="field__label" htmlFor={`${id}-username`}>
            Username
          </label>
          <input
            id={`${id}-username`}
            className="field__control"
            autoComplete="username"
            aria-invalid={errors.username ? true : undefined}
            aria-describedby={errors.username ? `${id}-username-error` : undefined}
            {...register('username')}
          />
          {errors.username && (
            <span id={`${id}-username-error`} className="field__error">
              {errors.username.message}
            </span>
          )}
        </div>

        <div className={`field${errors.password ? ' field--invalid' : ''}`}>
          <label className="field__label" htmlFor={`${id}-password`}>
            Пароль
          </label>
          <input
            id={`${id}-password`}
            className="field__control"
            type="password"
            autoComplete="current-password"
            aria-invalid={errors.password ? true : undefined}
            aria-describedby={errors.password ? `${id}-password-error` : undefined}
            {...register('password')}
          />
          {errors.password && (
            <span id={`${id}-password-error`} className="field__error">
              {errors.password.message}
            </span>
          )}
        </div>

        {errors.root && (
          <StatusMessage variant="error" compact>
            {errors.root.message}
          </StatusMessage>
        )}

        <button type="submit" className="button button--primary" disabled={isSubmitting}>
          {isSubmitting ? 'Вхід…' : 'Увійти'}
        </button>

        <p className="login-page__demo">
          Тестовий акаунт DummyJSON: <code>emilys</code> / <code>emilyspass</code>
        </p>
      </form>
    </section>
  )
}

export default LoginPage
