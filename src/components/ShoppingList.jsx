import React, { useMemo, useState } from 'react'
import { useAppData } from '../state/AppDataContext.jsx'
import { buildShoppingList, formatQuantity } from '../utils/shoppingList.js'
import { ingredients as allIngredients } from '../data/lookups.js'
import { formatWeekRangeLabel } from '../utils/dates.js'

export default function ShoppingList() {
  const {
    weekOffset,
    setWeekOffset,
    getDayMap,
    recipesById,
    pantryExcludedSet,
    pantryItems,
    togglePantryExcluded,
    addPantryItem,
    removePantryItem,
    toggleShoppingChecked,
    getCheckedMap,
  } = useAppData()

  const [pantryQuery, setPantryQuery] = useState('')

  const dayMap = getDayMap(weekOffset)
  const checkedMap = getCheckedMap(weekOffset)

  const list = useMemo(
    () => buildShoppingList({ dayMap, recipesById, pantryExcluded: pantryExcludedSet, checkedMap }),
    [dayMap, recipesById, pantryExcludedSet, checkedMap]
  )

  const pantrySuggestions = useMemo(() => {
    const q = pantryQuery.trim().toLowerCase()
    if (!q) return []
    return allIngredients.list
      .filter((i) => i.name.toLowerCase().includes(q) && !pantryItems[`id:${i.id}`])
      .slice(0, 6)
  }, [pantryQuery, pantryItems])

  return (
    <section className="view-section">
      <div className="view-header">
        <div>
          <h1>Shopping List</h1>
          <p className="muted">Automatically generated from everything planned for this week.</p>
        </div>
        <div className="week-nav">
          <button type="button" className="btn" onClick={() => setWeekOffset((o) => o - 1)} aria-label="Previous week">← Prev</button>
          <span className="week-label">{formatWeekRangeLabel(weekOffset)}</span>
          <button type="button" className="btn" onClick={() => setWeekOffset(0)}>Today</button>
          <button type="button" className="btn" onClick={() => setWeekOffset((o) => o + 1)} aria-label="Next week">Next →</button>
        </div>
      </div>

      {list.totalItems === 0 ? (
        <p className="empty-state">Nothing planned for this week yet — add recipes in the Weekly Planner to build a shopping list.</p>
      ) : (
        <>
          <p className="muted small">{list.checkedItems} of {list.totalItems} items checked off</p>
          <div className="shopping-categories">
            {list.categories.map((cat) => (
              <div className="shopping-category" key={cat.name}>
                <h2>{cat.name}</h2>
                <ul className="shopping-items">
                  {cat.items.map((item) => (
                    <li key={item.key} className={item.checked ? 'checked' : ''}>
                      <label className="shopping-item-label">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => toggleShoppingChecked(weekOffset, item.key)}
                        />
                        <span className="shopping-item-text">
                          <strong>{item.name}</strong>
                          <span className="muted small"> — {formatQuantity(item)}</span>
                          {item.optional && <span className="chip chip-optional">optional</span>}
                        </span>
                      </label>
                      <button
                        type="button"
                        className="link-btn small"
                        onClick={() => togglePantryExcluded(item.ingredientKey, item.name)}
                        title="Mark as already in your pantry"
                      >
                        Have it
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="pantry-panel">
        <h2>Pantry staples</h2>
        <p className="muted small">Items marked here are excluded from your shopping list, even across weeks.</p>

        {list.pantryItems.length > 0 && (
          <ul className="pantry-list">
            {list.pantryItems.map((item) => (
              <li key={item.key}>
                <span>{item.name}</span>
                <button type="button" className="link-btn small" onClick={() => removePantryItem(item.ingredientKey)}>Remove</button>
              </li>
            ))}
          </ul>
        )}

        {Object.entries(pantryItems)
          .filter(([key]) => !list.pantryItems.some((i) => i.ingredientKey === key))
          .map(([key, val]) => (
            <ul className="pantry-list" key={key}>
              <li>
                <span>{val.name}</span>
                <button type="button" className="link-btn small" onClick={() => removePantryItem(key)}>Remove</button>
              </li>
            </ul>
          ))}

        <div className="pantry-add">
          <input
            type="search"
            placeholder="Add a pantry staple (e.g. Salt)…"
            value={pantryQuery}
            onChange={(e) => setPantryQuery(e.target.value)}
          />
          {pantrySuggestions.length > 0 && (
            <ul className="combobox-list pantry-suggestions">
              {pantrySuggestions.map((i) => (
                <li key={i.id}>
                  <button type="button" onClick={() => { addPantryItem(`id:${i.id}`, i.name); setPantryQuery('') }}>
                    + {i.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
