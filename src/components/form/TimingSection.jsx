import React from 'react'
import { SPICE_LABELS } from '../../lib/constants.js'

export default function TimingSection({ value, onChange }) {
  const set = (patch) => onChange({ ...value, ...patch })
  const totalTime = (Number(value.prepTime) || 0) + (Number(value.cookTime) || 0)

  return (
    <div className="form-section-body">
      <div className="form-row">
        <span className="field-label">Servings</span>
        <div className="stepper">
          <button type="button" onClick={() => set({ servings: Math.max(1, (Number(value.servings) || 1) - 1) })} aria-label="Decrease servings">-</button>
          <input
            type="number"
            min="1"
            className="stepper-input"
            value={value.servings}
            onChange={(e) => set({ servings: e.target.value })}
            aria-label="Servings"
          />
          <button type="button" onClick={() => set({ servings: (Number(value.servings) || 1) + 1 })} aria-label="Increase servings">+</button>
        </div>
      </div>

      <div className="form-row-group">
        <div className="form-row">
          <label className="field-label" htmlFor="prep-time">Prep time (minutes)</label>
          <input id="prep-time" type="number" min="0" className="text-input" value={value.prepTime} onChange={(e) => set({ prepTime: e.target.value })} />
        </div>
        <div className="form-row">
          <label className="field-label" htmlFor="cook-time">Cook time (minutes)</label>
          <input id="cook-time" type="number" min="0" className="text-input" value={value.cookTime} onChange={(e) => set({ cookTime: e.target.value })} />
        </div>
        <div className="form-row">
          <span className="field-label">Total time</span>
          <div className="readonly-pill">{totalTime} min</div>
        </div>
      </div>

      <div className="form-row">
        <label className="field-label" htmlFor="spice-level">Spice level: <strong>{SPICE_LABELS[value.spiceLevel]}</strong></label>
        <input
          id="spice-level"
          type="range"
          min="0"
          max="5"
          step="1"
          value={value.spiceLevel}
          onChange={(e) => set({ spiceLevel: Number(e.target.value) })}
        />
        <div className="range-scale">
          <span>Mild</span>
          <span>Very spicy</span>
        </div>
      </div>
    </div>
  )
}
