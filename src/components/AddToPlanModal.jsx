import { useMemo, useState } from 'react'
import { PLANNER_SLOTS } from '../data/lookups.js'
import { DAY_LABELS, formatDayLabel, formatWeekRange, shiftWeekKey, todayWeekKey, weekRelativeLabel } from '../utils/date.js'
import Modal from './Modal.jsx'

export function nearbyWeekOptions(before = 2, after = 8) {
  const today = todayWeekKey()
  const options = []
  for (let i = -before; i <= after; i += 1) {
    const weekKey = shiftWeekKey(today, i)
    options.push({ weekKey, label: `${weekRelativeLabel(weekKey, today)} (${formatWeekRange(weekKey)})` })
  }
  return options
}

export default function AddToPlanModal({ recipe, defaultSlotId, onConfirm, onClose }) {
  const weekOptions = useMemo(() => nearbyWeekOptions(), [])
  const [weekKey, setWeekKey] = useState(weekOptions[2].weekKey) // default: this week
  const [dayIndex, setDayIndex] = useState(0)
  const [slotId, setSlotId] = useState(defaultSlotId || PLANNER_SLOTS[2].id)

  return (
    <Modal title={`Add "${recipe.title}" to your meal plan`} onClose={onClose}>
      <div className="form-grid">
        <label className="field">
          <span>Meal-planning week</span>
          <select className="text-input" value={weekKey} onChange={(e) => setWeekKey(e.target.value)}>
            {weekOptions.map((opt) => (
              <option key={opt.weekKey} value={opt.weekKey}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Planned cooking date</span>
          <select className="text-input" value={dayIndex} onChange={(e) => setDayIndex(Number(e.target.value))}>
            {DAY_LABELS.map((label, idx) => (
              <option key={label} value={idx}>
                {label} · {formatDayLabel(weekKey, idx)}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Planned serving time</span>
          <select className="text-input" value={slotId} onChange={(e) => setSlotId(e.target.value)}>
            {PLANNER_SLOTS.map((slot) => (
              <option key={slot.id} value={slot.id}>
                {slot.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="modal-panel__actions">
        <button className="btn btn--ghost" onClick={onClose}>
          Cancel
        </button>
        <button className="btn btn--primary" onClick={() => onConfirm({ weekKey, dayIndex, slotId })}>
          Add to plan
        </button>
      </div>
    </Modal>
  )
}
