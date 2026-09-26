import React, { useMemo, useState } from 'react'
import RecipeCard from './RecipeCard.jsx'
import { CUISINES, MEAL_TYPES, DIETARY_TAGS } from '../lib/data.js'

export default function RecipeCatalog({ recipes, onOpenRecipe, onAddRecipe }) {
  const [query, setQuery] = useState('')
  const [cuisineFilter, setCuisineFilter] = useState('')
  const [mealTypeFilter, setMealTypeFilter] = useState('')
  const [dietaryFilter, setDietaryFilter] = useState('')

  const filtered = useMemo(() => {
    return recipes.filter((r) => {
      if (query.trim() && !r.title.toLowerCase().includes(query.trim().toLowerCase())) return false
      if (cuisineFilter && r.cuisineId !== cuisineFilter) return false
      if (mealTypeFilter && r.mealTypeId !== mealTypeFilter) return false
      if (dietaryFilter && !r.dietaryTagIds.includes(dietaryFilter)) return false
      return true
    })
  }, [recipes, query, cuisineFilter, mealTypeFilter, dietaryFilter])

  return (
    <section className="view view-catalog">
      <div className="view-header">
        <div>
          <h1>Recipe catalog</h1>
          <p className="view-subtitle">Browse seed recipes and anything you've created.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={onAddRecipe}>+ New recipe</button>
      </div>

      <div className="catalog-filters">
        <input
          type="search"
          className="text-input"
          placeholder="Search recipes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search recipes"
        />
        <select className="text-input" value={cuisineFilter} onChange={(e) => setCuisineFilter(e.target.value)} aria-label="Filter by cuisine">
          <option value="">All cuisines</option>
          {CUISINES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="text-input" value={mealTypeFilter} onChange={(e) => setMealTypeFilter(e.target.value)} aria-label="Filter by meal type">
          <option value="">All meal types</option>
          {MEAL_TYPES.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <select className="text-input" value={dietaryFilter} onChange={(e) => setDietaryFilter(e.target.value)} aria-label="Filter by dietary tag">
          <option value="">All diets</option>
          {DIETARY_TAGS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="empty-state">No recipes match your filters yet.</p>
      ) : (
        <div className="recipe-grid">
          {filtered.map((r) => <RecipeCard key={r.id} recipe={r} onOpen={onOpenRecipe} />)}
        </div>
      )}
    </section>
  )
}
