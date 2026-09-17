const LINKS = [
  { view: 'catalog', label: 'Recipes' },
  { view: 'planner', label: 'Weekly planner' },
  { view: 'shopping', label: 'Shopping list' },
]

export default function NavBar({ currentView, onNavigate }) {
  return (
    <header className="app-nav">
      <div className="app-nav__brand" onClick={() => onNavigate('catalog')} role="button" tabIndex={0}>
        🍲 <span>Meal Planner</span>
      </div>
      <nav className="app-nav__links">
        {LINKS.map((link) => (
          <button
            key={link.view}
            className={`app-nav__link ${currentView === link.view ? 'is-active' : ''}`}
            onClick={() => onNavigate(link.view)}
          >
            {link.label}
          </button>
        ))}
      </nav>
      <button className="btn btn--primary app-nav__cta" onClick={() => onNavigate('new')}>
        + Add recipe
      </button>
    </header>
  )
}
