import React, { useEffect, useRef, useState } from 'react'

export default function OptionsMenu({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const set = (patch) => onChange({ ...value, ...patch })

  useEffect(() => {
    function onDocClick(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  return (
    <div className="options-menu" ref={rootRef}>
      <button type="button" className="btn btn-secondary" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        Recipe options ▾
      </button>
      {open && (
        <div className="options-menu-panel" role="menu">
          <p className="options-menu-heading">Settings</p>
          <button
            type="button"
            role="menuitemcheckbox"
            aria-checked={value.includeInShoppingList}
            className={`options-menu-item ${value.includeInShoppingList ? 'is-active' : ''}`}
            onClick={() => set({ includeInShoppingList: !value.includeInShoppingList })}
          >
            <span className="options-menu-check">{value.includeInShoppingList ? '✓' : ''}</span>
            Include ingredients in generated shopping lists
          </button>
          <button
            type="button"
            role="menuitemcheckbox"
            aria-checked={value.showNutrition}
            className={`options-menu-item ${value.showNutrition ? 'is-active' : ''}`}
            onClick={() => set({ showNutrition: !value.showNutrition })}
          >
            <span className="options-menu-check">{value.showNutrition ? '✓' : ''}</span>
            Show nutrition information
          </button>
          <button
            type="button"
            role="menuitemcheckbox"
            aria-checked={value.allowSubstitutions}
            className={`options-menu-item ${value.allowSubstitutions ? 'is-active' : ''}`}
            onClick={() => set({ allowSubstitutions: !value.allowSubstitutions })}
          >
            <span className="options-menu-check">{value.allowSubstitutions ? '✓' : ''}</span>
            Allow ingredient substitutions
          </button>

          <p className="options-menu-heading">Measurement units</p>
          <button
            type="button"
            role="menuitemradio"
            aria-checked={value.unitSystem === 'us'}
            className={`options-menu-item ${value.unitSystem === 'us' ? 'is-active' : ''}`}
            onClick={() => set({ unitSystem: 'us' })}
          >
            <span className="options-menu-check">{value.unitSystem === 'us' ? '●' : '○'}</span>
            US customary
          </button>
          <button
            type="button"
            role="menuitemradio"
            aria-checked={value.unitSystem === 'metric'}
            className={`options-menu-item ${value.unitSystem === 'metric' ? 'is-active' : ''}`}
            onClick={() => set({ unitSystem: 'metric' })}
          >
            <span className="options-menu-check">{value.unitSystem === 'metric' ? '●' : '○'}</span>
            Metric
          </button>
        </div>
      )}
    </div>
  )
}
