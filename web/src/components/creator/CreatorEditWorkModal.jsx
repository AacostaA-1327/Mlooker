import { useEffect, useState } from 'react'
import { Disc3, Loader2, Music2, Pencil, X } from 'lucide-react'
import { editarObra } from '../../api/mlookerApi'
import { useToast } from '../../context/ToastContext'

const TIPOS = [
  { value: 'MUSICA', label: 'Música' },
  { value: 'ALBUM', label: 'Álbum' },
]

function workToForm(work, artistName) {
  return {
    nombreArtista: artistName ?? work.creador?.nombre ?? '',
    titulo: work.titulo ?? '',
    tipo: work.tipo ?? 'MUSICA',
    precioTotal: work.precioTotal != null ? String(work.precioTotal) : '',
    cantidadFracciones:
      work.cantidadFracciones != null ? String(work.cantidadFracciones) : '',
  }
}

function hasSoldTokens(work) {
  return (work.porcentajeDisponible ?? 100) < 100
}

function validate(form, lockedEconomics) {
  const errors = {}

  const titulo = form.titulo.trim()
  if (!titulo) {
    errors.titulo = 'El nombre de la obra es obligatorio'
  } else if (titulo.length > 200) {
    errors.titulo = 'Máximo 200 caracteres'
  }

  if (!form.tipo) {
    errors.tipo = 'Selecciona un tipo'
  } else if (!['MUSICA', 'ALBUM'].includes(form.tipo)) {
    errors.tipo = 'Tipo no válido'
  }

  if (!lockedEconomics) {
    const precio = parseFloat(form.precioTotal)
    if (form.precioTotal === '' || Number.isNaN(precio)) {
      errors.precioTotal = 'El precio total es obligatorio'
    } else if (precio <= 0) {
      errors.precioTotal = 'Debe ser mayor que cero'
    }

    const fracciones = parseInt(form.cantidadFracciones, 10)
    if (form.cantidadFracciones === '' || Number.isNaN(fracciones)) {
      errors.cantidadFracciones = 'Las fracciones son obligatorias'
    } else if (fracciones < 1) {
      errors.cantidadFracciones = 'Debe ser al menos 1'
    } else if (!Number.isInteger(parseFloat(form.cantidadFracciones))) {
      errors.cantidadFracciones = 'Debe ser un número entero'
    }
  }

  return errors
}

export default function CreatorEditWorkModal({
  open,
  work,
  creadorId,
  artistName,
  onClose,
  onSaved,
}) {
  const { showSuccess } = useToast()
  const [form, setForm] = useState(null)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState(null)

  const lockedEconomics = work ? hasSoldTokens(work) : false

  useEffect(() => {
    if (open && work) {
      setForm(workToForm(work, artistName))
      setErrors({})
      setApiError(null)
    }
  }, [open, work, artistName])

  if (!open || !work || !form) {
    return null
  }

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
    setApiError(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validate(form, lockedEconomics)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setSubmitting(true)
    setApiError(null)

    try {
      const payload = {
        nombreArtista: form.nombreArtista.trim(),
        titulo: form.titulo.trim(),
        tipo: form.tipo,
        precioTotal: lockedEconomics ? work.precioTotal : parseFloat(form.precioTotal),
        cantidadFracciones: lockedEconomics
          ? work.cantidadFracciones
          : parseInt(form.cantidadFracciones, 10),
      }
      await editarObra(creadorId, work.id, payload)
      showSuccess(`"${payload.titulo}" actualizada correctamente.`)
      onSaved?.()
      onClose?.()
    } catch (err) {
      setApiError(err.response?.data?.message ?? 'No se pudo actualizar la obra.')
    } finally {
      setSubmitting(false)
    }
  }

  const precioPorFraccion =
    form.precioTotal && form.cantidadFracciones
      ? (
          parseFloat(form.precioTotal) / parseInt(form.cantidadFracciones, 10)
        ).toFixed(2)
      : null

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="modal-card modal-card-wide"
        role="dialog"
        aria-labelledby="edit-work-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Cerrar">
          <X size={18} />
        </button>

        <h2 id="edit-work-title">Editar obra</h2>
        <p className="modal-subtitle">
          Modifica los datos de <strong>{work.titulo}</strong> en el marketplace.
        </p>

        {lockedEconomics && (
          <p className="form-hint edit-locked-hint">
            Esta obra ya tiene tokens vendidos: solo puedes cambiar título y tipo.
          </p>
        )}

        <form className="creator-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="edit-nombreArtista">Nombre del artista</label>
            <input
              id="edit-nombreArtista"
              type="text"
              value={form.nombreArtista}
              readOnly
            />
          </div>

          <div className="form-field">
            <label htmlFor="edit-titulo">Nombre de la obra</label>
            <input
              id="edit-titulo"
              type="text"
              value={form.titulo}
              onChange={(e) => updateField('titulo', e.target.value)}
              aria-invalid={Boolean(errors.titulo)}
            />
            {errors.titulo && <p className="field-error" role="alert">{errors.titulo}</p>}
          </div>

          <div className="form-field">
            <span className="field-label">Tipo</span>
            <div className="tipo-options">
              {TIPOS.map((option) => (
                <label key={option.value} className="tipo-option">
                  <input
                    type="radio"
                    name="edit-tipo"
                    value={option.value}
                    checked={form.tipo === option.value}
                    onChange={(e) => updateField('tipo', e.target.value)}
                  />
                  {option.value === 'MUSICA' ? <Music2 size={16} /> : <Disc3 size={16} />}
                  {option.label}
                </label>
              ))}
            </div>
            {errors.tipo && <p className="field-error" role="alert">{errors.tipo}</p>}
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="edit-precioTotal">Precio total (EUR)</label>
              <input
                id="edit-precioTotal"
                type="number"
                min="0.01"
                step="0.01"
                value={form.precioTotal}
                onChange={(e) => updateField('precioTotal', e.target.value)}
                disabled={lockedEconomics}
                aria-invalid={Boolean(errors.precioTotal)}
              />
              {errors.precioTotal && (
                <p className="field-error" role="alert">{errors.precioTotal}</p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="edit-cantidadFracciones">Fracciones (tokens)</label>
              <input
                id="edit-cantidadFracciones"
                type="number"
                min="1"
                step="1"
                value={form.cantidadFracciones}
                onChange={(e) => updateField('cantidadFracciones', e.target.value)}
                disabled={lockedEconomics}
                aria-invalid={Boolean(errors.cantidadFracciones)}
              />
              {errors.cantidadFracciones && (
                <p className="field-error" role="alert">{errors.cantidadFracciones}</p>
              )}
            </div>
          </div>

          {precioPorFraccion && !Number.isNaN(precioPorFraccion) && (
            <p className="form-hint">
              Precio por fracción: <strong>{precioPorFraccion} €</strong>
            </p>
          )}

          {apiError && <p className="error-banner" role="alert">{apiError}</p>}

          <div className="confirm-dialog-actions edit-modal-actions">
            <button type="button" className="auth-btn" onClick={onClose}>
              Cancelar
            </button>
            <button className="publish-btn" type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="spin" size={18} /> Guardando...
                </>
              ) : (
                <>
                  <Pencil size={18} /> Guardar cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
