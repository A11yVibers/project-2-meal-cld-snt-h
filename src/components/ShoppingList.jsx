import React, { useMemo, useState } from 'react'
import { SHOPPING_CATEGORIES, PLANNER_SLOTS, lookupMaps } from '../lib/data.js'

function buildShoppingItems(mealPlan, getRecipeById) {
  const items = new Map() // key: ingredientId::unit -> item

  Object.keys(mealPlan).forEach((date) => {
    PLANNER_SLOTS.forEach((slot) => {
      const recipeId = mealPlan[date]?.[slot]
      if (!recipeId) return
      const recipe = getRecipeById(recipeId)
      if (!recipe) return
      if (recipe.options && recipe.options.includeInShoppingList === false) return

      recipe.ingredientSections.forEach((section) => {
        section.ingredients.forEach((ing) => {
          const info = lookupMaps.ingredient[ing.ingredientId]
          const category = info?.category || 'Other'
          const name = info?.name || ing.ingredientName || 'Unknown ingredient'
          const unit = ing.unit || ''
          const key = `${ing.ingredientId}::${unit}`
          const qty = Number(ing.quantity)

          if (!items.has(key)) {
            items.set(key, {
              key,
              ingredientId: ing.ingredientId,
              name,
              unit,
              category,
              quantity: Number.isFinite(qty) ? qty : 0,
              hasNumericQuantity: Number.isFinite(qty),
              recipeTitles: new Set(),
              allOptional: true,
            })
          }
          const item = items.get(key)
          if (Number.isFinite(qty)) item.quantity += qty
          if (!ing.optional) item.allOptional = false
          item.recipeTitles.add(recipe.title)
        })
      })
    })
  })

  return Array.from(items.values())
}

export default function ShoppingList({ mealPlan, getRecipeById, shoppingChecked, toggleShoppingItem, pantryIngredients, togglePantryIngredient }) {
  const [hidePantryItems, setHidePantryItems] = useState(false)

  const items = useMemo(() => buildShoppingItems(mealPlan, getRecipeById), [mealPlan, getRecipeById])

  const grouped = useMemo(() => {
    const byCategory = {}
    SHOPPING_CATEGORIES.forEach((c) => { byCategory[c] = [] })
    items.forEach((item) => {
      const bucket = byCategory[item.category] ? item.category : 'Other'
      if (!byCategory[bucket]) byCategory[bucket] = []
      byCategory[bucket].push(item)
    })
    return byCategory
  }, [items])

  const totalCount = items.length
  const checkedCount = items.filter((i) => shoppingChecked[i.key]).length

  if (totalCount === 0) {
    return (
      <section className="view view-shopping">
        <h1>Shopping list</h1>
        <p className="empty-state">Your meal plan is empty. Add recipes to the planner to generate a shopping list.</p>
      </section>
    )
  }

  return (
    <section className="view view-shopping">
      <div className="view-header">
        <div>
          <h1>Shopping list</h1>
          <p className="view-subtitle">{checkedCount} of {totalCount} items checked off. Generated from every recipe currently in your meal plan.</p>
        </div>
        <label className="checkbox-label">
          <input type="checkbox" checked={hidePantryItems} onChange={(e) => setHidePantryItems(e.target.checked)} />
          Hide items I already have in my pantry
        </label>
      </div>

      <div className="shopping-categories">
        {SHOPPING_CATEGORIES.concat(Object.keys(grouped).filter((c) => !SHOPPING_CATEGORIES.includes(c))).map((category) => {
          const categoryItems = grouped[category] || []
          const visibleItems = hidePantryItems ? categoryItems.filter((i) => !pantryIngredients.includes(i.ingredientId)) : categoryItems
          if (visibleItems.length === 0) return null
          return (
            <div className="shopping-category" key={category}>
              <h2>{category}</h2>
              <ul className="shopping-item-list">
                {visibleItems.map((item) => {
                  const inPantry = pantryIngredients.includes(item.ingredientId)
                  const checked = !!shoppingChecked[item.key]
                  return (
                    <li key={item.key} className={`shopping-item ${checked ? 'is-checked' : ''} ${inPantry ? 'is-pantry' : ''}`}>
                      <label className="checkbox-label shopping-item-main">
                        <input type="checkbox" checked={checked} onChange={() => toggleShoppingItem(item.key)} />
                        <span className="shopping-item-text">
                          {item.hasNumericQuantity && <strong>{Math.round(item.quantity * 100) / 100} {item.unit}</strong>}
                          {!item.hasNumericQuantity && item.unit && <strong>{item.unit}</strong>}
                          {' '}{item.name}
                          {item.allOptional && <span className="tag-pill tag-pill-alt">optional</span>}
                        </span>
                      </label>
                      <div className="shopping-item-side">
                        <span className="hint-text" title={Array.from(item.recipeTitles).join(', ')}>
                          {item.recipeTitles.size} recipe{item.recipeTitles.size > 1 ? 's' : ''}
                        </span>
                        <label className="checkbox-label pantry-toggle">
                          <input type="checkbox" checked={inPantry} onChange={() => togglePantryIngredient(item.ingredientId)} />
                          In pantry
                        </label>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}
