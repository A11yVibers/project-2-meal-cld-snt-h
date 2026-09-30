import React, { useMemo, useState } from 'react'
import Modal from './Modal.jsx'
import { useAppData } from '../state/AppDataContext.jsx'
import { MEAL_SLOTS } from '../data/recipeModel.js'
import { dayName, weekDatesForOffset, weekOptionLabel, formatShortDate } from '../utils/dates.js'

const WEEK_OFFSET_CHOICES = [0, 1, 2, 3, 4]

export default function AddToPlanModal({ recipe, onClose, onDone }) {
  const { assignSlot, getDayMap } = useAppData()
  const [offset, setOffset] = useState(0)
  const [dayIndex, setDayIndex] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1)
  const [slotId, setSlotId] = useState(recipe.mealTypeId ? slotFromMealType(recipe.mealTypeId) : 'dinner')
  const [useSpecificTime, setUseSpecificTime] = useState(false)
  const [specificTime, setSpecificTime] = useState('18:00')

  const dates = useMemo(() => weekDatesForOffset(offset), [offset])
  const dayMap = getDayMap(offset)
  const occupied = dayMap?.[dayIndex]?.[slotId]

  function confirm() {
    assignSlot(offset, dayIndex, slotId, recipe.id, useSpecificTime ? specificTime : '')
    onDone?.()
  }

  return (
    <Modal title={`Add "${recipe.title}" to the meal plan`} onClose={onClose}>
      <div className="form-grid">
        <label className="field">
          <span>Meal-planning week</span>
          <select value={offset} onChange={(e) => setOffset(Number(e.target.value))}>
            {WEEK_OFFSET_CHOICES.map((o) => (
              <option key={o} value={o}>{weekOptionLabel(o)}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Planned cooking date</span>
          <select value={dayIndex} onChange={(e) => setDayIndex(Number(e.target.value))}>
            {dates.map((d, i) => (
              <option key={i} value={i}>{dayName(i)} · {formatShortDate(d)}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Planned serving time</span>
          <select value={slotId} onChange={(e) => setSlotId(e.target.value)}>
            {MEAL_SLOTS.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </label>

        <label className="field checkbox-field">
          <input type="checkbox" checked={useSpecificTime} onChange={(e) => setUseSpecificTime(e.target.checked)} />
          <span>Use a specific date &amp; time instead (e.g. for a dinner party)</span>
        </label>

        {useSpecificTime && (
          <label className="field">
            <span>Specific time</span>
            <input type="time" value={specificTime} onChange={(e) => setSpecificTime(e.target.value)} />
          </label>
        )}

        {occupied?.recipeId && (
          <p className="warning-text">
            This slot already has a recipe planned. Confirming will replace it.
          </p>
        )}
      </div>

      <div className="modal-actions">
        <button type="button" className="btn" onClick={onClose}>Cancel</button>
        <button type="button" className="btn btn-primary" onClick={confirm}>Add to plan</button>
      </div>
    </Modal>
  )
}

function slotFromMealType(mealTypeId) {
  const map = { MT01: 'breakfast', MT02: 'lunch', MT03: 'dinner', MT04: 'snack', MT05: 'snack', MT06: 'dinner' }
  return map[mealTypeId] || 'dinner'
}
