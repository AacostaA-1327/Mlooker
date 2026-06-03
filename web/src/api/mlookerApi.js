import api from './client'

const INVERSOR_ID = Number(import.meta.env.VITE_INVERSOR_ID ?? 1)
const CREADOR_ID = Number(import.meta.env.VITE_CREADOR_ID ?? 1)

const COVERS = [
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=640&q=80',
  'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=640&q=80',
  'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?auto=format&fit=crop&w=640&q=80',
  'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=640&q=80',
]

export function mapActivoToCard(activo, index = 0) {
  return {
    id: activo.id,
    title: activo.titulo,
    artist: activo.creador?.nombre ?? 'Artista desconocido',
    type: activo.tipo,
    tokenPrice:
      activo.precioTotal && activo.cantidadFracciones
        ? activo.precioTotal / activo.cantidadFracciones
        : activo.rendimientoMensual,
    availablePct: Math.round(activo.porcentajeDisponible ?? 100),
    cover: COVERS[index % COVERS.length],
  }
}

export async function fetchActivos() {
  const { data } = await api.get('/api/v1/activos')
  return data.map(mapActivoToCard)
}

export async function fetchInversor(id = INVERSOR_ID) {
  const { data } = await api.get(`/api/v1/inversores/${id}`)
  return data
}

export async function invertirEnActivo(activoId, importe, inversorId = INVERSOR_ID) {
  const { data } = await api.post(`/api/v1/inversores/${inversorId}/invertir`, {
    activoId,
    importe,
  })
  return data
}

export async function publicarActivo(payload, creadorId = CREADOR_ID) {
  const { data } = await api.post(`/api/v1/creadores/${creadorId}/activos`, payload)
  return data
}

export { INVERSOR_ID, CREADOR_ID }
