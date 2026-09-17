import { CUISINES, MEAL_TYPES, DIETARY_TAGS, RECIPE_CATEGORIES } from '../../data/lookups.js'
import FormSection from './FormSection.jsx'

function toggleInList(list, value) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

export default function RecipeDetailsSection({ form, updateForm }) {
  return (
    <FormSection title="Recipe details" description="What is this recipe, and how should it be categorized?">
      <label className="field">
        <span>Recipe title *</span>
        <input
          className="text-input"
          type="text"
          value={form.title}
          onChange={(e) => updateForm({ title: e.target.value })}
          placeholder="e.g. Honey Garlic Salmon Bowls"
          required
        />
      </label>

      <label className="field">
        <span>Source link</span>
        <input
          className="text-input"
          type="url"
          value={form.sourceUrl}
          onChange={(e) => updateForm({ sourceUrl: e.target.value })}
          placeholder="https://…"
        />
      </label>

      <div className="field-row">
        <label className="field">
          <span>Cuisine</span>
          <select className="text-input" value={form.cuisineId} onChange={(e) => updateForm({ cuisineId: e.target.value })}>
            <option value="">Select a cuisine…</option>
            {CUISINES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Primary meal type</span>
          <select className="text-input" value={form.mealTypeId} onChange={(e) => updateForm({ mealTypeId: e.target.value })}>
            <option value="">Select a meal type…</option>
            {MEAL_TYPES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="field">
        <span>Dietary suitability</span>
        <div className="checkbox-grid">
          {DIETARY_TAGS.map((tag) => (
            <label key={tag.id} className="checkbox-chip">
              <input
                type="checkbox"
                checked={form.dietaryTagIds.includes(tag.id)}
                onChange={() => updateForm({ dietaryTagIds: toggleInList(form.dietaryTagIds, tag.id) })}
              />
              {tag.name}
            </label>
          ))}
        </div>
      </div>

      <div className="field">
        <span>Recipe categories</span>
        <div className="checkbox-grid">
          {RECIPE_CATEGORIES.map((cat) => (
            <label key={cat.id} className="checkbox-chip">
              <input
                type="checkbox"
                checked={form.categoryIds.includes(cat.id)}
                onChange={() => updateForm({ categoryIds: toggleInList(form.categoryIds, cat.id) })}
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>
    </FormSection>
  )
}
