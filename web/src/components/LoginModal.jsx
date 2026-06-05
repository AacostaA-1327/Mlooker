import { useState } from 'react'
import { Loader2, LogIn, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function LoginModal({ open, onClose, message }) {
  const { login } = useAuth()
  const { showSuccess } = useToast()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  if (!open) {
    return null
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const profile = await login(username.trim(), password)
      onClose?.()
      showSuccess(`Sesión iniciada como ${profile.nombre}.`)
    } catch (err) {
      setError(err.response?.data?.message ?? 'No se pudo iniciar sesión.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-labelledby="login-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Cerrar">
          <X size={18} />
        </button>

        <h2 id="login-title">Iniciar sesión</h2>
        <p className="modal-subtitle">
          {message ?? 'Necesitas una cuenta para invertir en tokens.'}
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="login-username">Usuario</label>
            <input
              id="login-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="cliente o quevedo"
              autoComplete="username"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="login-password">Contraseña</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Igual que el usuario"
              autoComplete="current-password"
              required
            />
          </div>

          <p className="form-hint">
            Demo cliente: <strong>cliente / cliente</strong> · Artista:{' '}
            <strong>quevedo / quevedo</strong>
          </p>

          {error && <p className="error-banner">{error}</p>}

          <button className="invest-btn" type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="spin" size={16} /> Entrando...
              </>
            ) : (
              <>
                <LogIn size={16} /> Entrar
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
