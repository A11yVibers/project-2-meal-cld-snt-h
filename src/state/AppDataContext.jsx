import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { seedRecipes } from '../data/seedRecipes.js'
import { makeId } from '../data/recipeModel.js'
import { loadJSON, saveJSON } from '../utils/storage.js'
import { weekKeyForOffset } from '../utils/dates.js'

const AppDataContext = createContext(null)

export function AppDataProvider({ children }) {
  const [userRecipes, setUserRecipes] = useState(() => loadJSON('userRecipes', []))
  const [weekPlans, setWeekPlans] = useState(() => loadJSON('weekPlans', {}))
  const [pantryItems, setPantryItems] = useState(() => loadJSON('pantryItems', {}))
  const [shoppingChecked, setShoppingChecked] = useState(() => loadJSON('shoppingChecked', {}))
  const [weekOffset, setWeekOffset] = useState(0)

  useEffect(() => saveJSON('userRecipes', userRecipes), [userRecipes])
  useEffect(() => saveJSON('weekPlans', weekPlans), [weekPlans])
  useEffect(() => saveJSON('pantryItems', pantryItems), [pantryItems])
  useEffect(() => saveJSON('shoppingChecked', shoppingChecked), [shoppingChecked])

  const allRecipes = useMemo(() => [...seedRecipes, ...userRecipes], [userRecipes])
  const recipesById = useMemo(() => new Map(allRecipes.map((r) => [r.id, r])), [allRecipes])

  const addRecipe = useCallback((draft) => {
    const id = makeId('recipe')
    const recipe = { ...draft, id, isUserCreated: true, createdAt: Date.now() }
    setUserRecipes((prev) => [...prev, recipe])

    const mp = draft.mealPlanning
    if (mp?.addImmediately) {
      const weekKey = weekKeyForOffset(Number(mp.plannedWeekOffset) || 0)
      setWeekPlans((prev) => {
        const next = { ...prev }
        const week = { ...(next[weekKey] || {}) }
        const day = { ...(week[mp.plannedDayIndex] || {}) }
        day[mp.plannedSlotId] = { recipeId: id, specificTime: mp.plannedSpecificTime || '' }
        week[mp.plannedDayIndex] = day
        next[weekKey] = week
        return next
      })
    }
    return id
  }, [])

  const assignSlot = useCallback((offset, dayIndex, slotId, recipeId, specificTime = '') => {
    const weekKey = weekKeyForOffset(offset)
    setWeekPlans((prev) => {
      const next = { ...prev }
      const week = { ...(next[weekKey] || {}) }
      const day = { ...(week[dayIndex] || {}) }
      day[slotId] = { recipeId, specificTime }
      week[dayIndex] = day
      next[weekKey] = week
      return next
    })
  }, [])

  const removeSlot = useCallback((offset, dayIndex, slotId) => {
    const weekKey = weekKeyForOffset(offset)
    setWeekPlans((prev) => {
      const next = { ...prev }
      const week = { ...(next[weekKey] || {}) }
      const day = { ...(week[dayIndex] || {}) }
      delete day[slotId]
      week[dayIndex] = day
      next[weekKey] = week
      return next
    })
  }, [])

  const getDayMap = useCallback((offset) => weekPlans[weekKeyForOffset(offset)] || {}, [weekPlans])

  const toggleShoppingChecked = useCallback((offset, itemKey) => {
    const weekKey = weekKeyForOffset(offset)
    setShoppingChecked((prev) => {
      const week = { ...(prev[weekKey] || {}) }
      week[itemKey] = !week[itemKey]
      return { ...prev, [weekKey]: week }
    })
  }, [])

  const getCheckedMap = useCallback(
    (offset) => shoppingChecked[weekKeyForOffset(offset)] || {},
    [shoppingChecked]
  )

  const togglePantryExcluded = useCallback((key, name) => {
    setPantryItems((prev) => {
      const next = { ...prev }
      if (next[key]) {
        delete next[key]
      } else {
        next[key] = { name }
      }
      return next
    })
  }, [])

  const addPantryItem = useCallback((key, name) => {
    setPantryItems((prev) => (prev[key] ? prev : { ...prev, [key]: { name } }))
  }, [])

  const removePantryItem = useCallback((key) => {
    setPantryItems((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  const pantryExcludedSet = useMemo(() => new Set(Object.keys(pantryItems)), [pantryItems])

  const value = {
    allRecipes,
    recipesById,
    userRecipes,
    addRecipe,
    weekOffset,
    setWeekOffset,
    assignSlot,
    removeSlot,
    getDayMap,
    toggleShoppingChecked,
    getCheckedMap,
    pantryItems,
    pantryExcludedSet,
    togglePantryExcluded,
    addPantryItem,
    removePantryItem,
  }

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider')
  return ctx
}
