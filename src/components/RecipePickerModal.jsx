import { useMemo, useState } from 'react'
import { APPROVED_IMAGES } from '../approved-images.js'
import { MEAL_TYPE_BY_ID } from '../data/lookups.js'
import Modal from './Modal.jsx'

export default function RecipePickerModal({ title, recipes, onPick, onClose, currentRecipeId, onClear }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return recipes
    return recipes.filter((r) => r.title.toLowerCase().includes(q))
  }, [recipes, query])

  return (
    <Modal title={title} onClose={onClose}>
      <input
        className="text-input"
        autoFocus
        type="text"
        placeholder="Search recipes…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {currentRecipeId && (
        <button className="btn btn--ghost btn--danger picker-clear" onClick={onClear}>
          Remove recipe from this slot
        </button>
      )}
      <div className="picker-list">
        {filtered.length === 0 && <p className="muted">No recipes match “{query}”.</p>}
        {filtered.map((recipe) => (
          <button
            key={recipe.id}
            className={`picker-list__item ${recipe.id === currentRecipeId ? 'is-current' : ''}`}
            onClick={() => onPick(recipe.id)}
          >
            <img src={recipe.coverImageUrl || APPROVED_IMAGES.placeholder} alt="" />
            <span className="picker-list__info">
              <strong>{recipe.title}</strong>
              <small>{MEAL_TYPE_BY_ID[recipe.mealTypeId]?.name || 'Any meal'}</small>
            </span>
          </button>
        ))}
      </div>
    </Modal>
  )
}
