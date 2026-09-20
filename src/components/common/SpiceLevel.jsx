import React from 'react'

const LABELS = ['No spice', 'Mild', 'Mild-medium', 'Medium', 'Hot', 'Very spicy']

export default function SpiceLevel({ level }) {
  const value = Math.max(0, Math.min(5, Number(level) || 0))
  return (
    <span className="spice-level" title={LABELS[value]}>
      <span aria-hidden="true">{'🌶️'.repeat(value) || '—'}</span>
      <span className="sr-only">{LABELS[value]}</span>
    </span>
  )
}
