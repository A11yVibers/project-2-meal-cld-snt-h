import { INGREDIENT_BY_ID, INGREDIENT_BY_NAME_LOWER } from '../data/lookups.js'

export function ingredientKeyFor(item) {
  if (item.ingredientId) return `id:${item.ingredientId}`
  return `name:${(item.ingredientName || '').trim().toLowerCase()}`
}

export function categoryForItem(item) {
  if (item.ingredientId && INGREDIENT_BY_ID[item.ingredientId]) {
    return INGREDIENT_BY_ID[item.ingredientId].category
  }
  const byName = INGREDIENT_BY_NAME_LOWER[(item.ingredientName || '').trim().toLowerCase()]
  if (byName) return byName.category
  return 'Other'
}

// Collects every recipeId currently assigned anywhere within a single
// week's plan (all days, all slots).
export function recipeIdsForWeek(weekPlan) {
  const ids = []
  if (!weekPlan) return ids
  Object.values(weekPlan).forEach((day) => {
    Object.values(day || {}).forEach((recipeId) => {
      if (recipeId) ids.push(recipeId)
    })
  })
  return ids
}

// Aggregates ingredient lines across a set of recipes into shopping-list
// rows grouped by shopping category. Quantities are summed when the same
// ingredient + unit combination repeats across recipes.
export function buildShoppingList({ recipeIds, recipesById, pantrySet, excludePantry }) {
  const lineMap = new Map()

  recipeIds.forEach((recipeId) => {
    const recipe = recipesById[recipeId]
    if (!recipe) return
    if (recipe.recipeOptions && recipe.recipeOptions.includeInShoppingList === false) return

    recipe.ingredientSections.forEach((section) => {
      section.items.forEach((item) => {
        const ingredientKey = ingredientKeyFor(item)
        if (excludePantry && pantrySet.has(ingredientKey)) return

        const unit = (item.unit || '').trim()
        const lineKey = `${ingredientKey}::${unit}`
        const quantity = parseFloat(item.quantity)

        if (!lineMap.has(lineKey)) {
          lineMap.set(lineKey, {
            key: lineKey,
            ingredientKey,
            name: item.ingredientName || 'Unnamed ingredient',
            unit,
            quantity: 0,
            hasQuantity: false,
            category: categoryForItem(item),
            optional: true,
            recipeTitles: new Set(),
          })
        }

        const line = lineMap.get(lineKey)
        if (Number.isFinite(quantity)) {
          line.quantity += quantity
          line.hasQuantity = true
        }
        if (!item.optional) line.optional = false
        line.recipeTitles.add(recipe.title)
      })
    })
  })

  return Array.from(lineMap.values())
    .map((line) => ({ ...line, recipeTitles: Array.from(line.recipeTitles).sort() }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export function groupByCategory(lines, categoryOrder) {
  const groups = new Map(categoryOrder.map((c) => [c, []]))
  lines.forEach((line) => {
    const key = groups.has(line.category) ? line.category : 'Other'
    groups.get(key).push(line)
  })
  return categoryOrder
    .map((category) => ({ category, items: groups.get(category) }))
    .filter((group) => group.items.length > 0)
}
