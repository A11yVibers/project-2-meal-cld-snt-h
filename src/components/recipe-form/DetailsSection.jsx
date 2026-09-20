import React from 'react'
import { cuisines, mealTypes, dietaryTags, recipeCategories } from '../../data/loadData.js'

export default function DetailsSection({ draft, updateDraft }) {
  function toggleInArray(field, id) {
    const current = draft[field]
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
    updateDraft({ [field]: next })
  }

  return (
    <fieldset className="form-section">
      <legend>Recipe details</legend>

      <label className="field-label" htmlFor="rf-title">
        Recipe title *
        <input
          id="rf-title"
          type="text"
          required
          value={draft.title}
          onChange={(e) => updateDraft({ title: e.target.value })}
        />
      </label>

      <label className="field-label" htmlFor="rf-desc">
        Short description
        <input
          id="rf-desc"
          type="text"
          value={draft.shortDescription}
          onChange={(e) => updateDraft({ shortDescription: e.target.value })}
          placeholder="A one-sentence summary shown in the catalog"
        />
      </label>

      <label className="field-label" htmlFor="rf-source">
        Source link
        <input
          id="rf-source"
          type="url"
          value={draft.sourceUrl}
          onChange={(e) => updateDraft({ sourceUrl: e.target.value })}
          placeholder="https://…"
        />
      </label>

      <div className="form-grid">
        <label className="field-label" htmlFor="rf-cuisine">
          Cuisine
          <select id="rf-cuisine" value={draft.cuisineId} onChange={(e) => updateDraft({ cuisineId: e.target.value })}>
            <option value="">Select a cuisine…</option>
            {cuisines.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>

        <label className="field-label" htmlFor="rf-mealtype">
          Primary meal type
          <select id="rf-mealtype" value={draft.mealTypeId} onChange={(e) => updateDraft({ mealTypeId: e.target.value })}>
            <option value="">Select a meal type…</option>
            {mealTypes.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="field-label">
        <span>Dietary suitability</span>
        <div className="checkbox-grid" role="group" aria-label="Dietary suitability">
          {dietaryTags.map((tag) => (
            <label key={tag.id} className="checkbox-item">
              <input
                type="checkbox"
                checked={draft.dietaryTagIds.includes(tag.id)}
                onChange={() => toggleInArray('dietaryTagIds', tag.id)}
              />
              {tag.name}
            </label>
          ))}
        </div>
      </div>

      <div className="field-label">
        <span>Recipe categories</span>
        <div className="checkbox-grid" role="group" aria-label="Recipe categories">
          {recipeCategories.map((cat) => (
            <label key={cat.id} className="checkbox-item">
              <input
                type="checkbox"
                checked={draft.categoryIds.includes(cat.id)}
                onChange={() => toggleInArray('categoryIds', cat.id)}
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>
    </fieldset>
  )
}
