import { useState } from 'react'
import { APPROVED_IMAGES } from '../approved-images.js'
import { useAppData } from '../context/AppDataContext.jsx'
import {
  CUISINE_BY_ID,
  MEAL_TYPE_BY_ID,
  DIETARY_TAG_BY_ID,
  RECIPE_CATEGORY_BY_ID,
  SPICE_LEVEL_LABELS,
  PLANNER_SLOT_IDS,
} from '../data/lookups.js'
import { formatMinutes } from '../utils/date.js'
import Badge from '../components/Badge.jsx'
import AddToPlanModal from '../components/AddToPlanModal.jsx'

export default function RecipeDetailPage({ recipeId, onBack, onGoToPlanner }) {
  const { recipesById, setPlanSlot } = useAppData()
  const [showAddToPlan, setShowAddToPlan] = useState(false)
  const [confirmation, setConfirmation] = useState('')

  const recipe = recipesById[recipeId]

  if (!recipe) {
    return (
      <div className="page">
        <button className="btn btn--ghost" onClick={onBack}>
          ← Back to recipes
        </button>
        <p className="muted">This recipe could not be found.</p>
      </div>
    )
  }

  const cuisine = CUISINE_BY_ID[recipe.cuisineId]
  const mealType = MEAL_TYPE_BY_ID[recipe.mealTypeId]
  const imageUrl = recipe.coverImageUrl || APPROVED_IMAGES.placeholder
  const options = recipe.recipeOptions || {}

  function handleConfirmAddToPlan({ weekKey, dayIndex, slotId }) {
    setPlanSlot(weekKey, dayIndex, slotId, recipe.id)
    setShowAddToPlan(false)
    setConfirmation('Added to your weekly meal plan.')
  }

  return (
    <div className="page recipe-detail">
      <button className="btn btn--ghost" onClick={onBack}>
        ← Back to recipes
      </button>

      <div className="recipe-detail__hero" style={{ '--accent': recipe.accentColor || '#D97757' }}>
        <img src={imageUrl} alt="" className="recipe-detail__image" />
        <div className="recipe-detail__hero-info">
          <h1>{recipe.title}</h1>
          {recipe.shortDescription && <p className="muted">{recipe.shortDescription}</p>}
          <div className="recipe-detail__badges">
            {mealType && <Badge>{mealType.name}</Badge>}
            {cuisine && <Badge tone="muted">{cuisine.name}</Badge>}
            {recipe.dietaryTagIds.map((id) => (
              <Badge tone="soft" key={id}>
                {DIETARY_TAG_BY_ID[id]?.name || id}
              </Badge>
            ))}
          </div>
          <div className="recipe-detail__categories">
            {recipe.categoryIds.map((id) => (
              <span key={id} className="chip">
                {RECIPE_CATEGORY_BY_ID[id]?.name || id}
              </span>
            ))}
          </div>
          {recipe.sourceUrl && (
            <a href={recipe.sourceUrl} target="_blank" rel="noreferrer" className="recipe-detail__source">
              Source: {recipe.sourceName || recipe.sourceUrl} ↗
            </a>
          )}
          <div className="recipe-detail__actions">
            <button className="btn btn--primary" onClick={() => setShowAddToPlan(true)}>
              + Add to meal plan
            </button>
            <button className="btn btn--ghost" onClick={onGoToPlanner}>
              View weekly planner
            </button>
          </div>
          {confirmation && <p className="confirmation-note">{confirmation}</p>}
        </div>
      </div>

      <div className="recipe-detail__facts">
        <Fact label="Servings" value={recipe.servings} />
        <Fact label="Prep time" value={formatMinutes(recipe.prepTime)} />
        <Fact label="Cook time" value={formatMinutes(recipe.cookTime)} />
        <Fact label="Total time" value={formatMinutes(recipe.totalTime)} />
        <Fact label="Spice level" value={SPICE_LEVEL_LABELS[recipe.spiceLevel] || SPICE_LEVEL_LABELS[0]} />
        {!recipe.includeInMealSuggestions && <Fact label="Meal suggestions" value="Hidden from suggestions" />}
      </div>

      <div className="recipe-detail__columns">
        <section>
          <h2>Ingredients</h2>
          {recipe.ingredientSections.map((section) => (
            <div key={section.id} className="ingredient-section">
              <h3>{section.name}</h3>
              <ul className="ingredient-list">
                {section.items.map((item) => (
                  <li key={item.id} className={item.optional ? 'is-optional' : ''}>
                    <span className="ingredient-qty">
                      {item.quantity} {item.unit}
                    </span>
                    <span className="ingredient-name">
                      {item.ingredientName}
                      {item.notes ? `, ${item.notes}` : ''}
                    </span>
                    {item.optional && <span className="ingredient-flag">optional</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section>
          <h2>Method</h2>
          <ol className="step-list">
            {recipe.steps.map((step) => (
              <li key={step.id}>
                <span className="step-text">{step.instruction}</span>
                {step.timerMinutes > 0 && <span className="step-timer">⏲ {step.timerMinutes} min</span>}
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section className="recipe-detail__options">
        <h2>Recipe settings</h2>
        <div className="option-summary">
          <Badge tone={options.includeInShoppingList ? 'positive' : 'muted'}>
            {options.includeInShoppingList ? '✓' : '✕'} In shopping lists
          </Badge>
          <Badge tone={options.showNutrition ? 'positive' : 'muted'}>
            {options.showNutrition ? '✓' : '✕'} Nutrition info
          </Badge>
          <Badge tone={options.allowSubstitutions ? 'positive' : 'muted'}>
            {options.allowSubstitutions ? '✓' : '✕'} Substitutions allowed
          </Badge>
          <Badge tone="muted">{options.unitSystem === 'metric' ? 'Metric units' : 'US customary units'}</Badge>
        </div>
      </section>

      {showAddToPlan && (
        <AddToPlanModal
          recipe={recipe}
          defaultSlotId={PLANNER_SLOT_IDS.includes(recipe.mealTypeId) ? recipe.mealTypeId : undefined}
          onConfirm={handleConfirmAddToPlan}
          onClose={() => setShowAddToPlan(false)}
        />
      )}
    </div>
  )
}

function Fact({ label, value }) {
  return (
    <div className="fact">
      <span className="fact__label">{label}</span>
      <span className="fact__value">{value}</span>
    </div>
  )
}
