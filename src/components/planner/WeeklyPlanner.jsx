import React, { useState } from 'react'
import { usePlanner } from '../../context/PlannerContext.jsx'
import { useRecipes } from '../../context/RecipesContext.jsx'
import {
  MEAL_SLOTS,
  MEAL_SLOT_LABELS,
  DAY_LABELS,
  weekDates,
  formatWeekRangeLabel,
  formatShortDate,
  isToday,
} from '../../lib/dateWeek.js'
import { recipeImageSrc } from '../../lib/image.js'
import PickRecipeModal from './PickRecipeModal.jsx'

export default function WeeklyPlanner({ onOpenRecipe }) {
  const { assignments, setSlot, selectedWeekStart, goToNextWeek, goToPrevWeek, goToCurrentWeek } = usePlanner()
  const { recipesById } = useRecipes()
  const [activeCell, setActiveCell] = useState(null) // { date, slot }

  const days = weekDates(selectedWeekStart)

  return (
    <section aria-labelledby="planner-heading">
      <div className="section-header">
        <div>
          <h1 id="planner-heading">Weekly meal planner</h1>
          <p className="section-subtitle">Plan breakfast, lunch, dinner and snacks for the week.</p>
        </div>
      </div>

      <div className="week-nav" role="group" aria-label="Change week">
        <button type="button" className="button button-ghost" onClick={goToPrevWeek} aria-label="Previous week">← Previous</button>
        <div className="week-nav-current">
          <strong>{formatWeekRangeLabel(selectedWeekStart)}</strong>
          <button type="button" className="button button-link" onClick={goToCurrentWeek}>Today</button>
        </div>
        <button type="button" className="button button-ghost" onClick={goToNextWeek} aria-label="Next week">Next →</button>
      </div>

      <div className="planner-grid-wrap">
        <table className="planner-grid">
          <thead>
            <tr>
              <th scope="col" className="planner-slot-header">Meal</th>
              {days.map((day, i) => (
                <th scope="col" key={day} className={isToday(day) ? 'is-today' : ''}>
                  <span className="planner-day-name">{DAY_LABELS[i]}</span>
                  <span className="planner-day-date">{formatShortDate(day)}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MEAL_SLOTS.map((slot) => (
              <tr key={slot}>
                <th scope="row" className="planner-slot-header">{MEAL_SLOT_LABELS[slot]}</th>
                {days.map((day) => {
                  const recipeId = assignments?.[day]?.[slot]
                  const recipe = recipeId ? recipesById.get(recipeId) : null
                  return (
                    <td key={day} className={isToday(day) ? 'is-today' : ''}>
                      {recipe ? (
                        <div className="planner-cell-filled">
                          <button type="button" className="planner-recipe-chip" onClick={() => onOpenRecipe(recipe.id)}>
                            <img src={recipeImageSrc(recipe)} alt="" />
                            <span>{recipe.title}</span>
                          </button>
                          <button
                            type="button"
                            className="button button-link planner-cell-edit"
                            onClick={() => setActiveCell({ date: day, slot })}
                          >
                            Change
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="planner-cell-empty"
                          onClick={() => setActiveCell({ date: day, slot })}
                        >
                          + Add recipe
                        </button>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {activeCell && (
        <PickRecipeModal
          date={activeCell.date}
          slot={activeCell.slot}
          currentRecipeId={assignments?.[activeCell.date]?.[activeCell.slot] || null}
          onPick={(recipeId) => {
            setSlot(activeCell.date, activeCell.slot, recipeId)
            setActiveCell(null)
          }}
          onRemove={() => {
            setSlot(activeCell.date, activeCell.slot, null)
            setActiveCell(null)
          }}
          onClose={() => setActiveCell(null)}
        />
      )}
    </section>
  )
}
