import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react'
import { loadState, saveState } from '../lib/storage.js'

const ShoppingListContext = createContext(null)

const ITEM_STATE_KEY = 'shoppingItemState'
const HIDE_PANTRY_KEY = 'shoppingHidePantry'

// itemState: { [itemKey]: { checked: bool, inPantry: bool } }

export function ShoppingListProvider({ children }) {
  const [itemState, setItemState] = useState(() => loadState(ITEM_STATE_KEY, {}))
  const [hidePantryItems, setHidePantryItems] = useState(() => loadState(HIDE_PANTRY_KEY, false))

  useEffect(() => {
    saveState(ITEM_STATE_KEY, itemState)
  }, [itemState])

  useEffect(() => {
    saveState(HIDE_PANTRY_KEY, hidePantryItems)
  }, [hidePantryItems])

  const toggleChecked = useCallback((key) => {
    setItemState((prev) => ({
      ...prev,
      [key]: { ...prev[key], checked: !prev[key]?.checked },
    }))
  }, [])

  const togglePantry = useCallback((key) => {
    setItemState((prev) => ({
      ...prev,
      [key]: { ...prev[key], inPantry: !prev[key]?.inPantry },
    }))
  }, [])

  const getState = useCallback(
    (key) => itemState[key] || { checked: false, inPantry: false },
    [itemState],
  )

  const value = useMemo(
    () => ({ getState, toggleChecked, togglePantry, hidePantryItems, setHidePantryItems }),
    [getState, toggleChecked, togglePantry, hidePantryItems],
  )

  return <ShoppingListContext.Provider value={value}>{children}</ShoppingListContext.Provider>
}

export function useShoppingListState() {
  const ctx = useContext(ShoppingListContext)
  if (!ctx) throw new Error('useShoppingListState must be used within a ShoppingListProvider')
  return ctx
}
