import React from 'react'
import Combobox from '../Combobox.jsx'
import { INGREDIENTS, UNITS } from '../../lib/data.js'
import { makeId } from '../../lib/id.js'

const ingredientOptions = INGREDIENTS.map((i) => ({ id: i.id, name: i.name, category: i.category }))

export default function IngredientsSection({ sections, onChange }) {
  function updateSection(sectionId, patch) {
    onChange(sections.map((s) => (s.id === sectionId ? { ...s, ...patch } : s)))
  }

  function updateIngredient(sectionId, ingId, patch) {
    onChange(sections.map((s) => {
      if (s.id !== sectionId) return s
      return { ...s, ingredients: s.ingredients.map((ing) => (ing.id === ingId ? { ...ing, ...patch } : ing)) }
    }))
  }

  function addIngredient(sectionId) {
    updateSection(sectionId, {
      ingredients: [
        ...sections.find((s) => s.id === sectionId).ingredients,
        { id: makeId('ing'), ingredientId: '', quantity: '', unit: '', optional: false },
      ],
    })
  }

  function removeIngredient(sectionId, ingId) {
    const section = sections.find((s) => s.id === sectionId)
    if (section.ingredients.length <= 1) return
    updateSection(sectionId, { ingredients: section.ingredients.filter((ing) => ing.id !== ingId) })
  }

  function moveIngredient(sectionId, ingId, dir) {
    const section = sections.find((s) => s.id === sectionId)
    const idx = section.ingredients.findIndex((ing) => ing.id === ingId)
    const newIdx = idx + dir
    if (newIdx < 0 || newIdx >= section.ingredients.length) return
    const next = [...section.ingredients]
    ;[next[idx], next[newIdx]] = [next[newIdx], next[idx]]
    updateSection(sectionId, { ingredients: next })
  }

  function addSection() {
    onChange([...sections, {
      id: makeId('section'),
      name: '',
      ingredients: [{ id: makeId('ing'), ingredientId: '', quantity: '', unit: '', optional: false }],
    }])
  }

  function removeSection(sectionId) {
    if (sections.length <= 1) return
    onChange(sections.filter((s) => s.id !== sectionId))
  }

  return (
    <div className="form-section-body">
      {sections.map((section, sIdx) => (
        <div className="ingredient-section-editor" key={section.id}>
          <div className="section-header-row">
            <input
              type="text"
              className="text-input section-name-input"
              placeholder={`Section name (e.g. "Main", "Sauce", "Garnish")`}
              value={section.name}
              onChange={(e) => updateSection(section.id, { name: e.target.value })}
              aria-label={`Section ${sIdx + 1} name`}
            />
            <button type="button" className="btn btn-danger-outline" onClick={() => removeSection(section.id)} disabled={sections.length <= 1}>
              Remove section
            </button>
          </div>

          <div className="ingredient-rows">
            {section.ingredients.map((ing, iIdx) => (
              <div className="ingredient-row" key={ing.id}>
                <div className="ingredient-row-field ingredient-row-name">
                  <Combobox
                    options={ingredientOptions}
                    value={ing.ingredientId}
                    onChange={(id) => updateIngredient(section.id, ing.id, { ingredientId: id })}
                    placeholder="Search ingredient..."
                    ariaLabel={`Ingredient ${iIdx + 1} in ${section.name || 'section'}`}
                  />
                </div>
                <input
                  type="number"
                  min="0"
                  step="any"
                  className="text-input ingredient-row-qty"
                  placeholder="Qty"
                  value={ing.quantity}
                  onChange={(e) => updateIngredient(section.id, ing.id, { quantity: e.target.value })}
                  aria-label={`Quantity for ingredient ${iIdx + 1}`}
                />
                <select
                  className="text-input ingredient-row-unit"
                  value={ing.unit}
                  onChange={(e) => updateIngredient(section.id, ing.id, { unit: e.target.value })}
                  aria-label={`Unit for ingredient ${iIdx + 1}`}
                >
                  <option value="">Unit</option>
                  {UNITS.map((u) => <option key={u.id} value={u.name}>{u.name}</option>)}
                </select>
                <label className="checkbox-label ingredient-row-optional">
                  <input
                    type="checkbox"
                    checked={ing.optional}
                    onChange={(e) => updateIngredient(section.id, ing.id, { optional: e.target.checked })}
                  />
                  Optional
                </label>
                <div className="ingredient-row-actions">
                  <button type="button" className="icon-btn" aria-label="Move ingredient up" onClick={() => moveIngredient(section.id, ing.id, -1)} disabled={iIdx === 0}>↑</button>
                  <button type="button" className="icon-btn" aria-label="Move ingredient down" onClick={() => moveIngredient(section.id, ing.id, 1)} disabled={iIdx === section.ingredients.length - 1}>↓</button>
                  <button type="button" className="icon-btn" aria-label="Remove ingredient" onClick={() => removeIngredient(section.id, ing.id)} disabled={section.ingredients.length <= 1}>✕</button>
                </div>
              </div>
            ))}
          </div>

          <button type="button" className="btn btn-secondary btn-small" onClick={() => addIngredient(section.id)}>+ Add ingredient</button>
        </div>
      ))}

      <button type="button" className="btn btn-secondary" onClick={addSection}>+ Add ingredient section</button>
    </div>
  )
}
