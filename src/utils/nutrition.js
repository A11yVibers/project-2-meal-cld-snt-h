// Lightweight, clearly-labeled nutrition *estimate*. There is no nutrition
// data source provided, so this derives a rough per-serving figure from
// ingredient shopping categories and quantities purely so the "Show
// nutrition information" recipe option has something meaningful to reveal.
// It is not a substitute for real nutrition data.
import { ingredientById, shoppingCategoryForIngredientName } from '../data/lookups.js'

const CATEGORY_PROFILE = {
  'Meat & seafood': { calories: 190, protein: 22, carbs: 0, fat: 10 },
  'Dairy & eggs': { calories: 110, protein: 6, carbs: 3, fat: 8 },
  'Grains & pantry': { calories: 150, protein: 4, carbs: 30, fat: 1 },
  'Produce': { calories: 30, protein: 1, carbs: 6, fat: 0 },
  'Oils & condiments': { calories: 80, protein: 0, carbs: 2, fat: 8 },
  'Canned & jarred': { calories: 100, protein: 5, carbs: 15, fat: 2 },
  'Spices': { calories: 5, protein: 0, carbs: 1, fat: 0 },
  'Other': { calories: 60, protein: 2, carbs: 8, fat: 2 },
}

function quantityWeight(item) {
  const qty = Number(item.quantity)
  if (!Number.isFinite(qty) || qty <= 0) return 1
  // Dampen the effect of very large/small quantities so one "3 cups" entry
  // doesn't dominate the estimate.
  return Math.max(0.4, Math.min(2.5, Math.sqrt(qty)))
}

export function estimateNutrition(recipe) {
  const servings = Math.max(1, Number(recipe.servings) || 1)
  const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 }

  ;(recipe.ingredients || []).forEach((item) => {
    if (item.optional) return
    const category = item.ingredientId
      ? ingredientById(item.ingredientId)?.shoppingCategory
      : shoppingCategoryForIngredientName(item.ingredientName)
    const profile = CATEGORY_PROFILE[category] || CATEGORY_PROFILE.Other
    const weight = quantityWeight(item)
    totals.calories += profile.calories * weight
    totals.protein += profile.protein * weight
    totals.carbs += profile.carbs * weight
    totals.fat += profile.fat * weight
  })

  return {
    calories: Math.round(totals.calories / servings),
    protein: Math.round(totals.protein / servings),
    carbs: Math.round(totals.carbs / servings),
    fat: Math.round(totals.fat / servings),
  }
}
