// Minimal RFC4180-ish CSV parser: handles quoted fields, escaped quotes ("")
// and commas/newlines inside quoted fields. Good enough for the flat,
// well-formed project-assets CSV files used as seed/lookup data.

export function parseCSV(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false
  const len = text.length
  let i = 0

  while (i < len) {
    const char = text[i]
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i += 2
          continue
        }
        inQuotes = false
        i += 1
        continue
      }
      field += char
      i += 1
      continue
    }

    if (char === '"') {
      inQuotes = true
      i += 1
      continue
    }
    if (char === ',') {
      row.push(field)
      field = ''
      i += 1
      continue
    }
    if (char === '\r') {
      i += 1
      continue
    }
    if (char === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
      i += 1
      continue
    }
    field += char
    i += 1
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  return rows.filter((r) => !(r.length === 1 && r[0].trim() === ''))
}

export function parseCSVToObjects(text) {
  const rows = parseCSV(text)
  if (rows.length === 0) return []
  const headers = rows[0].map((h) => h.trim())
  return rows.slice(1).map((r) => {
    const obj = {}
    headers.forEach((h, idx) => {
      obj[h] = r[idx] !== undefined ? r[idx] : ''
    })
    return obj
  })
}

export function splitIdList(value) {
  if (!value) return []
  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
}

export function toBool(value, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback
  return String(value).trim().toLowerCase() === 'true'
}

export function toNum(value, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}
