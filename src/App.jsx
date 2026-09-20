import React from 'react'
import { RecipesProvider, useRecipes } from './context/RecipesContext.jsx'
import { PlannerProvider } from './context/PlannerContext.jsx'
import { ShoppingListProvider } from './context/ShoppingListContext.jsx'
import { useHashRoute } from './lib/useHashRoute.js'
import NavBar from './components/NavBar.jsx'
import RecipeCatalog from './components/RecipeCatalog.jsx'
import RecipeDetail from './components/RecipeDetail.jsx'
import RecipeForm from './components/recipe-form/RecipeForm.jsx'
import WeeklyPlanner from './components/planner/WeeklyPlanner.jsx'
import ShoppingList from './components/shopping/ShoppingList.jsx'

function AppRoutes() {
  const { path, param, navigate } = useHashRoute()
  const { getRecipe } = useRecipes()

  function openRecipe(id) {
    navigate('recipe', id)
  }

  let content
  if (path === 'recipe' && param) {
    const recipe = getRecipe(param)
    content = recipe ? (
      <RecipeDetail recipe={recipe} onBack={() => navigate('catalog')} />
    ) : (
      <p className="empty-state">That recipe could not be found. <a href="#/catalog">Back to recipes</a></p>
    )
  } else if (path === 'add') {
    content = (
      <RecipeForm
        onSaved={(recipe) => navigate('recipe', recipe.id)}
        onCancel={() => navigate('catalog')}
      />
    )
  } else if (path === 'planner') {
    content = <WeeklyPlanner onOpenRecipe={openRecipe} />
  } else if (path === 'shopping') {
    content = <ShoppingList />
  } else {
    content = <RecipeCatalog onOpenRecipe={openRecipe} onAddRecipe={() => navigate('add')} />
  }

  const activeNavPath = path === 'recipe' || path === 'add' ? 'catalog' : path

  return (
    <>
      <NavBar currentPath={activeNavPath} navigate={navigate} />
      <main className="app-main">{content}</main>
    </>
  )
}

export default function App() {
  return (
    <RecipesProvider>
      <PlannerProvider>
        <ShoppingListProvider>
          <AppRoutes />
        </ShoppingListProvider>
      </PlannerProvider>
    </RecipesProvider>
  )
}
