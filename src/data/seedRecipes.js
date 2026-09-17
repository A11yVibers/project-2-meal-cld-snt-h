// Builds the initial/seed recipe catalog from project-assets/recipes.csv,
// recipe_ingredients.csv and recipe_steps.csv. These files are treated as
// immutable source data: we only read + normalize them into the app's
// internal recipe shape, never write back to them.
import recipesRaw from '../../project-assets/recipes.csv?raw'
import recipeIngredientsRaw from '../../project-assets/recipe_ingredients.csv?raw'
import recipeStepsRaw from '../../project-assets/recipe_steps.csv?raw'
import { parseCSVToObjects, splitIdList, toBool, toNum } from './csv.js'

const rawRecipes = parseCSVToObjects(recipesRaw)
const rawIngredientRows = parseCSVToObjects(recipeIngredientsRaw)
const rawStepRows = parseCSVToObjects(recipeStepsRaw)

function buildIngredientSections(recipeId) {
  const rows = rawIngredientRows
    .filter((row) => row.recipe_id === recipeId)
    .sort((a, b) => toNum(a.display_order) - toNum(b.display_order))

  const sections = []
  const sectionByName = new Map()

  rows.forEach((row) => {
    const sectionName = row.section_name || 'Main'
    let section = sectionByName.get(sectionName)
    if (!section) {
      section = { id: `${recipeId}-section-${sections.length}`, name: sectionName, items: [] }
      sectionByName.set(sectionName, section)
      sections.push(section)
    }
    section.items.push({
      id: `${recipeId}-ing-${row.display_order}`,
      ingredientId: row.ingredient_id || null,
      ingredientName: row.ingredient_name || '',
      quantity: row.quantity || '',
      unit: row.unit || '',
      notes: row.notes || '',
      optional: toBool(row.optional, false),
    })
  })

  return sections
}

function buildSteps(recipeId) {
  return rawStepRows
    .filter((row) => row.recipe_id === recipeId)
    .sort((a, b) => toNum(a.step_number) - toNum(b.step_number))
    .map((row) => ({
      id: `${recipeId}-step-${row.step_number}`,
      instruction: row.instruction || '',
      timerMinutes: toNum(row.timer_minutes, 0),
    }))
}

export function buildSeedRecipes() {
  return rawRecipes.map((r) => {
    const prepTime = toNum(r.prep_time_minutes)
    const cookTime = toNum(r.cook_time_minutes)
    return {
      id: r.recipe_id,
      title: r.title,
      shortDescription: r.short_description || '',
      sourceName: r.source_name || '',
      sourceUrl: r.source_url || '',
      servings: toNum(r.servings, 4) || 4,
      prepTime,
      cookTime,
      totalTime: toNum(r.total_time_minutes) || prepTime + cookTime,
      cuisineId: r.cuisine_id || '',
      mealTypeId: r.meal_type_id || '',
      dietaryTagIds: splitIdList(r.dietary_tag_ids),
      categoryIds: splitIdList(r.category_ids),
      difficulty: toNum(r.difficulty_1_to_5, 0),
      spiceLevel: toNum(r.spice_level_0_to_5, 0),
      accentColor: r.accent_color || '#D97757',
      coverImageUrl: r.cover_image_url || '',
      includeInMealSuggestions: toBool(r.include_in_meal_suggestions, true),
      ingredientSections: buildIngredientSections(r.recipe_id),
      steps: buildSteps(r.recipe_id),
      recipeOptions: {
        includeInShoppingList: true,
        showNutrition: false,
        allowSubstitutions: true,
        unitSystem: 'us',
      },
      isUserRecipe: false,
      createdAt: 0,
    }
  })
}
