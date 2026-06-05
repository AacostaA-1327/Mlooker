import { useState } from 'react'
import CreatorPublishForm from './CreatorPublishForm'
import CreatorWorksList from './CreatorWorksList'

export default function CreatorPanel({ creadorId, artistName, onCatalogChange }) {
  const [refreshKey, setRefreshKey] = useState(0)

  const bumpCatalog = () => {
    setRefreshKey((k) => k + 1)
    onCatalogChange?.()
  }

  return (
    <>
      <CreatorWorksList
        creadorId={creadorId}
        refreshKey={refreshKey}
        onDeleted={onCatalogChange}
      />
      <CreatorPublishForm
        creadorId={creadorId}
        artistName={artistName}
        onPublished={bumpCatalog}
      />
    </>
  )
}
