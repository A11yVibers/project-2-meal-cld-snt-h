import React from 'react'
import IngredientCombobox from '../IngredientCombobox.jsx'
import { units } from '../../data/lookups.js'
import { emptyIngredientRow } from '../../data/recipeModel.js'

export default function IngredientsSection({ draft, update }) {
  const rows = draft.ingredients
  const sectionNames = Array.from(new Set(rows.map((r) => r.section || 'Main')))

  function setRows(next) {
    update({ ingredients: next })
  }

  function patchRow(id, patch) {
    setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  function addIngredient() {
    const lastSection = rows.length ? rows[rows.length - 1].section : 'Main'
    setRows([...rows, emptyIngredientRow(lastSection)])
  }

  function addSection() {
    const n = sectionNames.length + 1
    setRows([...rows, emptyIngredientRow(`Section ${n}`)])
  }

  function removeRow(id) {
    setRows(rows.filter((r) => r.id !== id))
  }

  function moveRow(id, dir) {
    const idx = rows.findIndex((r) => r.id === id)
    const swapWith = idx + dir
    if (swapWith < 0 || swapWith >= rows.length) return
    const next = [...rows]
    ;[next[idx], next[swapWith]] = [next[swapWith], next[idx]]
    setRows(next)
  }

  return (
    <fieldset className="form-section">
      <legend>Ingredients</legend>
      <p className="muted small">
        Group ingredients into sections (e.g. "Main", "Sauce", "Garnish") by editing the section name on each row.
      </p>

      <datalist id="ingredient-sections">
        {sectionNames.map((s) => <option value={s} key={s} />)}
      </datalist>

      <div className="ingredient-rows">
        {rows.map((row, idx) => (
          <div className="ingredient-row" key={row.id}>
            <div className="ingredient-row-grid">
              <label className="field field-compact">
                <span>Section</span>
                <input
                  type="text"
                  list="ingredient-sections"
                  value={row.section}
                  onChange={(e) => patchRow(row.id, { section: e.target.value })}
                />
              </label>

              <label className="field field-grow">
                <span>Ingredient</span>
                <IngredientCombobox
                  rowId={row.id}
                  value={{ ingredientId: row.ingredientId, ingredientName: row.ingredientName }}
                  onChange={({ ingredientId, ingredientName }) => patchRow(row.id, { ingredientId, ingredientName })}
                />
              </label>

              <label className="field field-compact">
                <span>Quantity</span>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={row.quantity}
                  onChange={(e) => patchRow(row.id, { quantity: e.target.value })}
                />
              </label>

              <label className="field field-compact">
                <span>Unit</span>
                <select value={row.unit} onChange={(e) => patchRow(row.id, { unit: e.target.value })}>
                  <option value="">—</option>
                  {units.list.map((u) => (
                    <option key={u.id} value={u.name}>{u.name}</option>
                  ))}
                </select>
              </label>

              <label className="field field-checkbox-compact">
                <input
                  type="checkbox"
                  checked={row.optional}
                  onChange={(e) => patchRow(row.id, { optional: e.target.checked })}
                />
                <span>Optional</span>
              </label>
            </div>

            <div className="row-controls">
              <button type="button" className="icon-btn" disabled={idx === 0} onClick={() => moveRow(row.id, -1)} aria-label="Move ingredient up">↑</button>
              <button type="button" className="icon-btn" disabled={idx === rows.length - 1} onClick={() => moveRow(row.id, 1)} aria-label="Move ingredient down">↓</button>
              <button type="button" className="icon-btn icon-btn-danger" onClick={() => removeRow(row.id)} aria-label="Remove ingredient">🗑</button>
            </div>
          </div>
        ))}
      </div>

      <div className="section-actions">
        <button type="button" className="btn" onClick={addIngredient}>+ Add another ingredient</button>
        <button type="button" className="btn" onClick={addSection}>+ Add ingredient section</button>
      </div>
    </fieldset>
  )
}
