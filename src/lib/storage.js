const ITEMS_KEY = 'dq_items'
const HISTORY_KEY = 'dq_history'

export function loadItems(fallback) {
  try {
    const raw = localStorage.getItem(ITEMS_KEY)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function saveItems(items) {
  localStorage.setItem(ITEMS_KEY, JSON.stringify(items))
}

export function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveHistory(history) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
}

export function appendHistory(entry) {
  const history = loadHistory()
  history.unshift(entry)
  saveHistory(history)
  return history
}

export function clearAll() {
  localStorage.removeItem(ITEMS_KEY)
  localStorage.removeItem(HISTORY_KEY)
}
