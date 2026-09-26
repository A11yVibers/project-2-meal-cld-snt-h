import React, { useState } from 'react'
import DetailsSection from './DetailsSection.jsx'
import TimingSection from './TimingSection.jsx'
import ImageSection from './ImageSection.jsx'
import IngredientsSection from './IngredientsSection.jsx'
import MethodSection from './MethodSection.jsx'
import PlanningSection from './PlanningSection.jsx'
import OptionsMenu from './OptionsMenu.jsx'
import { makeId } from '../../lib/id.js'
import { lookupMaps } from '../../lib/data.js'
import { startOfWeek, toIsoDate } from '../../lib/dates.js'
import { ACCENT_COLORS } from '../../lib/constants.js'

function initialFormState() {
  const today = toIsoDate(new Date())
  return {
    title: '',
    sourceUrl: '',
    cuisineId: '',
    mealTypeId: '',
    dietaryTagIds: [],
    categoryIds: [],
    servings: 4,
    prepTime: 15,
    cookTime: 15,
    spiceLevel: 0,
    coverImage: '',
    accentColor: ACCENT_COLORS[0],
    ingredientSections: [
      { id: makeId('section'), name: 'Main', ingredients: [{ id: makeId('ing'), ingredientId: '', quantity: '', unit: '', optional: false }] },
    ],
    steps: [{ id: makeId('step'), instruction: '', timerMinutes: '' }],
    planning: {
      availableForSuggestions: true,
      addToPlanNow: false,
      weekStart: toIsoDate(startOfWeek(new Date())),
      plannedDate: today,
      plannedSlot: 'Dinner',
      exactDateTime: '',
    },
    options: {
      includeInShoppingList: true,
      showNutrition: false,
      allowSubstitutions: true,
      unitSystem: 'us',
    },
  }
}

const SECTIONS = [
  { key: 'details', label: 'Recipe details' },
  { key: 'timing', label: 'Timing & yield' },
  { key: 'image', label: 'Image & appearance' },
  { key: 'ingredients', label: 'Ingredients' },
  { key: 'method', label: 'Method' },
  { key: 'planning', label: 'Meal planning options' },
]

export default function RecipeForm({ onCreate, onCancel }) {
  const [form, setForm] = useState(initialFormState)
  const [error, setError] = useState('')

  function validate() {
    if (!form.title.trim()) return 'Please give the recipe a title.'
    if (!form.cuisineId) return 'Please select a cuisine.'
    if (!form.mealTypeId) return 'Please select a primary meal type.'
    const hasIngredient = form.ingredientSections.some((s) => s.ingredients.some((i) => i.ingredientId && i.quantity !== ''))
    if (!hasIngredient) return 'Please add at least one ingredient with a quantity.'
    const hasStep = form.steps.some((s) => s.instruction.trim())
    if (!hasStep) return 'Please add at least one method step.'
    return ''
  }

  function handleSubmit(e) {
    e.preventDefault()
    const validationError = validate()
    if (validationError) { setError(validationError); return }
    setError('')

    const cleanedSections = form.ingredientSections
      .map((s) => ({
        ...s,
        name: s.name.trim() || 'Main',
        ingredients: s.ingredients.filter((i) => i.ingredientId && i.quantity !== ''),
      }))
      .filter((s) => s.ingredients.length > 0)
      .map((s) => ({
        ...s,
        ingredients: s.ingredients.map((i) => ({
          ...i,
          ingredientName: lookupMaps.ingredient[i.ingredientId]?.name || '',
          quantity: i.quantity,
        })),
      }))

    const cleanedSteps = form.steps
      .filter((s) => s.instruction.trim())
      .map((s) => ({ ...s, timerMinutes: Number(s.timerMinutes) || 0 }))

    const prepTime = Number(form.prepTime) || 0
    const cookTime = Number(form.cookTime) || 0

    const recipeData = {
      title: form.title.trim(),
      shortDescription: '',
      sourceName: '',
      sourceUrl: form.sourceUrl.trim(),
      servings: Number(form.servings) || 1,
      prepTime,
      cookTime,
      totalTime: prepTime + cookTime,
      cuisineId: form.cuisineId,
      mealTypeId: form.mealTypeId,
      dietaryTagIds: form.dietaryTagIds,
      categoryIds: form.categoryIds,
      difficulty: 1,
      spiceLevel: Number(form.spiceLevel) || 0,
      accentColor: form.accentColor,
      coverImage: form.coverImage,
      availableForSuggestions: form.planning.availableForSuggestions,
      ingredientSections: cleanedSections,
      steps: cleanedSteps,
      options: { ...form.options },
      planningDefaults: { ...form.planning },
    }

    onCreate(recipeData, form.planning)
  }

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      <div className="view-header">
        <h1>New recipe</h1>
        <OptionsMenu value={form.options} onChange={(options) => setForm((f) => ({ ...f, options }))} />
      </div>

      {SECTIONS.map(({ key, label }) => (
        <fieldset className="form-section" key={key}>
          <legend>{label}</legend>
          {key === 'details' && <DetailsSection value={form} onChange={(v) => setForm((f) => ({ ...f, ...v }))} />}
          {key === 'timing' && <TimingSection value={form} onChange={(v) => setForm((f) => ({ ...f, ...v }))} />}
          {key === 'image' && <ImageSection value={form} onChange={(v) => setForm((f) => ({ ...f, ...v }))} />}
          {key === 'ingredients' && (
            <IngredientsSection sections={form.ingredientSections} onChange={(v) => setForm((f) => ({ ...f, ingredientSections: v }))} />
          )}
          {key === 'method' && <MethodSection steps={form.steps} onChange={(v) => setForm((f) => ({ ...f, steps: v }))} />}
          {key === 'planning' && (
            <PlanningSection
              value={form.planning}
              primaryMealTypeId={form.mealTypeId}
              onChange={(v) => setForm((f) => ({ ...f, planning: v }))}
            />
          )}
        </fieldset>
      ))}

      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="dialog-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save recipe</button>
      </div>
    </form>
  )
}
