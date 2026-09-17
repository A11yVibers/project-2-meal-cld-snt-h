import { useMemo, useState } from 'react'
import { useAppData } from '../context/AppDataContext.jsx'
import { CUISINES, MEAL_TYPES } from '../data/lookups.js'
import RecipeCard from '../components/RecipeCard.jsx'

export default function CatalogPage({ onOpenRecipe, onAddRecipe }) {
  const { recipes } = useAppData()
  const [query, setQuery] = useState('')
  const [cuisineFilter, setCuisineFilter] = useState('')
  const [mealTypeFilter, setMealTypeFilter] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return recipes.filter((r) => {
      if (q && !r.title.toLowerCase().includes(q)) return false
      if (cuisineFilter && r.cuisineId !== cuisineFilter) return false
      if (mealTypeFilter && r.mealTypeId !== mealTypeFilter) return false
      return true
    })
  }, [recipes, query, cuisineFilter, mealTypeFilter])

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Recipe catalog</h1>
          <p className="muted">Browse seed recipes and anything you've added yourself.</p>
        </div>
        <button className="btn btn--primary" onClick={onAddRecipe}>
          + Add recipe
        </button>
      </div>

      <div className="catalog-filters">
        <input
          className="text-input"
          type="text"
          placeholder="Search recipes…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className="text-input" value={cuisineFilter} onChange={(e) => setCuisineFilter(e.target.value)}>
          <option value="">All cuisines</option>
          {CUISINES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select className="text-input" value={mealTypeFilter} onChange={(e) => setMealTypeFilter(e.target.value)}>
          <option value="">All meal types</option>
          {MEAL_TYPES.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="muted">No recipes match your filters yet.</p>
      ) : (
        <div className="recipe-grid">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onSelect={onOpenRecipe} />
          ))}
        </div>
      )}
    </div>
  )
}
