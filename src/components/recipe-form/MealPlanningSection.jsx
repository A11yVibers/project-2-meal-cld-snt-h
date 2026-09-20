import React, { useMemo } from 'react'
import {
  MEAL_SLOTS,
  MEAL_SLOT_LABELS,
  DAY_LABELS,
  getCurrentWeekStart,
  shiftWeek,
  weekDates,
  formatWeekRangeLabel,
  formatShortDate,
} from '../../lib/dateWeek.js'

const WEEK_OPTION_COUNT = 6

export default function MealPlanningSection({ draft, updateDraft }) {
  const currentWeek = getCurrentWeekStart()
  const weekOptions = useMemo(
    () => Array.from({ length: WEEK_OPTION_COUNT }, (_, i) => shiftWeek(currentWeek, i)),
    [currentWeek],
  )

  function updateMealPlanning(patch) {
    updateDraft({ mealPlanning: { ...draft.mealPlanning, ...patch } })
  }

  const days = weekDates(draft.mealPlanning.planWeekStart || currentWeek)

  return (
    <fieldset className="form-section">
      <legend>Meal planning options</legend>

      <label className="checkbox-item">
        <input
          type="checkbox"
          checked={draft.mealPlanning.availableForSuggestions}
          onChange={(e) => updateMealPlanning({ availableForSuggestions: e.target.checked })}
        />
        Make this recipe available in meal-plan suggestions
      </label>

      <label className="checkbox-item">
        <input
          type="checkbox"
          checked={draft.mealPlanning.addToPlanNow}
          onChange={(e) => updateMealPlanning({ addToPlanNow: e.target.checked })}
        />
        Add this recipe to the meal plan immediately
      </label>

      {draft.mealPlanning.addToPlanNow && (
        <div className="meal-planning-details">
          <div className="form-grid">
            <label className="field-label" htmlFor="rf-plan-week">
              Meal-planning week
              <select
                id="rf-plan-week"
                value={draft.mealPlanning.planWeekStart}
                onChange={(e) => {
                  const week = e.target.value
                  updateMealPlanning({ planWeekStart: week, plannedDate: weekDates(week)[0] })
                }}
              >
                {weekOptions.map((w) => (
                  <option key={w} value={w}>{formatWeekRangeLabel(w)}</option>
                ))}
              </select>
            </label>

            <label className="field-label" htmlFor="rf-plan-date">
              Planned cooking date
              <select
                id="rf-plan-date"
                value={draft.mealPlanning.plannedDate}
                onChange={(e) => updateMealPlanning({ plannedDate: e.target.value })}
              >
                {days.map((d, i) => (
                  <option key={d} value={d}>{DAY_LABELS[i]} · {formatShortDate(d)}</option>
                ))}
              </select>
            </label>

            <label className="field-label" htmlFor="rf-plan-slot">
              Planned serving time
              <select
                id="rf-plan-slot"
                value={draft.mealPlanning.plannedMealSlot}
                onChange={(e) => updateMealPlanning({ plannedMealSlot: e.target.value })}
              >
                {MEAL_SLOTS.map((s) => (
                  <option key={s} value={s}>{MEAL_SLOT_LABELS[s]}</option>
                ))}
              </select>
            </label>

            <label className="field-label" htmlFor="rf-plan-datetime">
              Specific date &amp; time (optional)
              <input
                id="rf-plan-datetime"
                type="datetime-local"
                value={draft.mealPlanning.plannedTime}
                onChange={(e) => updateMealPlanning({ plannedTime: e.target.value })}
              />
            </label>
          </div>
          <p className="field-hint">
            Use the specific date &amp; time field for occasions where exact timing matters, such as a dinner party.
          </p>
        </div>
      )}
    </fieldset>
  )
}
