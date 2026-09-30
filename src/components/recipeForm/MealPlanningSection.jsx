import React, { useMemo } from 'react'
import { MEAL_SLOTS } from '../../data/recipeModel.js'
import { dayName, formatShortDate, weekDatesForOffset, weekOptionLabel } from '../../utils/dates.js'

const WEEK_OFFSET_CHOICES = [0, 1, 2, 3, 4]

export default function MealPlanningSection({ draft, update }) {
  const mp = draft.mealPlanning

  function patchMp(patch) {
    update({ mealPlanning: { ...mp, ...patch } })
  }

  const dates = useMemo(() => weekDatesForOffset(Number(mp.plannedWeekOffset) || 0), [mp.plannedWeekOffset])

  return (
    <fieldset className="form-section">
      <legend>Meal planning options</legend>

      <label className="field checkbox-field">
        <input
          type="checkbox"
          checked={mp.availableForSuggestions}
          onChange={(e) => patchMp({ availableForSuggestions: e.target.checked })}
        />
        <span>Make this recipe available in meal-plan suggestions</span>
      </label>

      <label className="field checkbox-field">
        <input
          type="checkbox"
          checked={mp.addImmediately}
          onChange={(e) => patchMp({ addImmediately: e.target.checked })}
        />
        <span>Immediately add this recipe to the meal plan</span>
      </label>

      {mp.addImmediately && (
        <div className="nested-fields">
          <label className="field">
            <span>Meal-planning week</span>
            <select
              value={mp.plannedWeekOffset}
              onChange={(e) => patchMp({ plannedWeekOffset: Number(e.target.value) })}
            >
              {WEEK_OFFSET_CHOICES.map((o) => (
                <option key={o} value={o}>{weekOptionLabel(o)}</option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Planned cooking date</span>
            <select
              value={mp.plannedDayIndex}
              onChange={(e) => patchMp({ plannedDayIndex: Number(e.target.value) })}
            >
              {dates.map((d, i) => (
                <option key={i} value={i}>{dayName(i)} · {formatShortDate(d)}</option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Planned serving time</span>
            <select
              value={mp.plannedSlotId}
              onChange={(e) => patchMp({ plannedSlotId: e.target.value })}
            >
              {MEAL_SLOTS.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Specific date &amp; time (optional)</span>
            <input
              type="time"
              value={mp.plannedSpecificTime}
              onChange={(e) => patchMp({ plannedSpecificTime: e.target.value })}
            />
            <span className="muted small">Use this when the meal has an exact time, e.g. a dinner party.</span>
          </label>
        </div>
      )}
    </fieldset>
  )
}
