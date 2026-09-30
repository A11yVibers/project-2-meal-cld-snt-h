import React from 'react'
import { SPICE_LEVELS, deriveTotalTime } from '../../data/recipeModel.js'

export default function TimingSection({ draft, update }) {
  const total = deriveTotalTime(draft.prepTimeMinutes, draft.cookTimeMinutes)

  function step(delta) {
    const next = Math.max(1, (Number(draft.servings) || 0) + delta)
    update({ servings: next })
  }

  return (
    <fieldset className="form-section">
      <legend>Timing and yield</legend>

      <label className="field">
        <span>Servings</span>
        <div className="stepper">
          <button type="button" onClick={() => step(-1)} aria-label="Decrease servings">−</button>
          <input
            type="number"
            min="1"
            value={draft.servings}
            onChange={(e) => update({ servings: Math.max(1, Number(e.target.value) || 1) })}
          />
          <button type="button" onClick={() => step(1)} aria-label="Increase servings">+</button>
        </div>
      </label>

      <div className="field-row">
        <label className="field">
          <span>Prep time (minutes)</span>
          <input
            type="number"
            min="0"
            value={draft.prepTimeMinutes}
            onChange={(e) => update({ prepTimeMinutes: Math.max(0, Number(e.target.value) || 0) })}
          />
        </label>
        <label className="field">
          <span>Cook time (minutes)</span>
          <input
            type="number"
            min="0"
            value={draft.cookTimeMinutes}
            onChange={(e) => update({ cookTimeMinutes: Math.max(0, Number(e.target.value) || 0) })}
          />
        </label>
        <label className="field">
          <span>Total time</span>
          <input type="text" value={`${total} min`} disabled readOnly />
        </label>
      </div>

      <label className="field">
        <span>Spice level: {SPICE_LEVELS[draft.spiceLevel]}</span>
        <input
          type="range"
          min="0"
          max="5"
          step="1"
          value={draft.spiceLevel}
          onChange={(e) => update({ spiceLevel: Number(e.target.value) })}
        />
        <div className="range-labels">
          <span>Mild</span>
          <span>Very spicy</span>
        </div>
      </label>
    </fieldset>
  )
}
