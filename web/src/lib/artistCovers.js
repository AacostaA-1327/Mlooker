/**
 * Fotos de artistas verificados (Deezer CDN, 1000×1000).
 * Claves: nombre normalizado en minúsculas sin acentos.
 */
const ARTIST_COVERS = {
  quevedo:
    'https://cdn-images.dzcdn.net/images/artist/79880cc1b999b15567e332203464c34e/1000x1000-000000-80-0-0.jpg',
  'la pantera':
    'https://cdn-images.dzcdn.net/images/artist/a94524c08a3b37ea4b25577a5c8a0965/1000x1000-000000-80-0-0.jpg',
  'lucho rk':
    'https://cdn-images.dzcdn.net/images/artist/3095312c8ed2248c70c42bab0dd4745b/1000x1000-000000-80-0-0.jpg',
  rosalia:
    'https://cdn-images.dzcdn.net/images/artist/96636156440182f1e7db3f77d39e6545/1000x1000-000000-80-0-0.jpg',
  'bad bunny':
    'https://cdn-images.dzcdn.net/images/artist/044a3f315b041864887a8dd8709e6926/1000x1000-000000-80-0-0.jpg',
  drake:
    'https://cdn-images.dzcdn.net/images/artist/eb0ed5b21d1ea5af021fc074ded0e91f/1000x1000-000000-80-0-0.jpg',
  'taylor swift':
    'https://cdn-images.dzcdn.net/images/artist/e528e270424103b527f8a27ac625563b/1000x1000-000000-80-0-0.jpg',
  'billie eilish':
    'https://cdn-images.dzcdn.net/images/artist/8eab1a9a644889aabaca1e193e05f984/1000x1000-000000-80-0-0.jpg',
  shakira:
    'https://cdn-images.dzcdn.net/images/artist/69c569506a8ff6ab0edfecbd1adf94b0/1000x1000-000000-80-0-0.jpg',
  eminem:
    'https://cdn-images.dzcdn.net/images/artist/0f30bbd33a680030054af004d698d6ac/1000x1000-000000-80-0-0.jpg',
}

const FALLBACK_COVERS = [
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=640&q=80',
  'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=640&q=80',
  'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?auto=format&fit=crop&w=640&q=80',
  'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=640&q=80',
]

export function normalizeArtistName(name) {
  return (name ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export function coverForArtist(artistName, fallbackIndex = 0) {
  const key = normalizeArtistName(artistName)
  if (key && ARTIST_COVERS[key]) {
    return ARTIST_COVERS[key]
  }
  return FALLBACK_COVERS[fallbackIndex % FALLBACK_COVERS.length]
}
