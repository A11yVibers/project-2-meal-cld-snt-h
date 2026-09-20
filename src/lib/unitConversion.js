// Lightweight, approximate US <-> metric conversion for display purposes
// only (the underlying stored quantity/unit never changes). Units that
// aren't measurement-system specific (piece, clove, can, package, pinch,
// "to taste") are left untouched.

const US_TO_METRIC = {
  oz: { factor: 28.35, unit: 'g' },
  lb: { factor: 453.6, unit: 'g' },
  tsp: { factor: 4.93, unit: 'ml' },
  tbsp: { factor: 14.79, unit: 'ml' },
  cup: { factor: 236.6, unit: 'ml' },
}

const METRIC_TO_US = {
  g: { factor: 1 / 28.35, unit: 'oz' },
  kg: { factor: 1000 / 453.6, unit: 'lb' },
  ml: { factor: 1 / 236.6, unit: 'cup' },
  L: { factor: 1000 / 236.6, unit: 'cup' },
}

function roundNice(n) {
  if (!Number.isFinite(n)) return n
  if (n >= 100) return Math.round(n)
  if (n >= 10) return Math.round(n * 10) / 10
  return Math.round(n * 100) / 100
}

/**
 * Convert a { quantity, unit } pair for display in the requested
 * measurement system. Returns { quantity, unit } (possibly unchanged).
 */
export function convertForDisplay(quantity, unit, system) {
  if (quantity === '' || quantity == null || !unit) return { quantity, unit }
  const qty = Number(quantity)
  if (!Number.isFinite(qty)) return { quantity, unit }

  if (system === 'metric' && US_TO_METRIC[unit]) {
    const { factor, unit: newUnit } = US_TO_METRIC[unit]
    let value = qty * factor
    let outUnit = newUnit
    if (outUnit === 'g' && value >= 1000) {
      value = value / 1000
      outUnit = 'kg'
    } else if (outUnit === 'ml' && value >= 1000) {
      value = value / 1000
      outUnit = 'L'
    }
    return { quantity: roundNice(value), unit: outUnit }
  }

  if (system === 'us' && METRIC_TO_US[unit]) {
    const { factor, unit: newUnit } = METRIC_TO_US[unit]
    return { quantity: roundNice(qty * factor), unit: newUnit }
  }

  return { quantity: qty, unit }
}
