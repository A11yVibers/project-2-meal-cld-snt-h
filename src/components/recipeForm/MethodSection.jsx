import React from 'react'
import { emptyStepRow } from '../../data/recipeModel.js'

export default function MethodSection({ draft, update }) {
  const steps = draft.steps

  function setSteps(next) {
    update({ steps: next })
  }

  function patchStep(id, patch) {
    setSteps(steps.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }

  function addStep() {
    setSteps([...steps, emptyStepRow()])
  }

  function removeStep(id) {
    setSteps(steps.filter((s) => s.id !== id))
  }

  function moveStep(id, dir) {
    const idx = steps.findIndex((s) => s.id === id)
    const swapWith = idx + dir
    if (swapWith < 0 || swapWith >= steps.length) return
    const next = [...steps]
    ;[next[idx], next[swapWith]] = [next[swapWith], next[idx]]
    setSteps(next)
  }

  return (
    <fieldset className="form-section">
      <legend>Method</legend>

      <div className="step-rows">
        {steps.map((step, idx) => (
          <div className="step-row" key={step.id}>
            <span className="step-number">{idx + 1}</span>
            <div className="step-row-grid">
              <label className="field field-grow">
                <span>Instruction</span>
                <textarea
                  rows={2}
                  value={step.instruction}
                  onChange={(e) => patchStep(step.id, { instruction: e.target.value })}
                  placeholder="Describe this step…"
                />
              </label>
              <label className="field field-compact">
                <span>Timer (minutes, optional)</span>
                <input
                  type="number"
                  min="0"
                  value={step.timerMinutes}
                  onChange={(e) => patchStep(step.id, { timerMinutes: e.target.value })}
                />
              </label>
            </div>
            <div className="row-controls">
              <button type="button" className="icon-btn" disabled={idx === 0} onClick={() => moveStep(step.id, -1)} aria-label="Move step up">↑</button>
              <button type="button" className="icon-btn" disabled={idx === steps.length - 1} onClick={() => moveStep(step.id, 1)} aria-label="Move step down">↓</button>
              <button type="button" className="icon-btn icon-btn-danger" onClick={() => removeStep(step.id)} aria-label="Remove step">🗑</button>
            </div>
          </div>
        ))}
      </div>

      <div className="section-actions">
        <button type="button" className="btn" onClick={addStep}>+ Add another step</button>
      </div>
    </fieldset>
  )
}
