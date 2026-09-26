import React from 'react'
import { makeId } from '../../lib/id.js'

export default function MethodSection({ steps, onChange }) {
  function updateStep(id, patch) {
    onChange(steps.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }

  function addStep() {
    onChange([...steps, { id: makeId('step'), instruction: '', timerMinutes: '' }])
  }

  function removeStep(id) {
    if (steps.length <= 1) return
    onChange(steps.filter((s) => s.id !== id))
  }

  function moveStep(id, dir) {
    const idx = steps.findIndex((s) => s.id === id)
    const newIdx = idx + dir
    if (newIdx < 0 || newIdx >= steps.length) return
    const next = [...steps]
    ;[next[idx], next[newIdx]] = [next[newIdx], next[idx]]
    onChange(next)
  }

  return (
    <div className="form-section-body">
      <div className="method-steps">
        {steps.map((step, idx) => (
          <div className="method-step-row" key={step.id}>
            <div className="step-index">{idx + 1}</div>
            <div className="method-step-fields">
              <textarea
                className="text-input"
                placeholder="Instruction text..."
                value={step.instruction}
                onChange={(e) => updateStep(step.id, { instruction: e.target.value })}
                rows={2}
                aria-label={`Step ${idx + 1} instruction`}
              />
              <label className="field-label-inline">
                Timer (minutes, optional)
                <input
                  type="number"
                  min="0"
                  className="text-input timer-input"
                  placeholder="e.g. 10"
                  value={step.timerMinutes}
                  onChange={(e) => updateStep(step.id, { timerMinutes: e.target.value })}
                  aria-label={`Step ${idx + 1} timer minutes`}
                />
              </label>
            </div>
            <div className="ingredient-row-actions">
              <button type="button" className="icon-btn" aria-label="Move step up" onClick={() => moveStep(step.id, -1)} disabled={idx === 0}>↑</button>
              <button type="button" className="icon-btn" aria-label="Move step down" onClick={() => moveStep(step.id, 1)} disabled={idx === steps.length - 1}>↓</button>
              <button type="button" className="icon-btn" aria-label="Remove step" onClick={() => removeStep(step.id)} disabled={steps.length <= 1}>✕</button>
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="btn btn-secondary btn-small" onClick={addStep}>+ Add step</button>
    </div>
  )
}
