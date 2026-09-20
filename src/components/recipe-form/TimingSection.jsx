import React from 'react'

const SPICE_LABELS = ['Mild', 'Mild+', 'Medium', 'Medium-hot', 'Hot', 'Very spicy']

export default function TimingSection({ draft, updateDraft }) {
  const totalTime = (Number(draft.prepTime) || 0) + (Number(draft.cookTime) || 0)

  function adjustServings(delta) {
    const next = Math.max(1, (Number(draft.servings) || 1) + delta)
    updateDraft({ servings: next })
  }

  return (
    <fieldset className="form-section">
      <legend>Timing and yield</legend>

      <div className="field-label">
        <span id="rf-servings-label">Servings</span>
        <div className="stepper" role="group" aria-labelledby="rf-servings-label">
          <button type="button" className="stepper-btn" onClick={() => adjustServings(-1)} aria-label="Decrease servings">−</button>
          <input
            type="number"
            min="1"
            inputMode="numeric"
            value={draft.servings}
            onChange={(e) => updateDraft({ servings: e.target.value === '' ? '' : Number(e.target.value) })}
            aria-label="Servings"
          />
          <button type="button" className="stepper-btn" onClick={() => adjustServings(1)} aria-label="Increase servings">+</button>
        </div>
      </div>

      <div className="form-grid">
        <label className="field-label" htmlFor="rf-prep">
          Prep time (minutes)
          <input
            id="rf-prep"
            type="number"
            min="0"
            value={draft.prepTime}
            onChange={(e) => updateDraft({ prepTime: e.target.value === '' ? '' : Number(e.target.value) })}
          />
        </label>

        <label className="field-label" htmlFor="rf-cook">
          Cook time (minutes)
          <input
            id="rf-cook"
            type="number"
            min="0"
            value={draft.cookTime}
            onChange={(e) => updateDraft({ cookTime: e.target.value === '' ? '' : Number(e.target.value) })}
          />
        </label>

        <div className="field-label">
          <span>Total time</span>
          <output className="total-time-output">{totalTime} min</output>
        </div>
      </div>

      <div className="field-label">
        <label htmlFor="rf-spice">Spice level</label>
        <div className="spice-slider">
          <input
            id="rf-spice"
            type="range"
            min="0"
            max="5"
            step="1"
            value={draft.spiceLevel}
            onChange={(e) => updateDraft({ spiceLevel: Number(e.target.value) })}
            aria-valuetext={draft.spiceLevel === 0 ? 'No spice' : SPICE_LABELS[draft.spiceLevel - 1]}
          />
          <div className="spice-slider-labels">
            <span>Mild</span>
            <span>{'🌶️'.repeat(draft.spiceLevel) || 'No spice'}</span>
            <span>Very spicy</span>
          </div>
        </div>
      </div>
    </fieldset>
  )
}
