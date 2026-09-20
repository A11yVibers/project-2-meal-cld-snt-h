import React from 'react'
import { emptyStep } from '../../data/recipeDraft.js'

export default function MethodSection({ draft, updateDraft }) {
  function setSteps(nextSteps) {
    updateDraft({ steps: nextSteps })
  }

  function updateStep(stepId, patch) {
    setSteps(draft.steps.map((s) => (s.id === stepId ? { ...s, ...patch } : s)))
  }

  function addStep() {
    setSteps([...draft.steps, emptyStep()])
  }

  function removeStep(stepId) {
    if (draft.steps.length <= 1) return
    setSteps(draft.steps.filter((s) => s.id !== stepId))
  }

  function moveStep(stepId, direction) {
    const index = draft.steps.findIndex((s) => s.id === stepId)
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= draft.steps.length) return
    const steps = [...draft.steps]
    const [moved] = steps.splice(index, 1)
    steps.splice(newIndex, 0, moved)
    setSteps(steps)
  }

  return (
    <fieldset className="form-section">
      <legend>Method</legend>

      <ol className="method-row-list">
        {draft.steps.map((step, index) => (
          <li className="method-row" key={step.id}>
            <span className="step-number" aria-hidden="true">{index + 1}</span>
            <div className="method-row-body">
              <label className="field-label" htmlFor={`rf-step-text-${step.id}`}>
                Instruction
                <textarea
                  id={`rf-step-text-${step.id}`}
                  rows={2}
                  value={step.instruction}
                  onChange={(e) => updateStep(step.id, { instruction: e.target.value })}
                  placeholder={`Describe step ${index + 1}…`}
                />
              </label>
              <label className="field-label method-row-timer" htmlFor={`rf-step-timer-${step.id}`}>
                Timer (minutes, optional)
                <input
                  id={`rf-step-timer-${step.id}`}
                  type="number"
                  min="0"
                  value={step.timerMinutes}
                  onChange={(e) =>
                    updateStep(step.id, { timerMinutes: e.target.value === '' ? '' : Number(e.target.value) })
                  }
                />
              </label>
            </div>
            <div className="ingredient-row-actions" role="group" aria-label={`Reorder step ${index + 1}`}>
              <button type="button" className="icon-button" onClick={() => moveStep(step.id, -1)} disabled={index === 0} aria-label="Move step up">↑</button>
              <button type="button" className="icon-button" onClick={() => moveStep(step.id, 1)} disabled={index === draft.steps.length - 1} aria-label="Move step down">↓</button>
              <button
                type="button"
                className="icon-button icon-button-danger"
                onClick={() => removeStep(step.id)}
                disabled={draft.steps.length <= 1}
                aria-label={`Remove step ${index + 1}`}
              >✕</button>
            </div>
          </li>
        ))}
      </ol>

      <button type="button" className="button button-secondary" onClick={addStep}>
        + Add another step
      </button>
    </fieldset>
  )
}
