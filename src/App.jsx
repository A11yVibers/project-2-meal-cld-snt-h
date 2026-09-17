import { useState } from 'react'
import { AppDataProvider } from './context/AppDataContext.jsx'
import { todayWeekKey } from './utils/date.js'
import NavBar from './components/NavBar.jsx'
import CatalogPage from './pages/CatalogPage.jsx'
import RecipeDetailPage from './pages/RecipeDetailPage.jsx'
import NewRecipePage from './pages/NewRecipePage.jsx'
import PlannerPage from './pages/PlannerPage.jsx'
import ShoppingListPage from './pages/ShoppingListPage.jsx'

export default function App() {
  const [view, setView] = useState('catalog')
  const [selectedRecipeId, setSelectedRecipeId] = useState(null)
  const [weekKey, setWeekKey] = useState(todayWeekKey())

  function navigate(nextView) {
    setView(nextView)
  }

  function openRecipe(recipeId) {
    setSelectedRecipeId(recipeId)
    setView('detail')
  }

  return (
    <AppDataProvider>
      <div className="app-shell">
        <NavBar currentView={view} onNavigate={navigate} />
        <main className="app-main">
          {view === 'catalog' && <CatalogPage onOpenRecipe={openRecipe} onAddRecipe={() => navigate('new')} />}

          {view === 'detail' && (
            <RecipeDetailPage recipeId={selectedRecipeId} onBack={() => navigate('catalog')} onGoToPlanner={() => navigate('planner')} />
          )}

          {view === 'new' && <NewRecipePage onCancel={() => navigate('catalog')} onCreated={openRecipe} />}

          {view === 'planner' && <PlannerPage weekKey={weekKey} onChangeWeek={setWeekKey} onOpenRecipe={openRecipe} />}

          {view === 'shopping' && <ShoppingListPage weekKey={weekKey} onChangeWeek={setWeekKey} />}
        </main>
      </div>
    </AppDataProvider>
  )
}
