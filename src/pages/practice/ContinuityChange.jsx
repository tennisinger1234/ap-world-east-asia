import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getItem, practice, questionCategory, shuffle } from '../../lib/content'
import { Meter, PracticeTabs, QuestionMascot, ScoreSummary } from '../../components/practice'
import { CategoryChip, PageHeader } from '../../components/ui'

const OPTIONS = [
  { id: 'continuity', label: 'Continuity', hint: 'Something that stayed the same', cls: 'bg-celadon-wash text-celadon-deep border-celadon-deep' },
  { id: 'change', label: 'Change', hint: 'Something that broke from the past', cls: 'bg-ochre-wash text-ochre border-ochre' },
]

export default function ContinuityChange() {
  const [deck, setDeck] = useState(() => shuffle(practice.ccot))
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState(null)
  const [results, setResults] = useState([])

  const restart = () => {
    setDeck(shuffle(practice.ccot))
    setIndex(0)
    setPicked(null)
    setResults([])
  }

  const q = deck[index]
  const done = index >= deck.length

  const choose = (id) => {
    if (picked) return
    setPicked(id)
    setResults((r) => [...r, { correct: id === q.answer, category: questionCategory(q.itemIds) }])
  }

  return (
    <>
      <PracticeTabs />
      <PageHeader eyebrow="Practice · Continuity or change?" title="What does it show?">
        For each example, decide whether it shows <strong>continuity</strong> (something persisting from the Song) or{' '}
        <strong>change</strong> (a break from what came before).
      </PageHeader>

      {done ? (
        <ScoreSummary mode="ccot" results={results} onRestart={restart} restartLabel="Shuffle and try again" />
      ) : (
        <div className="mx-auto max-w-2xl">
          <Meter value={index} total={deck.length} label={`Example ${index + 1} of ${deck.length}`} />
          <QuestionMascot state={!picked ? 'idle' : picked === q.answer ? 'correct' : 'wrong'} />
          <article key={q.id} className="scroll unroll px-6 py-8 sm:px-9">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              {questionCategory(q.itemIds) && <CategoryChip categoryId={questionCategory(q.itemIds)} link={false} />}
            </div>
            <p className="font-display text-3xl leading-snug">{q.text}</p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {OPTIONS.map((o) => {
                const isAnswer = picked && o.id === q.answer
                const isWrong = picked === o.id && o.id !== q.answer
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => choose(o.id)}
                    disabled={!!picked}
                    className={`rounded-md border-2 p-4 text-left transition ${
                      isAnswer ? o.cls : isWrong ? 'border-seal bg-seal-wash' : picked ? 'border-ink-line opacity-50' : 'border-ink-line bg-paper-card hover:border-ink'
                    }`}
                  >
                    <span className="block font-display text-2xl font-bold">{o.label}</span>
                    <span className="muted block text-xs">{o.hint}</span>
                  </button>
                )
              })}
            </div>

            {picked && (
              <div className="rise mt-5 rounded-md border border-ink-line bg-paper/70 p-4" aria-live="polite">
                <p className={`font-display text-xl font-bold ${picked === q.answer ? 'text-celadon-deep' : 'text-seal'}`}>
                  {picked === q.answer ? 'Correct.' : `It's ${q.answer}.`}
                </p>
                <p className="mt-1 leading-relaxed">{q.explanation}</p>
                <p className="mt-2 text-sm">
                  Review:{' '}
                  {q.itemIds
                    .map(getItem)
                    .filter(Boolean)
                    .map((it, i, arr) => (
                      <span key={it.id}>
                        <Link to={`/learn/${it.category}?focus=${it.id}`} className="font-semibold text-celadon-deep hover:underline">
                          {it.title}
                        </Link>
                        {i < arr.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                </p>
                <button type="button" className="btn-primary mt-4" onClick={() => { setPicked(null); setIndex((i) => i + 1) }}>
                  {index + 1 < deck.length ? 'Next example →' : 'See summary'}
                </button>
              </div>
            )}
          </article>
          <p className="mt-4 text-center text-sm">
            <Link to="/connections?focus=ccot" className="font-semibold text-celadon-deep hover:underline">
              Study the continuity vs. change table →
            </Link>
          </p>
        </div>
      )}
    </>
  )
}
