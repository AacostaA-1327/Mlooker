const STORAGE_PREFIX = 'mlooker-market-'

const CHART_LABELS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']

function round(value) {
  return Math.round(value * 100) / 100
}

function storageKey(assetId) {
  return `${STORAGE_PREFIX}${assetId}`
}

function cryptoTick(price, anchor, volatility) {
  const randomMove = (Math.random() - 0.48) * volatility
  const meanReversion = (anchor - price) * 0.04
  const next = price * (1 + randomMove) + meanReversion
  return Math.max(anchor * 0.25, Math.min(anchor * 4, next))
}

function labelForPoint(index, side) {
  if (side === 'buy') return `Compra ${index}`
  if (side === 'sell') return `Venta ${index}`
  return CHART_LABELS[index % CHART_LABELS.length]
}

function buildHistoryPoint(label, price, owned) {
  return {
    label,
    price: round(price),
    portfolio: round(price * owned),
  }
}

function seedHistory(basePrice, owned = 0) {
  let price = basePrice
  return CHART_LABELS.slice(0, 8).map((label, i) => {
    price = cryptoTick(price, basePrice, 0.035)
    if (i === 7) price = basePrice
    return buildHistoryPoint(label, price, owned)
  })
}

export function loadMarket(asset, owned = 0) {
  try {
    const raw = localStorage.getItem(storageKey(asset.id))
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        ...parsed,
        history: parsed.history.map((point) => ({
          ...point,
          portfolio: round(point.price * owned),
        })),
      }
    }
  } catch {
    // ignore corrupt storage
  }

  return {
    basePrice: asset.tokenPrice,
    currentPrice: asset.tokenPrice,
    tradeCount: 0,
    history: seedHistory(asset.tokenPrice, owned),
  }
}

export function saveMarket(assetId, market) {
  localStorage.setItem(storageKey(assetId), JSON.stringify(market))
}

export function priceChangePct(market) {
  if (!market?.basePrice) return 0
  return round(((market.currentPrice - market.basePrice) / market.basePrice) * 100)
}

export function applyTrade(market, asset, { side, quantity, ownedAfter }) {
  const demandImpact =
    (quantity / Math.max(asset.totalTokens, 1)) * (side === 'buy' ? 0.18 : -0.14)
  let price = market.currentPrice * (1 + demandImpact)
  const history = [...market.history]

  const reactionSteps = side === 'buy' ? 4 : 3
  for (let i = 0; i < reactionSteps; i += 1) {
    const stepVolatility = i === 0 ? 0.09 : 0.055
    if (i > 0) {
      price = cryptoTick(price, asset.tokenPrice, stepVolatility)
    } else {
      price = cryptoTick(price, asset.tokenPrice, stepVolatility * 0.5)
    }
    history.push(
      buildHistoryPoint(
        labelForPoint(market.tradeCount + i + 1, i === 0 ? side : null),
        price,
        ownedAfter,
      ),
    )
  }

  const trimmedHistory = history.slice(-12)

  return {
    basePrice: market.basePrice ?? asset.tokenPrice,
    currentPrice: round(price),
    tradeCount: market.tradeCount + 1,
    history: trimmedHistory,
  }
}

export function userRoyaltiesAtPrice(asset, owned, marketPrice) {
  const total = asset.totalTokens || 1
  const share = Math.min(1, Math.max(0, owned / total))
  const baseMonthly = (asset.rendimientoMensual ?? 0) * share
  const priceFactor = marketPrice / (asset.tokenPrice || marketPrice || 1)
  return round(baseMonthly * priceFactor)
}
