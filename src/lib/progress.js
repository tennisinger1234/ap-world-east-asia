import { useSyncExternalStore } from 'react'

// Per-browser study progress, saved in localStorage so it survives reloads. The app works without it.
const KEY = 'ap11-progress-v1'
const EMPTY = {
  viewed: [], // PIRATES categories opened
  pages: [], // Learn/Connections pages opened (for the unit progress ring)
  lastLearn: null, // path to resume
  best: {}, // best score per practice mode
  mcq: { correct: 0, answered: 0 }, // running multiple-choice totals
  mastered: [], // flashcard ids marked "Got it"
  saq: [], // SAQ prompt ids completed
}
let state = load()
const listeners = new Set()

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY
  } catch {
    return EMPTY
  }
}

function save(next) {
  state = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* storage unavailable: keep in memory only */
  }
  listeners.forEach((l) => l())
}

const subscribe = (l) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

export const useProgress = () => useSyncExternalStore(subscribe, () => state, () => state)

const addUnique = (list, v) => (list.includes(v) ? list : [...list, v])

export function markViewed(categoryId) {
  if (state.viewed.includes(categoryId)) return
  save({ ...state, viewed: [...state.viewed, categoryId] })
}

// The Learn pages that make up "the unit" for the progress ring.
export const UNIT_PAGES = [
  '/learn/political',
  '/learn/intellectual',
  '/learn/religious',
  '/learn/artistic',
  '/learn/technological',
  '/learn/economic',
  '/learn/social',
  '/learn/neighbors',
  '/learn/timeline',
  '/connections',
]

export function markPage(path) {
  if (!UNIT_PAGES.includes(path)) return
  const pages = addUnique(state.pages, path)
  const lastLearn = path
  if (pages === state.pages && state.lastLearn === lastLearn) return
  save({ ...state, pages, lastLearn })
}

export function recordScore(mode, correct, total) {
  if (!total) return
  const prev = state.best[mode]
  const pct = Math.round((correct / total) * 100)
  if (prev && prev.pct >= pct) return
  save({ ...state, best: { ...state.best, [mode]: { correct, total, pct } } })
}

export function recordMcqAnswer(correct) {
  save({ ...state, mcq: { correct: state.mcq.correct + (correct ? 1 : 0), answered: state.mcq.answered + 1 } })
}

export function markMastered(cardId) {
  if (state.mastered.includes(cardId)) return
  save({ ...state, mastered: [...state.mastered, cardId] })
}

export function markSaqDone(id) {
  if (state.saq.includes(id)) return
  save({ ...state, saq: [...state.saq, id] })
}

export function unitPercent(p) {
  return Math.round((UNIT_PAGES.filter((x) => p.pages.includes(x)).length / UNIT_PAGES.length) * 100)
}

export function resetProgress() {
  save(EMPTY)
}
