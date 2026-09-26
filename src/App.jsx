import React, { useState } from 'react'
import { AppStateProvider, useAppState } from './state/store.jsx'
import RecipeCatalog from './components/RecipeCatalog.jsx'
import RecipeDetail from './components/RecipeDetail.jsx'
import RecipeForm from './components/form/RecipeForm.jsx'
import MealPlanner from './components/MealPlanner.jsx'
import ShoppingList from './components/ShoppingList.jsx'

const VIEWS = [
  { key: 'catalog', label: 'Recipes' },
  { key: 'planner', label: 'Meal planner' },
  { key: 'shopping', label: 'Shopping list' },
]

function AppShell() {
  const state = useAppState()
  const [view, setView] = useState('catalog')
  const [selectedRecipeId, setSelectedRecipeId] = useState(null)
  const [toast, setToast] = useState('')

  function openRecipe(id) {
    setSelectedRecipeId(id)
    setView('detail')
  }

  function handleCreateRecipe(recipeData, planning) {
    const recipe = state.addRecipe(recipeData)
    if (planning?.addToPlanNow) {
      state.planRecipeNow(recipe.id, planning.plannedDate, planning.plannedSlot)
    }
    setToast(`"${recipe.title}" was added to your recipe catalog${planning?.addToPlanNow ? ' and meal plan' : ''}.`)
    setTimeout(() => setToast(''), 4000)
    setView('catalog')
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-brand">🍽️ Meal Planner</div>
        <nav className="app-nav">
          {VIEWS.map((v) => (
            <button
              key={v.key}
              type="button"
              className={`nav-tab ${view === v.key || (v.key === 'catalog' && view === 'detail') ? 'is-active' : ''}`}
              onClick={() => setView(v.key)}
            >
              {v.label}
            </button>
          ))}
        </nav>
      </header>

      {toast && <div className="toast" role="status">{toast}</div>}

      <main className="app-main">
        {view === 'catalog' && (
          <RecipeCatalog recipes={state.recipes} onOpenRecipe={openRecipe} onAddRecipe={() => setView('add')} />
        )}

        {view === 'detail' && selectedRecipeId && (
          <RecipeDetail
            recipe={state.getRecipeById(selectedRecipeId)}
            onBack={() => setView('catalog')}
            planRecipeNow={state.planRecipeNow}
            mealPlan={state.mealPlan}
            getRecipeById={state.getRecipeById}
          />
        )}

        {view === 'add' && (
          <RecipeForm onCreate={handleCreateRecipe} onCancel={() => setView('catalog')} />
        )}

        {view === 'planner' && (
          <MealPlanner
            recipes={state.recipes}
            mealPlan={state.mealPlan}
            assignSlot={state.assignSlot}
            clearSlot={state.clearSlot}
            getRecipeById={state.getRecipeById}
            onOpenRecipe={openRecipe}
          />
        )}

        {view === 'shopping' && (
          <ShoppingList
            mealPlan={state.mealPlan}
            getRecipeById={state.getRecipeById}
            shoppingChecked={state.shoppingChecked}
            toggleShoppingItem={state.toggleShoppingItem}
            pantryIngredients={state.pantryIngredients}
            togglePantryIngredient={state.togglePantryIngredient}
          />
        )}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AppStateProvider>
      <AppShell />
    </AppStateProvider>
  )
}
