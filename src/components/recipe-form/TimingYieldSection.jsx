import { SPICE_LEVEL_LABELS } from '../../data/lookups.js'
import { formatMinutes } from '../../utils/date.js'
import FormSection from './FormSection.jsx'

export default function TimingYieldSection({ form, updateForm }) {
  const totalTime = (Number(form.prepTime) || 0) + (Number(form.cookTime) || 0)

  return (
    <FormSection title="Timing and yield" description="How much food, and how long will it take?">
      <div className="field-row">
        <label className="field">
          <span>Servings</span>
          <div className="stepper">
            <button
              type="button"
              className="stepper__btn"
              onClick={() => updateForm({ servings: Math.max(1, (Number(form.servings) || 1) - 1) })}
            >
              −
            </button>
            <input
              className="stepper__value"
              type="number"
              min="1"
              value={form.servings}
              onChange={(e) => updateForm({ servings: Math.max(1, Number(e.target.value) || 1) })}
            />
            <button
              type="button"
              className="stepper__btn"
              onClick={() => updateForm({ servings: (Number(form.servings) || 1) + 1 })}
            >
              +
            </button>
          </div>
        </label>

        <label className="field">
          <span>Prep time (min)</span>
          <input
            className="text-input"
            type="number"
            min="0"
            value={form.prepTime}
            onChange={(e) => updateForm({ prepTime: Math.max(0, Number(e.target.value) || 0) })}
          />
        </label>

        <label className="field">
          <span>Cook time (min)</span>
          <input
            className="text-input"
            type="number"
            min="0"
            value={form.cookTime}
            onChange={(e) => updateForm({ cookTime: Math.max(0, Number(e.target.value) || 0) })}
          />
        </label>

        <div className="field">
          <span>Total time</span>
          <div className="readonly-value">{formatMinutes(totalTime)}</div>
        </div>
      </div>

      <label className="field">
        <span>
          Spice level: <strong>{SPICE_LEVEL_LABELS[form.spiceLevel]}</strong>
        </span>
        <input
          type="range"
          min="0"
          max="5"
          step="1"
          value={form.spiceLevel}
          onChange={(e) => updateForm({ spiceLevel: Number(e.target.value) })}
        />
        <div className="range-scale">
          {SPICE_LEVEL_LABELS.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </label>
    </FormSection>
  )
}
