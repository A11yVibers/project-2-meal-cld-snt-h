import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react'
import { loadState, saveState } from '../lib/storage.js'
import { getCurrentWeekStart, shiftWeek } from '../lib/dateWeek.js'

const PlannerContext = createContext(null)

const ASSIGNMENTS_KEY = 'plannerAssignments'

export function PlannerProvider({ children }) {
  const [assignments, setAssignments] = useState(() => loadState(ASSIGNMENTS_KEY, {}))
  const [selectedWeekStart, setSelectedWeekStart] = useState(() => getCurrentWeekStart())

  useEffect(() => {
    saveState(ASSIGNMENTS_KEY, assignments)
  }, [assignments])

  const setSlot = useCallback((date, slot, recipeId) => {
    setAssignments((prev) => {
      const day = { ...(prev[date] || {}) }
      if (recipeId) {
        day[slot] = recipeId
      } else {
        delete day[slot]
      }
      const next = { ...prev, [date]: day }
      if (Object.keys(day).length === 0) delete next[date]
      return next
    })
  }, [])

  const clearSlot = useCallback((date, slot) => {
    setSlot(date, slot, null)
  }, [setSlot])

  const goToNextWeek = useCallback(() => {
    setSelectedWeekStart((w) => shiftWeek(w, 1))
  }, [])

  const goToPrevWeek = useCallback(() => {
    setSelectedWeekStart((w) => shiftWeek(w, -1))
  }, [])

  const goToCurrentWeek = useCallback(() => {
    setSelectedWeekStart(getCurrentWeekStart())
  }, [])

  const value = useMemo(
    () => ({
      assignments,
      setSlot,
      clearSlot,
      selectedWeekStart,
      setSelectedWeekStart,
      goToNextWeek,
      goToPrevWeek,
      goToCurrentWeek,
    }),
    [assignments, setSlot, clearSlot, selectedWeekStart, goToNextWeek, goToPrevWeek, goToCurrentWeek],
  )

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>
}

export function usePlanner() {
  const ctx = useContext(PlannerContext)
  if (!ctx) throw new Error('usePlanner must be used within a PlannerProvider')
  return ctx
}
