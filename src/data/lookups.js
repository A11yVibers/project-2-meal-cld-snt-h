import { parseCsv } from './csvParse.js'
import {
  cuisinesCsv,
  dietaryTagsCsv,
  ingredientsCsv,
  mealTypesCsv,
  recipeCategoriesCsv,
  unitsCsv,
} from './rawCsv.js'

function buildLookup(rows, idKey, nameKey, extra) {
  const list = rows.map((r) => ({
    id: r[idKey],
    name: r[nameKey],
    ...(extra ? extra(r) : {}),
  }))
  const byId = new Map(list.map((item) => [item.id, item]))
  return { list, byId }
}

const cuisineRows = parseCsv(cuisinesCsv)
const dietaryTagRows = parseCsv(dietaryTagsCsv)
const ingredientRows = parseCsv(ingredientsCsv)
const mealTypeRows = parseCsv(mealTypesCsv)
const categoryRows = parseCsv(recipeCategoriesCsv)
const unitRows = parseCsv(unitsCsv)

export const cuisines = buildLookup(cuisineRows, 'cuisine_id', 'cuisine_name')
export const dietaryTags = buildLookup(dietaryTagRows, 'dietary_tag_id', 'dietary_tag_name')
export const mealTypes = buildLookup(mealTypeRows, 'meal_type_id', 'meal_type_name')
export const recipeCategories = buildLookup(categoryRows, 'category_id', 'category_name')
export const units = buildLookup(unitRows, 'unit_id', 'unit_name')
export const ingredients = buildLookup(ingredientRows, 'ingredient_id', 'ingredient_name', (r) => ({
  shoppingCategory: r.shopping_category || 'Other',
}))

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

export function cuisineName(id) {
  return cuisines.byId.get(id)?.name || 'Other'
}
export function mealTypeName(id) {
  return mealTypes.byId.get(id)?.name || ''
}
export function dietaryTagNames(ids = []) {
  return ids.map((id) => dietaryTags.byId.get(id)?.name).filter(Boolean)
}
export function categoryNames(ids = []) {
  return ids.map((id) => recipeCategories.byId.get(id)?.name).filter(Boolean)
}
export function unitName(id) {
  // Units are stored by name directly in recipes (matches recipe_ingredients.csv
  // shape, which uses literal unit strings like "lb", "tbsp"), so pass-through
  // if it isn't a U## id.
  return units.byId.get(id)?.name || id
}
export function ingredientById(id) {
  return ingredients.byId.get(id)
}
export function shoppingCategoryForIngredientName(name) {
  const lower = String(name).trim().toLowerCase()
  const found = ingredients.list.find((i) => i.name.toLowerCase() === lower)
  return found ? found.shoppingCategory : 'Other'
}
