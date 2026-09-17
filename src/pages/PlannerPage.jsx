import { useState } from 'react'
import { useAppData } from '../context/AppDataContext.jsx'
import { PLANNER_SLOTS } from '../data/lookups.js'
import { DAY_LABELS_SHORT, formatDayLabel, formatWeekRange, shiftWeekKey, weekRelativeLabel } from '../utils/date.js'
import MealSlotCell from '../components/MealSlotCell.jsx'
import RecipePickerModal from '../components/RecipePickerModal.jsx'

export default function PlannerPage({ weekKey, onChangeWeek, onOpenRecipe }) {
  const { recipes, recipesById, getWeekPlan, setPlanSlot, clearPlanSlot } = useAppData()
  const [pickerTarget, setPickerTarget] = useState(null) // { dayIndex, slotId }

  const weekPlan = getWeekPlan(weekKey)

  function resolveSlot(dayIndex, slotId) {
    const recipeId = weekPlan[dayIndex]?.[slotId]
    return recipeId ? recipesById[recipeId] : null
  }

  function handlePick(recipeId) {
    if (!pickerTarget) return
    setPlanSlot(weekKey, pickerTarget.dayIndex, pickerTarget.slotId, recipeId)
    setPickerTarget(null)
  }

  function handleClearFromPicker() {
    if (!pickerTarget) return
    clearPlanSlot(weekKey, pickerTarget.dayIndex, pickerTarget.slotId)
    setPickerTarget(null)
  }

  const currentSlotRecipeId = pickerTarget ? weekPlan[pickerTarget.dayIndex]?.[pickerTarget.slotId] : null

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Weekly meal planner</h1>
          <p className="muted">Plan Breakfast, Lunch, Dinner, and Snack for each day of the week.</p>
        </div>
        <div className="week-nav">
          <button className="btn btn--ghost" onClick={() => onChangeWeek(shiftWeekKey(weekKey, -1))}>
            ← Prev week
          </button>
          <div className="week-nav__label">
            <strong>{weekRelativeLabel(weekKey)}</strong>
            <span>{formatWeekRange(weekKey)}</span>
          </div>
          <button className="btn btn--ghost" onClick={() => onChangeWeek(shiftWeekKey(weekKey, 1))}>
            Next week →
          </button>
        </div>
      </div>

      <div className="planner-grid">
        <div className="planner-grid__corner" />
        {DAY_LABELS_SHORT.map((label, dayIndex) => (
          <div className="planner-grid__day-header" key={label}>
            <span>{label}</span>
            <small>{formatDayLabel(weekKey, dayIndex)}</small>
          </div>
        ))}

        {PLANNER_SLOTS.map((slot) => (
          <div className="planner-grid__row" key={slot.id}>
            <div className="planner-grid__slot-label">{slot.name}</div>
            {DAY_LABELS_SHORT.map((_, dayIndex) => (
              <div className="planner-grid__cell" key={`${slot.id}-${dayIndex}`}>
                <MealSlotCell
                  recipe={resolveSlot(dayIndex, slot.id)}
                  onOpenRecipe={onOpenRecipe}
                  onAssign={() => setPickerTarget({ dayIndex, slotId: slot.id })}
                  onClear={() => clearPlanSlot(weekKey, dayIndex, slot.id)}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {pickerTarget && (
        <RecipePickerModal
          title={`Choose a recipe for ${PLANNER_SLOTS.find((s) => s.id === pickerTarget.slotId)?.name}, ${DAY_LABELS_SHORT[pickerTarget.dayIndex]}`}
          recipes={recipes}
          currentRecipeId={currentSlotRecipeId}
          onPick={handlePick}
          onClear={handleClearFromPicker}
          onClose={() => setPickerTarget(null)}
        />
      )}
    </div>
  )
}
