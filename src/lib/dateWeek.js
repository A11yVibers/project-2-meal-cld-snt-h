// Date helpers for the weekly planner. Weeks run Monday -> Sunday and are
// keyed everywhere by the ISO date string (YYYY-MM-DD) of their Monday.

export const MEAL_SLOTS = ['breakfast', 'lunch', 'dinner', 'snack']

export const MEAL_SLOT_LABELS = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
}

export const DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function toDateOnly(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function toISODate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function fromISODate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(iso, days) {
  const date = fromISODate(iso)
  date.setDate(date.getDate() + days)
  return toISODate(date)
}

export function getMonday(date = new Date()) {
  const d = toDateOnly(date)
  const day = d.getDay() // 0 = Sunday
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return toISODate(d)
}

export function getCurrentWeekStart() {
  return getMonday(new Date())
}

export function weekDates(weekStartIso) {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStartIso, i))
}

export function shiftWeek(weekStartIso, deltaWeeks) {
  return addDays(weekStartIso, deltaWeeks * 7)
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function formatShortDate(iso) {
  const date = fromISODate(iso)
  return `${MONTHS[date.getMonth()]} ${date.getDate()}`
}

export function formatWeekRangeLabel(weekStartIso) {
  const start = fromISODate(weekStartIso)
  const end = fromISODate(addDays(weekStartIso, 6))
  const startLabel = `${MONTHS[start.getMonth()]} ${start.getDate()}`
  const endLabel =
    start.getMonth() === end.getMonth()
      ? `${end.getDate()}`
      : `${MONTHS[end.getMonth()]} ${end.getDate()}`
  return `${startLabel} – ${endLabel}, ${end.getFullYear()}`
}

export function isToday(iso) {
  return iso === toISODate(new Date())
}
