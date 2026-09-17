import { useState } from 'react'
import { useAppData } from '../context/AppDataContext.jsx'
import { ACCENT_COLOR_SWATCHES, PLANNER_SLOTS } from '../data/lookups.js'
import { generateId } from '../utils/id.js'
import { todayWeekKey } from '../utils/date.js'
import { nearbyWeekOptions } from '../components/AddToPlanModal.jsx'
import RecipeDetailsSection from '../components/recipe-form/RecipeDetailsSection.jsx'
import TimingYieldSection from '../components/recipe-form/TimingYieldSection.jsx'
import ImageAppearanceSection from '../components/recipe-form/ImageAppearanceSection.jsx'
import IngredientsSection from '../components/recipe-form/IngredientsSection.jsx'
import MethodSection from '../components/recipe-form/MethodSection.jsx'
import MealPlanningSection from '../components/recipe-form/MealPlanningSection.jsx'
import RecipeOptionsMenu from '../components/recipe-form/RecipeOptionsMenu.jsx'

function initialForm() {
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
    accentColor: ACCENT_COLOR_SWATCHES[0],
    coverImageDataUrl: '',
    ingredientSections: [
      { id: generateId('section'), name: 'Main', items: [{ id: generateId('ing'), ingredientId: null, ingredientName: '', quantity: '', unit: '', optional: false }] },
    ],
    steps: [{ id: generateId('step'), instruction: '', timerMinutes: '' }],
    includeInMealSuggestions: true,
    addToPlanNow: false,
    planWeekKey: todayWeekKey(),
    planDayIndex: 0,
    planSlotId: PLANNER_SLOTS[2]?.id || PLANNER_SLOTS[0].id,
    useSpecificDateTime: false,
    specificDateTime: '',
    recipeOptions: {
      includeInShoppingList: true,
      showNutrition: false,
      allowSubstitutions: true,
      unitSystem: 'us',
    },
  }
}

export default function NewRecipePage({ onCancel, onCreated }) {
  const { addRecipe, setPlanSlot } = useAppData()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')

  function updateForm(patch) {
    setForm((prev) => ({ ...prev, ...patch }))
  }

  function validate() {
    if (!form.title.trim()) return 'Please give this recipe a title.'
    const hasIngredient = form.ingredientSections.some((s) => s.items.some((it) => it.ingredientName.trim()))
    if (!hasIngredient) return 'Please add at least one ingredient.'
    const hasStep = form.steps.some((s) => s.instruction.trim())
    if (!hasStep) return 'Please add at least one method step.'
    return ''
  }

  function handleSubmit(e) {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    setError('')

    const cleanedSections = form.ingredientSections
      .map((section) => ({
        ...section,
        name: section.name.trim() || 'Ingredients',
        items: section.items.filter((it) => it.ingredientName.trim()),
      }))
      .filter((section) => section.items.length > 0)

    const cleanedSteps = form.steps
      .filter((s) => s.instruction.trim())
      .map((s, idx) => ({ id: s.id, instruction: s.instruction.trim(), timerMinutes: Number(s.timerMinutes) || 0, stepNumber: idx + 1 }))

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
      difficulty: 0,
      spiceLevel: form.spiceLevel,
      accentColor: form.accentColor,
      coverImageUrl: form.coverImageDataUrl || '',
      includeInMealSuggestions: form.includeInMealSuggestions,
      ingredientSections: cleanedSections,
      steps: cleanedSteps,
      recipeOptions: { ...form.recipeOptions },
    }

    const created = addRecipe(recipeData)

    if (form.addToPlanNow) {
      setPlanSlot(form.planWeekKey, form.planDayIndex, form.planSlotId, created.id)
    }

    onCreated(created.id)
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Add a new recipe</h1>
          <p className="muted">Fill in as much detail as you like — it will show up in the catalog right away.</p>
        </div>
        <RecipeOptionsMenu options={form.recipeOptions} onChange={(recipeOptions) => updateForm({ recipeOptions })} />
      </div>

      {error && <div className="form-error">{error}</div>}

      <form className="recipe-form" onSubmit={handleSubmit}>
        <RecipeDetailsSection form={form} updateForm={updateForm} />
        <TimingYieldSection form={form} updateForm={updateForm} />
        <ImageAppearanceSection form={form} updateForm={updateForm} />
        <IngredientsSection sections={form.ingredientSections} onChange={(ingredientSections) => updateForm({ ingredientSections })} />
        <MethodSection steps={form.steps} onChange={(steps) => updateForm({ steps })} />
        <MealPlanningSection form={form} updateForm={updateForm} />

        <div className="recipe-form__actions">
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary">
            Save recipe
          </button>
        </div>
      </form>
    </div>
  )
}
