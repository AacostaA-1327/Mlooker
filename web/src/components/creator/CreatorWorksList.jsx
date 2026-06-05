import { useCallback, useEffect, useState } from 'react'
import { Loader2, Trash2 } from 'lucide-react'
import { eliminarObra, fetchMisActivos } from '../../api/mlookerApi'

function formatEur(value) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)
}

export default function CreatorWorksList({ creadorId, refreshKey, onDeleted }) {
  const [works, setWorks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const loadWorks = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      setWorks(await fetchMisActivos(creadorId))
    } catch (err) {
      setError(err.response?.data?.message ?? 'No se pudieron cargar tus obras.')
    } finally {
      setLoading(false)
    }
  }, [creadorId])

  useEffect(() => {
    loadWorks()
  }, [loadWorks, refreshKey])

  const handleDelete = async (work) => {
    const confirmed = window.confirm(
      `¿Eliminar "${work.titulo}" del marketplace? Esta acción no se puede deshacer.`,
    )
    if (!confirmed) return

    setDeletingId(work.id)
    setError(null)
    try {
      await eliminarObra(creadorId, work.id)
      setWorks((prev) => prev.filter((item) => item.id !== work.id))
      onDeleted?.()
    } catch (err) {
      setError(err.response?.data?.message ?? 'No se pudo eliminar la obra.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="creator-works">
      <div className="section-heading compact">
        <h2>Mis obras publicadas</h2>
        <p>Gestiona el catálogo que tienes en el marketplace.</p>
      </div>

      {loading ? (
        <p className="loading-state">
          <Loader2 className="spin" size={18} /> Cargando obras...
        </p>
      ) : works.length === 0 ? (
        <p className="form-hint">Aún no has publicado ninguna obra.</p>
      ) : (
        <ul className="works-list">
          {works.map((work) => {
            const tokenPrice =
              work.precioTotal && work.cantidadFracciones
                ? work.precioTotal / work.cantidadFracciones
                : work.rendimientoMensual
            const tokensVendidos =
              work.cantidadFracciones != null
                ? Math.round(
                    ((100 - (work.porcentajeDisponible ?? 100)) / 100) *
                      work.cantidadFracciones,
                  )
                : 0

            return (
              <li key={work.id} className="works-item">
                <div>
                  <strong>{work.titulo}</strong>
                  <span className="works-meta">
                    {work.tipo} · {work.cantidadFracciones} tokens ·{' '}
                    {formatEur(tokenPrice)}/token
                  </span>
                  <span className="works-meta">
                    Disponible: {Math.round(work.porcentajeDisponible ?? 0)}%
                    {tokensVendidos > 0 && ` · ${tokensVendidos} tokens vendidos`}
                  </span>
                </div>
                <button
                  type="button"
                  className="sell-btn works-delete-btn"
                  disabled={deletingId === work.id}
                  onClick={() => handleDelete(work)}
                >
                  {deletingId === work.id ? (
                    <Loader2 className="spin" size={16} />
                  ) : (
                    <>
                      <Trash2 size={14} /> Eliminar
                    </>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {error && <p className="error-banner">{error}</p>}
    </section>
  )
}
