import React, { useState, useMemo } from 'react'
import {
  cuisineById,
  mealTypeById,
  dietaryTagById,
  recipeCategoryById,
  ingredientById,
} from '../data/loadData.js'
import { recipeImageSrc } from '../lib/image.js'
import { convertForDisplay } from '../lib/unitConversion.js'
import SpiceLevel from './common/SpiceLevel.jsx'
import AssignToPlanModal from './planner/AssignToPlanModal.jsx'

function formatQuantity(qty) {
  if (qty == null || qty === '') return ''
  const rounded = Math.round(qty * 100) / 100
  return String(rounded)
}

export default function RecipeDetail({ recipe, onBack }) {
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const cuisine = cuisineById.get(recipe.cuisineId)?.name
  const mealType = mealTypeById.get(recipe.mealTypeId)?.name
  const totalTime = recipe.prepTime + recipe.cookTime
  const system = recipe.options?.measurementSystem || 'us'

  const dietaryNames = recipe.dietaryTagIds.map((id) => dietaryTagById.get(id)?.name || id)
  const categoryNames = recipe.categoryIds.map((id) => recipeCategoryById.get(id)?.name || id)

  return (
    <article className="recipe-detail" style={{ '--accent': recipe.accentColor }}>
      <button type="button" className="button button-ghost back-link" onClick={onBack}>
        ← Back to recipes
      </button>

      <header className="recipe-detail-header">
        <img src={recipeImageSrc(recipe)} alt="" className="recipe-detail-image" />
        <div className="recipe-detail-heading">
          <h1>{recipe.title}</h1>
          <p className="recipe-detail-desc">{recipe.shortDescription}</p>
          <ul className="recipe-detail-badges">
            {mealType && <li className="chip">{mealType}</li>}
            {cuisine && <li className="chip">{cuisine}</li>}
            {dietaryNames.map((name) => (
              <li key={name} className="chip chip-outline">{name}</li>
            ))}
          </ul>
          {categoryNames.length > 0 && (
            <ul className="recipe-detail-badges">
              {categoryNames.map((name) => (
                <li key={name} className="chip chip-soft">{name}</li>
              ))}
            </ul>
          )}
          {recipe.sourceUrl && (
            <p className="recipe-source">
              Source:{' '}
              <a href={recipe.sourceUrl} target="_blank" rel="noreferrer">
                {recipe.sourceName || recipe.sourceUrl}
              </a>
            </p>
          )}
          <div className="recipe-detail-actions">
            <button type="button" className="button button-primary" onClick={() => setShowAssignModal(true)}>
              + Add to meal plan
            </button>
            {justAdded && <span className="confirm-msg" role="status">Added to your meal plan ✓</span>}
          </div>
        </div>
      </header>

      <section className="recipe-stats" aria-label="Timing and yield">
        <div className="stat"><span className="stat-label">Servings</span><span className="stat-value">{recipe.servings}</span></div>
        <div className="stat"><span className="stat-label">Prep time</span><span className="stat-value">{recipe.prepTime} min</span></div>
        <div className="stat"><span className="stat-label">Cook time</span><span className="stat-value">{recipe.cookTime} min</span></div>
        <div className="stat"><span className="stat-label">Total time</span><span className="stat-value">{totalTime} min</span></div>
        <div className="stat"><span className="stat-label">Spice level</span><span className="stat-value"><SpiceLevel level={recipe.spiceLevel} /></span></div>
        {recipe.difficulty > 0 && (
          <div className="stat"><span className="stat-label">Difficulty</span><span className="stat-value">{recipe.difficulty}/5</span></div>
        )}
      </section>

      <div className="recipe-detail-columns">
        <section aria-labelledby="ingredients-heading" className="recipe-ingredients">
          <h2 id="ingredients-heading">
            Ingredients
            <span className="unit-system-tag">{system === 'metric' ? 'Metric' : 'US customary'}</span>
          </h2>
          {recipe.options?.allowSubstitutions && (
            <p className="hint-banner">Substitutions welcome for these ingredients.</p>
          )}
          {recipe.ingredientSections.map((section) => (
            <div key={section.id} className="ingredient-section">
              <h3>{section.name}</h3>
              <ul>
                {section.items.map((item) => {
                  const name = item.customName || ingredientById.get(item.ingredientId)?.name || 'Ingredient'
                  const { quantity, unit } = convertForDisplay(item.quantity, item.unit, system)
                  return (
                    <li key={item.id}>
                      <span className="ingredient-qty">{formatQuantity(quantity)} {unit}</span>
                      <span className="ingredient-name">{name}</span>
                      {item.notes && <span className="ingredient-notes"> — {item.notes}</span>}
                      {item.optional && <span className="chip chip-sm chip-outline">optional</span>}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </section>

        <section aria-labelledby="method-heading" className="recipe-method">
          <h2 id="method-heading">Method</h2>
          <ol>
            {recipe.steps.map((step, index) => (
              <li key={step.id}>
                <span className="step-number" aria-hidden="true">{index + 1}</span>
                <div>
                  <p>{step.instruction}</p>
                  {step.timerMinutes > 0 && <span className="chip chip-sm">⏱ {step.timerMinutes} min</span>}
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {recipe.options?.showNutrition && (
        <section aria-labelledby="nutrition-heading" className="recipe-nutrition">
          <h2 id="nutrition-heading">Nutrition information</h2>
          <p className="empty-state">Nutrition information isn't available for this recipe yet.</p>
        </section>
      )}

      {showAssignModal && (
        <AssignToPlanModal
          recipe={recipe}
          onClose={() => setShowAssignModal(false)}
          onAssigned={() => {
            setShowAssignModal(false)
            setJustAdded(true)
            window.setTimeout(() => setJustAdded(false), 3000)
          }}
        />
      )}
    </article>
  )
}
