import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './useAuth'
import { getApiErrorMessage } from '../../shared/lib/getApiErrorMessage'
import styles from './LoginForm.module.css'

export function LoginForm() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError(null)
    setFieldErrors({})

    const nextErrors: { username?: string; password?: string } = {}
    const u = username.trim()
    if (!u) {
      nextErrors.username = 'Укажите логин или email'
    }
    if (!password) {
      nextErrors.password = 'Введите пароль'
    }
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors)
      return
    }

    setSubmitting(true)
    try {
      await login(u, password, remember)
      navigate('/products', { replace: true })
    } catch (err) {
      setFormError(getApiErrorMessage(err, 'Не удалось войти. Проверьте данные.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Вход</h1>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="login-username">
            Почта
          </label>
          <div className={styles.inputWrap}>
            <span className={styles.inputIconLeft} aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M3.75 7.5a2.25 2.25 0 0 1 2.25-2.25h12a2.25 2.25 0 0 1 2.25 2.25v9A2.25 2.25 0 0 1 18 18.75H6a2.25 2.25 0 0 1-2.25-2.25v-9Zm2.25-.75a.75.75 0 0 0-.75.75v.24l6.35 4.41a.75.75 0 0 0 .85 0l6.35-4.41V7.5a.75.75 0 0 0-.75-.75H6Zm12.75 2.82-5.44 3.78a2.25 2.25 0 0 1-2.56 0L5.25 9.57v6.93c0 .41.34.75.75.75h12c.41 0 .75-.34.75-.75V9.57Z" />
              </svg>
            </span>
            <input
              id="login-username"
              name="username"
              type="text"
              autoComplete="username"
              className={`${styles.input} ${fieldErrors.username ? styles.inputError : ''}`}
              value={username}
              onChange={(ev) => setUsername(ev.target.value)}
              disabled={submitting}
              aria-invalid={Boolean(fieldErrors.username)}
              aria-describedby={fieldErrors.username ? 'login-username-error' : undefined}
            />
            <span className={styles.inputIconRight} aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M6.47 6.47a.75.75 0 0 1 1.06 0L12 10.94l4.47-4.47a.75.75 0 1 1 1.06 1.06L13.06 12l4.47 4.47a.75.75 0 0 1-1.06 1.06L12 13.06l-4.47 4.47a.75.75 0 0 1-1.06-1.06L10.94 12 6.47 7.53a.75.75 0 0 1 0-1.06Z" />
              </svg>
            </span>
          </div>
          {fieldErrors.username ? (
            <p id="login-username-error" className={styles.fieldError} role="alert">
              {fieldErrors.username}
            </p>
          ) : null}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="login-password">
            Пароль
          </label>
          <div className={styles.inputWrap}>
            <span className={styles.inputIconLeft} aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M8.25 9V7.5a3.75 3.75 0 1 1 7.5 0V9h.75A2.25 2.25 0 0 1 18.75 11.25v6A2.25 2.25 0 0 1 16.5 19.5h-9a2.25 2.25 0 0 1-2.25-2.25v-6A2.25 2.25 0 0 1 7.5 9h.75Zm1.5 0h4.5V7.5a2.25 2.25 0 1 0-4.5 0V9Z" />
              </svg>
            </span>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              className={`${styles.input} ${fieldErrors.password ? styles.inputError : ''}`}
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              disabled={submitting}
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={fieldErrors.password ? 'login-password-error' : undefined}
            />
            <span className={styles.inputIconRight} aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-3.18-3.18a11.2 11.2 0 0 0 2.28-2.59.75.75 0 0 0 0-.72C18.99 10.9 15.8 9 12 9c-1.39 0-2.71.25-3.89.7L3.53 2.47Zm6.9 9.02 3.08 3.08a2.25 2.25 0 0 1-3.08-3.08Zm6.8 4.68-1.5-1.5a3.75 3.75 0 0 0-5.4-5.4L8.92 7.86A9.72 9.72 0 0 1 12 7.5c4.06 0 7.2 2.33 8.61 4.5a9.58 9.58 0 0 1-3.38 4.17ZM12 4.5c1.38 0 2.69.24 3.87.68a.75.75 0 1 1-.53 1.4A9.71 9.71 0 0 0 12 6c-4.06 0-7.2 2.33-8.61 4.5a9.57 9.57 0 0 0 2.75 3.56.75.75 0 1 1-.93 1.18 11.2 11.2 0 0 1-2.84-3.26.75.75 0 0 1 0-.72C5.01 7.6 8.2 4.5 12 4.5Z" />
              </svg>
            </span>
          </div>
          {fieldErrors.password ? (
            <p id="login-password-error" className={styles.fieldError} role="alert">
              {fieldErrors.password}
            </p>
          ) : null}
        </div>

        {formError ? (
          <p className={styles.formError} role="alert">
            {formError}
          </p>
        ) : null}

        <label className={styles.remember}>
          <input
            type="checkbox"
            checked={remember}
            onChange={(ev) => setRemember(ev.target.checked)}
            disabled={submitting}
          />
          Запомнить данные
        </label>

        <button type="submit" className={styles.submit} disabled={submitting}>
          {submitting ? 'Вход…' : 'Войти'}
        </button>

        <div className={styles.dividerOr} aria-hidden="true">
          <span className={styles.dividerLine} />
          <span className={styles.dividerText}>или</span>
          <span className={styles.dividerLine} />
        </div>

        <p className={styles.footer}>
          Нет аккаунта?{' '}
          <button type="button" className={styles.createLink}>
            Создать
          </button>
        </p>
      </form>
    </div>
  )
}
