import React, { useMemo } from 'react'
import { usePlanner } from '../../context/PlannerContext.jsx'
import { useRecipes } from '../../context/RecipesContext.jsx'
import { useShoppingListState } from '../../context/ShoppingListContext.jsx'
import { buildShoppingList } from '../../lib/shoppingList.js'
import { formatWeekRangeLabel } from '../../lib/dateWeek.js'

function formatQty(qty) {
  if (qty == null) return null
  const rounded = Math.round(qty * 100) / 100
  return rounded
}

export default function ShoppingList() {
  const { assignments, selectedWeekStart, goToNextWeek: nextWeek, goToPrevWeek: prevWeek, goToCurrentWeek } = usePlanner()
  const { recipesById } = useRecipes()
  const { getState, toggleChecked, togglePantry, hidePantryItems, setHidePantryItems } = useShoppingListState()

  const groups = useMemo(
    () => buildShoppingList({ weekStart: selectedWeekStart, assignments, recipesById }),
    [selectedWeekStart, assignments, recipesById],
  )

  const totalItems = groups.reduce((sum, g) => sum + g.items.length, 0)
  const visibleGroups = groups
    .map((group) => ({
      ...group,
      items: hidePantryItems ? group.items.filter((item) => !getState(item.key).inPantry) : group.items,
    }))
    .filter((group) => group.items.length > 0)

  return (
    <section aria-labelledby="shopping-heading">
      <div className="section-header">
        <div>
          <h1 id="shopping-heading">Shopping list</h1>
          <p className="section-subtitle">
            Generated from recipes planned for the week of {formatWeekRangeLabel(selectedWeekStart)}.
          </p>
        </div>
      </div>

      <div className="week-nav" role="group" aria-label="Change week">
        <button type="button" className="button button-ghost" onClick={prevWeek} aria-label="Previous week">← Previous</button>
        <div className="week-nav-current">
          <strong>{formatWeekRangeLabel(selectedWeekStart)}</strong>
          <button type="button" className="button button-link" onClick={goToCurrentWeek}>Today</button>
        </div>
        <button type="button" className="button button-ghost" onClick={nextWeek} aria-label="Next week">Next →</button>
      </div>

      <div className="shopping-controls">
        <label className="toggle-row">
          <input
            type="checkbox"
            checked={hidePantryItems}
            onChange={(e) => setHidePantryItems(e.target.checked)}
          />
          Hide items I already have in my pantry
        </label>
        <p className="section-subtitle">{totalItems} ingredient{totalItems === 1 ? '' : 's'} needed</p>
      </div>

      {totalItems === 0 ? (
        <p className="empty-state">
          No recipes are planned for this week yet. Add recipes to your meal plan to build a shopping list.
        </p>
      ) : (
        <div className="shopping-groups">
          {visibleGroups.map((group) => (
            <div className="shopping-group" key={group.category}>
              <h2>{group.category}</h2>
              <ul>
                {group.items.map((item) => {
                  const state = getState(item.key)
                  const qty = formatQty(item.quantity)
                  return (
                    <li key={item.key} className={state.checked ? 'is-checked' : ''}>
                      <label className="shopping-item-main">
                        <input
                          type="checkbox"
                          checked={state.checked}
                          onChange={() => toggleChecked(item.key)}
                        />
                        <span className="shopping-item-name">
                          {qty != null ? `${qty} ${item.unit} ` : ''}{item.name}
                          {item.optional && <span className="chip chip-sm chip-outline">optional</span>}
                        </span>
                      </label>
                      <label className="shopping-item-pantry">
                        <input
                          type="checkbox"
                          checked={state.inPantry}
                          onChange={() => togglePantry(item.key)}
                        />
                        I have this
                      </label>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
