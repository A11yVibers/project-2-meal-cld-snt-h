// Lookup data sourced from project-assets/*.csv (treated as immutable input
// data — parsed at build time, never duplicated or hand-typed here).
import cuisinesRaw from '../../project-assets/cuisines.csv?raw'
import dietaryTagsRaw from '../../project-assets/dietary_tags.csv?raw'
import mealTypesRaw from '../../project-assets/meal_types.csv?raw'
import recipeCategoriesRaw from '../../project-assets/recipe_categories.csv?raw'
import unitsRaw from '../../project-assets/units.csv?raw'
import ingredientsRaw from '../../project-assets/ingredients.csv?raw'
import { parseCSVToObjects } from './csv.js'

function toMap(list) {
  return Object.fromEntries(list.map((item) => [item.id, item]))
}

export const CUISINES = parseCSVToObjects(cuisinesRaw).map((r) => ({
  id: r.cuisine_id,
  name: r.cuisine_name,
}))

export const DIETARY_TAGS = parseCSVToObjects(dietaryTagsRaw).map((r) => ({
  id: r.dietary_tag_id,
  name: r.dietary_tag_name,
}))

export const MEAL_TYPES = parseCSVToObjects(mealTypesRaw).map((r) => ({
  id: r.meal_type_id,
  name: r.meal_type_name,
}))

export const RECIPE_CATEGORIES = parseCSVToObjects(recipeCategoriesRaw).map((r) => ({
  id: r.category_id,
  name: r.category_name,
}))

export const UNITS = parseCSVToObjects(unitsRaw).map((r) => ({
  id: r.unit_id,
  name: r.unit_name,
}))

export const INGREDIENTS = parseCSVToObjects(ingredientsRaw).map((r) => ({
  id: r.ingredient_id,
  name: r.ingredient_name,
  category: r.shopping_category,
}))

export const CUISINE_BY_ID = toMap(CUISINES)
export const DIETARY_TAG_BY_ID = toMap(DIETARY_TAGS)
export const MEAL_TYPE_BY_ID = toMap(MEAL_TYPES)
export const RECIPE_CATEGORY_BY_ID = toMap(RECIPE_CATEGORIES)
export const UNIT_BY_ID = toMap(UNITS)
export const INGREDIENT_BY_ID = toMap(INGREDIENTS)

export const INGREDIENT_BY_NAME_LOWER = Object.fromEntries(
  INGREDIENTS.map((item) => [item.name.trim().toLowerCase(), item])
)

// The weekly planner only ever exposes four slots. These four meal types
// happen to be the first four rows of meal_types.csv (MT01-MT04), so we
// reuse those ids as the canonical planner-slot keys instead of inventing
// new ones.
export const PLANNER_SLOTS = MEAL_TYPES.slice(0, 4)
export const PLANNER_SLOT_IDS = PLANNER_SLOTS.map((s) => s.id)

export const SHOPPING_CATEGORY_ORDER = [
  'Produce',
  'Meat & seafood',
  'Dairy & eggs',
  'Grains & pantry',
  'Oils & condiments',
  'Canned & jarred',
  'Spices',
  'Other',
]

export const SPICE_LEVEL_LABELS = ['No spice', 'Mild', 'Medium', 'Spicy', 'Hot', 'Very spicy']

export const ACCENT_COLOR_SWATCHES = [
  '#D97757',
  '#8A9A5B',
  '#4C7EA8',
  '#B8544B',
  '#C99A3C',
  '#6C6EAB',
  '#3E8E7E',
  '#A65D8C',
]
