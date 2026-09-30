import React from 'react'
import { cuisines, mealTypes, dietaryTags, recipeCategories } from '../../data/lookups.js'

export default function DetailsSection({ draft, update }) {
  function toggleMulti(field, id) {
    const current = draft[field] || []
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
    update({ [field]: next })
  }

  return (
    <fieldset className="form-section">
      <legend>Recipe details</legend>

      <label className="field">
        <span>Recipe title *</span>
        <input
          type="text"
          required
          value={draft.title}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="e.g. Weeknight Chicken Stir-Fry"
        />
      </label>

      <label className="field">
        <span>Short description</span>
        <input
          type="text"
          value={draft.shortDescription}
          onChange={(e) => update({ shortDescription: e.target.value })}
          placeholder="One or two sentences about this dish"
        />
      </label>

      <label className="field">
        <span>Source link</span>
        <input
          type="url"
          value={draft.sourceUrl}
          onChange={(e) => update({ sourceUrl: e.target.value })}
          placeholder="https://…"
        />
      </label>

      <div className="field-row">
        <label className="field">
          <span>Cuisine</span>
          <select value={draft.cuisineId} onChange={(e) => update({ cuisineId: e.target.value })}>
            <option value="">Select a cuisine…</option>
            {cuisines.list.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Primary meal type</span>
          <select value={draft.mealTypeId} onChange={(e) => update({ mealTypeId: e.target.value })}>
            <option value="">Select a meal type…</option>
            {mealTypes.list.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="chip-fieldset">
        <legend>Dietary suitability</legend>
        <div className="chip-options">
          {dietaryTags.list.map((tag) => (
            <label key={tag.id} className={`chip-toggle ${draft.dietaryTagIds.includes(tag.id) ? 'selected' : ''}`}>
              <input
                type="checkbox"
                checked={draft.dietaryTagIds.includes(tag.id)}
                onChange={() => toggleMulti('dietaryTagIds', tag.id)}
              />
              {tag.name}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="chip-fieldset">
        <legend>Recipe categories</legend>
        <div className="chip-options">
          {recipeCategories.list.map((cat) => (
            <label key={cat.id} className={`chip-toggle ${draft.categoryIds.includes(cat.id) ? 'selected' : ''}`}>
              <input
                type="checkbox"
                checked={draft.categoryIds.includes(cat.id)}
                onChange={() => toggleMulti('categoryIds', cat.id)}
              />
              {cat.name}
            </label>
          ))}
        </div>
      </fieldset>
    </fieldset>
  )
}
