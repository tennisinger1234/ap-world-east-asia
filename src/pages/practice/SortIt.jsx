import { useMemo, useState } from 'react'
import { categories, getCategory, sample, shuffle, verifiedItems } from '../../lib/content'
import { PracticeTabs, ScoreSummary } from '../../components/practice'
import { PageHeader, Seal } from '../../components/ui'

const ROUND = 8
// One verified development from each category, plus one extra, so every bin is used.
function buildRound() {
  const pool = verifiedItems.filter((i) => i.focus !== 'context')
  const one = categories.map((c) => sample(pool.filter((i) => i.category === c.id), 1)[0]).filter(Boolean)
  const extra = sample(pool.filter((i) => !one.includes(i)), ROUND - one.length)
  return shuffle([...one, ...extra])
}

function Chip({ item, selected, checked, onPick, draggable }) {
  const right = checked && checked.correct
  const wrong = checked && !checked.correct
  return (
    <button
      type="button"
      draggable={draggable}
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', item.id)
        e.dataTransfer.effectAllowed = 'move'
      }}
      onClick={onPick}
      aria-pressed={selected}
      className={`w-full rounded-md border-2 px-3 py-2 text-left text-sm font-medium leading-snug shadow-paper transition ${
        right
          ? 'border-celadon-deep bg-celadon-wash'
          : wrong
            ? 'border-seal bg-seal-wash'
            : selected
              ? 'border-seal bg-paper-card ring-2 ring-seal/30'
              : 'border-ink-line bg-paper-card hover:border-ink'
      } ${draggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
    >
      {item.title}
      {wrong && <span className="mt-1 block text-xs font-semibold text-seal">Belongs in: {getCategory(item.category).name}</span>}
    </button>
  )
}

export default function SortIt() {
  const [round, setRound] = useState(0)
  const cards = useMemo(() => buildRound(), [round])
  const [placed, setPlaced] = useState({})
  const [selected, setSelected] = useState(null)
  const [checked, setChecked] = useState(false)
  const [summary, setSummary] = useState(false)
  const [over, setOver] = useState(null)

  const restart = () => {
    setRound((r) => r + 1)
    setPlaced({})
    setSelected(null)
    setChecked(false)
    setSummary(false)
  }

  const place = (id, cat) => {
    if (checked || !id) return
    setPlaced((p) => ({ ...p, [id]: cat }))
    setSelected(null)
  }
  const unplace = (id) => {
    if (checked) return
    setPlaced((p) => {
      const n = { ...p }
      delete n[id]
      return n
    })
  }

  const tray = cards.filter((c) => !placed[c.id])
  const results = cards.map((c) => ({ correct: placed[c.id] === c.category, category: c.category }))
  const verdict = (c) => (checked ? { correct: placed[c.id] === c.category } : null)

  if (summary) {
    return (
      <>
        <PracticeTabs />
        <ScoreSummary mode="sort" results={results} onRestart={restart} />
      </>
    )
  }

  return (
    <>
      <PracticeTabs />
      <PageHeader eyebrow="Practice · Sort it" title="Which PIRATES category?">
        Drag each development into its category. On a phone, tap a development, then tap a category. Tap a placed card to send it
        back.
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
        <section
          aria-label="Developments to sort"
          className="lg:sticky lg:top-24 lg:self-start"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => unplace(e.dataTransfer.getData('text/plain'))}
        >
          <h2 className="mb-3 text-xl">
            To sort <span className="faint font-sans text-sm">({tray.length} left)</span>
          </h2>
          <div className="space-y-2 rounded-lg border border-dashed border-ink-line p-3">
            {tray.length === 0 ? (
              <p className="faint p-2 text-sm">All placed.</p>
            ) : (
              tray.map((c) => (
                <Chip key={c.id} item={c} draggable selected={selected === c.id} onPick={() => setSelected((s) => (s === c.id ? null : c.id))} />
              ))
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {!checked ? (
              <button type="button" className="btn-primary" disabled={tray.length > 0} onClick={() => setChecked(true)}>
                {tray.length > 0 ? `Place all ${cards.length} to check` : 'Check answers'}
              </button>
            ) : (
              <button type="button" className="btn-primary" onClick={() => setSummary(true)}>
                See summary →
              </button>
            )}
            <button type="button" className="btn-ghost" onClick={restart}>
              New set
            </button>
          </div>
          {checked && (
            <p className="mt-3 font-sans text-xl font-bold">
              {results.filter((r) => r.correct).length} / {cards.length} correct
            </p>
          )}
        </section>

        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((cat) => {
            const inBin = cards.filter((c) => placed[c.id] === cat.id)
            return (
              <li
                key={cat.id}
                onDragOver={(e) => {
                  e.preventDefault()
                  setOver(cat.id)
                }}
                onDragLeave={() => setOver((o) => (o === cat.id ? null : o))}
                onDrop={(e) => {
                  e.preventDefault()
                  setOver(null)
                  place(e.dataTransfer.getData('text/plain'), cat.id)
                }}
                className={`flex min-h-[9rem] flex-col rounded-lg border-2 p-3 transition ${
                  over === cat.id ? 'border-seal bg-seal-wash/40' : selected ? 'border-dashed border-ink-faint bg-paper-card/60' : 'border-ink-line bg-paper-card/60'
                }`}
              >
                <button
                  type="button"
                  onClick={() => place(selected, cat.id)}
                  disabled={!selected || checked}
                  className="mb-2 flex items-center gap-2 text-left disabled:cursor-default"
                  aria-label={`Place selected development in ${cat.name}`}
                >
                  <Seal categoryId={cat.id} size={32} />
                  <span className="font-display text-xl font-semibold">{cat.name}</span>
                  {selected && !checked && <span className="ml-auto text-xs font-semibold text-seal">Tap to place</span>}
                </button>
                <div className="space-y-2">
                  {inBin.map((c) => (
                    <Chip key={c.id} item={c} draggable={!checked} checked={verdict(c)} onPick={() => unplace(c.id)} />
                  ))}
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      {selected && !checked && (
        <div
          className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-line bg-paper/95 px-3 pt-3 shadow-lift backdrop-blur lg:hidden"
          style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
        >
          <p className="mb-2 truncate text-xs font-semibold">
            Place “{cards.find((c) => c.id === selected)?.title}” in:
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            {categories.map((cat) => (
              <button key={cat.id} type="button" onClick={() => place(selected, cat.id)} className="flex flex-col items-center rounded-md border border-ink-line bg-paper-card px-1 py-1.5 active:scale-[.97]">
                <span className="font-display text-lg font-bold leading-none text-seal">{cat.letter}</span>
                <span className="mt-0.5 text-[10px] font-medium leading-tight text-ink-soft">{cat.name}</span>
              </button>
            ))}
            <button type="button" onClick={() => setSelected(null)} className="rounded-md border border-ink-line px-1 py-1.5 text-xs font-semibold text-ink-soft">
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  )
}
