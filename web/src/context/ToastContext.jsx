import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { CheckCircle2, X, XCircle } from 'lucide-react'

const ToastContext = createContext(null)

const AUTO_DISMISS_MS = 4200

function ToastItem({ toast, onDismiss }) {
  const Icon = toast.type === 'error' ? XCircle : CheckCircle2

  return (
    <div
      className={`toast toast-${toast.type}`}
      role={toast.type === 'error' ? 'alert' : 'status'}
      aria-live="polite"
    >
      <Icon size={20} className="toast-icon" aria-hidden />
      <p className="toast-message">{toast.message}</p>
      <button
        type="button"
        className="toast-close"
        onClick={() => onDismiss(toast.id)}
        aria-label="Cerrar notificación"
      >
        <X size={16} />
      </button>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timersRef = useRef(new Map())

  const dismiss = useCallback((id) => {
    const timer = timersRef.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timersRef.current.delete(id)
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (message, type = 'success') => {
      const id = crypto.randomUUID()
      setToasts((prev) => [...prev, { id, message, type }])

      const timer = setTimeout(() => dismiss(id), AUTO_DISMISS_MS)
      timersRef.current.set(id, timer)
    },
    [dismiss],
  )

  const showSuccess = useCallback(
    (message) => showToast(message, 'success'),
    [showToast],
  )

  const showError = useCallback(
    (message) => showToast(message, 'error'),
    [showToast],
  )

  const value = useMemo(
    () => ({ showSuccess, showError }),
    [showSuccess, showError],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack" aria-label="Notificaciones">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast debe usarse dentro de ToastProvider')
  }
  return context
}
