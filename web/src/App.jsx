import { useCallback, useEffect, useState } from 'react'

import {

  Wallet,

  Music4,

  BadgeEuro,

  Loader2,

  LayoutDashboard,

  PenLine,

  ChevronRight,

  LogIn,

  LogOut,

} from 'lucide-react'

import { fetchActivos, fetchInversor, fetchTotalRegalias } from './api/mlookerApi'

import { useAuth } from './context/AuthContext'

import CreatorPanel from './components/creator/CreatorPanel'

import AssetDetail from './components/AssetDetail'

import LoginModal from './components/LoginModal'



function formatEur(value) {

  return new Intl.NumberFormat('es-ES', {

    style: 'currency',

    currency: 'EUR',

  }).format(value)

}



const VIEWS = {

  MARKETPLACE: 'marketplace',

  CREATOR: 'creator',

}



function ownedTokensStorageKey(inversorId) {

  return `mlooker-owned-${inversorId}`

}



function loadOwnedTokens(inversorId) {

  if (!inversorId) return {}

  try {

    const raw = localStorage.getItem(ownedTokensStorageKey(inversorId))

    return raw ? JSON.parse(raw) : {}

  } catch {

    return {}

  }

}



function saveOwnedTokens(inversorId, owned) {

  if (!inversorId) return

  localStorage.setItem(ownedTokensStorageKey(inversorId), JSON.stringify(owned))

}



