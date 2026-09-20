import { ingredientById, SHOPPING_CATEGORIES } from '../data/loadData.js'
import { MEAL_SLOTS, weekDates } from './dateWeek.js'

function categoryFor(ingredientId, customName) {
  if (ingredientId) {
    const found = ingredientById.get(ingredientId)
    if (found) return found.shoppingCategory
  }
  return 'Other'
}

function keyFor(ingredientId, name, unit) {
  return `${ingredientId || 'custom'}::${name.trim().toLowerCase()}::${(unit || '').trim().toLowerCase()}`
}

/**
 * Build a shopping list from every recipe assigned to the given week's
 * planner slots. Ingredients are combined when they share the same
 * ingredient identity and unit; different units for the same ingredient
 * are kept as separate lines since they can't reliably be summed.
 */
export function buildShoppingList({ weekStart, assignments, recipesById }) {
  const days = weekDates(weekStart)
  const lines = new Map()

  days.forEach((day) => {
    MEAL_SLOTS.forEach((slot) => {
      const recipeId = assignments?.[day]?.[slot]
      if (!recipeId) return
      const recipe = recipesById.get(recipeId)
      if (!recipe) return
      if (recipe.options && recipe.options.includeInShoppingList === false) return

      recipe.ingredientSections.forEach((section) => {
        section.items.forEach((item) => {
          const name = item.customName || ingredientById.get(item.ingredientId)?.name || 'Ingredient'
          const key = keyFor(item.ingredientId, name, item.unit)
          const category = categoryFor(item.ingredientId, name)
          const existing = lines.get(key)
          const quantity = item.quantity === '' || item.quantity == null ? null : Number(item.quantity)

          if (existing) {
            if (quantity != null && existing.quantity != null) {
              existing.quantity += quantity
            } else {
              existing.quantity = null // can't combine meaningfully
            }
            existing.recipeTitles.add(recipe.title)
            existing.optional = existing.optional && item.optional
          } else {
            lines.set(key, {
              key,
              name,
              unit: item.unit || '',
              quantity,
              category,
              optional: item.optional,
              recipeTitles: new Set([recipe.title]),
            })
          }
        })
      })
    })
  })

  const items = Array.from(lines.values()).map((line) => ({
    ...line,
    recipeTitles: Array.from(line.recipeTitles),
  }))

  const grouped = SHOPPING_CATEGORIES.map((category) => ({
    category,
    items: items
      .filter((item) => item.category === category)
      .sort((a, b) => a.name.localeCompare(b.name)),
  })).filter((group) => group.items.length > 0)

  return grouped
}
