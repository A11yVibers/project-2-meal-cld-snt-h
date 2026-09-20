import React from 'react'

const NAV_ITEMS = [
  { path: 'catalog', label: 'Recipes' },
  { path: 'planner', label: 'Meal planner' },
  { path: 'shopping', label: 'Shopping list' },
]

export default function NavBar({ currentPath, navigate }) {
  return (
    <header className="app-header">
      <div className="app-header-inner">
        <span className="app-brand">🍽️ Meal Planner</span>
        <nav aria-label="Primary">
          <ul className="nav-list">
            {NAV_ITEMS.map((item) => (
              <li key={item.path}>
                <a
                  href={`#/${item.path}`}
                  className={currentPath === item.path ? 'is-active' : ''}
                  aria-current={currentPath === item.path ? 'page' : undefined}
                  onClick={(e) => {
                    e.preventDefault()
                    navigate(item.path)
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
