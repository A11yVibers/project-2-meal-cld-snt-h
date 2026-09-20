import { makeId } from '../lib/id.js'
import { getCurrentWeekStart, weekDates } from '../lib/dateWeek.js'

export const ACCENT_PALETTE = [
  '#D97757',
  '#8A9A5B',
  '#4C6EF5',
  '#E8590C',
  '#2F9E44',
  '#AE3EC9',
  '#1098AD',
  '#F08C00',
  '#495057',
  '#C2255C',
]

export function emptyIngredientItem() {
  return {
    id: makeId('item'),
    ingredientId: '',
    customName: '',
    quantity: '',
    unit: '',
    notes: '',
    optional: false,
  }
}

export function emptySection(name = '') {
  return {
    id: makeId('section'),
    name,
    items: [emptyIngredientItem()],
  }
}

export function emptyStep() {
  return {
    id: makeId('step'),
    instruction: '',
    timerMinutes: '',
  }
}

export function createEmptyDraft() {
  const currentWeek = getCurrentWeekStart()
  return {
    title: '',
    shortDescription: '',
    sourceUrl: '',
    cuisineId: '',
    mealTypeId: '',
    dietaryTagIds: [],
    categoryIds: [],
    servings: 4,
    prepTime: 15,
    cookTime: 15,
    spiceLevel: 0,
    accentColor: ACCENT_PALETTE[0],
    coverImage: '',
    ingredientSections: [emptySection('Main')],
    steps: [emptyStep()],
    mealPlanning: {
      availableForSuggestions: true,
      addToPlanNow: false,
      planWeekStart: currentWeek,
      plannedDate: weekDates(currentWeek)[0],
      plannedMealSlot: 'dinner',
      plannedTime: '',
    },
    options: {
      includeInShoppingList: true,
      showNutrition: false,
      allowSubstitutions: false,
      measurementSystem: 'us',
    },
  }
}
