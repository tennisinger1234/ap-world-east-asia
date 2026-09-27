import { useState } from 'react'
import { Link } from 'react-router-dom'
import { shuffle, timelineEntries } from '../../lib/content'
import { PracticeTabs, ScoreSummary } from '../../components/practice'
import { CategoryChip, PageHeader } from '../../components/ui'

const ROUND = 6

// Verified entries with a single date (not a range) and distinct years, so there is exactly one right order.
const SINGLE_DATE = /^(c\. )?\d{3,4}s?$/
function buildRound() {
  const seen = new Set()
  const pool = shuffle(timelineEntries().filter((e) => e.verified && e.year <= 1450 && SINGLE_DATE.test(e.date)))
  const pick = []
  for (const e of pool) {
    if (seen.has(e.year)) continue
    seen.add(e.year)
    pick.push(e)
    if (pick.length === ROUND) break
  }
  return pick
}

function newRound() {
  const events = buildRound()
  return { events, order: shuffle(events) }
}

export default function TimelineOrder() {
  const [{ events, order: list }, setRound] = useState(newRound)
  const [checked, setChecked] = useState(false)
  const [summary, setSummary] = useState(false)
  const [dragIdx, setDragIdx] = useState(null)
  const setOrder = (order) => setRound((r) => ({ ...r, order }))

  const restart = () => {
    setRound(newRound())
    setChecked(false)
    setSummary(false)
  }

  const correctOrder = [...events].sort((a, b) => a.year - b.year)
  const results = list.map((e, i) => ({ correct: correctOrder[i].key === e.key, category: e.category }))

  const move = (from, to) => {
    if (checked || to < 0 || to >= list.length || from === to) return
    const next = [...list]
    const [x] = next.splice(from, 1)
    next.splice(to, 0, x)
    setOrder(next)
  }

  if (summary) {
    return (
      <>
        <PracticeTabs />
        <ScoreSummary mode="order" results={results} onRestart={restart} restartLabel="New set of events" />
      </>
    )
  }

  return (
    <>
      <PracticeTabs />
      <PageHeader eyebrow="Practice · Timeline order" title="Put these in order">
        Arrange the events from earliest (top) to latest (bottom). Drag them, or use the ↑ ↓ buttons.
      </PageHeader>

      <div className="mx-auto max-w-2xl">
        <p className="eyebrow mb-2">Earliest</p>
        <ol className="space-y-2">
          {list.map((e, i) => {
            const ok = checked && correctOrder[i].key === e.key
            const bad = checked && !ok
            return (
              <li
                key={e.key}
                draggable={!checked}
                onDragStart={() => setDragIdx(i)}
                onDragOver={(ev) => ev.preventDefault()}
                onDrop={() => {
                  move(dragIdx, i)
                  setDragIdx(null)
                }}
                className={`flex items-center gap-3 rounded-md border-2 bg-paper-card p-3 shadow-paper transition ${
                  ok ? 'border-celadon-deep bg-celadon-wash' : bad ? 'border-seal bg-seal-wash' : 'border-ink-line'
                } ${!checked ? 'cursor-grab active:cursor-grabbing' : ''}`}
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-sm bg-paper-deep font-sans text-base font-bold">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium leading-snug">{e.label}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    {e.category && <CategoryChip categoryId={e.category} link={false} />}
                    {checked && <span className="font-sans text-base font-bold tabular-nums">{e.date}</span>}
                  </div>
                </div>
                {!checked && (
                  <div className="flex shrink-0 flex-col gap-1">
                    <button type="button" className="btn-ghost !min-h-0 !px-2 !py-0.5" onClick={() => move(i, i - 1)} disabled={i === 0} aria-label={`Move “${e.label}” earlier`}>
                      ↑
                    </button>
                    <button type="button" className="btn-ghost !min-h-0 !px-2 !py-0.5" onClick={() => move(i, i + 1)} disabled={i === list.length - 1} aria-label={`Move “${e.label}” later`}>
                      ↓
                    </button>
                  </div>
                )}
              </li>
            )
          })}
        </ol>
        <p className="eyebrow mt-2">Latest</p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {!checked ? (
            <button type="button" className="btn-primary" onClick={() => setChecked(true)}>
              Check order
            </button>
          ) : (
            <>
              <p className="font-sans text-xl font-bold">
                {results.filter((r) => r.correct).length} / {list.length} in the right place
              </p>
              <button type="button" className="btn-primary" onClick={() => setSummary(true)}>
                See summary →
              </button>
            </>
          )}
          <button type="button" className="btn-ghost" onClick={restart}>
            New set
          </button>
        </div>
        {checked && (
          <div className="rise mt-6 rounded-md border border-ink-line bg-paper/70 p-4">
            <p className="mb-2 font-semibold">Correct order</p>
            <ol className="list-decimal space-y-1 pl-5 text-sm">
              {correctOrder.map((e) => (
                <li key={e.key}>
                  <span className="font-semibold tabular-nums">{e.date}</span>: {e.label}
                </li>
              ))}
            </ol>
            <Link to="/learn/timeline" className="mt-3 inline-block text-sm font-semibold text-celadon-deep hover:underline">
              Study the full timeline →
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
