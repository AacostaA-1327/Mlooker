import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  BadgeEuro,
  Loader2,
  Music4,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { invertirEnActivo, venderTokens } from '../api/mlookerApi'
import {
  applyTrade,
  loadMarket,
  priceChangePct,
  saveMarket,
  userRoyaltiesAtPrice,
} from '../lib/tokenMarket'

function formatEur(value) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)
}

export default function AssetDetail({
  asset,
  walletEur,
  ownedTokens,
  inversorId,
  isLoggedIn,
  isInversor,
  onRequireLogin,
  onBack,
  onWalletChange,
  onAssetUpdate,
  onOwnedChange,
}) {
  const [quantity, setQuantity] = useState(1)
  const [busy, setBusy] = useState(null)
  const [error, setError] = useState(null)
  const [market, setMarket] = useState(() => loadMarket(asset, ownedTokens[asset.id] ?? 0))

  const owned = ownedTokens[asset.id] ?? 0
  const ownershipPct = asset.totalTokens
    ? Math.round((owned / asset.totalTokens) * 100)
    : 0
  const changePct = priceChangePct(market)
  const monthlyRoyalties = userRoyaltiesAtPrice(asset, owned, market.currentPrice)
  const portfolioValue = round(market.currentPrice * owned)

  const maxBuyByWallet = Math.floor(walletEur / asset.tokenPrice)
  const maxBuy = Math.min(asset.tokensAvailable, maxBuyByWallet)
  const maxSell = Math.max(0, owned)
  const qty = Math.max(1, Number(quantity) || 1)

  useEffect(() => {
    setMarket(loadMarket(asset, owned))
  }, [asset.id])

  useEffect(() => {
    setMarket((prev) => ({
      ...prev,
      history: prev.history.map((point) => ({
        ...point,
        portfolio: round(point.price * owned),
      })),
    }))
  }, [owned])

  const pushMarketAfterTrade = (side, ownedAfter) => {
    setMarket((prev) => {
      const next = applyTrade(prev, asset, { side, quantity: qty, ownedAfter })
      saveMarket(asset.id, next)
      return next
    })
  }

  const requireInversorSession = () => {
    if (!isLoggedIn || !isInversor || !inversorId) {
      onRequireLogin('Inicia sesión como cliente para comprar o vender tokens.')
      return false
    }
    return true
  }

  const handleBuy = async () => {
    if (!requireInversorSession()) return

    const importe = asset.tokenPrice * qty
    if (importe > walletEur) {
      setError('Saldo insuficiente.')
      return
    }
    setBusy('buy')
    setError(null)
    try {
      const result = await invertirEnActivo(asset.id, importe, inversorId)
      const ownedAfter = owned + qty
      onWalletChange(result.nuevoSaldo)
      onAssetUpdate(asset.id, Math.round(result.porcentajeDisponible))
      onOwnedChange(asset.id, ownedAfter)
      pushMarketAfterTrade('buy', ownedAfter)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Error al comprar tokens.')
    } finally {
      setBusy(null)
    }
  }

  const handleSell = async () => {
    if (!requireInversorSession()) return

    if (qty > owned) {
      setError('No tienes suficientes tokens para vender.')
      return
    }
    setBusy('sell')
    setError(null)
    try {
      const importe = asset.tokenPrice * qty
      const result = await venderTokens(asset.id, importe, inversorId)
      const ownedAfter = owned - qty
      onWalletChange(result.nuevoSaldo)
      onAssetUpdate(asset.id, Math.round(result.porcentajeDisponible))
      onOwnedChange(asset.id, ownedAfter)
      pushMarketAfterTrade('sell', ownedAfter)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Error al vender tokens.')
    } finally {
      setBusy(null)
    }
  }

  return (
    <section className="asset-detail">
      <button type="button" className="back-btn" onClick={onBack}>
        <ArrowLeft size={16} /> Volver al marketplace
      </button>

      <div className="asset-detail-hero">
        <img src={asset.cover} alt={asset.title} className="asset-detail-cover" />
        <div>
          <span className="badge">{asset.type}</span>
          <h1>{asset.title}</h1>
          <p className="artist">
            <Music4 size={14} /> {asset.artist}
          </p>
          <div className="detail-stats">
            <div>
              <span>Total tokens</span>
              <strong>{asset.totalTokens}</strong>
            </div>
            <div>
              <span>Disponibles</span>
              <strong>{asset.tokensAvailable}</strong>
            </div>
            <div>
              <span>Tus tokens</span>
              <strong>{owned}</strong>
            </div>
            <div>
              <span>Precio mercado</span>
              <strong>{formatEur(market.currentPrice)}</strong>
            </div>
            <div>
              <span>Variación</span>
              <strong className={changePct >= 0 ? 'price-up' : 'price-down'}>
                {changePct >= 0 ? '+' : ''}
                {changePct}%
              </strong>
            </div>
            <div>
              <span>Valor cartera</span>
              <strong>{formatEur(portfolioValue)}</strong>
            </div>
            <div>
              <span>Tu participación</span>
              <strong>{ownershipPct}%</strong>
            </div>
            <div>
              <span>Tus regalías / mes</span>
              <strong>{formatEur(monthlyRoyalties)}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="chart-panel asset-detail-chart">
        <div className="chart-header">
          <h2>
            {changePct >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
            Mercado del token (tipo cripto)
          </h2>
          <p>
            Cada compra empuja el precio al alza; cada venta lo presiona a la baja.
            {owned > 0 && (
              <>
                {' '}
                Tu cartera: {owned} tokens = {formatEur(portfolioValue)}.
              </>
            )}
          </p>
        </div>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={market.history} key={`market-${market.tradeCount}-${owned}`}>
              <XAxis dataKey="label" stroke="#95a1b8" />
              <YAxis stroke="#95a1b8" tickFormatter={(v) => `${v}€`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#131b2d',
                  border: '1px solid #2d3954',
                  borderRadius: '10px',
                }}
                formatter={(value, name) => [
                  formatEur(value),
                  name === 'price' ? 'Precio token' : 'Tu cartera',
                ]}
              />
              <Line
                type="monotone"
                dataKey="price"
                name="price"
                stroke="#3ecf8e"
                strokeWidth={3}
                dot={{ r: 3, fill: '#3ecf8e' }}
                isAnimationActive
              />
              {owned > 0 && (
                <Line
                  type="monotone"
                  dataKey="portfolio"
                  name="portfolio"
                  stroke="#3ca8ff"
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  dot={{ r: 3, fill: '#3ca8ff' }}
                  isAnimationActive
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="trade-panel">
        {!isLoggedIn || !isInversor ? (
          <p className="form-hint">
            Puedes ver la gráfica sin cuenta. Para operar,{' '}
            <button
              type="button"
              className="link-btn"
              onClick={() =>
                onRequireLogin('Inicia sesión como cliente para invertir en esta canción.')
              }
            >
              inicia sesión
            </button>
            .
          </p>
        ) : (
          <div className="trade-wallet">
            <Wallet size={18} />
            <span>Saldo: {formatEur(walletEur)}</span>
          </div>
        )}

        <div className="token-qty">
          <label htmlFor="detail-qty">Cantidad de tokens</label>
          <input
            id="detail-qty"
            type="number"
            min={1}
            max={Math.max(maxBuy, maxSell, 1) || 1}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <span className="token-total">
            <BadgeEuro size={14} /> Total: {formatEur(asset.tokenPrice * qty)}
          </span>
        </div>

        {error && <p className="error-banner">{error}</p>}

        <div className="trade-actions">
          <button
            type="button"
            className="invest-btn"
            disabled={busy != null || maxBuy <= 0 || qty > maxBuy}
            onClick={handleBuy}
          >
            {busy === 'buy' ? (
              <>
                <Loader2 className="spin" size={16} /> Comprando...
              </>
            ) : (
              'Comprar tokens'
            )}
          </button>
          <button
            type="button"
            className="sell-btn"
            disabled={busy != null || owned <= 0 || qty > maxSell}
            onClick={handleSell}
          >
            {busy === 'sell' ? (
              <>
                <Loader2 className="spin" size={16} /> Vendiendo...
              </>
            ) : (
              'Vender tokens'
            )}
          </button>
        </div>
      </div>
    </section>
  )
}

function round(value) {
  return Math.round(value * 100) / 100
}
