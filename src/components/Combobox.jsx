import React, { useEffect, useRef, useState } from 'react'

// A small searchable "select" - filters a list of {id, name} options as you type,
// and only commits a value when an option from the list is actually chosen.
export default function Combobox({ options, value, onChange, placeholder = 'Search...', ariaLabel }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)
  const rootRef = useRef(null)

  const selected = options.find((o) => o.id === value) || null

  useEffect(() => {
    setQuery(selected ? selected.name : '')
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    function onDocClick(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false)
        setQuery(selected ? selected.name : '')
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [selected])

  const filtered = query.trim() === ''
    ? options
    : options.filter((o) => o.name.toLowerCase().includes(query.trim().toLowerCase()))

  function commit(option) {
    onChange(option ? option.id : '')
    setQuery(option ? option.name : '')
    setOpen(false)
  }

  return (
    <div className="combobox" ref={rootRef}>
      <input
        type="text"
        className="combobox-input"
        aria-label={ariaLabel}
        placeholder={placeholder}
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); setHighlight(0) }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight((h) => Math.min(h + 1, filtered.length - 1)) }
          if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight((h) => Math.max(h - 1, 0)) }
          if (e.key === 'Enter') { e.preventDefault(); if (filtered[highlight]) commit(filtered[highlight]) }
          if (e.key === 'Escape') { setOpen(false); setQuery(selected ? selected.name : '') }
        }}
      />
      {open && (
        <ul className="combobox-list" role="listbox">
          {filtered.length === 0 && <li className="combobox-empty">No matches</li>}
          {filtered.map((o, idx) => (
            <li
              key={o.id}
              role="option"
              aria-selected={o.id === value}
              className={`combobox-option ${idx === highlight ? 'is-highlighted' : ''} ${o.id === value ? 'is-selected' : ''}`}
              onMouseDown={(e) => { e.preventDefault(); commit(o) }}
              onMouseEnter={() => setHighlight(idx)}
            >
              {o.name}
              {o.category ? <span className="combobox-hint">{o.category}</span> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
