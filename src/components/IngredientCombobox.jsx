import { useEffect, useMemo, useRef, useState } from 'react'
import { INGREDIENTS } from '../data/lookups.js'

// Searchable ingredient picker backed by project-assets/ingredients.csv.
// Falls back to a free-text custom ingredient when nothing in the list
// matches (still submitted as a normal ingredient entry, just without an
// ingredientId / shopping-category lookup match).
export default function IngredientCombobox({ ingredientId, ingredientName, onChange, placeholder = 'Search ingredients…' }) {
  const [query, setQuery] = useState(ingredientName || '')
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    setQuery(ingredientName || '')
  }, [ingredientName])

  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return INGREDIENTS.slice(0, 8)
    return INGREDIENTS.filter((ing) => ing.name.toLowerCase().includes(q)).slice(0, 8)
  }, [query])

  const exactMatch = INGREDIENTS.some((ing) => ing.name.toLowerCase() === query.trim().toLowerCase())

  function selectIngredient(ing) {
    setQuery(ing.name)
    setOpen(false)
    onChange({ ingredientId: ing.id, ingredientName: ing.name })
  }

  function useCustom() {
    setOpen(false)
    onChange({ ingredientId: null, ingredientName: query.trim() })
  }

  return (
    <div className="combobox" ref={wrapRef}>
      <input
        className="combobox__input"
        type="text"
        value={query}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
          onChange({ ingredientId: null, ingredientName: e.target.value })
        }}
      />
      {ingredientId && <span className="combobox__matched" title="Linked to ingredient list">✓</span>}
      {open && (
        <div className="combobox__menu">
          {matches.length === 0 && <div className="combobox__empty">No matches</div>}
          {matches.map((ing) => (
            <button type="button" key={ing.id} className="combobox__option" onClick={() => selectIngredient(ing)}>
              <span>{ing.name}</span>
              <span className="combobox__option-cat">{ing.category}</span>
            </button>
          ))}
          {query.trim() && !exactMatch && (
            <button type="button" className="combobox__option combobox__option--custom" onClick={useCustom}>
              Use custom ingredient “{query.trim()}”
            </button>
          )}
        </div>
      )}
    </div>
  )
}
