export const DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
export const DAY_LABELS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function addDays(date, amount) {
  const d = new Date(date)
  d.setDate(d.getDate() + amount)
  return d
}

export function addWeeks(date, amount) {
  return addDays(date, amount * 7)
}

// Monday-first week start.
export function getWeekStart(date) {
  const d = startOfDay(date)
  const dayOfWeek = d.getDay() // 0 = Sunday ... 6 = Saturday
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  return addDays(d, diffToMonday)
}

export function toISODate(date) {
  const d = new Date(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function fromISODate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function weekKeyFor(date) {
  return toISODate(getWeekStart(date))
}

export function todayWeekKey() {
  return weekKeyFor(new Date())
}

export function shiftWeekKey(weekKey, amount) {
  return toISODate(addWeeks(fromISODate(weekKey), amount))
}

export function formatWeekRange(weekKey) {
  const start = fromISODate(weekKey)
  const end = addDays(start, 6)
  const opts = { month: 'short', day: 'numeric' }
  const startLabel = start.toLocaleDateString(undefined, opts)
  const endLabel = end.toLocaleDateString(undefined, { ...opts, year: 'numeric' })
  return `${startLabel} – ${endLabel}`
}

export function weekRelativeLabel(weekKey, referenceWeekKey = todayWeekKey()) {
  const diffWeeks = Math.round(
    (fromISODate(weekKey).getTime() - fromISODate(referenceWeekKey).getTime()) / (7 * 24 * 60 * 60 * 1000)
  )
  if (diffWeeks === 0) return 'This week'
  if (diffWeeks === 1) return 'Next week'
  if (diffWeeks === -1) return 'Last week'
  if (diffWeeks > 1) return `In ${diffWeeks} weeks`
  return `${Math.abs(diffWeeks)} weeks ago`
}

export function dayDateForWeek(weekKey, dayIndex) {
  return addDays(fromISODate(weekKey), dayIndex)
}

export function formatDayLabel(weekKey, dayIndex) {
  const date = dayDateForWeek(weekKey, dayIndex)
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function dayIndexForISODate(iso) {
  const date = fromISODate(iso)
  const day = date.getDay()
  return day === 0 ? 6 : day - 1
}

export function formatMinutes(totalMinutes) {
  const minutes = Number(totalMinutes) || 0
  if (minutes <= 0) return '0 min'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m} min`
  if (m === 0) return `${h} hr`
  return `${h} hr ${m} min`
}
