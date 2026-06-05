import api from './client'


const COVERS = [
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=640&q=80',
  'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=640&q=80',
  'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?auto=format&fit=crop&w=640&q=80',
  'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=640&q=80',
]

export function mapActivoToCard(activo, index = 0) {
  const totalTokens = activo.cantidadFracciones ?? 0
  const availablePct = activo.porcentajeDisponible ?? 100
  return {
    id: activo.id,
    title: activo.titulo,
    artist: activo.creador?.nombre ?? 'Artista desconocido',
    type: activo.tipo,
    totalTokens,
    tokensAvailable: Math.round((availablePct / 100) * totalTokens),
    rendimientoMensual: activo.rendimientoMensual ?? 0,
    tokenPrice:
      activo.precioTotal && activo.cantidadFracciones
        ? activo.precioTotal / activo.cantidadFracciones
        : activo.rendimientoMensual,
    availablePct: Math.round(availablePct),
    cover: COVERS[index % COVERS.length],
  }
}

export async function fetchActivos() {
  const { data } = await api.get('/api/v1/activos')
  return data.map(mapActivoToCard)
}

export async function fetchInversor(inversorId) {
  const { data } = await api.get(`/api/v1/inversores/${inversorId}`)
  return data
}

export async function fetchTotalRegalias(inversorId) {
  try {
    const { data } = await api.get(`/api/v1/inversores/${inversorId}/regalias-total`)
    return data.totalRegalias
  } catch (err) {
    if (err.response?.status === 404) {
      return null
    }
    throw err
  }
}

export async function invertirEnActivo(activoId, importe, inversorId) {
  const { data } = await api.post(`/api/v1/inversores/${inversorId}/invertir`, {
    activoId,
    importe,
  })
  return {
    nuevoSaldo: data.nuevoSaldo,
    porcentajeDisponible: data.porcentajeDisponible,
  }
}

export async function venderTokens(activoId, importe, inversorId) {
  const { data } = await api.post(`/api/v1/inversores/${inversorId}/vender`, {
    activoId,
    importe,
  })
  return {
    nuevoSaldo: data.nuevoSaldo,
    porcentajeDisponible: data.porcentajeDisponible,
  }
}

export async function publicarActivo(payload, creadorId) {
  const { data } = await api.post(`/api/v1/creadores/${creadorId}/activos`, payload)
  return data
}

export async function fetchMisActivos(creadorId) {
  const { data } = await api.get(`/api/v1/creadores/${creadorId}/activos`)
  return data
}

export async function eliminarObra(creadorId, activoId) {
  await api.delete(`/api/v1/creadores/${creadorId}/activos/${activoId}`)
}
