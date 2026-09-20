import React from 'react'
import { ingredients, units } from '../../data/loadData.js'
import { emptyIngredientItem, emptySection } from '../../data/recipeDraft.js'

const ingredientNameById = new Map(ingredients.map((i) => [i.id, i.name]))
const ingredientIdByLowerName = new Map(ingredients.map((i) => [i.name.toLowerCase(), i.id]))

function displayNameFor(item) {
  if (item.ingredientId) return ingredientNameById.get(item.ingredientId) || item.customName
  return item.customName
}

export default function IngredientsSection({ draft, updateDraft }) {
  function setSections(nextSections) {
    updateDraft({ ingredientSections: nextSections })
  }

  function updateSection(sectionId, patch) {
    setSections(draft.ingredientSections.map((s) => (s.id === sectionId ? { ...s, ...patch } : s)))
  }

  function updateItem(sectionId, itemId, patch) {
    setSections(
      draft.ingredientSections.map((s) =>
        s.id !== sectionId
          ? s
          : { ...s, items: s.items.map((it) => (it.id === itemId ? { ...it, ...patch } : it)) },
      ),
    )
  }

  function handleNameInput(sectionId, itemId, value) {
    const matchId = ingredientIdByLowerName.get(value.trim().toLowerCase())
    updateItem(sectionId, itemId, {
      customName: value,
      ingredientId: matchId || '',
    })
  }

  function addItem(sectionId) {
    setSections(
      draft.ingredientSections.map((s) =>
        s.id === sectionId ? { ...s, items: [...s.items, emptyIngredientItem()] } : s,
      ),
    )
  }

  function removeItem(sectionId, itemId) {
    setSections(
      draft.ingredientSections.map((s) =>
        s.id === sectionId ? { ...s, items: s.items.filter((it) => it.id !== itemId) } : s,
      ),
    )
  }

  function moveItem(sectionId, itemId, direction) {
    setSections(
      draft.ingredientSections.map((s) => {
        if (s.id !== sectionId) return s
        const index = s.items.findIndex((it) => it.id === itemId)
        const newIndex = index + direction
        if (newIndex < 0 || newIndex >= s.items.length) return s
        const items = [...s.items]
        const [moved] = items.splice(index, 1)
        items.splice(newIndex, 0, moved)
        return { ...s, items }
      }),
    )
  }

  function addSection() {
    setSections([...draft.ingredientSections, emptySection('')])
  }

  function removeSection(sectionId) {
    if (draft.ingredientSections.length <= 1) return
    setSections(draft.ingredientSections.filter((s) => s.id !== sectionId))
  }

  return (
    <fieldset className="form-section">
      <legend>Ingredients</legend>
      <datalist id="rf-ingredient-options">
        {ingredients.map((ing) => (
          <option key={ing.id} value={ing.name} />
        ))}
      </datalist>

      {draft.ingredientSections.map((section) => (
        <div className="ingredient-section-editor" key={section.id}>
          <div className="ingredient-section-editor-header">
            <label className="field-label" htmlFor={`rf-section-name-${section.id}`}>
              Section name
              <input
                id={`rf-section-name-${section.id}`}
                type="text"
                placeholder="e.g. Main, Sauce, Garnish"
                value={section.name}
                onChange={(e) => updateSection(section.id, { name: e.target.value })}
              />
            </label>
            {draft.ingredientSections.length > 1 && (
              <button
                type="button"
                className="button button-danger-outline"
                onClick={() => removeSection(section.id)}
              >
                Remove section
              </button>
            )}
          </div>

          <ul className="ingredient-row-list">
            {section.items.map((item, iIndex) => (
              <li className="ingredient-row" key={item.id}>
                <label className="field-label ingredient-row-name" htmlFor={`rf-ing-name-${item.id}`}>
                  Ingredient
                  <input
                    id={`rf-ing-name-${item.id}`}
                    type="text"
                    list="rf-ingredient-options"
                    placeholder="Search ingredients…"
                    value={displayNameFor(item)}
                    onChange={(e) => handleNameInput(section.id, item.id, e.target.value)}
                  />
                </label>

                <label className="field-label ingredient-row-qty" htmlFor={`rf-ing-qty-${item.id}`}>
                  Quantity
                  <input
                    id={`rf-ing-qty-${item.id}`}
                    type="number"
                    min="0"
                    step="0.25"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(section.id, item.id, {
                        quantity: e.target.value === '' ? '' : Number(e.target.value),
                      })
                    }
                  />
                </label>

                <label className="field-label ingredient-row-unit" htmlFor={`rf-ing-unit-${item.id}`}>
                  Unit
                  <select
                    id={`rf-ing-unit-${item.id}`}
                    value={item.unit}
                    onChange={(e) => updateItem(section.id, item.id, { unit: e.target.value })}
                  >
                    <option value="">—</option>
                    {units.map((u) => (
                      <option key={u.id} value={u.name}>{u.name}</option>
                    ))}
                  </select>
                </label>

                <label className="checkbox-item ingredient-row-optional">
                  <input
                    type="checkbox"
                    checked={item.optional}
                    onChange={(e) => updateItem(section.id, item.id, { optional: e.target.checked })}
                  />
                  Optional
                </label>

                <div className="ingredient-row-actions" role="group" aria-label={`Reorder ${displayNameFor(item) || 'ingredient'}`}>
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => moveItem(section.id, item.id, -1)}
                    disabled={iIndex === 0}
                    aria-label="Move ingredient up"
                  >↑</button>
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => moveItem(section.id, item.id, 1)}
                    disabled={iIndex === section.items.length - 1}
                    aria-label="Move ingredient down"
                  >↓</button>
                  <button
                    type="button"
                    className="icon-button icon-button-danger"
                    onClick={() => removeItem(section.id, item.id)}
                    aria-label="Remove ingredient"
                    disabled={section.items.length <= 1}
                  >✕</button>
                </div>
              </li>
            ))}
          </ul>

          <button type="button" className="button button-secondary" onClick={() => addItem(section.id)}>
            + Add another ingredient
          </button>
        </div>
      ))}

      <button type="button" className="button button-secondary" onClick={addSection}>
        + Add another ingredient section
      </button>
    </fieldset>
  )
}
