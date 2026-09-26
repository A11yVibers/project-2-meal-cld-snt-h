import React, { useMemo, useState } from 'react'
import { PLANNER_SLOTS } from '../lib/data.js'
import { APPROVED_IMAGES } from '../approved-images.js'
import { startOfWeek, addDays, toIsoDate, getWeekDates, formatDayLabel, formatWeekRangeLabel, isToday } from '../lib/dates.js'
import RecipePickerModal from './RecipePickerModal.jsx'

export default function MealPlanner({ recipes, mealPlan, assignSlot, clearSlot, getRecipeById, onOpenRecipe }) {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()))
  const [pickerTarget, setPickerTarget] = useState(null) // { date, slot }

  const weekDates = useMemo(() => getWeekDates(weekStart), [weekStart])

  function goWeek(delta) {
    setWeekStart((prev) => addDays(prev, delta * 7))
  }

  function handleSelectRecipe(recipeId) {
    if (!pickerTarget) return
    assignSlot(pickerTarget.date, pickerTarget.slot, recipeId)
    setPickerTarget(null)
  }

  return (
    <section className="view view-planner">
      <div className="view-header">
        <div>
          <h1>Weekly meal planner</h1>
          <p className="view-subtitle">Week of {formatWeekRangeLabel(weekStart)}</p>
        </div>
        <div className="week-nav">
          <button type="button" className="btn btn-secondary" onClick={() => goWeek(-1)}>&larr; Previous week</button>
          <button type="button" className="btn btn-secondary" onClick={() => setWeekStart(startOfWeek(new Date()))}>Today</button>
          <button type="button" className="btn btn-secondary" onClick={() => goWeek(1)}>Next week &rarr;</button>
        </div>
      </div>

      <div className="planner-grid">
        <div className="planner-grid-corner" />
        {PLANNER_SLOTS.map((slot) => <div className="planner-slot-header" key={slot}>{slot}</div>)}

        {weekDates.map((date) => {
          const iso = toIsoDate(date)
          return (
            <React.Fragment key={iso}>
              <div className={`planner-day-header ${isToday(date) ? 'is-today' : ''}`}>{formatDayLabel(date)}</div>
              {PLANNER_SLOTS.map((slot) => {
                const recipeId = mealPlan[iso]?.[slot]
                const recipe = recipeId ? getRecipeById(recipeId) : null
                return (
                  <div className="planner-cell" key={slot}>
                    {recipe ? (
                      <div className="planner-cell-recipe" style={{ '--accent': recipe.accentColor || '#D97757' }}>
                        <button type="button" className="planner-cell-thumb" onClick={() => onOpenRecipe(recipe.id)} aria-label={`Open ${recipe.title}`}>
                          <img src={recipe.coverImage || APPROVED_IMAGES.placeholder} alt={recipe.title} />
                        </button>
                        <span className="planner-cell-title">{recipe.title}</span>
                        <div className="planner-cell-actions">
                          <button type="button" className="btn-link" onClick={() => setPickerTarget({ date: iso, slot })}>Replace</button>
                          <button type="button" className="btn-link btn-link-danger" onClick={() => clearSlot(iso, slot)}>Remove</button>
                        </div>
                      </div>
                    ) : (
                      <button type="button" className="planner-cell-empty" onClick={() => setPickerTarget({ date: iso, slot })}>
                        + Add recipe
                      </button>
                    )}
                  </div>
                )
              })}
            </React.Fragment>
          )
        })}
      </div>

      {pickerTarget && (
        <RecipePickerModal
          recipes={recipes}
          title={`Choose a recipe for ${pickerTarget.slot}`}
          onClose={() => setPickerTarget(null)}
          onSelect={handleSelectRecipe}
        />
      )}
    </section>
  )
}
