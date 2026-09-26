import React from 'react'
import { APPROVED_IMAGES } from '../approved-images.js'
import { lookupMaps } from '../lib/data.js'
import { SPICE_LABELS } from '../lib/constants.js'

export default function RecipeCard({ recipe, onOpen }) {
  const image = recipe.coverImage || APPROVED_IMAGES.placeholder
  const cuisine = lookupMaps.cuisine[recipe.cuisineId] || ''
  const mealType = lookupMaps.mealType[recipe.mealTypeId] || ''
  const dietaryNames = recipe.dietaryTagIds.map((id) => lookupMaps.dietaryTag[id]).filter(Boolean)

  return (
    <button type="button" className="recipe-card" style={{ '--accent': recipe.accentColor || '#D97757' }} onClick={() => onOpen(recipe.id)}>
      <div className="recipe-card-media">
        <img src={image} alt={recipe.title} loading="lazy" />
        {!recipe.isSeed && <span className="badge badge-user">Your recipe</span>}
      </div>
      <div className="recipe-card-body">
        <h3 className="recipe-card-title">{recipe.title}</h3>
        {recipe.shortDescription && <p className="recipe-card-desc">{recipe.shortDescription}</p>}
        <div className="recipe-card-meta">
          {mealType && <span className="meta-pill">{mealType}</span>}
          {cuisine && <span className="meta-pill">{cuisine}</span>}
          <span className="meta-pill">⏱ {recipe.totalTime} min</span>
          <span className="meta-pill">🍽 {recipe.servings} servings</span>
          {recipe.spiceLevel > 0 && (
            <span className="meta-pill" title={SPICE_LABELS[recipe.spiceLevel]}>
              {'🌶'.repeat(Math.min(recipe.spiceLevel, 3))} {recipe.spiceLevel >= 4 ? '+' : ''}
            </span>
          )}
        </div>
        {dietaryNames.length > 0 && (
          <div className="recipe-card-tags">
            {dietaryNames.slice(0, 3).map((n) => <span key={n} className="tag-pill">{n}</span>)}
            {dietaryNames.length > 3 && <span className="tag-pill">+{dietaryNames.length - 3}</span>}
          </div>
        )}
      </div>
    </button>
  )
}
