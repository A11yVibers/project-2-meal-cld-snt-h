import React, { useMemo, useState } from 'react'
import { useRecipes } from '../context/RecipesContext.jsx'
import { mealTypes } from '../data/loadData.js'
import RecipeCard from './RecipeCard.jsx'

export default function RecipeCatalog({ onOpenRecipe, onAddRecipe }) {
  const { recipes } = useRecipes()
  const [search, setSearch] = useState('')
  const [mealTypeFilter, setMealTypeFilter] = useState('')

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return recipes.filter((recipe) => {
      if (mealTypeFilter && recipe.mealTypeId !== mealTypeFilter) return false
      if (!term) return true
      return (
        recipe.title.toLowerCase().includes(term) ||
        recipe.shortDescription.toLowerCase().includes(term)
      )
    })
  }, [recipes, search, mealTypeFilter])

  return (
    <section aria-labelledby="catalog-heading">
      <div className="section-header">
        <div>
          <h1 id="catalog-heading">Recipe catalog</h1>
          <p className="section-subtitle">{recipes.length} recipe{recipes.length === 1 ? '' : 's'} available</p>
        </div>
        <button type="button" className="button button-primary" onClick={onAddRecipe}>
          + Add new recipe
        </button>
      </div>

      <div className="catalog-controls">
        <label className="field-label" htmlFor="catalog-search">
          Search recipes
          <input
            id="catalog-search"
            type="search"
            placeholder="Search by title or description…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <label className="field-label" htmlFor="catalog-mealtype">
          Meal type
          <select id="catalog-mealtype" value={mealTypeFilter} onChange={(e) => setMealTypeFilter(e.target.value)}>
            <option value="">All meal types</option>
            {mealTypes.map((mt) => (
              <option key={mt.id} value={mt.id}>{mt.name}</option>
            ))}
          </select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="empty-state">No recipes match your search yet.</p>
      ) : (
        <div className="recipe-grid">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onOpen={onOpenRecipe} />
          ))}
        </div>
      )}
    </section>
  )
}
