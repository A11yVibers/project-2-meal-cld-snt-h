// Best-effort display-only conversion between US customary and metric units.
// Only applied within a single recipe's detail view (per that recipe's own
// "Recipe options" setting) -- never applied when aggregating the shopping
// list, since mixing conversions across recipes there would be unreliable.
const TO_METRIC = {
  lb: { factor: 0.453592, unit: 'kg' },
  oz: { factor: 28.3495, unit: 'g' },
  cup: { factor: 236.588, unit: 'ml' },
  tbsp: { factor: 14.7868, unit: 'ml' },
  tsp: { factor: 4.92892, unit: 'ml' },
}

const TO_US = {
  kg: { factor: 2.20462, unit: 'lb' },
  g: { factor: 0.035274, unit: 'oz' },
  L: { factor: 4.22675, unit: 'cup' },
  ml: { factor: 0.00422675, unit: 'cup' },
}

function round(n) {
  return Math.round(n * 100) / 100
}

export function convertQuantity(quantity, unit, measurementSystem) {
  const qty = Number(quantity)
  if (!Number.isFinite(qty) || !unit) return { quantity, unit }

  if (measurementSystem === 'metric' && TO_METRIC[unit]) {
    const { factor, unit: newUnit } = TO_METRIC[unit]
    return { quantity: round(qty * factor), unit: newUnit }
  }
  if (measurementSystem === 'us' && TO_US[unit]) {
    const { factor, unit: newUnit } = TO_US[unit]
    return { quantity: round(qty * factor), unit: newUnit }
  }
  return { quantity: qty, unit }
}
