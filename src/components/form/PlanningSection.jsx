import React from 'react'
import { PLANNER_SLOTS, MEAL_TYPES } from '../../lib/data.js'
import { startOfWeek, addDays, toIsoDate, formatWeekRangeLabel, parseIsoDate } from '../../lib/dates.js'

export default function PlanningSection({ value, onChange, primaryMealTypeId }) {
  const set = (patch) => onChange({ ...value, ...patch })
  const weekStartDate = parseIsoDate(value.weekStart)
  const weekEndIso = toIsoDate(addDays(weekStartDate, 6))

  const primaryMealTypeName = MEAL_TYPES.find((m) => m.id === primaryMealTypeId)?.name
  const needsExactTime = primaryMealTypeName && !PLANNER_SLOTS.includes(primaryMealTypeName)

  function handleWeekChange(e) {
    const snapped = toIsoDate(startOfWeek(parseIsoDate(e.target.value)))
    let plannedDate = value.plannedDate
    if (plannedDate < snapped || plannedDate > toIsoDate(addDays(parseIsoDate(snapped), 6))) {
      plannedDate = snapped
    }
    set({ weekStart: snapped, plannedDate })
  }

  return (
    <div className="form-section-body">
      <label className="checkbox-label">
        <input type="checkbox" checked={value.availableForSuggestions} onChange={(e) => set({ availableForSuggestions: e.target.checked })} />
        Make available in meal-plan suggestions
      </label>

      <label className="checkbox-label">
        <input type="checkbox" checked={value.addToPlanNow} onChange={(e) => set({ addToPlanNow: e.target.checked })} />
        Add this recipe to the meal plan immediately
      </label>

      {value.addToPlanNow && (
        <div className="planning-detail-fields">
          <div className="form-row">
            <label className="field-label" htmlFor="plan-week">Meal-planning week</label>
            <input id="plan-week" type="date" className="text-input" value={value.weekStart} onChange={handleWeekChange} />
            <p className="hint-text">Week of {formatWeekRangeLabel(weekStartDate)}</p>
          </div>
          <div className="form-row-group">
            <div className="form-row">
              <label className="field-label" htmlFor="plan-date">Planned cooking date</label>
              <input
                id="plan-date"
                type="date"
                className="text-input"
                value={value.plannedDate}
                min={value.weekStart}
                max={weekEndIso}
                onChange={(e) => set({ plannedDate: e.target.value })}
              />
            </div>
            <div className="form-row">
              <label className="field-label" htmlFor="plan-slot">Planned serving time</label>
              <select id="plan-slot" className="text-input" value={value.plannedSlot} onChange={(e) => set({ plannedSlot: e.target.value })}>
                {PLANNER_SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {needsExactTime && (
            <div className="form-row">
              <label className="field-label" htmlFor="plan-exact">Specific date &amp; time</label>
              <input
                id="plan-exact"
                type="datetime-local"
                className="text-input"
                value={value.exactDateTime}
                onChange={(e) => set({ exactDateTime: e.target.value })}
              />
              <p className="hint-text">
                "{primaryMealTypeName}" isn't one of the planner's standard slots, so pick the exact date and time
                this should be served in addition to the slot above.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
