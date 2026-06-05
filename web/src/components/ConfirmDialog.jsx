import { AlertTriangle, X } from 'lucide-react'

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}) {
  if (!open) {
    return null
  }

  return (
    <div className="modal-overlay" role="presentation" onClick={onCancel}>
      <div
        className="modal-card confirm-dialog"
        role="alertdialog"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-close" onClick={onCancel} aria-label="Cerrar">
          <X size={18} />
        </button>

        <div className="confirm-dialog-icon" aria-hidden>
          <AlertTriangle size={28} />
        </div>

        <h2 id="confirm-title">{title}</h2>
        <p id="confirm-message" className="modal-subtitle">
          {message}
        </p>

        <div className="confirm-dialog-actions">
          <button type="button" className="auth-btn" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className="sell-btn confirm-dialog-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
