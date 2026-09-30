import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ingredients } from '../data/lookups.js'

// Searchable ingredient picker backed by ingredients.csv, with the option to
// fall back to a free-typed custom ingredient name if nothing matches.
export default function IngredientCombobox({ value, onChange, rowId }) {
  const [query, setQuery] = useState(value?.ingredientName || '')
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    setQuery(value?.ingredientName || '')
  }, [value?.ingredientName])

  useEffect(() => {
    function onDocClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ingredients.list.slice(0, 8)
    return ingredients.list.filter((i) => i.name.toLowerCase().includes(q)).slice(0, 8)
  }, [query])

  function pick(ingredient) {
    onChange({ ingredientId: ingredient.id, ingredientName: ingredient.name })
    setQuery(ingredient.name)
    setOpen(false)
  }

  function useCustom() {
    onChange({ ingredientId: '', ingredientName: query.trim() })
    setOpen(false)
  }

  const listId = `ingredient-list-${rowId}`

  return (
    <div className="combobox" ref={wrapRef}>
      <input
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        placeholder="Search ingredients…"
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
          onChange({ ingredientId: '', ingredientName: e.target.value })
        }}
      />
      {open && (
        <ul className="combobox-list" id={listId} role="listbox">
          {results.map((i) => (
            <li key={i.id}>
              <button type="button" role="option" onClick={() => pick(i)}>
                {i.name} <span className="muted small">· {i.shoppingCategory}</span>
              </button>
            </li>
          ))}
          {query.trim() && !results.some((i) => i.name.toLowerCase() === query.trim().toLowerCase()) && (
            <li>
              <button type="button" className="combobox-custom" onClick={useCustom}>
                Use custom ingredient "{query.trim()}"
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
