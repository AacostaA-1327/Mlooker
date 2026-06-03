import { useCallback, useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Wallet, Music4, TrendingUp, BadgeEuro, Loader2, LayoutDashboard, PenLine } from 'lucide-react'
import { royaltyHistory } from './mocks/data'
import { fetchActivos, fetchInversor, invertirEnActivo } from './api/mlookerApi'
import CreatorPublishForm from './components/creator/CreatorPublishForm'

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

export default function App() {
  const [view, setView] = useState(VIEWS.MARKETPLACE)
  const [assets, setAssets] = useState([])
  const [walletEur, setWalletEur] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [investingId, setInvestingId] = useState(null)

  const loadMarketplace = useCallback(async () => {
    setError(null)
    const [activos, inversor] = await Promise.all([fetchActivos(), fetchInversor()])
    setAssets(activos)
    setWalletEur(inversor.saldo)
  }, [])

  useEffect(() => {
    if (view !== VIEWS.MARKETPLACE) {
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
  }, [loadMarketplace, view])

  const handleInvertir = async (asset) => {
    if (asset.availablePct <= 0) return

    setInvestingId(asset.id)
    setError(null)

    try {
      const result = await invertirEnActivo(asset.id, asset.tokenPrice)
      setWalletEur(result.nuevoSaldo)
      setAssets((prev) =>
        prev.map((item) =>
          item.id === asset.id
            ? { ...item, availablePct: Math.round(result.porcentajeDisponible) }
            : item,
        ),
      )
    } catch (err) {
      const msg = err.response?.data?.message ?? err.response?.data?.error
      setError(
        msg ??
          err.response?.statusText ??
          'Error al invertir. Revisa credenciales (X-API-Key) y saldo.',
      )
    } finally {
      setInvestingId(null)
    }
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
            onClick={() => setView(VIEWS.MARKETPLACE)}
          >
            <LayoutDashboard size={16} /> Marketplace
          </button>
          <button
            type="button"
            className={view === VIEWS.CREATOR ? 'tab active' : 'tab'}
            onClick={() => setView(VIEWS.CREATOR)}
          >
            <PenLine size={16} /> Panel creador
          </button>
        </nav>

        {view === VIEWS.MARKETPLACE && (
          <div className="wallet">
            <Wallet size={18} />
            <div>
              <span className="wallet-label">Wallet balance</span>
              <strong>{formatEur(walletEur)}</strong>
            </div>
          </div>
        )}
      </header>

      <main className={view === VIEWS.CREATOR ? 'layout layout-single' : 'layout'}>
        {view === VIEWS.CREATOR ? (
          <CreatorPublishForm
            onPublished={() => {
              setView(VIEWS.MARKETPLACE)
            }}
          />
        ) : (
          <>
            <section>
              <div className="section-heading">
                <h1>Marketplace</h1>
                <p>Activos reales desde MySQL vía API Spring Boot.</p>
              </div>

              {error && <p className="error-banner">{error}</p>}

              {loading ? (
                <p className="loading-state">
                  <Loader2 className="spin" size={20} /> Cargando canciones...
                </p>
              ) : (
                <div className="asset-grid">
                  {assets.map((asset) => (
                    <article key={asset.id} className="asset-card">
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

                        <div className="availability">
                          <div className="availability-header">
                            <span>Disponibilidad</span>
                            <strong>{asset.availablePct}%</strong>
                          </div>
                          <div className="progress">
                            <span style={{ width: `${asset.availablePct}%` }} />
                          </div>
                        </div>

                        <button
                          className="invest-btn"
                          type="button"
                          disabled={investingId === asset.id || asset.availablePct <= 0}
                          onClick={() => handleInvertir(asset)}
                        >
                          {investingId === asset.id ? (
                            <>
                              <Loader2 className="spin" size={16} /> Invirtiendo...
                            </>
                          ) : (
                            'Invertir'
                          )}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <aside className="chart-panel">
              <div className="chart-header">
                <h2>
                  <TrendingUp size={18} /> Historial de regalias
                </h2>
                <p>Ultimos 7 dias (demo)</p>
              </div>

              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={royaltyHistory}>
                    <XAxis dataKey="day" stroke="#95a1b8" />
                    <YAxis stroke="#95a1b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#131b2d',
                        border: '1px solid #2d3954',
                        borderRadius: '10px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="royalties"
                      stroke="#3ecf8e"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#3ecf8e' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </aside>
          </>
        )}
      </main>
    </div>
  )
}
