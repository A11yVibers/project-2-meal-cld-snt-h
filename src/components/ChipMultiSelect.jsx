import React from 'react'

// Toggleable chip group for multi-select fields (dietary tags, categories, etc).
export default function ChipMultiSelect({ options, values, onChange, name }) {
  function toggle(id) {
    if (values.includes(id)) onChange(values.filter((v) => v !== id))
    else onChange([...values, id])
  }
  return (
    <div className="chip-group" role="group" aria-label={name}>
      {options.map((o) => {
        const active = values.includes(o.id)
        return (
          <button
            type="button"
            key={o.id}
            className={`chip ${active ? 'chip-active' : ''}`}
            aria-pressed={active}
            onClick={() => toggle(o.id)}
          >
            {o.name}
          </button>
        )
      })}
    </div>
  )
}
