import React from 'react'
import { cuisineById, mealTypeById, dietaryTagById } from '../data/loadData.js'
import { recipeImageSrc } from '../lib/image.js'
import SpiceLevel from './common/SpiceLevel.jsx'

export default function RecipeCard({ recipe, onOpen }) {
  const cuisine = cuisineById.get(recipe.cuisineId)?.name
  const mealType = mealTypeById.get(recipe.mealTypeId)?.name
  const totalTime = recipe.prepTime + recipe.cookTime

  return (
    <button type="button" className="recipe-card" onClick={() => onOpen(recipe.id)} style={{ '--accent': recipe.accentColor }}>
      <div className="recipe-card-image-wrap">
        <img src={recipeImageSrc(recipe)} alt="" className="recipe-card-image" loading="lazy" />
        {!recipe.isSeed && <span className="badge badge-new">Your recipe</span>}
      </div>
      <div className="recipe-card-body">
        <h3 className="recipe-card-title">{recipe.title}</h3>
        <p className="recipe-card-desc">{recipe.shortDescription}</p>
        <ul className="recipe-card-meta" aria-label="Recipe details">
          {mealType && <li>{mealType}</li>}
          {cuisine && <li>{cuisine}</li>}
          <li>{totalTime} min</li>
          <li>{recipe.servings} servings</li>
        </ul>
        <div className="recipe-card-footer">
          <SpiceLevel level={recipe.spiceLevel} />
          {recipe.dietaryTagIds.length > 0 && (
            <span className="recipe-card-tags">
              {recipe.dietaryTagIds.slice(0, 3).map((id) => (
                <span key={id} className="chip chip-sm">{dietaryTagById.get(id)?.name || id}</span>
              ))}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
