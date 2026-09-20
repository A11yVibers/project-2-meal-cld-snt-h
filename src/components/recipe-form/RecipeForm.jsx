import React, { useState } from 'react'
import { useRecipes } from '../../context/RecipesContext.jsx'
import { usePlanner } from '../../context/PlannerContext.jsx'
import { createEmptyDraft } from '../../data/recipeDraft.js'
import DetailsSection from './DetailsSection.jsx'
import TimingSection from './TimingSection.jsx'
import ImageSection from './ImageSection.jsx'
import IngredientsSection from './IngredientsSection.jsx'
import MethodSection from './MethodSection.jsx'
import MealPlanningSection from './MealPlanningSection.jsx'
import OptionsMenu from './OptionsMenu.jsx'

function isBlankItem(item) {
  return !item.ingredientId && !item.customName.trim() && item.quantity === ''
}

function cleanDraftForSave(draft) {
  const ingredientSections = draft.ingredientSections
    .map((section) => ({ ...section, items: section.items.filter((item) => !isBlankItem(item)) }))
    .filter((section) => section.items.length > 0)

  const steps = draft.steps.filter((step) => step.instruction.trim() !== '')

  return {
    ...draft,
    title: draft.title.trim(),
    servings: Number(draft.servings) || 1,
    prepTime: Number(draft.prepTime) || 0,
    cookTime: Number(draft.cookTime) || 0,
    ingredientSections,
    steps,
  }
}

export default function RecipeForm({ onSaved, onCancel }) {
  const [draft, setDraft] = useState(createEmptyDraft)
  const [error, setError] = useState('')
  const { addRecipe } = useRecipes()
  const { setSlot } = usePlanner()

  function updateDraft(patch) {
    setDraft((prev) => ({ ...prev, ...patch }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!draft.title.trim()) {
      setError('Recipe title is required.')
      return
    }
    setError('')

    const cleaned = cleanDraftForSave(draft)
    const saved = addRecipe(cleaned)

    if (cleaned.mealPlanning.addToPlanNow && cleaned.mealPlanning.plannedDate && cleaned.mealPlanning.plannedMealSlot) {
      setSlot(cleaned.mealPlanning.plannedDate, cleaned.mealPlanning.plannedMealSlot, saved.id)
    }

    onSaved(saved)
  }

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      <div className="section-header">
        <h1>Add a new recipe</h1>
      </div>

      {error && <p className="warning-banner" role="alert">{error}</p>}

      <DetailsSection draft={draft} updateDraft={updateDraft} />
      <TimingSection draft={draft} updateDraft={updateDraft} />
      <ImageSection draft={draft} updateDraft={updateDraft} />
      <IngredientsSection draft={draft} updateDraft={updateDraft} />
      <MethodSection draft={draft} updateDraft={updateDraft} />
      <MealPlanningSection draft={draft} updateDraft={updateDraft} />
      <OptionsMenu draft={draft} updateDraft={updateDraft} />

      <div className="modal-actions form-submit-row">
        <button type="button" className="button button-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="button button-primary">Save recipe</button>
      </div>
    </form>
  )
}
