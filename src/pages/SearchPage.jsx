import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { search } from '../lib/content'
import { NextSteps, PageHeader } from '../components/ui'
import { EmptyState } from '../components/Loading'

export default function SearchPage() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const [draft, setDraft] = useState(q)
  const results = search(q)

  return (
    <>
      <PageHeader eyebrow="Search" title={q ? `Results for “${q}”` : 'Search the guide'} />
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setParams(draft.trim() ? { q: draft.trim() } : {})
        }}
        className="mb-8 flex max-w-xl gap-2"
        role="search"
      >
        <label htmlFor="q" className="sr-only">Search term</label>
        <input id="q" type="search" value={draft} onChange={(e) => setDraft(e.target.value)} className="field flex-1" placeholder="e.g. Zhu Xi, Champa rice, Hangzhou" />
        <button type="submit" className="btn-primary">Search</button>
      </form>

      {q && (
        <p className="muted mb-4 text-sm">
          {results.length} {results.length === 1 ? 'match' : 'matches'}
        </p>
      )}
      <ul className="space-y-3">
        {results.map((r) => (
          <li key={r.key}>
            <Link to={r.href} className="card block p-4 transition hover:border-ink">
              <span className="block text-[0.65rem] font-semibold uppercase tracking-wider text-seal">{r.kind}</span>
              <span className="block font-display text-xl font-semibold">{r.title}</span>
              <span className="faint block text-xs">{r.detail}</span>
              {r.snippet && <span className="muted mt-1 block text-sm">{r.snippet}</span>}
            </Link>
          </li>
        ))}
      </ul>
      {q && results.length === 0 && (
        <EmptyState pose="think" title={`Nothing found for “${q}”`}>
          Try a shorter term, such as “exam”, “rice”, or “Hangzhou”.
        </EmptyState>
      )}
      {!q && (
        <EmptyState pose="read" title="What would you like to find?">
          Search names, places, and terms: Zhu Xi, Champa rice, Kaifeng, Zen…
        </EmptyState>
      )}

      <NextSteps links={[{ to: '/', label: 'Back to Learn →' }, { to: '/practice', label: 'Practice' }]} />
    </>
  )
}
