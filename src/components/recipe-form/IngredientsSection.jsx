import { UNITS } from '../../data/lookups.js'
import { generateId } from '../../utils/id.js'
import IngredientCombobox from '../IngredientCombobox.jsx'
import FormSection from './FormSection.jsx'

function emptyItem() {
  return { id: generateId('ing'), ingredientId: null, ingredientName: '', quantity: '', unit: '', optional: false }
}

function emptySection(index) {
  return { id: generateId('section'), name: index === 0 ? 'Main' : '', items: [emptyItem()] }
}

function moveWithinArray(array, index, direction) {
  const target = index + direction
  if (target < 0 || target >= array.length) return array
  const next = array.slice()
  const [moved] = next.splice(index, 1)
  next.splice(target, 0, moved)
  return next
}

export default function IngredientsSection({ sections, onChange }) {
  function updateSection(sectionId, patch) {
    onChange(sections.map((s) => (s.id === sectionId ? { ...s, ...patch } : s)))
  }

  function updateItem(sectionId, itemId, patch) {
    onChange(
      sections.map((s) =>
        s.id !== sectionId ? s : { ...s, items: s.items.map((it) => (it.id === itemId ? { ...it, ...patch } : it)) }
      )
    )
  }

  function addItem(sectionId) {
    onChange(sections.map((s) => (s.id === sectionId ? { ...s, items: [...s.items, emptyItem()] } : s)))
  }

  function removeItem(sectionId, itemId) {
    onChange(
      sections.map((s) => (s.id !== sectionId ? s : { ...s, items: s.items.filter((it) => it.id !== itemId) }))
    )
  }

  function moveItem(sectionId, index, direction) {
    onChange(
      sections.map((s) => (s.id !== sectionId ? s : { ...s, items: moveWithinArray(s.items, index, direction) }))
    )
  }

  function addSection() {
    onChange([...sections, emptySection(sections.length)])
  }

  function removeSection(sectionId) {
    if (sections.length <= 1) return
    onChange(sections.filter((s) => s.id !== sectionId))
  }

  function moveSection(index, direction) {
    onChange(moveWithinArray(sections, index, direction))
  }

  return (
    <FormSection
      title="Ingredients"
      description="Group ingredients into sections like Main, Sauce, or Garnish."
      trailing={
        <button type="button" className="btn btn--secondary btn--small" onClick={addSection}>
          + Add ingredient section
        </button>
      }
    >
      {sections.map((section, sectionIndex) => (
        <div key={section.id} className="ingredient-section-editor">
          <div className="ingredient-section-editor__header">
            <input
              className="text-input section-name-input"
              type="text"
              placeholder="Section name (e.g. Sauce)"
              value={section.name}
              onChange={(e) => updateSection(section.id, { name: e.target.value })}
            />
            <div className="section-controls">
              <button type="button" className="icon-btn" title="Move section up" disabled={sectionIndex === 0} onClick={() => moveSection(sectionIndex, -1)}>
                ↑
              </button>
              <button
                type="button"
                className="icon-btn"
                title="Move section down"
                disabled={sectionIndex === sections.length - 1}
                onClick={() => moveSection(sectionIndex, 1)}
              >
                ↓
              </button>
              <button
                type="button"
                className="btn btn--ghost btn--small btn--danger"
                disabled={sections.length <= 1}
                onClick={() => removeSection(section.id)}
              >
                Remove section
              </button>
            </div>
          </div>

          <div className="ingredient-rows">
            {section.items.map((item, itemIndex) => (
              <div key={item.id} className="ingredient-row">
                <IngredientCombobox
                  ingredientId={item.ingredientId}
                  ingredientName={item.ingredientName}
                  onChange={({ ingredientId, ingredientName }) => updateItem(section.id, item.id, { ingredientId, ingredientName })}
                />
                <input
                  className="text-input ingredient-row__qty"
                  type="text"
                  inputMode="decimal"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => updateItem(section.id, item.id, { quantity: e.target.value })}
                />
                <select
                  className="text-input ingredient-row__unit"
                  value={item.unit}
                  onChange={(e) => updateItem(section.id, item.id, { unit: e.target.value })}
                >
                  <option value="">Unit…</option>
                  {UNITS.map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name}
                    </option>
                  ))}
                </select>
                <label className="checkbox-inline">
                  <input
                    type="checkbox"
                    checked={item.optional}
                    onChange={(e) => updateItem(section.id, item.id, { optional: e.target.checked })}
                  />
                  Optional
                </label>
                <div className="row-controls">
                  <button type="button" className="icon-btn" title="Move up" disabled={itemIndex === 0} onClick={() => moveItem(section.id, itemIndex, -1)}>
                    ↑
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    title="Move down"
                    disabled={itemIndex === section.items.length - 1}
                    onClick={() => moveItem(section.id, itemIndex, 1)}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="icon-btn icon-btn--danger"
                    title="Remove ingredient"
                    disabled={section.items.length <= 1}
                    onClick={() => removeItem(section.id, item.id)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button type="button" className="btn btn--ghost btn--small" onClick={() => addItem(section.id)}>
            + Add another ingredient
          </button>
        </div>
      ))}
    </FormSection>
  )
}
