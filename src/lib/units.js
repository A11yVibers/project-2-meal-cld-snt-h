// Lightweight unit-system conversion for display purposes only (recipe storage keeps the
// original quantity/unit the user entered). Only common convertible units are handled;
// anything else (clove, piece, can, package, pinch, to taste...) passes through unchanged.
const TO_METRIC = {
  lb: { factor: 0.453592, unit: 'kg' },
  oz: { factor: 28.3495, unit: 'g' },
  cup: { factor: 236.588, unit: 'ml' },
  tbsp: { factor: 14.787, unit: 'ml' },
  tsp: { factor: 4.929, unit: 'ml' },
}

const TO_US = {
  kg: { factor: 2.20462, unit: 'lb' },
  g: { factor: 0.035274, unit: 'oz' },
  L: { factor: 4.22675, unit: 'cup' },
  ml: { factor: 0.00422675, unit: 'cup' },
}

function round(n) {
  if (!Number.isFinite(n)) return n
  const r = Math.round(n * 100) / 100
  return r
}

export function convertQuantity(quantity, unit, system) {
  const qty = Number(quantity)
  if (!Number.isFinite(qty) || !unit) return { quantity, unit }
  const table = system === 'metric' ? TO_METRIC : TO_US
  const rule = table[unit]
  if (!rule) return { quantity, unit }
  return { quantity: round(qty * rule.factor), unit: rule.unit }
}
