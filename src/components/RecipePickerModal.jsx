import React, { useState } from 'react'
import Modal from './Modal.jsx'
import { APPROVED_IMAGES } from '../approved-images.js'

export default function RecipePickerModal({ recipes, title, onSelect, onClose }) {
  const [query, setQuery] = useState('')
  const filtered = query.trim()
    ? recipes.filter((r) => r.title.toLowerCase().includes(query.trim().toLowerCase()))
    : recipes

  return (
    <Modal title={title} onClose={onClose} wide>
      <input
        type="search"
        className="text-input"
        placeholder="Search recipes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
        aria-label="Search recipes to add"
      />
      <div className="picker-list">
        {filtered.length === 0 && <p className="empty-state">No recipes found.</p>}
        {filtered.map((r) => (
          <button type="button" key={r.id} className="picker-row" onClick={() => onSelect(r.id)}>
            <img src={r.coverImage || APPROVED_IMAGES.placeholder} alt={r.title} />
            <div>
              <strong>{r.title}</strong>
              <span className="hint-text">{r.servings} servings · {r.totalTime} min</span>
            </div>
          </button>
        ))}
      </div>
    </Modal>
  )
}
