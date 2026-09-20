import React, { useState, useRef, useEffect } from 'react'

export default function OptionsMenu({ draft, updateDraft }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const panelId = 'recipe-options-panel'

  function updateOptions(patch) {
    updateDraft({ options: { ...draft.options, ...patch } })
  }

  useEffect(() => {
    if (!open) return
    function onDocClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
    }
    function onKeyDown(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const { includeInShoppingList, showNutrition, allowSubstitutions, measurementSystem } = draft.options

  return (
    <fieldset className="form-section">
      <legend>Recipe options menu</legend>
      <div className="options-menu" ref={containerRef}>
        <button
          type="button"
          className="button button-secondary"
          aria-haspopup="true"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
        >
          ⋮ Recipe options
        </button>

        {/* A compact disclosure panel of native, independently toggleable
            checkboxes plus a mutually-exclusive radio group. Using real
            form controls (rather than an ARIA menu) keeps this keyboard-
            and screen-reader-accessible without extra ARIA plumbing. */}
        {open && (
          <div className="options-menu-panel" id={panelId}>
            <p className="options-menu-heading" id="options-menu-heading-1">Shopping &amp; display</p>
            <div role="group" aria-labelledby="options-menu-heading-1">
              <label className={`options-menu-item ${includeInShoppingList ? 'is-active' : ''}`}>
                <input
                  type="checkbox"
                  checked={includeInShoppingList}
                  onChange={(e) => updateOptions({ includeInShoppingList: e.target.checked })}
                />
                Include ingredients in generated shopping lists
              </label>
              <label className={`options-menu-item ${showNutrition ? 'is-active' : ''}`}>
                <input
                  type="checkbox"
                  checked={showNutrition}
                  onChange={(e) => updateOptions({ showNutrition: e.target.checked })}
                />
                Show nutrition information
              </label>
              <label className={`options-menu-item ${allowSubstitutions ? 'is-active' : ''}`}>
                <input
                  type="checkbox"
                  checked={allowSubstitutions}
                  onChange={(e) => updateOptions({ allowSubstitutions: e.target.checked })}
                />
                Allow ingredient substitutions
              </label>
            </div>

            <p className="options-menu-heading" id="options-menu-heading-2">Measurement units</p>
            <div className="options-menu-segment" role="group" aria-labelledby="options-menu-heading-2">
              <label className={`options-menu-item ${measurementSystem === 'us' ? 'is-active' : ''}`}>
                <input
                  type="radio"
                  name="measurementSystem"
                  checked={measurementSystem === 'us'}
                  onChange={() => updateOptions({ measurementSystem: 'us' })}
                />
                US customary
              </label>
              <label className={`options-menu-item ${measurementSystem === 'metric' ? 'is-active' : ''}`}>
                <input
                  type="radio"
                  name="measurementSystem"
                  checked={measurementSystem === 'metric'}
                  onChange={() => updateOptions({ measurementSystem: 'metric' })}
                />
                Metric
              </label>
            </div>
          </div>
        )}
      </div>
      <p className="field-hint">
        Currently: {includeInShoppingList ? 'included in' : 'excluded from'} shopping lists ·{' '}
        nutrition {showNutrition ? 'shown' : 'hidden'} · substitutions {allowSubstitutions ? 'allowed' : 'not noted'} ·{' '}
        {measurementSystem === 'us' ? 'US customary' : 'Metric'} units
      </p>
    </fieldset>
  )
}
