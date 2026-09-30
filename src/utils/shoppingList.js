import { ingredientById, shoppingCategoryForIngredientName, SHOPPING_CATEGORY_ORDER } from '../data/lookups.js'
import { MEAL_SLOTS } from '../data/recipeModel.js'

export function ingredientKey(item) {
  if (item.ingredientId) return `id:${item.ingredientId}`
  return `name:${String(item.ingredientName || '').trim().toLowerCase()}`
}

function categoryForItem(item) {
  if (item.ingredientId) {
    const looked = ingredientById(item.ingredientId)
    if (looked) return looked.shoppingCategory
  }
  return shoppingCategoryForIngredientName(item.ingredientName)
}

// Builds a categorized, combined shopping list for every recipe currently
// assigned in `dayMap` (the plan for one week: { [dayIndex]: { [slotId]: { recipeId } } }).
export function buildShoppingList({ dayMap, recipesById, pantryExcluded, checkedMap }) {
  const lines = new Map() // key::unit -> aggregate

  MEAL_SLOTS.forEach((slot) => {
    for (let day = 0; day < 7; day++) {
      const entry = dayMap?.[day]?.[slot.id]
      if (!entry?.recipeId) continue
      const recipe = recipesById.get(entry.recipeId)
      if (!recipe) continue
      if (recipe.options?.includeInShoppingList === false) continue

      ;(recipe.ingredients || []).forEach((item) => {
        const iKey = ingredientKey(item)
        const unit = item.unit || ''
        const lineKey = `${iKey}::${unit}`
        const qty = Number(item.quantity)
        const existing = lines.get(lineKey)
        if (existing) {
          existing.quantity = Number.isFinite(qty) ? existing.quantity + qty : existing.quantity
          existing.hasNumericQuantity = existing.hasNumericQuantity || Number.isFinite(qty)
          existing.optional = existing.optional && item.optional
          existing.sourceRecipes.add(recipe.title)
        } else {
          lines.set(lineKey, {
            key: lineKey,
            ingredientKey: iKey,
            name: item.ingredientName || 'Ingredient',
            unit,
            quantity: Number.isFinite(qty) ? qty : 0,
            hasNumericQuantity: Number.isFinite(qty),
            optional: !!item.optional,
            category: categoryForItem(item),
            sourceRecipes: new Set([recipe.title]),
          })
        }
      })
    }
  })

  const categories = new Map(SHOPPING_CATEGORY_ORDER.map((c) => [c, []]))
  const pantryItems = []

  Array.from(lines.values()).forEach((line) => {
    const out = {
      ...line,
      sourceRecipes: Array.from(line.sourceRecipes),
      checked: !!checkedMap?.[line.key],
      inPantry: pantryExcluded?.has(line.ingredientKey) || false,
    }
    if (out.inPantry) {
      pantryItems.push(out)
      return
    }
    if (!categories.has(out.category)) categories.set(out.category, [])
    categories.get(out.category).push(out)
  })

  const categoryList = SHOPPING_CATEGORY_ORDER.map((name) => ({
    name,
    items: (categories.get(name) || []).sort((a, b) => a.name.localeCompare(b.name)),
  })).filter((c) => c.items.length > 0)

  pantryItems.sort((a, b) => a.name.localeCompare(b.name))

  const totalItems = categoryList.reduce((sum, c) => sum + c.items.length, 0)
  const checkedItems = categoryList.reduce(
    (sum, c) => sum + c.items.filter((i) => i.checked).length,
    0
  )

  return { categories: categoryList, pantryItems, totalItems, checkedItems }
}

export function formatQuantity(line) {
  if (!line.hasNumericQuantity && line.quantity === 0) return line.unit || ''
  const q = line.quantity
  const rounded = Math.round(q * 100) / 100
  const text = Number.isInteger(rounded) ? String(rounded) : String(rounded)
  return [text, line.unit].filter(Boolean).join(' ')
}
