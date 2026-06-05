import api from './client'
import { coverForArtist } from '../lib/artistCovers'

export function mapActivoToCard(activo, index = 0) {
  const totalTokens = activo.cantidadFracciones ?? 0
  const availablePct = activo.porcentajeDisponible ?? 100
  const artist = activo.creador?.nombre ?? 'Artista desconocido'
  return {
    id: activo.id,
    title: activo.titulo,
    artist,
    type: activo.tipo,
    totalTokens,
    tokensAvailable: Math.round((availablePct / 100) * totalTokens),
    rendimientoMensual: activo.rendimientoMensual ?? 0,
    tokenPrice:
      activo.precioTotal && activo.cantidadFracciones
        ? activo.precioTotal / activo.cantidadFracciones
        : activo.rendimientoMensual,
    availablePct: Math.round(availablePct),
    cover: coverForArtist(artist, index),
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

export async function editarObra(creadorId, activoId, payload) {
  const { data } = await api.put(`/api/v1/creadores/${creadorId}/activos/${activoId}`, payload)
  return data
}

export async function eliminarObra(creadorId, activoId) {
  await api.delete(`/api/v1/creadores/${creadorId}/activos/${activoId}`)
}
