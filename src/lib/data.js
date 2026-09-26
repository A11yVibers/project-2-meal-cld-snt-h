// Loads and normalizes the seed data shipped in project-assets/*.csv.
// These files are treated as immutable source data: we only read/parse them here.
import cuisinesRaw from '../../project-assets/cuisines.csv?raw'
import dietaryTagsRaw from '../../project-assets/dietary_tags.csv?raw'
import ingredientsRaw from '../../project-assets/ingredients.csv?raw'
import mealTypesRaw from '../../project-assets/meal_types.csv?raw'
import recipeCategoriesRaw from '../../project-assets/recipe_categories.csv?raw'
import recipeIngredientsRaw from '../../project-assets/recipe_ingredients.csv?raw'
import recipeStepsRaw from '../../project-assets/recipe_steps.csv?raw'
import recipesRaw from '../../project-assets/recipes.csv?raw'
import unitsRaw from '../../project-assets/units.csv?raw'
import { parseCsv, splitList } from './csv.js'

const toBool = (v) => String(v).trim().toLowerCase() === 'true'
const toNum = (v, fallback = 0) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

export const CUISINES = parseCsv(cuisinesRaw).map((r) => ({ id: r.cuisine_id, name: r.cuisine_name }))
export const DIETARY_TAGS = parseCsv(dietaryTagsRaw).map((r) => ({ id: r.dietary_tag_id, name: r.dietary_tag_name }))
export const INGREDIENTS = parseCsv(ingredientsRaw).map((r) => ({
  id: r.ingredient_id,
  name: r.ingredient_name,
  category: r.shopping_category,
}))
export const MEAL_TYPES = parseCsv(mealTypesRaw).map((r) => ({ id: r.meal_type_id, name: r.meal_type_name }))
export const RECIPE_CATEGORIES = parseCsv(recipeCategoriesRaw).map((r) => ({ id: r.category_id, name: r.category_name }))
export const UNITS = parseCsv(unitsRaw).map((r) => ({ id: r.unit_id, name: r.unit_name }))

// The four slots the weekly planner exposes. Meal types beyond these (Dessert, Side dish)
// still exist as a recipe's primary meal type, but can't be dropped into a planner grid slot.
export const PLANNER_SLOTS = ['Breakfast', 'Lunch', 'Dinner', 'Snack']

export const SHOPPING_CATEGORIES = [
  'Produce',
  'Meat & seafood',
  'Dairy & eggs',
  'Grains & pantry',
  'Oils & condiments',
  'Canned & jarred',
  'Spices',
]

export const lookupMaps = {
  cuisine: Object.fromEntries(CUISINES.map((c) => [c.id, c.name])),
  dietaryTag: Object.fromEntries(DIETARY_TAGS.map((d) => [d.id, d.name])),
  ingredient: Object.fromEntries(INGREDIENTS.map((i) => [i.id, i])),
  mealType: Object.fromEntries(MEAL_TYPES.map((m) => [m.id, m.name])),
  category: Object.fromEntries(RECIPE_CATEGORIES.map((c) => [c.id, c.name])),
  unit: Object.fromEntries(UNITS.map((u) => [u.id, u.name])),
}

function buildIngredientSections(recipeId, rows) {
  const forRecipe = rows
    .filter((r) => r.recipe_id === recipeId)
    .sort((a, b) => toNum(a.display_order) - toNum(b.display_order))

  const sections = []
  const bySection = new Map()
  forRecipe.forEach((r) => {
    const sectionName = r.section_name || 'Main'
    if (!bySection.has(sectionName)) {
      const section = { id: `${recipeId}-sec-${sections.length}`, name: sectionName, ingredients: [] }
      bySection.set(sectionName, section)
      sections.push(section)
    }
    bySection.get(sectionName).ingredients.push({
      id: `${recipeId}-ing-${r.display_order}`,
      ingredientId: r.ingredient_id,
      ingredientName: r.ingredient_name,
      quantity: r.quantity,
      unit: r.unit,
      notes: r.notes || '',
      optional: toBool(r.optional),
    })
  })
  return sections
}

function buildSteps(recipeId, rows) {
  return rows
    .filter((r) => r.recipe_id === recipeId)
    .sort((a, b) => toNum(a.step_number) - toNum(b.step_number))
    .map((r) => ({
      id: `${recipeId}-step-${r.step_number}`,
      instruction: r.instruction,
      timerMinutes: toNum(r.timer_minutes, 0),
    }))
}

export function loadSeedRecipes() {
  const recipeRows = parseCsv(recipesRaw)
  const ingredientRows = parseCsv(recipeIngredientsRaw)
  const stepRows = parseCsv(recipeStepsRaw)

  return recipeRows.map((r) => ({
    id: r.recipe_id,
    isSeed: true,
    title: r.title,
    shortDescription: r.short_description || '',
    sourceName: r.source_name || '',
    sourceUrl: r.source_url || '',
    servings: toNum(r.servings, 1),
    prepTime: toNum(r.prep_time_minutes, 0),
    cookTime: toNum(r.cook_time_minutes, 0),
    totalTime: toNum(r.total_time_minutes, toNum(r.prep_time_minutes) + toNum(r.cook_time_minutes)),
    cuisineId: r.cuisine_id,
    mealTypeId: r.meal_type_id,
    dietaryTagIds: splitList(r.dietary_tag_ids),
    categoryIds: splitList(r.category_ids),
    difficulty: toNum(r.difficulty_1_to_5, 1),
    spiceLevel: toNum(r.spice_level_0_to_5, 0),
    accentColor: r.accent_color || '#D97757',
    coverImage: r.cover_image_url || '',
    availableForSuggestions: toBool(r.include_in_meal_suggestions),
    ingredientSections: buildIngredientSections(r.recipe_id, ingredientRows),
    steps: buildSteps(r.recipe_id, stepRows),
    options: {
      includeInShoppingList: true,
      showNutrition: false,
      allowSubstitutions: true,
      unitSystem: 'us',
    },
    createdAt: 0,
  }))
}
