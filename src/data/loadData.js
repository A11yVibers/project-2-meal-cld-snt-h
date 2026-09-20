import Papa from 'papaparse'
import {
  cuisinesCsv,
  dietaryTagsCsv,
  ingredientsCsv,
  mealTypesCsv,
  recipeCategoriesCsv,
  recipeIngredientsCsv,
  recipeStepsCsv,
  recipesCsv,
  unitsCsv,
} from './csvSources.js'

function parse(csvText) {
  const result = Papa.parse(csvText.trim(), {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
  })
  return result.data
}

function splitIds(value) {
  if (!value) return []
  return String(value)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function toBool(value) {
  return String(value).trim().toLowerCase() === 'true'
}

function toNumber(value, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

// ---- Lookup tables -------------------------------------------------------

export const cuisines = parse(cuisinesCsv).map((r) => ({
  id: r.cuisine_id,
  name: r.cuisine_name,
}))

export const dietaryTags = parse(dietaryTagsCsv).map((r) => ({
  id: r.dietary_tag_id,
  name: r.dietary_tag_name,
}))

export const mealTypes = parse(mealTypesCsv).map((r) => ({
  id: r.meal_type_id,
  name: r.meal_type_name,
}))

export const recipeCategories = parse(recipeCategoriesCsv).map((r) => ({
  id: r.category_id,
  name: r.category_name,
}))

export const units = parse(unitsCsv).map((r) => ({
  id: r.unit_id,
  name: r.unit_name,
}))

export const ingredients = parse(ingredientsCsv).map((r) => ({
  id: r.ingredient_id,
  name: r.ingredient_name,
  shoppingCategory: r.shopping_category,
}))

export const SHOPPING_CATEGORIES = [
  'Produce',
  'Meat & seafood',
  'Dairy & eggs',
  'Grains & pantry',
  'Oils & condiments',
  'Canned & jarred',
  'Spices',
  'Other',
]

export const lookupById = (list) => {
  const map = new Map()
  list.forEach((item) => map.set(item.id, item))
  return map
}

export const cuisineById = lookupById(cuisines)
export const dietaryTagById = lookupById(dietaryTags)
export const mealTypeById = lookupById(mealTypes)
export const recipeCategoryById = lookupById(recipeCategories)
export const unitById = lookupById(units)
export const ingredientById = lookupById(ingredients)

export function shoppingCategoryForIngredient(ingredientId, fallbackName) {
  const found = ingredientById.get(ingredientId)
  if (found) return found.shoppingCategory
  return 'Other'
}

// ---- Seed recipes ---------------------------------------------------------

function buildSeedRecipes() {
  const recipeRows = parse(recipesCsv)
  const ingredientRows = parse(recipeIngredientsCsv)
  const stepRows = parse(recipeStepsCsv)

  return recipeRows.map((row) => {
    const recipeId = row.recipe_id

    const ingredientRowsForRecipe = ingredientRows
      .filter((r) => r.recipe_id === recipeId)
      .sort((a, b) => toNumber(a.display_order) - toNumber(b.display_order))

    const sectionOrder = []
    const sectionsByName = new Map()
    ingredientRowsForRecipe.forEach((r) => {
      const sectionName = r.section_name || 'Main'
      if (!sectionsByName.has(sectionName)) {
        sectionsByName.set(sectionName, {
          id: `${recipeId}-sec-${sectionOrder.length}`,
          name: sectionName,
          items: [],
        })
        sectionOrder.push(sectionName)
      }
      sectionsByName.get(sectionName).items.push({
        id: `${recipeId}-ing-${r.display_order}`,
        ingredientId: r.ingredient_id,
        customName: r.ingredient_name || '',
        quantity: r.quantity === '' ? '' : toNumber(r.quantity, ''),
        unit: r.unit || '',
        notes: r.notes || '',
        optional: toBool(r.optional),
      })
    })

    const ingredientSections = sectionOrder.map((name) => sectionsByName.get(name))

    const steps = stepRows
      .filter((r) => r.recipe_id === recipeId)
      .sort((a, b) => toNumber(a.step_number) - toNumber(b.step_number))
      .map((r) => ({
        id: `${recipeId}-step-${r.step_number}`,
        instruction: r.instruction,
        timerMinutes: toNumber(r.timer_minutes, 0),
      }))

    return {
      id: recipeId,
      title: row.title,
      shortDescription: row.short_description || '',
      sourceName: row.source_name || '',
      sourceUrl: row.source_url || '',
      servings: toNumber(row.servings, 4),
      prepTime: toNumber(row.prep_time_minutes, 0),
      cookTime: toNumber(row.cook_time_minutes, 0),
      cuisineId: row.cuisine_id || '',
      mealTypeId: row.meal_type_id || '',
      dietaryTagIds: splitIds(row.dietary_tag_ids),
      categoryIds: splitIds(row.category_ids),
      difficulty: toNumber(row.difficulty_1_to_5, 0),
      spiceLevel: toNumber(row.spice_level_0_to_5, 0),
      accentColor: row.accent_color || '#D97757',
      coverImage: row.cover_image_url || '',
      includeInMealSuggestions: toBool(row.include_in_meal_suggestions),
      ingredientSections,
      steps,
      mealPlanning: {
        availableForSuggestions: toBool(row.include_in_meal_suggestions),
        addToPlanNow: false,
        planWeekStart: '',
        plannedDate: '',
        plannedMealSlot: '',
        plannedTime: '',
      },
      options: {
        includeInShoppingList: true,
        showNutrition: false,
        allowSubstitutions: false,
        measurementSystem: 'us',
      },
      isSeed: true,
      createdAt: 0,
    }
  })
}

export const seedRecipes = buildSeedRecipes()
