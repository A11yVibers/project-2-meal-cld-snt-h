import React, { useMemo, useState } from 'react'
import { useAppData } from '../state/AppDataContext.jsx'
import { APPROVED_IMAGES } from '../approved-images.js'
import { cuisineName, mealTypeName, dietaryTagNames, categoryNames } from '../data/lookups.js'
import { SPICE_LEVELS } from '../data/recipeModel.js'
import { convertQuantity } from '../utils/unitConvert.js'
import { estimateNutrition } from '../utils/nutrition.js'
import AddToPlanModal from './AddToPlanModal.jsx'

export default function RecipeDetail({ recipeId, onBack, onGoToPlanner }) {
  const { recipesById } = useAppData()
  const [showAddToPlan, setShowAddToPlan] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const recipe = recipesById.get(recipeId)

  const sections = useMemo(() => groupBySection(recipe?.ingredients || []), [recipe])
  const nutrition = useMemo(() => (recipe ? estimateNutrition(recipe) : null), [recipe])
  const measurementSystem = recipe?.options?.measurementSystem || 'us'

  if (!recipe) {
    return (
      <section className="view-section">
        <button type="button" className="link-btn" onClick={onBack}>← Back to recipes</button>
        <p className="empty-state">This recipe could not be found.</p>
      </section>
    )
  }

  const img = recipe.coverImageUrl || APPROVED_IMAGES.placeholder
  const dietary = dietaryTagNames(recipe.dietaryTagIds)
  const categories = categoryNames(recipe.categoryIds)

  return (
    <section className="view-section recipe-detail" style={{ '--accent': recipe.accentColor || '#D97757' }}>
      <button type="button" className="link-btn" onClick={onBack}>← Back to recipes</button>

      <div className="detail-hero">
        <img
          src={img}
          alt=""
          className="detail-hero-image"
          onError={(e) => { e.currentTarget.src = APPROVED_IMAGES.placeholder }}
        />
        <div className="detail-hero-info">
          <h1>{recipe.title}</h1>
          {recipe.shortDescription && <p className="muted">{recipe.shortDescription}</p>}
          {recipe.sourceUrl && (
            <p className="small">
              Source: <a href={recipe.sourceUrl} target="_blank" rel="noreferrer">{recipe.sourceName || recipe.sourceUrl}</a>
            </p>
          )}
          <div className="recipe-card-tags">
            {recipe.cuisineId && <span className="chip">{cuisineName(recipe.cuisineId)}</span>}
            {recipe.mealTypeId && <span className="chip">{mealTypeName(recipe.mealTypeId)}</span>}
            {dietary.map((t) => <span className="chip chip-dietary" key={t}>{t}</span>)}
            {categories.map((t) => <span className="chip chip-category" key={t}>{t}</span>)}
          </div>

          <div className="detail-meta-grid">
            <Meta label="Servings" value={recipe.servings} />
            <Meta label="Prep time" value={`${recipe.prepTimeMinutes} min`} />
            <Meta label="Cook time" value={`${recipe.cookTimeMinutes} min`} />
            <Meta label="Total time" value={`${recipe.totalTimeMinutes} min`} />
            <Meta label="Spice level" value={SPICE_LEVELS[recipe.spiceLevel || 0]} />
            {recipe.difficulty && <Meta label="Difficulty" value={`${recipe.difficulty} / 5`} />}
          </div>

          <div className="detail-actions">
            <button type="button" className="btn btn-primary" onClick={() => setShowAddToPlan(true)}>
              📅 Add to meal plan
            </button>
            {justAdded && (
              <span className="success-text">
                Added! <button type="button" className="link-btn" onClick={onGoToPlanner}>View planner →</button>
              </span>
            )}
          </div>
        </div>
      </div>

      {recipe.options?.allowSubstitutions && (
        <p className="info-banner">🔄 Ingredient substitutions are allowed for this recipe.</p>
      )}

      <div className="detail-columns">
        <div>
          <h2>Ingredients</h2>
          <p className="muted small">
            Measurements shown in {measurementSystem === 'metric' ? 'metric' : 'US customary'} units.
          </p>
          {sections.map((section) => (
            <div key={section.name} className="ingredient-section">
              <h3>{section.name}</h3>
              <ul className="ingredient-list">
                {section.items.map((item) => {
                  const { quantity, unit } = convertQuantity(item.quantity, item.unit, measurementSystem)
                  return (
                    <li key={item.id} className={item.optional ? 'optional' : ''}>
                      <span className="ingredient-qty">{formatQty(quantity)} {unit}</span>
                      <span className="ingredient-name">
                        {item.ingredientName}
                        {item.notes && <span className="muted small"> ({item.notes})</span>}
                        {item.optional && <span className="chip chip-optional">optional</span>}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}

          {recipe.options?.showNutrition && nutrition && (
            <div className="nutrition-panel">
              <h3>Estimated nutrition (per serving)</h3>
              <p className="muted small">Rough estimate derived from ingredient categories — not verified nutrition data.</p>
              <div className="nutrition-grid">
                <span><strong>{nutrition.calories}</strong> kcal</span>
                <span><strong>{nutrition.protein}</strong>g protein</span>
                <span><strong>{nutrition.carbs}</strong>g carbs</span>
                <span><strong>{nutrition.fat}</strong>g fat</span>
              </div>
            </div>
          )}
        </div>

        <div>
          <h2>Method</h2>
          <ol className="steps-list">
            {(recipe.steps || []).map((step, idx) => (
              <li key={step.id}>
                <span className="step-number">{idx + 1}</span>
                <span className="step-text">
                  {step.instruction}
                  {step.timerMinutes > 0 && <span className="chip chip-timer">⏱ {step.timerMinutes} min</span>}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {showAddToPlan && (
        <AddToPlanModal
          recipe={recipe}
          onClose={() => setShowAddToPlan(false)}
          onDone={() => { setShowAddToPlan(false); setJustAdded(true) }}
        />
      )}
    </section>
  )
}

function Meta({ label, value }) {
  return (
    <div className="meta-item">
      <span className="meta-label">{label}</span>
      <span className="meta-value">{value}</span>
    </div>
  )
}

function groupBySection(items) {
  const order = []
  const map = new Map()
  items.forEach((item) => {
    const name = item.section || 'Main'
    if (!map.has(name)) {
      map.set(name, [])
      order.push(name)
    }
    map.get(name).push(item)
  })
  return order.map((name) => ({ name, items: map.get(name) }))
}

function formatQty(q) {
  if (q === '' || q === undefined || q === null) return ''
  const n = Number(q)
  if (!Number.isFinite(n)) return q
  return Number.isInteger(n) ? String(n) : String(Math.round(n * 100) / 100)
}