export default function App() {

  const { user, isLoggedIn, isInversor, isVerifiedCreator, logout, bootstrapping } = useAuth()

  const [view, setView] = useState(VIEWS.MARKETPLACE)

  const [selectedAssetId, setSelectedAssetId] = useState(null)

  const [assets, setAssets] = useState([])

  const [walletEur, setWalletEur] = useState(0)

  const [totalRegalias, setTotalRegalias] = useState(null)

  const [ownedTokens, setOwnedTokens] = useState({})

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState(null)

  const [loginOpen, setLoginOpen] = useState(false)

  const [loginMessage, setLoginMessage] = useState(null)



  const inversorId = isInversor ? user?.inversorId : null



  useEffect(() => {

    if (inversorId) {

      setOwnedTokens(loadOwnedTokens(inversorId))

    } else {

      setOwnedTokens({})

      setWalletEur(0)

      setTotalRegalias(null)

    }

  }, [inversorId])



  const loadMarketplace = useCallback(async () => {

    setError(null)

    const activos = await fetchActivos()

    setAssets(activos)



    if (inversorId) {

      const [inversor, regalias] = await Promise.all([

        fetchInversor(inversorId),

        fetchTotalRegalias(inversorId),

      ])

      setWalletEur(inversor.saldo)

      setTotalRegalias(regalias)

    }

  }, [inversorId])



  useEffect(() => {

    if (view !== VIEWS.MARKETPLACE || bootstrapping) {

      return

    }

    setLoading(true)

    loadMarketplace()

      .catch((err) => {

        setError(

          err.response?.data?.message ??

            'No se pudo conectar con la API. Comprueba que Spring Boot esté en http://localhost:8080',

        )

      })

      .finally(() => setLoading(false))

  }, [loadMarketplace, view, bootstrapping])



  const selectedAsset = assets.find((a) => a.id === selectedAssetId)



  const openLogin = (message) => {

    setLoginMessage(message ?? null)

    setLoginOpen(true)

  }



  const handleOwnedChange = (assetId, newCount) => {

    if (!inversorId) return

    setOwnedTokens((prev) => {

      const next = { ...prev, [assetId]: Math.max(0, newCount) }

      if (next[assetId] === 0) {

        delete next[assetId]

      }

      saveOwnedTokens(inversorId, next)

      return next

    })

  }



  const handleAssetUpdate = (assetId, availablePct) => {

    setAssets((prev) =>

      prev.map((item) =>

        item.id === assetId

          ? {

              ...item,

              availablePct,

              tokensAvailable: Math.round((availablePct / 100) * item.totalTokens),

            }

          : item,

      ),

    )

  }



  const handleCreatorTab = () => {

    if (!isLoggedIn) {

      openLogin('Inicia sesión como artista verificado para acceder al panel creador.')

      return

    }

    if (!isVerifiedCreator) {

      setError('Solo artistas verificados pueden publicar obras.')

      return

    }

    setView(VIEWS.CREATOR)

    setSelectedAssetId(null)

  }



  return (

    <div className="app-shell">

      <header className="navbar">

        <div className="brand">

          <div className="logo">M</div>

          <div>

            <p className="brand-title">Mlooker</p>

            <p className="brand-subtitle">Trading de regalias musicales</p>

          </div>

        </div>



        <nav className="view-tabs" aria-label="Navegación principal">

          <button

            type="button"

            className={view === VIEWS.MARKETPLACE ? 'tab active' : 'tab'}

            onClick={() => {

              setView(VIEWS.MARKETPLACE)

              setSelectedAssetId(null)

            }}

          >

            <LayoutDashboard size={16} /> Marketplace

          </button>

          {isVerifiedCreator && (

            <button

              type="button"

              className={view === VIEWS.CREATOR ? 'tab active' : 'tab'}

              onClick={handleCreatorTab}

            >

              <PenLine size={16} /> Panel creador

            </button>

          )}

        </nav>



        <div className="navbar-actions">

          {isLoggedIn ? (

            <>

              {isInversor && view === VIEWS.MARKETPLACE && (

                <div className="wallet">

                  <Wallet size={18} />

                  <div>

                    <span className="wallet-label">{user.nombre}</span>

                    <strong>{formatEur(walletEur)}</strong>

                    {totalRegalias != null && (

                      <span className="wallet-regalias">

                        Regalías/mes: {formatEur(totalRegalias)}

                      </span>

                    )}

                  </div>

                </div>

              )}

              {!isInversor && (

                <span className="user-badge">{user.nombre}</span>

              )}

              <button type="button" className="auth-btn" onClick={logout}>

                <LogOut size={16} /> Cerrar sesión

              </button>

            </>

          ) : (

            <button type="button" className="auth-btn primary" onClick={() => openLogin()}>

              <LogIn size={16} /> Iniciar sesión

            </button>

          )}

        </div>

      </header>



      <main className="layout layout-single">

        {view === VIEWS.CREATOR && isVerifiedCreator ? (

          <CreatorPanel

            creadorId={user.creadorId}

            artistName={user.nombre}

            onCatalogChange={loadMarketplace}

          />

        ) : selectedAsset ? (

          <AssetDetail

            asset={selectedAsset}

            walletEur={walletEur}

            ownedTokens={ownedTokens}

            inversorId={inversorId}

            isLoggedIn={isLoggedIn}

            isInversor={isInversor}

            onRequireLogin={openLogin}

            onBack={() => setSelectedAssetId(null)}

            onWalletChange={setWalletEur}

            onAssetUpdate={handleAssetUpdate}

            onOwnedChange={handleOwnedChange}

          />

        ) : (

          <section>

            <div className="section-heading">

              <h1>Marketplace</h1>

              <p>Explora canciones sin cuenta. Inicia sesión para invertir.</p>

            </div>



            {error && <p className="error-banner">{error}</p>}



            {loading || bootstrapping ? (

              <p className="loading-state">

                <Loader2 className="spin" size={20} /> Cargando canciones...

              </p>

            ) : (

              <div className="asset-grid">

                {assets.map((asset) => (

                  <article

                    key={asset.id}

                    className="asset-card asset-card-clickable"

                    role="button"

                    tabIndex={0}

                    onClick={() => setSelectedAssetId(asset.id)}

                    onKeyDown={(e) => {

                      if (e.key === 'Enter' || e.key === ' ') {

                        e.preventDefault()

                        setSelectedAssetId(asset.id)

                      }

                    }}

                  >

                    <img src={asset.cover} alt={asset.title} className="asset-cover" />

                    <div className="asset-body">

                      <div className="asset-top">

                        <span className="badge">{asset.type}</span>

                        <Music4 size={16} />

                      </div>

                      <h3>{asset.title}</h3>

                      <p className="artist">{asset.artist}</p>



                      <div className="stats">

                        <p>

                          <BadgeEuro size={14} /> Precio token

                        </p>

                        <strong>{formatEur(asset.tokenPrice)}</strong>

                      </div>



                      <div className="stats">

                        <p>Total tokens</p>

                        <strong>{asset.totalTokens}</strong>

                      </div>



                      <div className="stats">

                        <p>Tokens disponibles</p>

                        <strong>{asset.tokensAvailable}</strong>

                      </div>



                      <div className="availability">

                        <div className="availability-header">

                          <span>Disponibilidad</span>

                          <strong>{asset.availablePct}%</strong>

                        </div>

                        <div className="progress">

                          <span style={{ width: `${asset.availablePct}%` }} />

                        </div>

                      </div>



                      <span className="view-detail-link">

                        Ver detalle y gráfica <ChevronRight size={14} />

                      </span>

                    </div>

                  </article>

                ))}

              </div>

            )}

          </section>

        )}

      </main>



      <LoginModal

        open={loginOpen}

        message={loginMessage}

        onClose={() => setLoginOpen(false)}

      />

    </div>

  )

}


