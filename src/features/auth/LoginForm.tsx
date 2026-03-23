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
