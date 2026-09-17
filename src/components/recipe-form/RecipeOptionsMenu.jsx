import { useEffect, useRef, useState } from 'react'

const TOGGLES = [
  { key: 'includeInShoppingList', label: 'Include ingredients in generated shopping lists' },
  { key: 'showNutrition', label: 'Show nutrition information' },
  { key: 'allowSubstitutions', label: 'Allow ingredient substitutions' },
]

export default function RecipeOptionsMenu({ options, onChange }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function toggle(key) {
    onChange({ ...options, [key]: !options[key] })
  }

  function setUnitSystem(unitSystem) {
    onChange({ ...options, unitSystem })
  }

  const activeCount = TOGGLES.filter((t) => options[t.key]).length

  return (
    <div className="recipe-options-menu" ref={wrapRef}>
      <button type="button" className="btn btn--secondary" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        ⚙ Recipe options <span className="options-count">{activeCount}</span>
      </button>
      {open && (
        <div className="recipe-options-menu__panel">
          <p className="recipe-options-menu__group-label">Settings</p>
          {TOGGLES.map((t) => (
            <button
              key={t.key}
              type="button"
              className={`recipe-options-menu__item ${options[t.key] ? 'is-selected' : ''}`}
              onClick={() => toggle(t.key)}
            >
              <span className="recipe-options-menu__check">{options[t.key] ? '✓' : ''}</span>
              {t.label}
            </button>
          ))}

          <p className="recipe-options-menu__group-label">Measurement units</p>
          <button
            type="button"
            className={`recipe-options-menu__item ${options.unitSystem === 'us' ? 'is-selected' : ''}`}
            onClick={() => setUnitSystem('us')}
          >
            <span className="recipe-options-menu__check">{options.unitSystem === 'us' ? '●' : '○'}</span>
            US customary measurements
          </button>
          <button
            type="button"
            className={`recipe-options-menu__item ${options.unitSystem === 'metric' ? 'is-selected' : ''}`}
            onClick={() => setUnitSystem('metric')}
          >
            <span className="recipe-options-menu__check">{options.unitSystem === 'metric' ? '●' : '○'}</span>
            Metric measurements
          </button>
        </div>
      )}
    </div>
  )
}
