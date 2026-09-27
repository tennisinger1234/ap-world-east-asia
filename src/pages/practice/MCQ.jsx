import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getItem, practice, questionCategory, shuffle } from '../../lib/content'
import { recordMcqAnswer } from '../../lib/progress'
import { CategoryFilter, Meter, PracticeTabs, QuestionMascot, ScoreSummary, Stimulus } from '../../components/practice'
import { CategoryChip, PageHeader } from '../../components/ui'

const SET_SIZE = 10
const all = practice.mcq
const counts = all.reduce(
  (acc, q) => {
    const c = questionCategory(q.itemIds)
    acc.all++
    acc[c] = (acc[c] ?? 0) + 1
    return acc
  },
  { all: 0 },
)

// Shuffle answer choices while tracking which one is correct.
const prepare = (qs) => qs.map((q) => ({ ...q, choices: shuffle(q.choices.map((text, i) => ({ text, correct: i === q.answer }))) }))

export default function MCQ() {
  const [category, setCategory] = useState('all')
  const [round, setRound] = useState(0)
  const questions = useMemo(() => {
    const pool = all.filter((q) => category === 'all' || questionCategory(q.itemIds) === category)
    return prepare(shuffle(pool).slice(0, category === 'all' ? SET_SIZE : pool.length))
  }, [category, round])
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState(null)
  const [results, setResults] = useState([])

  const restart = (cat = category) => {
    setCategory(cat)
    setRound((r) => r + 1)
    setIndex(0)
    setPicked(null)
    setResults([])
  }

  const q = questions[index]
  const done = index >= questions.length

  const choose = (i) => {
    if (picked !== null) return
    setPicked(i)
    recordMcqAnswer(q.choices[i].correct)
    setResults((r) => [...r, { correct: q.choices[i].correct, category: questionCategory(q.itemIds) }])
  }

  return (
    <>
      <PracticeTabs />
      <PageHeader eyebrow="Practice · Multiple choice" title="Stimulus-based questions">
        Read the stimulus, choose the best answer, then read the explanation. Sets of {SET_SIZE}, drawn at random.
      </PageHeader>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <CategoryFilter value={category} onChange={restart} counts={counts} id="mcq-cat" />
        <span className="faint text-sm tabular-nums">Score {results.filter((r) => r.correct).length}/{results.length}</span>
      </div>

      {done ? (
        <ScoreSummary mode="mcq" results={results} onRestart={() => restart()} />
      ) : (
        <div className="mx-auto max-w-2xl">
          <Meter value={index} total={questions.length} label={`Question ${index + 1} of ${questions.length}`} />
          <QuestionMascot state={picked === null ? 'idle' : q.choices[picked].correct ? 'correct' : 'wrong'} />
          <article key={q.id} className="scroll unroll px-5 py-7 sm:px-8">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              {questionCategory(q.itemIds) && <CategoryChip categoryId={questionCategory(q.itemIds)} />}
            </div>
            <Stimulus stimulus={q.stimulus} />
            <h2 className="text-2xl leading-snug">{q.question}</h2>
            <ul className="mt-5 space-y-2">
              {q.choices.map((c, i) => {
                const state =
                  picked === null
                    ? 'border-ink-line hover:border-ink bg-paper-card'
                    : c.correct
                      ? 'border-celadon-deep bg-celadon-wash'
                      : picked === i
                        ? 'border-seal bg-seal-wash'
                        : 'border-ink-line opacity-60'
                return (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => choose(i)}
                      disabled={picked !== null}
                      className={`flex w-full items-start gap-3 rounded-md border-2 p-3 text-left transition ${state}`}
                    >
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-sm bg-paper-deep font-display text-sm font-bold">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="leading-relaxed">{c.text}</span>
                      {picked !== null && c.correct && <span className="ml-auto font-bold text-celadon-deep">✓</span>}
                      {picked === i && !c.correct && <span className="ml-auto font-bold text-seal">✗</span>}
                    </button>
                  </li>
                )
              })}
            </ul>

            {picked !== null && (
              <div className="rise mt-5 rounded-md border border-ink-line bg-paper/70 p-4" aria-live="polite">
                <p className={`font-display text-xl font-bold ${q.choices[picked].correct ? 'text-celadon-deep' : 'text-seal'}`}>
                  {q.choices[picked].correct ? 'Correct.' : 'Not quite.'}
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
                  {index + 1 < questions.length ? 'Next question →' : 'See summary'}
                </button>
              </div>
            )}
          </article>
        </div>
      )}
    </>
  )
}
