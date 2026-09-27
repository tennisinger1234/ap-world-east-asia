import { Link } from 'react-router-dom'
import { practice } from '../../lib/content'
import { useProgress } from '../../lib/progress'
import { SealStamp } from '../../components/Decor'
import Mascot from '../../components/Mascot'
import { PracticeTabs } from '../../components/practice'
import { NextSteps, PageHeader } from '../../components/ui'
import { PRACTICE_MODES } from './modes'

const COUNTS = {
  mcq: `${practice.mcq.length} questions`,
  saq: `${practice.saq.length} prompts`,
  flashcards: 'Every development',
  sort: '8 per round',
  order: '6 per round',
  ccot: `${practice.ccot.length} examples`,
}

export default function PracticeHub() {
  const { best } = useProgress()
  return (
    <>
      <PracticeTabs />
      <div className="float-right -mt-4 hidden sm:block">
        <Mascot pose="think" size={130} />
      </div>
      <PageHeader eyebrow="Practice" title="Test what you know">
        Six ways to practice Topic 1.1, all built from the study guide's sourced content. Each set ends with a score and a list
        of categories to review.
      </PageHeader>

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PRACTICE_MODES.map((m, i) => (
          <li key={m.id} className="rise" style={{ '--d': `${i * 60}ms` }}>
            <Link to={`/practice/${m.id}`} className="scroll group flex h-full flex-col gap-3 px-5 py-6 transition hover:-translate-y-0.5 hover:shadow-lift">
              <div className="flex items-start justify-between gap-3">
                <SealStamp text={m.glyph} size={46} />
                {best[m.id] && (
                  <span className="chip bg-celadon-wash text-celadon-deep" title="Your best score in this browser">
                    Best {best[m.id].pct}%
                  </span>
                )}
              </div>
              <h2 className="text-2xl group-hover:underline">{m.title}</h2>
              <p className="muted text-sm leading-relaxed">{m.blurb}</p>
              <span className="faint mt-auto text-xs font-semibold">{COUNTS[m.id]} →</span>
            </Link>
          </li>
        ))}
      </ul>

      <NextSteps
        links={[
          { to: '/practice/mcq', label: 'Start with multiple choice →' },
          { to: '/', label: 'Review first (Learn)' },
        ]}
      />
    </>
  )
}
