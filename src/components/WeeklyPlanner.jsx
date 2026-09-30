import React, { useState } from 'react'
import { useAppData } from '../state/AppDataContext.jsx'
import { MEAL_SLOTS } from '../data/recipeModel.js'
import { dayName, formatShortDate, formatWeekRangeLabel, isToday, weekDatesForOffset } from '../utils/dates.js'
import RecipePickerModal from './RecipePickerModal.jsx'
import Modal from './Modal.jsx'

export default function WeeklyPlanner({ onOpenRecipe }) {
  const { weekOffset, setWeekOffset, getDayMap, assignSlot, removeSlot, recipesById } = useAppData()
  const [target, setTarget] = useState(null) // { dayIndex, slotId }
  const [pickerOpen, setPickerOpen] = useState(false)
  const [actionsOpen, setActionsOpen] = useState(false)

  const dates = weekDatesForOffset(weekOffset)
  const dayMap = getDayMap(weekOffset)

  function openSlot(dayIndex, slotId) {
    const existing = dayMap?.[dayIndex]?.[slotId]
    setTarget({ dayIndex, slotId })
    if (existing?.recipeId) setActionsOpen(true)
    else setPickerOpen(true)
  }

  function handlePick(recipeId) {
    if (target) assignSlot(weekOffset, target.dayIndex, target.slotId, recipeId)
    setPickerOpen(false)
    setTarget(null)
  }

  function handleRemove() {
    if (target) removeSlot(weekOffset, target.dayIndex, target.slotId)
    setActionsOpen(false)
    setTarget(null)
  }

  const activeEntry = target ? dayMap?.[target.dayIndex]?.[target.slotId] : null
  const activeRecipe = activeEntry?.recipeId ? recipesById.get(activeEntry.recipeId) : null

  return (
    <section className="view-section">
      <div className="view-header">
        <div>
          <h1>Weekly Meal Planner</h1>
          <p className="muted">Plan breakfast, lunch, dinner and snacks for the week.</p>
        </div>
        <div className="week-nav">
          <button type="button" className="btn" onClick={() => setWeekOffset((o) => o - 1)} aria-label="Previous week">← Prev</button>
          <span className="week-label">{formatWeekRangeLabel(weekOffset)}</span>
          <button type="button" className="btn" onClick={() => setWeekOffset(0)}>Today</button>
          <button type="button" className="btn" onClick={() => setWeekOffset((o) => o + 1)} aria-label="Next week">Next →</button>
        </div>
      </div>

      <div className="planner-grid">
        <div className="planner-corner" />
        {dates.map((d, i) => (
          <div key={i} className={`planner-day-head ${isToday(d) ? 'is-today' : ''}`}>
            <span>{dayName(i, true)}</span>
            <span className="small muted">{formatShortDate(d)}</span>
          </div>
        ))}

        {MEAL_SLOTS.map((slot) => (
          <React.Fragment key={slot.id}>
            <div className="planner-slot-label">{slot.label}</div>
            {dates.map((_, dayIndex) => {
              const entry = dayMap?.[dayIndex]?.[slot.id]
              const recipe = entry?.recipeId ? recipesById.get(entry.recipeId) : null
              return (
                <button
                  type="button"
                  key={dayIndex}
                  className={`planner-cell ${recipe ? 'filled' : 'empty'}`}
                  style={recipe ? { '--accent': recipe.accentColor || '#D97757' } : undefined}
                  onClick={() => openSlot(dayIndex, slot.id)}
                >
                  {recipe ? (
                    <>
                      <span className="planner-cell-title">{recipe.title}</span>
                      {entry.specificTime && <span className="small muted">{entry.specificTime}</span>}
                    </>
                  ) : (
                    <span className="planner-cell-empty">+ Add recipe</span>
                  )}
                </button>
              )
            })}
          </React.Fragment>
        ))}
      </div>

      {pickerOpen && (
        <RecipePickerModal
          title="Choose a recipe for this slot"
          onSelect={handlePick}
          onClose={() => { setPickerOpen(false); setTarget(null) }}
        />
      )}

      {actionsOpen && activeRecipe && (
        <Modal title={activeRecipe.title} onClose={() => { setActionsOpen(false); setTarget(null) }}>
          <div className="modal-actions modal-actions-stack">
            <button type="button" className="btn" onClick={() => { setActionsOpen(false); onOpenRecipe(activeRecipe.id) }}>
              View recipe
            </button>
            <button type="button" className="btn" onClick={() => { setActionsOpen(false); setPickerOpen(true) }}>
              Replace recipe
            </button>
            <button type="button" className="btn btn-danger" onClick={handleRemove}>
              Remove from plan
            </button>
          </div>
        </Modal>
      )}
    </section>
  )
}
