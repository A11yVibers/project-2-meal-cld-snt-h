// Raw CSV text imported at build time via Vite's `?raw` loader.
// These files live in project-assets/ and are treated as immutable source data:
// we only ever read/parse them here, never write back to them.
import cuisinesCsv from '../../project-assets/cuisines.csv?raw'
import dietaryTagsCsv from '../../project-assets/dietary_tags.csv?raw'
import ingredientsCsv from '../../project-assets/ingredients.csv?raw'
import mealTypesCsv from '../../project-assets/meal_types.csv?raw'
import recipeCategoriesCsv from '../../project-assets/recipe_categories.csv?raw'
import recipeIngredientsCsv from '../../project-assets/recipe_ingredients.csv?raw'
import recipeStepsCsv from '../../project-assets/recipe_steps.csv?raw'
import recipesCsv from '../../project-assets/recipes.csv?raw'
import unitsCsv from '../../project-assets/units.csv?raw'

export {
  cuisinesCsv,
  dietaryTagsCsv,
  ingredientsCsv,
  mealTypesCsv,
  recipeCategoriesCsv,
  recipeIngredientsCsv,
  recipeStepsCsv,
  recipesCsv,
  unitsCsv,
}
