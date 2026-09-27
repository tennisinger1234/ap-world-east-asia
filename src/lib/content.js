import content from '../data/content.json'

export const meta = content.meta
export const categories = content.categories
export const eras = content.eras
export const items = content.items
export const overview = content.overview
export const chains = content.chains
export const continuityChange = content.continuityChange
export const neighbors = content.neighbors
export const timelineEvents = content.timelineEvents
export const practice = content.practice
export const photos = content.photos ?? []
export const photosForItem = (id) => photos.filter((p) => p.itemId === id)
export const photosForSociety = (id) => photos.filter((p) => p.society === id)
export const sources = content.sources

const byId = (list) => Object.fromEntries(list.map((x) => [x.id, x]))
const itemIndex = byId(items)
const categoryIndex = byId(categories)
const sourceIndex = byId(sources)

export const getItem = (id) => itemIndex[id]
export const getCategory = (id) => categoryIndex[id]
export const getSource = (id) => sourceIndex[id]
export const itemsByCategory = (id, focus) =>
  items.filter((i) => i.category === id && (!focus || i.focus === focus))
export const contextItems = items.filter((i) => i.focus === 'context')
export const verifiedItems = items.filter((i) => i.verified)

export const CONNECTION_TYPES = ['cause/effect', 'continuity', 'change']

export const categoryHref = (id) => `/learn/${id}`
export const itemHref = (item) => `/learn/${item.category}?focus=${item.id}`

// Chicago bibliography: alphabetical by the first word of the entry, ignoring quotes/brackets.
const sortKey = (s) => s.bibliography.replace(/^[\s"“[*]+/, '').toLowerCase()
const byKey = (a, b) => sortKey(a).localeCompare(sortKey(b))
export const bibliography = sources.filter((s) => s.kind !== 'image').sort(byKey)
export const imageCredits = sources.filter((s) => s.kind === 'image').sort(byKey)

// Fill a note template's {loc} with this citation's locator (e.g. "slide 9"), or the source default.
const fillLoc = (template, src, loc) => template.replace('{loc}', loc ?? src.defaultLoc ?? '')

/**
 * Build Chicago-style notes for one page.
 * `citations` is an ordered list (one per footnote marker) of either a sourceId array or an
 * object with { sourceIds, locators } such as a content item.
 * The first time a source is cited on the page it gets the full note; after that, the short note.
 */
export function buildNotes(citations) {
  const seen = new Set()
  const notes = []
  const numbers = citations.map((c) => {
    const ids = Array.isArray(c) ? c : c?.sourceIds
    const locators = Array.isArray(c) ? {} : (c?.locators ?? {})
    if (!ids || ids.length === 0) return null
    const n = notes.length + 1
    const parts = ids
      .filter((id) => sourceIndex[id])
      .map((id) => {
        const src = sourceIndex[id]
        const text = fillLoc(seen.has(id) ? src.shortNote : src.note, src, locators[id])
        seen.add(id)
        return { sourceId: id, text }
      })
    notes.push({ n, parts })
    return n
  })
  return { numbers, notes }
}

export function shuffle(list) {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const sample = (list, n) => shuffle(list).slice(0, n)


export const questionCategory = (itemIds) => itemIds?.map(getItem).find(Boolean)?.category ?? null

export function timelineEntries() {
  const fromItems = items
    .filter((i) => typeof i.year === 'number')
    .map((i) => ({
      key: i.id,
      year: i.year,
      label: i.title,
      date: i.date,
      category: i.category,
      focus: i.focus,
      sourceIds: i.sourceIds,
      locators: i.locators,
      verified: i.verified,
      background: !!i.background,
      itemId: i.id,
    }))
  const fromEvents = timelineEvents.map((e) => ({
    key: e.id,
    year: e.year,
    label: e.label,
    date: e.date ?? String(e.year),
    category: e.category ?? null,
    focus: null,
    sourceIds: e.sourceIds,
    locators: e.locators,
    verified: e.verified,
    background: e.year < 1200,
    itemId: e.itemId ?? null,
  }))
  return [...fromItems, ...fromEvents].sort((a, b) => a.year - b.year)
}

// ---------- search ----------
const norm = (s) =>
  (s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[‘’'ʼ]/g, "'")

const searchIndex = [
  ...items.map((i) => ({
    key: i.id,
    kind: i.focus === 'context' ? 'After the Song' : i.focus === 'neighbors' ? 'Japan · Korea · Vietnam' : 'Song China',
    title: i.title,
    detail: i.date,
    categoryId: i.category,
    href: `/learn/${i.category}?focus=${i.id}`,
    title_n: norm(i.title),
    body_n: norm([i.summary, i.globalConnection, i.date, i.region].join(' ')),
  })),
  ...neighbors.societies.flatMap((s) =>
    [...s.adopted, ...s.adapted].map((e, idx) => ({
      key: `${s.id}-${idx}`,
      kind: `${s.name}: ${s.adopted.includes(e) ? 'adopted' : 'adapted'}`,
      title: e.label,
      detail: s.name,
      href: `/learn/neighbors?society=${s.id}`,
      title_n: norm(e.label),
      body_n: norm(e.text),
    })),
  ),
  ...timelineEvents.map((e) => ({
    key: e.id,
    kind: 'Timeline',
    title: e.label,
    detail: e.date ?? String(e.year),
    href: `/learn/timeline?focus=${e.id}`,
    title_n: norm(e.label),
    body_n: norm(String(e.year)),
  })),
  ...chains.map((c) => ({
    key: c.id,
    kind: 'Connections',
    title: c.title,
    detail: 'Cause → effect chain',
    href: `/connections?focus=${c.id}`,
    title_n: norm(c.title),
    body_n: norm(c.steps.map((s) => s.text).join(' ')),
  })),
  ...continuityChange.map((r) => ({
    key: r.id,
    kind: 'Connections',
    title: r.theme,
    detail: 'Continuity vs. change table',
    href: `/connections?focus=${r.id}`,
    title_n: norm(r.theme),
    body_n: norm([r.song, r.yuan, r.ming].join(' ')),
  })),
]

export function search(query, limit = 50) {
  const q = norm(query).trim()
  if (q.length < 2) return []
  const terms = q.split(/\s+/)
  const results = []
  for (const e of searchIndex) {
    const hay = `${e.title_n} ${e.body_n}`
    if (!terms.every((t) => hay.includes(t))) continue
    let score = 0
    if (e.title_n.includes(q)) score += 10
    if (e.title_n.startsWith(q)) score += 5
    if (hay.includes(q)) score += 3
    score += terms.filter((t) => e.title_n.includes(t)).length
    results.push({ ...e, score, snippet: snippetFor(e, terms[0]) })
  }
  return results.sort((a, b) => b.score - a.score).slice(0, limit)
}

function snippetFor(entry, term) {
  const source = items.find((i) => i.id === entry.key)?.summary
  if (!source) return null
  const i = norm(source).indexOf(term)
  if (i < 0) return source.slice(0, 110) + (source.length > 110 ? '…' : '')
  const start = Math.max(0, i - 50)
  return (start > 0 ? '…' : '') + source.slice(start, start + 130) + (start + 130 < source.length ? '…' : '')
}
