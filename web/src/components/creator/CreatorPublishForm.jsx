import { useEffect, useState } from 'react'
import { Disc3, Loader2, Music2, Upload } from 'lucide-react'
import { publicarActivo } from '../../api/mlookerApi'
import { useToast } from '../../context/ToastContext'

const TIPOS = [
  { value: 'MUSICA', label: 'Música' },
  { value: 'ALBUM', label: 'Álbum' },
]

const INITIAL = {
  nombreArtista: '',
  titulo: '',
  tipo: 'MUSICA',
  precioTotal: '',
  cantidadFracciones: '',
}

function validate(form) {
  const errors = {}

  const nombreArtista = form.nombreArtista.trim()
  if (!nombreArtista) {
    errors.nombreArtista = 'El nombre del artista es obligatorio'
  } else if (nombreArtista.length > 120) {
    errors.nombreArtista = 'Máximo 120 caracteres'
  }

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

  return errors
}

export default function CreatorPublishForm({ creadorId, artistName, onPublished }) {
  const { showSuccess } = useToast()
  const [form, setForm] = useState({ ...INITIAL, nombreArtista: artistName ?? '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState(null)

  useEffect(() => {
    if (artistName) {
      setForm((prev) => ({ ...prev, nombreArtista: artistName }))
    }
  }, [artistName])

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
    setSuccess(false)
    setApiError(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validate(form)
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
        precioTotal: parseFloat(form.precioTotal),
        cantidadFracciones: parseInt(form.cantidadFracciones, 10),
      }
      await publicarActivo(payload, creadorId)
      setForm({ ...INITIAL, nombreArtista: artistName ?? '' })
      showSuccess(`"${payload.titulo}" publicada correctamente en el marketplace.`)
      onPublished?.()
    } catch (err) {
      setApiError(
        err.response?.data?.message ??
          'No se pudo publicar la obra. Comprueba la API y la API Key.',
      )
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
    <section className="creator-panel">
      <div className="section-heading">
        <h1>Panel del creador</h1>
        <p>Publica tu obra en el marketplace. Todos los campos son obligatorios.</p>
      </div>

      <form className="creator-form" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="nombreArtista">Nombre del artista</label>
          <input
            id="nombreArtista"
            type="text"
            value={form.nombreArtista}
            readOnly
            placeholder="Ej. Quevedo"
            aria-invalid={Boolean(errors.nombreArtista)}
            aria-describedby={errors.nombreArtista ? 'nombreArtista-error' : undefined}
          />
          {errors.nombreArtista && (
            <p id="nombreArtista-error" className="field-error" role="alert">
              {errors.nombreArtista}
            </p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="titulo">Nombre de la obra</label>
          <input
            id="titulo"
            type="text"
            value={form.titulo}
            onChange={(e) => updateField('titulo', e.target.value)}
            placeholder="Ej. Mi primer álbum"
            aria-invalid={Boolean(errors.titulo)}
            aria-describedby={errors.titulo ? 'titulo-error' : undefined}
          />
          {errors.titulo && (
            <p id="titulo-error" className="field-error" role="alert">
              {errors.titulo}
            </p>
          )}
        </div>

        <div className="form-field">
          <span className="field-label">Tipo</span>
          <div className="tipo-options">
            {TIPOS.map((option) => (
              <label key={option.value} className="tipo-option">
                <input
                  type="radio"
                  name="tipo"
                  value={option.value}
                  checked={form.tipo === option.value}
                  onChange={(e) => updateField('tipo', e.target.value)}
                />
                {option.value === 'MUSICA' ? (
                  <Music2 size={16} />
                ) : (
                  <Disc3 size={16} />
                )}
                {option.label}
              </label>
            ))}
          </div>
          {errors.tipo && (
            <p className="field-error" role="alert">
              {errors.tipo}
            </p>
          )}
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="precioTotal">Precio total (EUR)</label>
            <input
              id="precioTotal"
              type="number"
              min="0.01"
              step="0.01"
              value={form.precioTotal}
              onChange={(e) => updateField('precioTotal', e.target.value)}
              placeholder="1000"
              aria-invalid={Boolean(errors.precioTotal)}
            />
            {errors.precioTotal && (
              <p className="field-error" role="alert">
                {errors.precioTotal}
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="cantidadFracciones">Fracciones (tokens)</label>
            <input
              id="cantidadFracciones"
              type="number"
              min="1"
              step="1"
              value={form.cantidadFracciones}
              onChange={(e) => updateField('cantidadFracciones', e.target.value)}
              placeholder="100"
              aria-invalid={Boolean(errors.cantidadFracciones)}
            />
            {errors.cantidadFracciones && (
              <p className="field-error" role="alert">
                {errors.cantidadFracciones}
              </p>
            )}
          </div>
        </div>

        {precioPorFraccion && !Number.isNaN(precioPorFraccion) && (
          <p className="form-hint">
            Precio por fracción: <strong>{precioPorFraccion} €</strong>
          </p>
        )}

        {apiError && (
          <p className="error-banner" role="alert">
            {apiError}
          </p>
        )}

        <button className="publish-btn" type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="spin" size={18} /> Publicando...
            </>
          ) : (
            <>
              <Upload size={18} /> Publicar obra
            </>
          )}
        </button>
      </form>
    </section>
  )
}
