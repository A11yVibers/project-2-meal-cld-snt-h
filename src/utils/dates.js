const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

export function startOfWeek(date = new Date()) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const dow = d.getDay() // 0 = Sunday
  const diffToMonday = (dow + 6) % 7
  d.setDate(d.getDate() - diffToMonday)
  return d
}

export function addDays(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

export function addWeeks(date, n) {
  return addDays(date, n * 7)
}

export function toDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function weekKeyForOffset(offset) {
  return toDateKey(addWeeks(startOfWeek(new Date()), offset))
}

export function weekDatesForOffset(offset) {
  const monday = addWeeks(startOfWeek(new Date()), offset)
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i))
}

export function formatShortDate(date) {
  return `${MONTH_SHORT[date.getMonth()]} ${date.getDate()}`
}

export function formatWeekRangeLabel(offset) {
  const dates = weekDatesForOffset(offset)
  const start = dates[0]
  const end = dates[6]
  const sameMonth = start.getMonth() === end.getMonth()
  const startLabel = `${MONTH_SHORT[start.getMonth()]} ${start.getDate()}`
  const endLabel = sameMonth ? `${end.getDate()}` : `${MONTH_SHORT[end.getMonth()]} ${end.getDate()}`
  const suffix = offset === 0 ? ' (This week)' : offset === 1 ? ' (Next week)' : offset === -1 ? ' (Last week)' : ''
  return `${startLabel} – ${endLabel}, ${end.getFullYear()}${suffix}`
}

export function dayName(index, short = false) {
  return short ? DAY_SHORT[index] : DAY_NAMES[index]
}

export function isToday(date) {
  const today = new Date()
  return toDateKey(date) === toDateKey(today)
}

export function weekOptionLabel(offset) {
  if (offset === 0) return `This week (${formatShortRange(offset)})`
  if (offset === 1) return `Next week (${formatShortRange(offset)})`
  return `${formatShortRange(offset)}`
}

function formatShortRange(offset) {
  const dates = weekDatesForOffset(offset)
  return `${formatShortDate(dates[0])} – ${formatShortDate(dates[6])}`
}
