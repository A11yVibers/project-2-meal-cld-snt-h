import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react'
import { seedRecipes } from '../data/loadData.js'
import { loadState, saveState } from '../lib/storage.js'
import { makeId } from '../lib/id.js'

const RecipesContext = createContext(null)

const STORAGE_KEY = 'userRecipes'

export function RecipesProvider({ children }) {
  const [userRecipes, setUserRecipes] = useState(() => loadState(STORAGE_KEY, []))

  useEffect(() => {
    saveState(STORAGE_KEY, userRecipes)
  }, [userRecipes])

  const recipes = useMemo(() => [...seedRecipes, ...userRecipes], [userRecipes])

  const recipesById = useMemo(() => {
    const map = new Map()
    recipes.forEach((r) => map.set(r.id, r))
    return map
  }, [recipes])

  const addRecipe = useCallback((recipeDraft) => {
    const recipe = {
      ...recipeDraft,
      id: makeId('recipe'),
      isSeed: false,
      createdAt: Date.now(),
    }
    setUserRecipes((prev) => [...prev, recipe])
    return recipe
  }, [])

  const getRecipe = useCallback((id) => recipesById.get(id), [recipesById])

  const value = useMemo(
    () => ({ recipes, recipesById, addRecipe, getRecipe }),
    [recipes, recipesById, addRecipe, getRecipe],
  )

  return <RecipesContext.Provider value={value}>{children}</RecipesContext.Provider>
}

export function useRecipes() {
  const ctx = useContext(RecipesContext)
  if (!ctx) throw new Error('useRecipes must be used within a RecipesProvider')
  return ctx
}
