import React from 'react'
import { APPROVED_IMAGES } from '../approved-images.js'
import { cuisineName, mealTypeName, dietaryTagNames } from '../data/lookups.js'
import { SPICE_LEVELS } from '../data/recipeModel.js'

export default function RecipeCard({ recipe, onOpen }) {
  const img = recipe.coverImageUrl || APPROVED_IMAGES.placeholder
  const tags = dietaryTagNames(recipe.dietaryTagIds).slice(0, 2)

  return (
    <button type="button" className="recipe-card" style={{ '--accent': recipe.accentColor || '#D97757' }} onClick={() => onOpen(recipe.id)}>
      <div className="recipe-card-image-wrap">
        <img
          src={img}
          alt=""
          className="recipe-card-image"
          loading="lazy"
          onError={(e) => { e.currentTarget.src = APPROVED_IMAGES.placeholder }}
        />
        {recipe.isUserCreated && <span className="chip chip-new">Your recipe</span>}
      </div>
      <div className="recipe-card-body">
        <h3 className="recipe-card-title">{recipe.title}</h3>
        <p className="recipe-card-desc">{recipe.shortDescription || 'No description yet.'}</p>
        <div className="recipe-card-meta">
          <span>⏱ {recipe.totalTimeMinutes} min</span>
          <span>🍽 {recipe.servings} servings</span>
          {recipe.spiceLevel > 0 && <span>🌶 {SPICE_LEVELS[recipe.spiceLevel]}</span>}
        </div>
        <div className="recipe-card-tags">
          {recipe.cuisineId && <span className="chip">{cuisineName(recipe.cuisineId)}</span>}
          {recipe.mealTypeId && <span className="chip">{mealTypeName(recipe.mealTypeId)}</span>}
          {tags.map((t) => (
            <span className="chip chip-dietary" key={t}>{t}</span>
          ))}
        </div>
      </div>
    </button>
  )
}
