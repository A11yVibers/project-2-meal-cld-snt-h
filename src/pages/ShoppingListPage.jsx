import { useMemo } from 'react'
import { useAppData } from '../context/AppDataContext.jsx'
import { SHOPPING_CATEGORY_ORDER } from '../data/lookups.js'
import { formatWeekRange, shiftWeekKey, weekRelativeLabel } from '../utils/date.js'
import { buildShoppingList, groupByCategory, recipeIdsForWeek } from '../utils/shoppingList.js'

function formatQuantity(line) {
  if (!line.hasQuantity) return ''
  const rounded = Math.round(line.quantity * 100) / 100
  return `${rounded}${line.unit ? ` ${line.unit}` : ''}`
}

export default function ShoppingListPage({ weekKey, onChangeWeek }) {
  const { recipesById, getWeekPlan, shoppingChecked, setItemChecked, pantrySet, togglePantryItem, excludePantry, setExcludePantry } = useAppData()

  const weekPlan = getWeekPlan(weekKey)
  const recipeIds = useMemo(() => recipeIdsForWeek(weekPlan), [weekPlan])
  const usedRecipes = useMemo(
    () => Array.from(new Set(recipeIds)).map((id) => recipesById[id]).filter(Boolean),
    [recipeIds, recipesById]
  )

  const lines = useMemo(
    () => buildShoppingList({ recipeIds, recipesById, pantrySet, excludePantry }),
    [recipeIds, recipesById, pantrySet, excludePantry]
  )

  const grouped = useMemo(() => groupByCategory(lines, SHOPPING_CATEGORY_ORDER), [lines])

  const totalCount = lines.length
  const checkedCount = lines.filter((line) => shoppingChecked[`${weekKey}::${line.key}`]).length

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Shopping list</h1>
          <p className="muted">Generated automatically from everything planned for this week.</p>
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

      <div className="shopping-toolbar">
        <label className="checkbox-inline">
          <input type="checkbox" checked={excludePantry} onChange={(e) => setExcludePantry(e.target.checked)} />
          Exclude ingredients I already have in my pantry
        </label>
        <span className="muted">
          {checkedCount} / {totalCount} checked off
        </span>
      </div>

      {usedRecipes.length === 0 ? (
        <p className="muted">No recipes are planned for this week yet. Add some from the weekly planner to build a shopping list.</p>
      ) : (
        <>
          <div className="shopping-source-recipes">
            <span className="muted">Built from:</span>
            {usedRecipes.map((r) => (
              <span className="chip" key={r.id}>
                {r.title}
              </span>
            ))}
          </div>

          {grouped.length === 0 ? (
            <p className="muted">Everything for this week is already in your pantry.</p>
          ) : (
            <div className="shopping-categories">
              {grouped.map((group) => (
                <div className="shopping-category" key={group.category}>
                  <h2>{group.category}</h2>
                  <ul className="shopping-item-list">
                    {group.items.map((line) => {
                      const checkedKey = `${weekKey}::${line.key}`
                      const checked = !!shoppingChecked[checkedKey]
                      const inPantry = pantrySet.has(line.ingredientKey)
                      return (
                        <li key={line.key} className={checked ? 'is-checked' : ''}>
                          <label className="shopping-item-list__main">
                            <input type="checkbox" checked={checked} onChange={(e) => setItemChecked(checkedKey, e.target.checked)} />
                            <span className="shopping-item-list__name">
                              {formatQuantity(line) && <strong>{formatQuantity(line)} </strong>}
                              {line.name}
                              {line.optional && <em className="ingredient-flag"> optional</em>}
                            </span>
                          </label>
                          <button
                            type="button"
                            className={`btn btn--ghost btn--small ${inPantry ? 'is-active' : ''}`}
                            onClick={() => togglePantryItem(line.ingredientKey)}
                            title="Mark as already in my pantry"
                          >
                            {inPantry ? '✓ In pantry' : 'In pantry?'}
                          </button>
                          {line.recipeTitles.length > 0 && (
                            <span className="shopping-item-list__source muted">from {line.recipeTitles.join(', ')}</span>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
