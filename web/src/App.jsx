import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Wallet, Music4, TrendingUp, BadgeEuro } from 'lucide-react'
import { currentUser, marketplaceAssets, royaltyHistory } from './mocks/data'

function formatEur(value) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)
}

export default function App() {
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

        <div className="wallet">
          <Wallet size={18} />
          <div>
            <span className="wallet-label">Wallet balance</span>
            <strong>{formatEur(currentUser.walletEur)}</strong>
          </div>
        </div>
      </header>

      <main className="layout">
        <section>
          <div className="section-heading">
            <h1>Marketplace</h1>
            <p>Invierte en tokens de albumes y canciones con reparto automatico de royalties.</p>
          </div>

          <div className="asset-grid">
            {marketplaceAssets.map((asset) => (
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

                  <button className="invest-btn" type="button">
                    Invertir
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="chart-panel">
          <div className="chart-header">
            <h2>
              <TrendingUp size={18} /> Historial de regalias
            </h2>
            <p>Ultimos 7 dias</p>
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
      </main>
    </div>
  )
}
