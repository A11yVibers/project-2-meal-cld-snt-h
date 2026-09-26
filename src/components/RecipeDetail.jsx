import React, { useState } from 'react'
import { APPROVED_IMAGES } from '../approved-images.js'
import { lookupMaps } from '../lib/data.js'
import { SPICE_LABELS } from '../lib/constants.js'
import { convertQuantity } from '../lib/units.js'
import PlanRecipeDialog from './PlanRecipeDialog.jsx'

export default function RecipeDetail({ recipe, onBack, planRecipeNow, mealPlan, getRecipeById }) {
  const [servings, setServings] = useState(recipe.servings || 1)
  const [showPlanDialog, setShowPlanDialog] = useState(false)
  const [confirmation, setConfirmation] = useState('')

  const ratio = recipe.servings > 0 ? servings / recipe.servings : 1
  const unitSystem = recipe.options?.unitSystem || 'us'

  const image = recipe.coverImage || APPROVED_IMAGES.placeholder
  const cuisine = lookupMaps.cuisine[recipe.cuisineId] || 'Other'
  const mealType = lookupMaps.mealType[recipe.mealTypeId] || ''
  const dietaryNames = recipe.dietaryTagIds.map((id) => lookupMaps.dietaryTag[id]).filter(Boolean)
  const categoryNames = recipe.categoryIds.map((id) => lookupMaps.category[id]).filter(Boolean)

  function scaledQuantity(quantity) {
    const n = Number(quantity)
    if (!Number.isFinite(n)) return quantity
    const scaled = n * ratio
    return Math.round(scaled * 100) / 100
  }

  return (
    <section className="view view-detail">
      <button type="button" className="btn-link" onClick={onBack}>&larr; Back to catalog</button>

      <div className="detail-hero" style={{ '--accent': recipe.accentColor || '#D97757' }}>
        <img className="detail-hero-img" src={image} alt={recipe.title} />
        <div className="detail-hero-info">
          <h1>{recipe.title}</h1>
          {recipe.shortDescription && <p className="detail-desc">{recipe.shortDescription}</p>}
          <div className="detail-meta-row">
            {mealType && <span className="meta-pill">{mealType}</span>}
            <span className="meta-pill">{cuisine}</span>
            <span className="meta-pill" title={SPICE_LABELS[recipe.spiceLevel]}>
              Spice: {SPICE_LABELS[recipe.spiceLevel]}
            </span>
          </div>
          {recipe.sourceUrl && (
            <p className="detail-source">
              Source: <a href={recipe.sourceUrl} target="_blank" rel="noreferrer">{recipe.sourceName || recipe.sourceUrl}</a>
            </p>
          )}
          {dietaryNames.length > 0 && (
            <div className="recipe-card-tags">{dietaryNames.map((n) => <span key={n} className="tag-pill">{n}</span>)}</div>
          )}
          {categoryNames.length > 0 && (
            <div className="recipe-card-tags">{categoryNames.map((n) => <span key={n} className="tag-pill tag-pill-alt">{n}</span>)}</div>
          )}
          <button type="button" className="btn btn-primary" style={{ marginTop: '0.75rem' }} onClick={() => setShowPlanDialog(true)}>
            + Add to meal plan
          </button>
          {confirmation && <p className="dialog-note" role="status">{confirmation}</p>}
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-timing">
          <h2>Timing &amp; yield</h2>
          <div className="timing-stats">
            <div><strong>{recipe.prepTime}</strong><span>Prep min</span></div>
            <div><strong>{recipe.cookTime}</strong><span>Cook min</span></div>
            <div><strong>{recipe.totalTime}</strong><span>Total min</span></div>
          </div>
          <div className="servings-adjust">
            <span>Servings</span>
            <div className="stepper">
              <button type="button" onClick={() => setServings((s) => Math.max(1, s - 1))} aria-label="Decrease servings">-</button>
              <span>{servings}</span>
              <button type="button" onClick={() => setServings((s) => s + 1)} aria-label="Increase servings">+</button>
            </div>
            {ratio !== 1 && <span className="hint-text">Ingredient amounts scaled ×{ratio.toFixed(2)}</span>}
          </div>
          <p className="hint-text">Measurements shown in {unitSystem === 'metric' ? 'metric' : 'US customary'} units (set in this recipe's options).</p>
        </div>

        <div className="detail-ingredients">
          <h2>Ingredients</h2>
          {recipe.ingredientSections.map((section) => (
            <div key={section.id} className="ingredient-section">
              <h3>{section.name}</h3>
              <ul>
                {section.ingredients.map((ing) => {
                  const { quantity, unit } = convertQuantity(scaledQuantity(ing.quantity), ing.unit, unitSystem)
                  return (
                    <li key={ing.id} className={ing.optional ? 'is-optional' : ''}>
                      <span className="ing-qty">{quantity} {unit}</span>
                      <span className="ing-name">{ing.ingredientName}</span>
                      {ing.notes && <span className="ing-notes">({ing.notes})</span>}
                      {ing.optional && <span className="tag-pill tag-pill-alt">optional</span>}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="detail-method">
          <h2>Method</h2>
          <ol>
            {recipe.steps.map((step, idx) => (
              <li key={step.id}>
                <div className="step-index">{idx + 1}</div>
                <div>
                  <p>{step.instruction}</p>
                  {step.timerMinutes > 0 && <span className="tag-pill">⏱ {step.timerMinutes} min</span>}
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="detail-options">
          <h2>Recipe options</h2>
          <ul className="options-summary">
            <li>{recipe.options?.includeInShoppingList ? '✓' : '—'} Included in shopping lists</li>
            <li>{recipe.options?.showNutrition ? '✓' : '—'} Nutrition info shown</li>
            <li>{recipe.options?.allowSubstitutions ? '✓' : '—'} Substitutions allowed</li>
            <li>Measurement system: {unitSystem === 'metric' ? 'Metric' : 'US customary'}</li>
          </ul>
          {recipe.options?.showNutrition && (
            <p className="hint-text">Nutrition estimates aren't available for this recipe yet.</p>
          )}
        </div>
      </div>

      {showPlanDialog && (
        <PlanRecipeDialog
          recipe={recipe}
          existingRecipeTitle={(date, slot) => {
            const existingId = mealPlan[date]?.[slot]
            if (!existingId) return null
            return getRecipeById(existingId)?.title || null
          }}
          onClose={() => setShowPlanDialog(false)}
          onConfirm={(date, slot) => {
            planRecipeNow(recipe.id, date, slot)
            setShowPlanDialog(false)
            setConfirmation(`Added to ${slot} on ${date}.`)
            setTimeout(() => setConfirmation(''), 3500)
          }}
        />
      )}
    </section>
  )
}
