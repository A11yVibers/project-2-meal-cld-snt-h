// Thin localStorage wrapper so the rest of the app doesn't sprinkle try/catch everywhere.
const PREFIX = 'mealPlanner:'

export function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw == null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function saveJson(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // Storage full or unavailable (e.g. private browsing) - fail silently, in-memory state still works.
  }
}
