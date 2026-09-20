import React, { useMemo, useState } from 'react'
import Modal from '../common/Modal.jsx'
import { usePlanner } from '../../context/PlannerContext.jsx'
import { useRecipes } from '../../context/RecipesContext.jsx'
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

export default function AssignToPlanModal({ recipe, onClose, onAssigned }) {
  const { assignments, setSlot } = usePlanner()
  const { recipesById } = useRecipes()
  const currentWeek = getCurrentWeekStart()

  const weekOptions = useMemo(
    () => Array.from({ length: WEEK_OPTION_COUNT }, (_, i) => shiftWeek(currentWeek, i)),
    [currentWeek],
  )

  const [week, setWeek] = useState(currentWeek)
  const [date, setDate] = useState(weekDates(currentWeek)[0])
  const [slot, setSlot_] = useState('dinner')

  const days = useMemo(() => weekDates(week), [week])

  const occupied = assignments?.[date]?.[slot]
  const occupiedRecipe = occupied ? recipesById.get(occupied) : null

  function handleWeekChange(newWeek) {
    setWeek(newWeek)
    setDate(weekDates(newWeek)[0])
  }

  function handleConfirm() {
    setSlot(date, slot, recipe.id)
    onAssigned()
  }

  return (
    <Modal title={`Add "${recipe.title}" to meal plan`} onClose={onClose}>
      <div className="form-grid">
        <label className="field-label" htmlFor="assign-week">
          Meal-planning week
          <select id="assign-week" value={week} onChange={(e) => handleWeekChange(e.target.value)}>
            {weekOptions.map((w) => (
              <option key={w} value={w}>{formatWeekRangeLabel(w)}</option>
            ))}
          </select>
        </label>

        <label className="field-label" htmlFor="assign-date">
          Planned cooking date
          <select id="assign-date" value={date} onChange={(e) => setDate(e.target.value)}>
            {days.map((d, i) => (
              <option key={d} value={d}>{DAY_LABELS[i]} · {formatShortDate(d)}</option>
            ))}
          </select>
        </label>

        <label className="field-label" htmlFor="assign-slot">
          Planned serving time
          <select id="assign-slot" value={slot} onChange={(e) => setSlot_(e.target.value)}>
            {MEAL_SLOTS.map((s) => (
              <option key={s} value={s}>{MEAL_SLOT_LABELS[s]}</option>
            ))}
          </select>
        </label>
      </div>

      {occupiedRecipe && occupiedRecipe.id !== recipe.id && (
        <p className="warning-banner" role="alert">
          {MEAL_SLOT_LABELS[slot]} on {formatShortDate(date)} already has "{occupiedRecipe.title}" planned.
          Continuing will replace it.
        </p>
      )}

      <div className="modal-actions">
        <button type="button" className="button button-ghost" onClick={onClose}>Cancel</button>
        <button type="button" className="button button-primary" onClick={handleConfirm}>
          {occupiedRecipe && occupiedRecipe.id !== recipe.id ? 'Replace and add' : 'Add to plan'}
        </button>
      </div>
    </Modal>
  )
}
