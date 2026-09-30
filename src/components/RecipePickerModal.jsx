import React, { useMemo, useState } from 'react'
import Modal from './Modal.jsx'
import { useAppData } from '../state/AppDataContext.jsx'
import { APPROVED_IMAGES } from '../approved-images.js'
import { mealTypeName } from '../data/lookups.js'

export default function RecipePickerModal({ title = 'Choose a recipe', onSelect, onClose }) {
  const { allRecipes } = useAppData()
  const [query, setQuery] = useState('')
  const [onlySuggested, setOnlySuggested] = useState(true)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allRecipes.filter((r) => {
      if (onlySuggested && !r.mealPlanning?.availableForSuggestions) return false
      if (q && !r.title.toLowerCase().includes(q)) return false
      return true
    })
  }, [allRecipes, query, onlySuggested])

  return (
    <Modal title={title} onClose={onClose} wide>
      <div className="picker-controls">
        <input
          type="search"
          autoFocus
          placeholder="Search recipes…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search recipes"
        />
        <div className="segmented" role="tablist" aria-label="Recipe filter">
          <button type="button" role="tab" aria-selected={onlySuggested} className={onlySuggested ? 'active' : ''} onClick={() => setOnlySuggested(true)}>
            Suggested
          </button>
          <button type="button" role="tab" aria-selected={!onlySuggested} className={!onlySuggested ? 'active' : ''} onClick={() => setOnlySuggested(false)}>
            All recipes
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="empty-state">No recipes found. Try the "All recipes" tab or a different search.</p>
      ) : (
        <ul className="picker-list">
          {filtered.map((r) => (
            <li key={r.id}>
              <button type="button" className="picker-row" onClick={() => onSelect(r.id)}>
                <img
                  src={r.coverImageUrl || APPROVED_IMAGES.placeholder}
                  alt=""
                  onError={(e) => { e.currentTarget.src = APPROVED_IMAGES.placeholder }}
                />
                <span className="picker-row-text">
                  <strong>{r.title}</strong>
                  <span className="muted small">
                    {mealTypeName(r.mealTypeId)} · {r.totalTimeMinutes} min · Serves {r.servings}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  )
}
