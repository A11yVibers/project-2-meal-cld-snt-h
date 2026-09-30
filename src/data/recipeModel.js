// Canonical in-app Recipe shape, shared by seed recipes (parsed from CSV)
// and user-created recipes (built from the Add Recipe form). Keeping one
// shape lets both kinds of recipes flow through the same catalog, detail,
// planner and shopping-list code.
//
// Recipe = {
//   id, title, shortDescription, sourceName, sourceUrl,
//   servings, prepTimeMinutes, cookTimeMinutes, totalTimeMinutes,
//   difficulty (1-5, optional), spiceLevel (0-5),
//   cuisineId, mealTypeId, dietaryTagIds: [], categoryIds: [],
//   accentColor, coverImageUrl,
//   ingredients: [{ id, section, ingredientId, ingredientName, quantity, unit, optional, notes }],
//   steps: [{ id, stepNumber, instruction, timerMinutes }],
//   mealPlanning: {
//     availableForSuggestions, addImmediately, plannedWeekKey,
//     plannedDayIndex, plannedSlotId, plannedSpecificTime,
//   },
//   options: { includeInShoppingList, showNutrition, allowSubstitutions, measurementSystem },
//   isUserCreated, createdAt,
// }

export const MEAL_SLOTS = [
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'dinner', label: 'Dinner' },
  { id: 'snack', label: 'Snack' },
]

export const SPICE_LEVELS = ['None', 'Mild', 'Medium', 'Medium-Hot', 'Hot', 'Very Spicy']

export const ACCENT_COLORS = [
  '#D97757',
  '#8A9A5B',
  '#4C7EA8',
  '#B5563C',
  '#6B5B95',
  '#3F7D6B',
  '#C98A3E',
  '#7A6A53',
]

let idCounter = 0
export function makeId(prefix) {
  idCounter += 1
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`
}

export function deriveTotalTime(prep, cook) {
  const p = Number(prep) || 0
  const c = Number(cook) || 0
  return p + c
}

export function emptyIngredientRow(section = 'Main') {
  return {
    id: makeId('ing'),
    section,
    ingredientId: '',
    ingredientName: '',
    quantity: '',
    unit: '',
    optional: false,
    notes: '',
  }
}

export function emptyStepRow() {
  return {
    id: makeId('step'),
    instruction: '',
    timerMinutes: '',
  }
}

export function blankRecipeDraft() {
  return {
    title: '',
    shortDescription: '',
    sourceName: '',
    sourceUrl: '',
    cuisineId: '',
    mealTypeId: '',
    dietaryTagIds: [],
    categoryIds: [],
    servings: 4,
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    spiceLevel: 0,
    accentColor: ACCENT_COLORS[0],
    coverImageUrl: '',
    ingredients: [emptyIngredientRow('Main')],
    steps: [emptyStepRow()],
    mealPlanning: {
      availableForSuggestions: true,
      addImmediately: false,
      plannedWeekOffset: 0,
      plannedDayIndex: 0,
      plannedSlotId: 'dinner',
      plannedSpecificTime: '',
    },
    options: {
      includeInShoppingList: true,
      showNutrition: false,
      allowSubstitutions: false,
      measurementSystem: 'us',
    },
  }
}
