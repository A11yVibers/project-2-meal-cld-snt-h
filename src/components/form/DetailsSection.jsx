import React from 'react'
import ChipMultiSelect from '../ChipMultiSelect.jsx'
import { CUISINES, MEAL_TYPES, DIETARY_TAGS, RECIPE_CATEGORIES } from '../../lib/data.js'

export default function DetailsSection({ value, onChange }) {
  const set = (patch) => onChange({ ...value, ...patch })

  return (
    <div className="form-section-body">
      <div className="form-row">
        <label className="field-label" htmlFor="recipe-title">Recipe title *</label>
        <input
          id="recipe-title"
          type="text"
          className="text-input"
          value={value.title}
          onChange={(e) => set({ title: e.target.value })}
          placeholder="e.g. Weeknight Black Bean Tacos"
          required
        />
      </div>

      <div className="form-row">
        <label className="field-label" htmlFor="recipe-source">Source link</label>
        <input
          id="recipe-source"
          type="url"
          className="text-input"
          value={value.sourceUrl}
          onChange={(e) => set({ sourceUrl: e.target.value })}
          placeholder="https://..."
        />
      </div>

      <div className="form-row-group">
        <div className="form-row">
          <label className="field-label" htmlFor="recipe-cuisine">Cuisine</label>
          <select id="recipe-cuisine" className="text-input" value={value.cuisineId} onChange={(e) => set({ cuisineId: e.target.value })}>
            <option value="">Select cuisine...</option>
            {CUISINES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="form-row">
          <label className="field-label" htmlFor="recipe-mealtype">Primary meal type</label>
          <select id="recipe-mealtype" className="text-input" value={value.mealTypeId} onChange={(e) => set({ mealTypeId: e.target.value })}>
            <option value="">Select meal type...</option>
            {MEAL_TYPES.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
      </div>

      <div className="form-row">
        <span className="field-label">Dietary suitability</span>
        <ChipMultiSelect options={DIETARY_TAGS} values={value.dietaryTagIds} onChange={(v) => set({ dietaryTagIds: v })} name="Dietary suitability" />
      </div>

      <div className="form-row">
        <span className="field-label">Recipe categories</span>
        <ChipMultiSelect options={RECIPE_CATEGORIES} values={value.categoryIds} onChange={(v) => set({ categoryIds: v })} name="Recipe categories" />
      </div>
    </div>
  )
}
