import { useMemo } from 'react'
import { PLANNER_SLOTS } from '../../data/lookups.js'
import { DAY_LABELS, formatDayLabel } from '../../utils/date.js'
import { nearbyWeekOptions } from '../AddToPlanModal.jsx'
import FormSection from './FormSection.jsx'

export default function MealPlanningSection({ form, updateForm }) {
  const weekOptions = useMemo(() => nearbyWeekOptions(), [])

  return (
    <FormSection title="Meal planning options" description="Decide how this recipe fits into your weekly meal plan.">
      <label className="checkbox-inline">
        <input
          type="checkbox"
          checked={form.includeInMealSuggestions}
          onChange={(e) => updateForm({ includeInMealSuggestions: e.target.checked })}
        />
        Make this recipe available in meal-plan suggestions
      </label>

      <label className="checkbox-inline">
        <input type="checkbox" checked={form.addToPlanNow} onChange={(e) => updateForm({ addToPlanNow: e.target.checked })} />
        Immediately add this recipe to the meal plan
      </label>

      {form.addToPlanNow && (
        <div className="meal-planning-details">
          <div className="field-row">
            <label className="field">
              <span>Meal-planning week</span>
              <select className="text-input" value={form.planWeekKey} onChange={(e) => updateForm({ planWeekKey: e.target.value })}>
                {weekOptions.map((opt) => (
                  <option key={opt.weekKey} value={opt.weekKey}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Planned cooking date</span>
              <select
                className="text-input"
                value={form.planDayIndex}
                onChange={(e) => updateForm({ planDayIndex: Number(e.target.value) })}
              >
                {DAY_LABELS.map((label, idx) => (
                  <option key={label} value={idx}>
                    {label} · {formatDayLabel(form.planWeekKey, idx)}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Planned serving time</span>
              <select className="text-input" value={form.planSlotId} onChange={(e) => updateForm({ planSlotId: e.target.value })}>
                {PLANNER_SLOTS.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="checkbox-inline">
            <input
              type="checkbox"
              checked={form.useSpecificDateTime}
              onChange={(e) => updateForm({ useSpecificDateTime: e.target.checked })}
            />
            Set a specific date &amp; time for this meal
          </label>

          {form.useSpecificDateTime && (
            <label className="field">
              <span>Specific date and time</span>
              <input
                className="text-input"
                type="datetime-local"
                value={form.specificDateTime}
                onChange={(e) => updateForm({ specificDateTime: e.target.value })}
              />
            </label>
          )}
        </div>
      )}
    </FormSection>
  )
}
