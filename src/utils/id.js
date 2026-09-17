let counter = 0

export function generateId(prefix = 'id') {
  counter += 1
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`
  }
  return `${prefix}-${Date.now()}-${counter}-${Math.random().toString(16).slice(2)}`
}
