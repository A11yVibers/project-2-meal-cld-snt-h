import React, { useState } from 'react'
import { AppDataProvider } from './state/AppDataContext.jsx'
import NavBar from './components/NavBar.jsx'
import RecipeCatalog from './components/RecipeCatalog.jsx'
import RecipeDetail from './components/RecipeDetail.jsx'
import AddRecipePage from './components/AddRecipePage.jsx'
import WeeklyPlanner from './components/WeeklyPlanner.jsx'
import ShoppingList from './components/ShoppingList.jsx'

export default function App() {
  const [view, setView] = useState('catalog')
  const [selectedRecipeId, setSelectedRecipeId] = useState(null)

  function openRecipe(id) {
    setSelectedRecipeId(id)
    setView('detail')
  }

  function navigate(next) {
    setView(next)
  }

  return (
    <AppDataProvider>
      <div className="app-shell">
        <NavBar view={view} onNavigate={navigate} onAddRecipe={() => setView('add')} />
        <main className="app-main">
          {view === 'catalog' && (
            <RecipeCatalog onOpenRecipe={openRecipe} onAddRecipe={() => setView('add')} />
          )}
          {view === 'detail' && (
            <RecipeDetail
              recipeId={selectedRecipeId}
              onBack={() => setView('catalog')}
              onGoToPlanner={() => setView('planner')}
            />
          )}
          {view === 'add' && (
            <AddRecipePage
              onCancel={() => setView('catalog')}
              onSaved={(id) => openRecipe(id)}
            />
          )}
          {view === 'planner' && <WeeklyPlanner onOpenRecipe={openRecipe} />}
          {view === 'shopping' && <ShoppingList />}
        </main>
      </div>
    </AppDataProvider>
  )
}
