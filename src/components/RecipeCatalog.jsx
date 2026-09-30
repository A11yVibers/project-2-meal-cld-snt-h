import React, { useMemo, useState } from 'react'
import RecipeCard from './RecipeCard.jsx'
import { useAppData } from '../state/AppDataContext.jsx'
import { cuisines, mealTypes } from '../data/lookups.js'

export default function RecipeCatalog({ onOpenRecipe, onAddRecipe }) {
  const { allRecipes } = useAppData()
  const [query, setQuery] = useState('')
  const [cuisineFilter, setCuisineFilter] = useState('')
  const [mealTypeFilter, setMealTypeFilter] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allRecipes.filter((r) => {
      if (q && !r.title.toLowerCase().includes(q) && !r.shortDescription.toLowerCase().includes(q)) return false
      if (cuisineFilter && r.cuisineId !== cuisineFilter) return false
      if (mealTypeFilter && r.mealTypeId !== mealTypeFilter) return false
      return true
    })
  }, [allRecipes, query, cuisineFilter, mealTypeFilter])

  return (
    <section className="view-section">
      <div className="view-header">
        <div>
          <h1>Recipe Catalog</h1>
          <p className="muted">Browse seed recipes and anything you've added yourself.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={onAddRecipe}>+ Add Recipe</button>
      </div>

      <div className="catalog-filters">
        <input
          type="search"
          placeholder="Search recipes…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search recipes"
        />
        <select value={cuisineFilter} onChange={(e) => setCuisineFilter(e.target.value)} aria-label="Filter by cuisine">
          <option value="">All cuisines</option>
          {cuisines.list.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select value={mealTypeFilter} onChange={(e) => setMealTypeFilter(e.target.value)} aria-label="Filter by meal type">
          <option value="">All meal types</option>
          {mealTypes.list.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="empty-state">No recipes match your filters yet.</p>
      ) : (
        <div className="recipe-grid">
          {filtered.map((r) => (
            <RecipeCard key={r.id} recipe={r} onOpen={onOpenRecipe} />
          ))}
        </div>
      )}
    </section>
  )
}
