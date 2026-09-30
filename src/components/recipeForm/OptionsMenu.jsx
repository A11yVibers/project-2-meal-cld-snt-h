import React, { useEffect, useRef, useState } from 'react'

export default function OptionsMenu({ draft, update }) {
  const opts = draft.options
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  function patch(p) {
    update({ options: { ...opts, ...p } })
  }

  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  return (
    <fieldset className="form-section">
      <legend>Recipe options menu</legend>
      <div className="options-menu-wrap" ref={ref}>
        <button type="button" className="btn options-menu-trigger" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          ⚙ Recipe options
        </button>

        {open && (
          <div className="options-menu" role="menu" aria-label="Recipe options">
            <MenuCheckbox
              checked={opts.includeInShoppingList}
              onClick={() => patch({ includeInShoppingList: !opts.includeInShoppingList })}
              label="Include ingredients in generated shopping lists"
            />
            <MenuCheckbox
              checked={opts.showNutrition}
              onClick={() => patch({ showNutrition: !opts.showNutrition })}
              label="Show nutrition information"
            />
            <MenuCheckbox
              checked={opts.allowSubstitutions}
              onClick={() => patch({ allowSubstitutions: !opts.allowSubstitutions })}
              label="Allow ingredient substitutions"
            />

            <div className="options-menu-divider" role="separator" />
            <div role="group" aria-label="Measurement system">
              <MenuRadio
                checked={opts.measurementSystem === 'us'}
                onClick={() => patch({ measurementSystem: 'us' })}
                label="US customary measurements"
              />
              <MenuRadio
                checked={opts.measurementSystem === 'metric'}
                onClick={() => patch({ measurementSystem: 'metric' })}
                label="Metric measurements"
              />
            </div>
          </div>
        )}
      </div>

      <div className="options-summary">
        {opts.includeInShoppingList && <span className="chip">Shopping list ✓</span>}
        {opts.showNutrition && <span className="chip">Nutrition info ✓</span>}
        {opts.allowSubstitutions && <span className="chip">Substitutions ✓</span>}
        <span className="chip chip-accent">{opts.measurementSystem === 'metric' ? 'Metric' : 'US customary'}</span>
      </div>
    </fieldset>
  )
}

function MenuCheckbox({ checked, onClick, label }) {
  return (
    <button type="button" role="menuitemcheckbox" aria-checked={checked} className={`options-menu-item ${checked ? 'is-selected' : ''}`} onClick={onClick}>
      <span className="options-menu-check">{checked ? '✓' : ''}</span>
      {label}
    </button>
  )
}

function MenuRadio({ checked, onClick, label }) {
  return (
    <button type="button" role="menuitemradio" aria-checked={checked} className={`options-menu-item ${checked ? 'is-selected' : ''}`} onClick={onClick}>
      <span className="options-menu-check">{checked ? '●' : ''}</span>
      {label}
    </button>
  )
}
