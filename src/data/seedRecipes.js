import { parseCsv, splitIds, toBool, toNumber } from './csvParse.js'
import { recipeIngredientsCsv, recipeStepsCsv, recipesCsv } from './rawCsv.js'
import { deriveTotalTime, makeId } from './recipeModel.js'

const recipeRows = parseCsv(recipesCsv)
const ingredientRows = parseCsv(recipeIngredientsCsv)
const stepRows = parseCsv(recipeStepsCsv)

function ingredientsForRecipe(recipeId) {
  return ingredientRows
    .filter((r) => r.recipe_id === recipeId)
    .sort((a, b) => toNumber(a.display_order) - toNumber(b.display_order))
    .map((r) => ({
      id: makeId('ing'),
      section: r.section_name || 'Main',
      ingredientId: r.ingredient_id || '',
      ingredientName: r.ingredient_name || '',
      quantity: r.quantity || '',
      unit: r.unit || '',
      optional: toBool(r.optional),
      notes: r.notes || '',
    }))
}

function stepsForRecipe(recipeId) {
  return stepRows
    .filter((r) => r.recipe_id === recipeId)
    .sort((a, b) => toNumber(a.step_number) - toNumber(b.step_number))
    .map((r) => ({
      id: makeId('step'),
      instruction: r.instruction || '',
      timerMinutes: toNumber(r.timer_minutes, 0),
    }))
}

export const seedRecipes = recipeRows.map((r) => {
  const prep = toNumber(r.prep_time_minutes, 0)
  const cook = toNumber(r.cook_time_minutes, 0)
  return {
    id: r.recipe_id,
    title: r.title,
    shortDescription: r.short_description || '',
    sourceName: r.source_name || '',
    sourceUrl: r.source_url || '',
    servings: toNumber(r.servings, 1),
    prepTimeMinutes: prep,
    cookTimeMinutes: cook,
    totalTimeMinutes: toNumber(r.total_time_minutes, deriveTotalTime(prep, cook)),
    difficulty: r.difficulty_1_to_5 ? toNumber(r.difficulty_1_to_5) : undefined,
    spiceLevel: toNumber(r.spice_level_0_to_5, 0),
    cuisineId: r.cuisine_id || '',
    mealTypeId: r.meal_type_id || '',
    dietaryTagIds: splitIds(r.dietary_tag_ids),
    categoryIds: splitIds(r.category_ids),
    accentColor: r.accent_color || '#D97757',
    coverImageUrl: r.cover_image_url || '',
    ingredients: ingredientsForRecipe(r.recipe_id),
    steps: stepsForRecipe(r.recipe_id),
    mealPlanning: {
      availableForSuggestions: toBool(r.include_in_meal_suggestions),
      addImmediately: false,
      plannedWeekOffset: 0,
      plannedDayIndex: 0,
      plannedSlotId: 'dinner',
      plannedSpecificTime: '',
    },
    options: {
      includeInShoppingList: true,
      showNutrition: false,
      allowSubstitutions: false,
      measurementSystem: 'us',
    },
    isUserCreated: false,
    createdAt: 0,
  }
})

export const seedCoverImageUrls = Array.from(
  new Set(recipeRows.map((r) => r.cover_image_url).filter(Boolean))
)
