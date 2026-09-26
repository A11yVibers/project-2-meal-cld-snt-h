import React, { useState } from 'react'
import { PLANNER_SLOTS } from '../lib/data.js'
import { toIsoDate } from '../lib/dates.js'
import Modal from './Modal.jsx'

// Modal used from a recipe's detail view to drop it into a specific day/slot of the planner.
export default function PlanRecipeDialog({ recipe, existingRecipeTitle, onConfirm, onClose }) {
  const [date, setDate] = useState(toIsoDate(new Date()))
  const [slot, setSlot] = useState('Dinner')

  return (
    <Modal title={`Add "${recipe.title}" to your plan`} onClose={onClose}>
      <div className="form-row">
        <label className="field-label" htmlFor="plan-date">Cooking date</label>
        <input id="plan-date" type="date" className="text-input" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div className="form-row">
        <label className="field-label" htmlFor="plan-slot">Meal slot</label>
        <select id="plan-slot" className="text-input" value={slot} onChange={(e) => setSlot(e.target.value)}>
          {PLANNER_SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      {existingRecipeTitle && existingRecipeTitle(date, slot) && (
        <p className="dialog-note">This will replace "{existingRecipeTitle(date, slot)}" already planned for that slot.</p>
      )}
      <div className="dialog-actions">
        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button type="button" className="btn btn-primary" onClick={() => onConfirm(date, slot)}>Add to plan</button>
      </div>
    </Modal>
  )
}
