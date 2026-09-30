import React, { useState } from 'react'
import { useAppData } from '../state/AppDataContext.jsx'
import { blankRecipeDraft, deriveTotalTime } from '../data/recipeModel.js'
import DetailsSection from './recipeForm/DetailsSection.jsx'
import TimingSection from './recipeForm/TimingSection.jsx'
import ImageSection from './recipeForm/ImageSection.jsx'
import IngredientsSection from './recipeForm/IngredientsSection.jsx'
import MethodSection from './recipeForm/MethodSection.jsx'
import MealPlanningSection from './recipeForm/MealPlanningSection.jsx'
import OptionsMenu from './recipeForm/OptionsMenu.jsx'

export default function AddRecipePage({ onCancel, onSaved }) {
  const { addRecipe } = useAppData()
  const [draft, setDraft] = useState(blankRecipeDraft())
  const [errors, setErrors] = useState([])

  function update(patch) {
    setDraft((prev) => ({ ...prev, ...patch }))
  }

  function validate() {
    const errs = []
    if (!draft.title.trim()) errs.push('Recipe title is required.')
    const validIngredients = draft.ingredients.filter((i) => i.ingredientName.trim())
    if (validIngredients.length === 0) errs.push('Add at least one ingredient.')
    const validSteps = draft.steps.filter((s) => s.instruction.trim())
    if (validSteps.length === 0) errs.push('Add at least one method step.')
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (errs.length) {
      setErrors(errs)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const cleanedIngredients = draft.ingredients
      .filter((i) => i.ingredientName.trim())
      .map((i) => ({ ...i, section: i.section.trim() || 'Main' }))
    const cleanedSteps = draft.steps
      .filter((s) => s.instruction.trim())
      .map((s) => ({ ...s, timerMinutes: Number(s.timerMinutes) || 0 }))

    const recipe = {
      ...draft,
      ingredients: cleanedIngredients,
      steps: cleanedSteps,
      servings: Number(draft.servings) || 1,
      prepTimeMinutes: Number(draft.prepTimeMinutes) || 0,
      cookTimeMinutes: Number(draft.cookTimeMinutes) || 0,
      totalTimeMinutes: deriveTotalTime(draft.prepTimeMinutes, draft.cookTimeMinutes),
    }

    const id = addRecipe(recipe)
    onSaved(id)
  }

  return (
    <section className="view-section">
      <div className="view-header">
        <div>
          <h1>Add a new recipe</h1>
          <p className="muted">Fill in as much detail as you'd like — only the title, one ingredient and one step are required.</p>
        </div>
        <button type="button" className="link-btn" onClick={onCancel}>Cancel</button>
      </div>

      {errors.length > 0 && (
        <div className="error-banner" role="alert">
          <ul>{errors.map((e) => <li key={e}>{e}</li>)}</ul>
        </div>
      )}

      <form className="recipe-form" onSubmit={handleSubmit}>
        <DetailsSection draft={draft} update={update} />
        <TimingSection draft={draft} update={update} />
        <ImageSection draft={draft} update={update} />
        <IngredientsSection draft={draft} update={update} />
        <MethodSection draft={draft} update={update} />
        <MealPlanningSection draft={draft} update={update} />
        <OptionsMenu draft={draft} update={update} />

        <div className="modal-actions">
          <button type="button" className="btn" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn btn-primary">Save recipe</button>
        </div>
      </form>
    </section>
  )
}
