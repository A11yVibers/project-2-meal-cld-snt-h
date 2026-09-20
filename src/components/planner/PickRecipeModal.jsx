import React, { useMemo, useState } from 'react'
import Modal from '../common/Modal.jsx'
import { useRecipes } from '../../context/RecipesContext.jsx'
import { recipeImageSrc } from '../../lib/image.js'
import { MEAL_SLOT_LABELS, formatShortDate } from '../../lib/dateWeek.js'

export default function PickRecipeModal({ date, slot, currentRecipeId, onPick, onRemove, onClose }) {
  const { recipes } = useRecipes()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return recipes
    return recipes.filter((r) => r.title.toLowerCase().includes(term))
  }, [recipes, search])

  return (
    <Modal title={`${MEAL_SLOT_LABELS[slot]} · ${formatShortDate(date)}`} onClose={onClose}>
      <label className="field-label" htmlFor="pick-recipe-search">
        Search recipes
        <input
          id="pick-recipe-search"
          type="search"
          autoFocus
          placeholder="Search by title…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>

      {currentRecipeId && (
        <button type="button" className="button button-danger-outline" onClick={onRemove}>
          Remove current recipe from this slot
        </button>
      )}

      <ul className="pick-recipe-list">
        {filtered.map((recipe) => (
          <li key={recipe.id}>
            <button
              type="button"
              className={`pick-recipe-item ${recipe.id === currentRecipeId ? 'is-selected' : ''}`}
              onClick={() => onPick(recipe.id)}
            >
              <img src={recipeImageSrc(recipe)} alt="" />
              <span>
                <span className="pick-recipe-title">{recipe.title}</span>
                <span className="pick-recipe-sub">{recipe.prepTime + recipe.cookTime} min · {recipe.servings} servings</span>
              </span>
            </button>
          </li>
        ))}
        {filtered.length === 0 && <li className="empty-state">No recipes match "{search}".</li>}
      </ul>
    </Modal>
  )
}
