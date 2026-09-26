import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { loadSeedRecipes, PLANNER_SLOTS } from '../lib/data.js'
import { loadJson, saveJson } from '../lib/storage.js'
import { makeId } from '../lib/id.js'
import { toIsoDate } from '../lib/dates.js'

const SEED_RECIPES = loadSeedRecipes()

const AppStateContext = createContext(null)

function emptySlotSet() {
  const obj = {}
  PLANNER_SLOTS.forEach((s) => { obj[s] = null })
  return obj
}

export function AppStateProvider({ children }) {
  const [userRecipes, setUserRecipes] = useState(() => loadJson('userRecipes', []))
  const [mealPlan, setMealPlan] = useState(() => loadJson('mealPlan', {}))
  const [shoppingChecked, setShoppingChecked] = useState(() => loadJson('shoppingChecked', {}))
  const [pantryIngredients, setPantryIngredients] = useState(() => loadJson('pantryIngredients', []))

  useEffect(() => { saveJson('userRecipes', userRecipes) }, [userRecipes])
  useEffect(() => { saveJson('mealPlan', mealPlan) }, [mealPlan])
  useEffect(() => { saveJson('shoppingChecked', shoppingChecked) }, [shoppingChecked])
  useEffect(() => { saveJson('pantryIngredients', pantryIngredients) }, [pantryIngredients])

  const recipes = useMemo(() => [...SEED_RECIPES, ...userRecipes], [userRecipes])

  const getRecipeById = useCallback((id) => recipes.find((r) => r.id === id) || null, [recipes])

  const addRecipe = useCallback((recipeData) => {
    const id = makeId('user-recipe')
    const recipe = { ...recipeData, id, isSeed: false, createdAt: Date.now() }
    setUserRecipes((prev) => [recipe, ...prev])
    return recipe
  }, [])

  const assignSlot = useCallback((isoDate, slot, recipeId) => {
    setMealPlan((prev) => {
      const day = { ...emptySlotSet(), ...(prev[isoDate] || {}) }
      day[slot] = recipeId
      return { ...prev, [isoDate]: day }
    })
  }, [])

  const clearSlot = useCallback((isoDate, slot) => {
    setMealPlan((prev) => {
      if (!prev[isoDate]) return prev
      const day = { ...prev[isoDate], [slot]: null }
      return { ...prev, [isoDate]: day }
    })
  }, [])

  const toggleShoppingItem = useCallback((key) => {
    setShoppingChecked((prev) => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const togglePantryIngredient = useCallback((ingredientKey) => {
    setPantryIngredients((prev) => (
      prev.includes(ingredientKey) ? prev.filter((k) => k !== ingredientKey) : [...prev, ingredientKey]
    ))
  }, [])

  const planRecipeNow = useCallback((recipeId, isoDate, slot) => {
    assignSlot(isoDate, slot, recipeId)
  }, [assignSlot])

  const value = useMemo(() => ({
    recipes,
    userRecipes,
    getRecipeById,
    addRecipe,
    mealPlan,
    assignSlot,
    clearSlot,
    planRecipeNow,
    shoppingChecked,
    toggleShoppingItem,
    pantryIngredients,
    togglePantryIngredient,
  }), [recipes, userRecipes, getRecipeById, addRecipe, mealPlan, assignSlot, clearSlot, planRecipeNow,
    shoppingChecked, toggleShoppingItem, pantryIngredients, togglePantryIngredient])

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}

export { toIsoDate }
