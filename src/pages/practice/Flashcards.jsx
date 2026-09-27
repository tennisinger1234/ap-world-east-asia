import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { items, shuffle } from '../../lib/content'
import { markMastered, useProgress } from '../../lib/progress'
import { CategoryFilter, Meter, PracticeTabs, ScoreSummary } from '../../components/practice'
import { CategoryChip, ConnectionChip, PageHeader } from '../../components/ui'

const SCOPES = { song: 'Song China only', all: 'Everything' }

function buildDeck(category, scope) {
  return shuffle(items.filter((i) => (category === 'all' || i.category === category) && (scope === 'all' || i.focus === 'song')))
}

export default function Flashcards() {
  const [category, setCategory] = useState('all')
  const [scope, setScope] = useState('song')
  const [deck, setDeck] = useState(() => buildDeck('all', 'song'))
  const [queue, setQueue] = useState(() => deck.map((c) => c.id))
  const [reviews, setReviews] = useState({})
  const [flipped, setFlipped] = useState(false)

  const byId = useMemo(() => Object.fromEntries(deck.map((c) => [c.id, c])), [deck])
  const card = byId[queue[0]]
  const done = queue.length === 0

  const reset = (cat = category, sc = scope) => {
    const d = buildDeck(cat, sc)
    setCategory(cat)
    setScope(sc)
    setDeck(d)
    setQueue(d.map((c) => c.id))
    setReviews({})
    setFlipped(false)
  }

  const gotIt = useCallback(() => {
    setFlipped(false)
    markMastered(queue[0])
    setQueue((q) => q.slice(1))
  }, [queue])
  const again = useCallback(() => {
    setFlipped(false)
    setReviews((r) => ({ ...r, [queue[0]]: (r[queue[0]] ?? 0) + 1 }))
    setQueue((q) => [...q.slice(1), q[0]])
  }, [queue])

  useEffect(() => {
    const onKey = (e) => {
      if (done || e.target.closest('input, textarea, select')) return
      if (e.key === ' ' || e.key === 'Enter') {
        if (e.target.closest('button')) return
        e.preventDefault()
        setFlipped((f) => !f)
      } else if (e.key === 'ArrowRight' && flipped) gotIt()
      else if (e.key === 'ArrowLeft' && flipped) again()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [done, flipped, gotIt, again])

  const { mastered: masteredAll } = useProgress()
  const results = deck.map((c) => ({ correct: !reviews[c.id], category: c.category }))
  const mastered = deck.length - queue.length
  const reviewPile = queue.filter((id) => reviews[id]).length

  return (
    <>
      <PracticeTabs />
      <PageHeader eyebrow="Practice · Flashcards" title="Flip, then sort">
        Tap a card to flip it. <strong>Got it</strong> takes it out of the deck; <strong>Review again</strong> sends it to the back.
        On a keyboard: Space flips, → got it, ← review again.
      </PageHeader>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <CategoryFilter value={category} onChange={(c) => reset(c)} id="fc-cat" label="Deck" />
        <div className="flex gap-1" role="group" aria-label="Scope">
          {Object.entries(SCOPES).map(([k, label]) => (
            <button key={k} type="button" onClick={() => reset(category, k)} className={scope === k ? 'btn-primary !min-h-0 !py-1.5' : 'btn-ghost !min-h-0 !py-1.5'} aria-pressed={scope === k}>
              {label}
            </button>
          ))}
        </div>
        <button type="button" className="btn-ghost !min-h-0 !py-1.5" onClick={() => reset()}>
          Shuffle &amp; restart
        </button>
      </div>

      {done ? (
        <ScoreSummary mode="flashcards" results={results} onRestart={() => reset()} restartLabel="Shuffle a new deck" />
      ) : (
        <div className="mx-auto max-w-2xl">
          <Meter value={mastered} total={deck.length} label={`Got it: ${mastered} · In review pile: ${reviewPile}`} />
          <p className="faint -mt-2 mb-4 text-xs">{masteredAll.length} of {items.length} developments mastered overall (saved in this browser)</p>

          <div className="[perspective:1600px]">
            <button
              type="button"
              onClick={() => setFlipped((f) => !f)}
              aria-label={flipped ? 'Show front of card' : 'Show back of card'}
              className="relative block min-h-[24rem] w-full text-left transition-transform duration-700 [transform-style:preserve-3d] sm:min-h-[21rem]"
              style={{ transform: flipped ? 'rotateY(180deg)' : 'none' }}
            >
              <div className="scroll absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 py-10 text-center [backface-visibility:hidden]">
                <CategoryChip categoryId={card.category} link={false} />
                <h2 className="text-3xl leading-tight sm:text-4xl">{card.title}</h2>
                <p className="faint font-medium">{card.date}</p>
                {reviews[card.id] > 0 && <span className="chip bg-ochre-wash text-ochre">Reviewing again</span>}
                <p className="faint mt-3 text-xs uppercase tracking-[0.2em]">Tap to reveal</p>
              </div>
              <div className="scroll absolute inset-0 flex flex-col gap-3 overflow-y-auto px-6 py-8 [backface-visibility:hidden] [transform:rotateY(180deg)] sm:px-8">
                <div className="flex flex-wrap gap-2">
                  <ConnectionChip type={card.connectionType} />
                </div>
                <p className="leading-relaxed">{card.summary}</p>
                <p className="mt-auto border-l-2 border-celadon bg-celadon-wash/50 px-3 py-2 text-sm leading-relaxed">
                  <span className="font-semibold text-celadon-deep">Global connection: </span>
                  {card.globalConnection}
                </p>
              </div>
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button type="button" className="btn-ghost" onClick={again} disabled={!flipped}>
              ↺ Review again
            </button>
            <button type="button" className="btn-primary" onClick={gotIt} disabled={!flipped}>
              ✓ Got it
            </button>
          </div>
          {!flipped && <p className="faint mt-2 text-center text-xs">Flip the card first, then sort it.</p>}
          <p className="mt-4 text-center text-sm">
            <Link to={`/learn/${card.category}?focus=${card.id}`} className="font-semibold text-celadon-deep hover:underline">
              Open this development in Learn →
            </Link>
          </p>
        </div>
      )}
    </>
  )
}
