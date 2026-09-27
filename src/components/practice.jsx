import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { categories, getCategory, getSource } from '../lib/content'
import { recordScore, useProgress } from '../lib/progress'
import { PRACTICE_MODES } from '../pages/practice/modes'
import { SealStamp } from './Decor'
import Mascot from './Mascot'
import { TabRow } from './ui'

export function PracticeTabs() {
  const { pathname } = useLocation()
  const { best } = useProgress()
  return (
    <TabRow
      label="Practice modes"
      tabs={[
        { to: '/practice', label: 'All modes', active: pathname === '/practice' },
        ...PRACTICE_MODES.map((m) => ({
          to: `/practice/${m.id}`,
          label: m.title,
          active: pathname === `/practice/${m.id}`,
          done: !!best[m.id],
        })),
      ]}
    />
  )
}

export function Stimulus({ stimulus }) {
  if (!stimulus) return null
  if (stimulus.type === 'quote') {
    const src = stimulus.sourceIds?.[0]
    return (
      <figure className="mb-5 border-l-4 border-seal bg-paper/70 px-4 py-3">
        <blockquote className="font-display text-xl leading-snug">“{stimulus.text}”</blockquote>
        <figcaption className="faint mt-2 text-xs">
          {stimulus.attribution}
          {src && getSource(src) && (
            <>
              {' · '}
              <Link to={`/sources?src=${src}`} className="font-semibold text-celadon-deep hover:underline">
                source
              </Link>
            </>
          )}
        </figcaption>
      </figure>
    )
  }
  return (
    <div className="mb-5 border-l-4 border-celadon bg-paper/70 px-4 py-3">
      <p className="faint mb-1 text-[0.65rem] font-semibold uppercase tracking-wider">Stimulus</p>
      <p className="leading-relaxed">{stimulus.text}</p>
    </div>
  )
}

export function Meter({ value, total, label }) {
  return (
    <div className="mb-4">
      <div className="mb-1 flex justify-between text-xs font-semibold">
        <span className="muted">{label}</span>
        <span className="tabular-nums text-ink-soft">
          {value} / {total}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-paper-deep">
        <div className="h-full bg-seal transition-all" style={{ width: `${total ? (value / total) * 100 : 0}%` }} />
      </div>
    </div>
  )
}

/**
 * End-of-set summary. `results` is a list of { correct: boolean, category: id|null }.
 * Shows the score, a per-category breakdown, and which categories to review.
 */
export function ScoreSummary({ mode, results, onRestart, restartLabel = 'Try a new set' }) {
  const correct = results.filter((r) => r.correct).length
  const total = results.length
  const pct = total ? Math.round((correct / total) * 100) : 0

  useEffect(() => {
    recordScore(mode, correct, total)
  }, [mode, correct, total])

  const byCat = categories
    .map((c) => {
      const rs = results.filter((r) => r.category === c.id)
      return { cat: c, total: rs.length, correct: rs.filter((r) => r.correct).length }
    })
    .filter((x) => x.total > 0)
  const review = byCat.filter((x) => x.correct < x.total).sort((a, b) => a.correct / a.total - b.correct / b.total)
  const verdict = pct >= 90 ? 'Excellent' : pct >= 70 ? 'Solid' : pct >= 50 ? 'Getting there' : 'Keep studying'

  return (
    <section className="scroll unroll mx-auto max-w-2xl px-6 py-9 text-center sm:px-10" aria-live="polite">
      <div className="relative mx-auto w-fit">
        <Mascot pose={pct >= 70 ? 'cheer' : 'encourage'} size={150} />
        <span className="absolute -right-4 bottom-4">
          <SealStamp text={pct >= 70 ? '優' : '學'} size={46} animate />
        </span>
      </div>
      <p className="eyebrow mt-5">Set complete · {verdict}</p>
      <p className="mt-2 font-sans text-6xl font-bold tabular-nums tracking-tight">
        {correct}
        <span className="text-ink-faint">/{total}</span>
      </p>
      <p className="muted">{pct}% correct</p>

      {byCat.length > 0 && (
        <div className="mt-8 text-left">
          <h3 className="mb-3 text-xl">By category</h3>
          <ul className="space-y-2">
            {byCat.map(({ cat, total: t, correct: c }) => (
              <li key={cat.id} className="flex items-center gap-3 text-sm">
                <span className="w-28 shrink-0 font-medium">{cat.name}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-paper-deep">
                  <span className={`block h-full ${c === t ? 'bg-celadon' : 'bg-seal'}`} style={{ width: `${(c / t) * 100}%` }} />
                </span>
                <span className="w-10 text-right tabular-nums text-ink-soft">
                  {c}/{t}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 rounded-md border border-ink-line bg-paper/70 p-4 text-left">
        {review.length ? (
          <>
            <p className="font-semibold">Review these categories:</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {review.map(({ cat }) => (
                <Link key={cat.id} to={`/learn/${cat.id}`} className="btn-ghost !min-h-0 !py-1.5">
                  {getCategory(cat.id).letter} · {cat.name} →
                </Link>
              ))}
            </div>
          </>
        ) : (
          <p className="font-semibold text-celadon-deep">No weak spots in this set. Try another mode.</p>
        )}
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" className="btn-primary" onClick={onRestart}>
          {restartLabel}
        </button>
        <Link to="/practice" className="btn-ghost">
          Other practice modes
        </Link>
      </div>
    </section>
  )
}

/** Mascot that reacts to the current answer: thinking, then cheering or encouraging. */
export function QuestionMascot({ state, size = 96 }) {
  const pose = state === 'correct' ? 'cheer' : state === 'wrong' ? 'encourage' : 'think'
  const say = { correct: 'Well done!', wrong: 'Keep going, you’ve got this!', idle: 'Hmm, think it through…' }[state ?? 'idle']
  return (
    <div className="flex items-center gap-2" aria-live="polite">
      <Mascot pose={pose} size={size} float={pose !== 'think'} />
      <p className="relative rounded-2xl border border-ink-line bg-paper-card px-3 py-2 text-sm font-medium shadow-paper before:absolute before:-left-1.5 before:top-1/2 before:h-3 before:w-3 before:-translate-y-1/2 before:rotate-45 before:border-b before:border-l before:border-ink-line before:bg-paper-card">
        {say}
      </p>
    </div>
  )
}

export function CategoryFilter({ value, onChange, counts, id = 'cat-filter', label = 'Category' }) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="field !rounded-full">
        <option value="all">All PIRATES{counts ? ` (${counts.all})` : ''}</option>
        {categories
          .filter((c) => !counts || counts[c.id])
          .map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
              {counts ? ` (${counts[c.id]})` : ''}
            </option>
          ))}
      </select>
    </div>
  )
}
