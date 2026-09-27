// Validates src/data/content.json against the project rules. Run: npm run check-content
import { existsSync, readFileSync } from 'node:fs'

const data = JSON.parse(readFileSync(new URL('../src/data/content.json', import.meta.url), 'utf8'))
const errors = []
const warnings = []
const err = (m) => errors.push(m)
const warn = (m) => warnings.push(m)

const TYPES = ['cause/effect', 'continuity', 'change']
const FOCUS = ['song', 'neighbors', 'context']
const sourceIds = new Set(data.sources.map((s) => s.id))
const categoryIds = new Set(data.categories.map((c) => c.id))
const itemIds = new Set()

const checkSources = (where, ids) => {
  if (!Array.isArray(ids) || ids.length === 0) err(`${where}: needs at least one sourceId`)
  for (const id of ids ?? []) if (!sourceIds.has(id)) err(`${where}: unknown sourceId "${id}"`)
}

for (const s of data.sources) {
  for (const f of ['id', 'bibliography', 'note', 'shortNote']) if (!s[f]) err(`source ${s.id}: missing ${f}`)
}

for (const it of data.items) {
  const w = `item ${it.id}`
  for (const f of ['id', 'category', 'title', 'date', 'summary', 'globalConnection', 'connectionType'])
    if (typeof it[f] !== 'string' || !it[f].trim()) err(`${w}: missing ${f}`)
  if (itemIds.has(it.id)) err(`${w}: duplicate id`)
  itemIds.add(it.id)
  if (!categoryIds.has(it.category)) err(`${w}: unknown category "${it.category}"`)
  if (!TYPES.includes(it.connectionType)) err(`${w}: bad connectionType "${it.connectionType}"`)
  if (typeof it.verified !== 'boolean') err(`${w}: verified must be true/false`)
  if (!FOCUS.includes(it.focus)) err(`${w}: focus must be one of ${FOCUS.join(', ')}`)
  checkSources(w, it.sourceIds)
  const sentences = it.summary.split(/(?<=[.!?])\s+(?=[A-Z"“(])/).length
  if (sentences < 2 || sentences > 4) warn(`${w}: summary has ${sentences} sentences (target 2–4)`)
  if (it.background && it.connectionType !== 'continuity') err(`${w}: pre-1200 background must be "continuity"`)
  if (typeof it.year === 'number' && it.year < 1200 && !it.background) err(`${w}: year ${it.year} is before 1200 but not marked background`)
  if (typeof it.year === 'number' && it.year > 1450) err(`${w}: year ${it.year} is after 1450`)
}

for (const c of data.categories) {
  const inCat = data.items.filter((i) => i.category === c.id)
  const inPeriod = inCat.filter((i) => !i.background).length
  const song = inCat.filter((i) => i.focus === 'song').length
  if (inPeriod < 3) err(`category ${c.id}: only ${inPeriod} in-period developments (need ≥3)`)
  if (song < 3) err(`category ${c.id}: only ${song} Song-focused developments (need ≥3)`)
  for (const f of ['neighbors', 'context'])
    if (inCat.filter((i) => i.focus === f).length > song) warn(`category ${c.id}: more "${f}" items than Song items`)
}

for (const e of data.eras ?? []) checkSources(`era ${e.id}`, e.sourceIds)

for (const o of data.overview) checkSources(`overview ${o.id}`, o.sourceIds)

for (const ch of data.chains)
  ch.steps.forEach((s, i) => {
    if (s.itemId && !itemIds.has(s.itemId)) err(`chain ${ch.id} step ${i + 1}: unknown itemId "${s.itemId}"`)
    if (!s.itemId) checkSources(`chain ${ch.id} step ${i + 1}`, s.sourceIds)
  })

for (const r of data.continuityChange) {
  if (!TYPES.includes(r.verdict)) err(`ccot ${r.id}: bad verdict "${r.verdict}"`)
  for (const id of r.itemIds ?? []) if (!itemIds.has(id)) err(`ccot ${r.id}: unknown itemId "${id}"`)
  if (r.sourceIds) checkSources(`ccot ${r.id}`, r.sourceIds)
}

for (const s of data.neighbors.societies)
  for (const side of ['adopted', 'adapted'])
    s[side].forEach((e, i) => {
      checkSources(`neighbors ${s.id}.${side}[${i}]`, e.sourceIds)
      if (typeof e.verified !== 'boolean') err(`neighbors ${s.id}.${side}[${i}]: verified must be true/false`)
    })

for (const e of data.timelineEvents) {
  checkSources(`event ${e.id}`, e.sourceIds)
  if (e.itemId && !itemIds.has(e.itemId)) err(`event ${e.id}: unknown itemId`)
}

const checkItems = (where, ids) => {
  if (!ids?.length) err(`${where}: needs itemIds`)
  for (const id of ids ?? []) if (!itemIds.has(id)) err(`${where}: unknown itemId "${id}"`)
}
const checkStimulus = (where, st) => {
  if (!st) return
  if (!['quote', 'description'].includes(st.type)) err(`${where}: stimulus type must be quote or description`)
  if (st.type === 'quote') {
    if (!st.attribution) err(`${where}: quote stimulus needs an attribution`)
    checkSources(`${where} stimulus`, st.sourceIds)
  }
}
const { mcq = [], saq = [], ccot = [] } = data.practice ?? {}
const qids = new Set()
for (const q of [...mcq, ...saq, ...ccot]) {
  if (qids.has(q.id)) err(`practice ${q.id}: duplicate id`)
  qids.add(q.id)
}
for (const q of mcq) {
  const w = `mcq ${q.id}`
  if (!q.stimulus) err(`${w}: needs a stimulus`)
  checkStimulus(w, q.stimulus)
  if (!Array.isArray(q.choices) || q.choices.length !== 4) err(`${w}: needs exactly 4 choices`)
  if (!(q.answer >= 0 && q.answer < q.choices.length)) err(`${w}: answer index out of range`)
  if (!q.explanation) err(`${w}: missing explanation`)
  checkItems(w, q.itemIds)
}
for (const q of saq) {
  const w = `saq ${q.id}`
  checkStimulus(w, q.stimulus)
  if (q.parts?.length !== 3) err(`${w}: needs parts a, b, c`)
  for (const p of q.parts ?? []) {
    if (!p.prompt || !p.points?.length) err(`${w}.${p.label}: needs prompt and model points`)
    checkItems(`${w}.${p.label}`, p.itemIds)
  }
}
for (const q of ccot) {
  const w = `ccot ${q.id}`
  if (!['continuity', 'change'].includes(q.answer)) err(`${w}: answer must be continuity or change`)
  if (!q.explanation) err(`${w}: missing explanation`)
  checkItems(w, q.itemIds)
}

for (const ph of data.photos ?? []) {
  const w = `photo ${ph.id}`
  if (!existsSync(new URL(`../src/assets/photos/${ph.file}`, import.meta.url))) err(`${w}: missing file src/assets/photos/${ph.file}`)
  if (ph.itemId && !itemIds.has(ph.itemId)) err(`${w}: unknown itemId "${ph.itemId}"`)
  if (!ph.itemId && !ph.society) err(`${w}: needs an itemId or society to be placed`)
  if (!sourceIds.has(ph.sourceId)) err(`${w}: unknown sourceId "${ph.sourceId}"`)
  for (const f of ['alt', 'caption']) if (!ph[f]) err(`${w}: missing ${f}`)
}

const used = new Set([
  ...(data.photos ?? []).map((p) => p.sourceId),
  ...data.items.flatMap((i) => i.sourceIds),
  ...data.overview.flatMap((o) => o.sourceIds),
  ...data.neighbors.societies.flatMap((s) => [...s.adopted, ...s.adapted].flatMap((e) => e.sourceIds)),
  ...data.timelineEvents.flatMap((e) => e.sourceIds),
  ...data.chains.flatMap((c) => c.steps.flatMap((s) => s.sourceIds ?? [])),
])
for (const s of data.sources) if (!used.has(s.id) && !s.bibliographyOnly) warn(`source ${s.id} is never cited`)

// Every entry shown on the site must be confirmed in a source.
const flagged = [
  ...data.items.filter((i) => i.verified !== true).map((i) => `item ${i.id}`),
  ...data.neighbors.societies.flatMap((s) => [...s.adopted, ...s.adapted].filter((e) => e.verified !== true).map((e) => `neighbors ${s.id}: ${e.label}`)),
  ...data.timelineEvents.filter((e) => e.verified !== true).map((e) => `event ${e.id}`),
  ...data.continuityChange.filter((r) => r.verified !== true).map((r) => `ccot row ${r.id}`),
  ...(data.photos ?? []).filter((p) => p.verified !== true).map((p) => `photo ${p.id}`),
  ...data.overview.filter((o) => o.verified !== true).map((o) => `overview ${o.id}`),
]
flagged.forEach((f) => err(`${f}: not verified; confirm it or remove it`))
for (const s of data.sources) if (/\[COLLECTION\]/.test(s.bibliography)) err(`source ${s.id}: placeholder left in bibliography`)
const unverified = flagged.length
console.log(
  `content.json: ${data.items.length} items, ${mcq.length} MCQ / ${saq.length} SAQ / ${ccot.length} CCOT, ${data.sources.length} sources, ${unverified} unverified entries`,
)
warnings.forEach((w) => console.warn('  warn:', w))
if (errors.length) {
  errors.forEach((e) => console.error('  ERROR:', e))
  process.exit(1)
}
console.log('  OK')
