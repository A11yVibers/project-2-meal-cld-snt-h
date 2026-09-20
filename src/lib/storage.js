// Small localStorage helpers so every context persists the same way and
// survives a page refresh. Falls back gracefully if storage is unavailable
// (e.g. private browsing quota errors).

const PREFIX = 'mealplanner:'

export function loadState(key, fallback) {
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    if (raw == null) return fallback
    return JSON.parse(raw)
  } catch (err) {
    console.warn(`Could not read "${key}" from localStorage`, err)
    return fallback
  }
}

export function saveState(key, value) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch (err) {
    console.warn(`Could not persist "${key}" to localStorage`, err)
  }
}
