import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { buildSeedRecipes } from '../data/seedRecipes.js'
import { loadJSON, saveJSON, STORAGE_KEYS } from '../data/storage.js'
import { generateId } from '../utils/id.js'

const AppDataContext = createContext(null)

const SEED_RECIPES = buildSeedRecipes()

export function AppDataProvider({ children }) {
  const [userRecipes, setUserRecipes] = useState(() => loadJSON(STORAGE_KEYS.userRecipes, []))
  const [mealPlan, setMealPlan] = useState(() => loadJSON(STORAGE_KEYS.mealPlan, {}))
  const [shoppingChecked, setShoppingChecked] = useState(() => loadJSON(STORAGE_KEYS.shoppingChecked, {}))
  const [pantryItems, setPantryItems] = useState(() => loadJSON(STORAGE_KEYS.pantryItems, []))
  const [excludePantry, setExcludePantry] = useState(() => loadJSON(STORAGE_KEYS.excludePantry, true))

  useEffect(() => saveJSON(STORAGE_KEYS.userRecipes, userRecipes), [userRecipes])
  useEffect(() => saveJSON(STORAGE_KEYS.mealPlan, mealPlan), [mealPlan])
  useEffect(() => saveJSON(STORAGE_KEYS.shoppingChecked, shoppingChecked), [shoppingChecked])
  useEffect(() => saveJSON(STORAGE_KEYS.pantryItems, pantryItems), [pantryItems])
  useEffect(() => saveJSON(STORAGE_KEYS.excludePantry, excludePantry), [excludePantry])

  const recipes = useMemo(() => [...SEED_RECIPES, ...userRecipes], [userRecipes])
  const recipesById = useMemo(() => Object.fromEntries(recipes.map((r) => [r.id, r])), [recipes])

  const addRecipe = useCallback((recipeData) => {
    const recipe = {
      ...recipeData,
      id: recipeData.id || generateId('recipe'),
      isUserRecipe: true,
      createdAt: Date.now(),
    }
    setUserRecipes((prev) => [...prev, recipe])
    return recipe
  }, [])

  const setPlanSlot = useCallback((weekKey, dayIndex, slotId, recipeId) => {
    setMealPlan((prev) => {
      const week = { ...(prev[weekKey] || {}) }
      const day = { ...(week[dayIndex] || {}) }
      day[slotId] = recipeId
      week[dayIndex] = day
      return { ...prev, [weekKey]: week }
    })
  }, [])

  const clearPlanSlot = useCallback((weekKey, dayIndex, slotId) => {
    setPlanSlot(weekKey, dayIndex, slotId, null)
  }, [setPlanSlot])

  const getWeekPlan = useCallback((weekKey) => mealPlan[weekKey] || {}, [mealPlan])

  const setItemChecked = useCallback((lineKey, checked) => {
    setShoppingChecked((prev) => ({ ...prev, [lineKey]: checked }))
  }, [])

  const togglePantryItem = useCallback((ingredientKey) => {
    setPantryItems((prev) =>
      prev.includes(ingredientKey) ? prev.filter((k) => k !== ingredientKey) : [...prev, ingredientKey]
    )
  }, [])

  const pantrySet = useMemo(() => new Set(pantryItems), [pantryItems])

  const value = useMemo(
    () => ({
      recipes,
      recipesById,
      addRecipe,
      mealPlan,
      setPlanSlot,
      clearPlanSlot,
      getWeekPlan,
      shoppingChecked,
      setItemChecked,
      pantryItems,
      pantrySet,
      togglePantryItem,
      excludePantry,
      setExcludePantry,
    }),
    [
      recipes,
      recipesById,
      addRecipe,
      mealPlan,
      setPlanSlot,
      clearPlanSlot,
      getWeekPlan,
      shoppingChecked,
      setItemChecked,
      pantryItems,
      pantrySet,
      togglePantryItem,
      excludePantry,
    ]
  )

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider')
  return ctx
}
