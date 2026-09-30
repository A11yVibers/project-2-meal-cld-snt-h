import React from 'react'

const TABS = [
  { id: 'catalog', label: 'Recipes' },
  { id: 'planner', label: 'Weekly Planner' },
  { id: 'shopping', label: 'Shopping List' },
]

export default function NavBar({ view, onNavigate, onAddRecipe }) {
  return (
    <header className="app-nav">
      <div className="app-nav-brand">🍲 Meal Planner</div>
      <nav className="app-nav-tabs" aria-label="Main navigation">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`app-nav-tab ${view === tab.id ? 'active' : ''}`}
            aria-current={view === tab.id ? 'page' : undefined}
            onClick={() => onNavigate(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <button type="button" className="btn btn-primary" onClick={onAddRecipe}>+ Add Recipe</button>
    </header>
  )
}
