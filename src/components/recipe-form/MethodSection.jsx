import { generateId } from '../../utils/id.js'
import FormSection from './FormSection.jsx'

function emptyStep() {
  return { id: generateId('step'), instruction: '', timerMinutes: '' }
}

function moveWithinArray(array, index, direction) {
  const target = index + direction
  if (target < 0 || target >= array.length) return array
  const next = array.slice()
  const [moved] = next.splice(index, 1)
  next.splice(target, 0, moved)
  return next
}

export default function MethodSection({ steps, onChange }) {
  function updateStep(stepId, patch) {
    onChange(steps.map((s) => (s.id === stepId ? { ...s, ...patch } : s)))
  }

  function addStep() {
    onChange([...steps, emptyStep()])
  }

  function removeStep(stepId) {
    if (steps.length <= 1) return
    onChange(steps.filter((s) => s.id !== stepId))
  }

  function moveStep(index, direction) {
    onChange(moveWithinArray(steps, index, direction))
  }

  return (
    <FormSection title="Method" description="Add numbered cooking steps, each with an optional timer.">
      <ol className="step-editor-list">
        {steps.map((step, index) => (
          <li key={step.id} className="step-editor-row">
            <span className="step-editor-number">{index + 1}</span>
            <textarea
              className="text-input step-editor-textarea"
              placeholder="Describe this step…"
              value={step.instruction}
              onChange={(e) => updateStep(step.id, { instruction: e.target.value })}
              rows={2}
            />
            <label className="field step-editor-timer">
              <span>Timer (min)</span>
              <input
                className="text-input"
                type="number"
                min="0"
                placeholder="—"
                value={step.timerMinutes}
                onChange={(e) => updateStep(step.id, { timerMinutes: e.target.value })}
              />
            </label>
            <div className="row-controls">
              <button type="button" className="icon-btn" title="Move up" disabled={index === 0} onClick={() => moveStep(index, -1)}>
                ↑
              </button>
              <button
                type="button"
                className="icon-btn"
                title="Move down"
                disabled={index === steps.length - 1}
                onClick={() => moveStep(index, 1)}
              >
                ↓
              </button>
              <button
                type="button"
                className="icon-btn icon-btn--danger"
                title="Remove step"
                disabled={steps.length <= 1}
                onClick={() => removeStep(step.id)}
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ol>
      <button type="button" className="btn btn--ghost btn--small" onClick={addStep}>
        + Add step
      </button>
    </FormSection>
  )
}
