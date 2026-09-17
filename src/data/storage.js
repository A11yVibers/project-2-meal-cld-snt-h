// Thin localStorage wrapper so all persisted app state (user recipes, the
// weekly meal plan, and shopping-list state) lives under versioned, namespaced
// keys and fails soft if storage is unavailable (e.g. private browsing).

export const STORAGE_KEYS = {
  userRecipes: 'mealplanner.userRecipes.v1',
  mealPlan: 'mealplanner.mealPlan.v1',
  shoppingChecked: 'mealplanner.shoppingChecked.v1',
  pantryItems: 'mealplanner.pantryItems.v1',
  excludePantry: 'mealplanner.excludePantry.v1',
}

export function loadJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null || raw === undefined) return fallback
    return JSON.parse(raw)
  } catch (err) {
    console.warn('Failed to load stored value for', key, err)
    return fallback
  }
}

export function saveJSON(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.warn('Failed to persist value for', key, err)
  }
}
