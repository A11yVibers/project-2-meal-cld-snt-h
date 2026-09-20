import { APPROVED_IMAGES } from '../approved-images.js'

export function recipeImageSrc(recipe) {
  return recipe?.coverImage || APPROVED_IMAGES.placeholder
}
