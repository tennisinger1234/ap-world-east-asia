import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getItem, practice, questionCategory } from '../../lib/content'
import { markSaqDone } from '../../lib/progress'
import { PracticeTabs, QuestionMascot, ScoreSummary, Stimulus } from '../../components/practice'
import { PageHeader } from '../../components/ui'

const prompts = practice.saq

export default function SAQ() {
  const [pi, setPi] = useState(0)
  const [answers, setAnswers] = useState({})
  const [revealed, setRevealed] = useState(false)
  const [marks, setMarks] = useState({})
  const [finished, setFinished] = useState(false)
  const s = prompts[pi]

  const choose = (i) => {
    setPi(i)
    setAnswers({})
    setRevealed(false)
    setMarks({})
    setFinished(false)
  }

  const allMarked = s.parts.every((p) => marks[p.label] !== undefined)
  const results = s.parts.map((p) => ({ correct: marks[p.label] === true, category: questionCategory(p.itemIds) }))

  return (
    <>
      <PracticeTabs />
      <PageHeader eyebrow="Practice · Short answer" title="SAQ practice">
        Write a short answer for each part: answer the question directly, then support it with specific evidence. When you're
        done, reveal the model answer points and score yourself.
      </PageHeader>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <label htmlFor="saq-pick" className="text-sm font-semibold">
          Prompt
        </label>
        <select id="saq-pick" value={pi} onChange={(e) => choose(Number(e.target.value))} className="field !rounded-full">
          {prompts.map((p, i) => (
            <option key={p.id} value={i}>
              {i + 1}. {p.title}
            </option>
          ))}
        </select>
      </div>

      {finished ? (
        <ScoreSummary mode="saq" results={results} onRestart={() => choose((pi + 1) % prompts.length)} restartLabel="Next prompt →" />
      ) : (
        <article key={s.id} className="scroll unroll mx-auto max-w-3xl px-5 py-8 sm:px-9">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-3xl">{s.title}</h2>
          </div>
          <Stimulus stimulus={s.stimulus} />
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
            <p className="muted text-sm">Answer (a), (b), and (c).</p>
            <QuestionMascot size={72} state={!revealed ? 'idle' : allMarked ? (results.every((r) => r.correct) ? 'correct' : 'wrong') : 'idle'} />
          </div>

          <ol className="space-y-6">
            {s.parts.map((p) => (
              <li key={p.label}>
                <label htmlFor={`saq-${p.label}`} className="block font-medium leading-relaxed">
                  <span className="font-display text-xl font-bold text-seal">({p.label})</span> {p.prompt}
                </label>
                <textarea
                  id={`saq-${p.label}`}
                  rows={3}
                  value={answers[p.label] ?? ''}
                  onChange={(e) => setAnswers((a) => ({ ...a, [p.label]: e.target.value }))}
                  className="field mt-2 w-full resize-y leading-relaxed"
                  placeholder="Write 1–3 sentences…"
                />
                {revealed && (
                  <div className="rise mt-3 rounded-md border border-celadon/60 bg-celadon-wash/50 p-4">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-celadon-deep">Model answer points (any ONE earns the point)</p>
                    <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed">
                      {p.points.map((pt) => (
                        <li key={pt}>{pt}</li>
                      ))}
                    </ul>
                    <p className="mt-2 text-xs">
                      Review:{' '}
                      {p.itemIds
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
                    <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label={`Did part ${p.label} earn the point?`}>
                      <span className="text-sm font-semibold">Did your answer earn the point?</span>
                      <button type="button" onClick={() => setMarks((m) => ({ ...m, [p.label]: true }))} className={marks[p.label] === true ? 'btn-primary !min-h-0 !py-1' : 'btn-ghost !min-h-0 !py-1'} aria-pressed={marks[p.label] === true}>
                        Yes
                      </button>
                      <button type="button" onClick={() => setMarks((m) => ({ ...m, [p.label]: false }))} className={marks[p.label] === false ? 'btn-seal !min-h-0 !py-1' : 'btn-ghost !min-h-0 !py-1'} aria-pressed={marks[p.label] === false}>
                        Not yet
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ol>

          <div className="mt-8 flex flex-wrap gap-3">
            {!revealed ? (
              <button type="button" className="btn-primary" onClick={() => setRevealed(true)}>
                Show model answer points
              </button>
            ) : (
              <button type="button" className="btn-primary" disabled={!allMarked} onClick={() => { markSaqDone(s.id); setFinished(true) }}>
                {allMarked ? 'See my score' : 'Score each part to finish'}
              </button>
            )}
            <button type="button" className="btn-ghost" onClick={() => choose((pi + 1) % prompts.length)}>
              Skip to next prompt
            </button>
          </div>
        </article>
      )}
    </>
  )
}
