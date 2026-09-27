import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CONNECTION_TYPES, buildNotes, chains, contextItems, continuityChange, getItem, items } from '../lib/content'
import { useFocusParam } from '../lib/useFocusParam'
import ItemCard from '../components/ItemCard'
import { Fn, NotesSection } from '../components/Notes'
import { CategoryChip, ConnectionChip, NextSteps, PageHeader } from '../components/ui'

export default function Connections() {
  const [type, setType] = useState('cause/effect')
  useFocusParam()

  // Footnote order on this page: chain steps, table rows, then Yuan/Ming context cards.
  const chainCitations = chains.flatMap((c) => c.steps.map((s) => (s.sourceIds ? s : getItem(s.itemId))))
  const rowCitations = continuityChange
  const { numbers, notes } = buildNotes([...chainCitations, ...rowCitations, ...contextItems])
  let k = 0
  const typed = items.filter((i) => i.connectionType === type && i.focus !== 'context')

  return (
    <>
      <PageHeader eyebrow="Historical thinking skills" title="Connections">
        Causation and continuity/change over time: how Song developments caused one another, and what the Yuan and Ming kept
        or changed after 1279.
      </PageHeader>

      <nav aria-label="On this page" className="-mt-4 mb-10 flex flex-wrap gap-2 text-sm">
        {[
          ['chains', 'Cause → effect'],
          ['ccot', 'Continuity vs. change'],
          ['after', 'After the Song'],
          ['bytype', 'By connection type'],
        ].map(([id, label]) => (
          <button key={id} type="button" className="btn-ghost !min-h-0 !py-1" onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}>
            {label}
          </button>
        ))}
      </nav>

      <section id="chains" aria-labelledby="chains-heading" className="mb-16 scroll-mt-24">
        <h2 id="chains-heading" className="mb-6 text-3xl">Cause → effect chains</h2>
        <div className="space-y-8">
          {chains.map((c, ci) => (
            <article key={c.id} id={c.id} className="scroll unroll px-5 py-7 transition sm:px-7" style={{ '--d': `${ci * 60}ms` }}>
              <h3 className="text-2xl">{c.title}</h3>
              {c.theme && <p className="faint mb-4 text-sm">{c.theme}</p>}
              <ol className="flex flex-col gap-2 lg:flex-row lg:items-stretch">
                {c.steps.map((s, i) => {
                  const n = numbers[k++]
                  const item = s.itemId ? getItem(s.itemId) : null
                  return (
                    <li key={i} className="flex flex-col gap-2 lg:flex-1 lg:flex-row lg:items-center">
                      <div className="flex-1 rounded-md border border-ink-line bg-paper/60 p-3 text-sm leading-relaxed">
                        {s.label && <span className="eyebrow block">{s.label}</span>}
                        {s.text}
                        <Fn n={n} />
                        {item && (
                          <Link to={`/learn/${item.category}?focus=${item.id}`} className="mt-1 block text-xs font-semibold text-celadon-deep hover:underline">
                            {item.title} →
                          </Link>
                        )}
                      </div>
                      {i < c.steps.length - 1 && (
                        <span aria-hidden="true" className="self-center font-display text-2xl text-seal lg:px-1">
                          <span className="lg:hidden">↓</span>
                          <span className="hidden lg:inline">→</span>
                        </span>
                      )}
                    </li>
                  )
                })}
              </ol>
            </article>
          ))}
        </div>
      </section>

      <section id="ccot" aria-labelledby="ccot-heading" className="mb-16 scroll-mt-24">
        <h2 id="ccot-heading" className="mb-2 text-3xl">Continuity vs. change: Song → Yuan → Ming</h2>
        <p className="muted mb-6">Start from the Song column, then read across: what the Mongols changed, and what the Ming restored or kept.</p>
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-ink-line">
                {['Theme', 'Song (960–1279)', 'Yuan (1271–1368)', 'Ming (1368– )', 'Verdict'].map((h, i) => (
                  <th key={h} scope="col" className={`p-3 font-display text-lg font-semibold ${i === 1 ? 'bg-seal-wash/60' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {continuityChange.map((r) => {
                const n = numbers[k++]
                return (
                  <tr key={r.id} id={r.id} className="border-b border-ink-line/70 align-top transition last:border-0">
                    <th scope="row" className="p-3 font-semibold">
                      {r.theme}
                      <Fn n={n} />
                    </th>
                    <td className="bg-seal-wash/30 p-3 leading-relaxed">{r.song}</td>
                    <td className="p-3 leading-relaxed">{r.yuan}</td>
                    <td className="p-3 leading-relaxed">{r.ming}</td>
                    <td className="p-3">
                      <ConnectionChip type={r.verdict} />
                      {r.verdictNote && <p className="muted mt-1 text-xs">{r.verdictNote}</p>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section id="after" aria-labelledby="after-heading" className="mb-16 scroll-mt-24">
        <p className="eyebrow mb-1">Context</p>
        <h2 id="after-heading" className="mb-2 text-3xl">After the Song: Yuan and Ming</h2>
        <p className="muted mb-6 max-w-2xl">Short context items to set the Song against what followed.</p>
        <div className="grid gap-7 md:grid-cols-2">
          {contextItems.map((item, i) => (
            <ItemCard key={item.id} item={item} fn={numbers[k + i]} index={i} showCategory />
          ))}
        </div>
      </section>

      <section id="bytype" aria-labelledby="bytype-heading" className="scroll-mt-24">
        <h2 id="bytype-heading" className="mb-4 text-3xl">Song and East Asian developments by connection type</h2>
        <div className="mb-5 flex flex-wrap gap-2" role="tablist">
          {CONNECTION_TYPES.map((t) => (
            <button key={t} type="button" role="tab" aria-selected={type === t} onClick={() => setType(t)} className={type === t ? 'btn-primary' : 'btn-ghost'}>
              {t === 'cause/effect' ? 'Cause/effect' : t[0].toUpperCase() + t.slice(1)} (
              {items.filter((i) => i.connectionType === t && i.focus !== 'context').length})
            </button>
          ))}
        </div>
        <ul className="grid gap-3 md:grid-cols-2">
          {typed.map((i) => (
            <li key={i.id} className="card p-4">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <CategoryChip categoryId={i.category} />
                <span className="faint text-xs">{i.date}</span>
              </div>
              <Link to={`/learn/${i.category}?focus=${i.id}`} className="font-semibold hover:underline">
                {i.title}
              </Link>
              <p className="muted mt-1 text-sm leading-relaxed">{i.globalConnection}</p>
            </li>
          ))}
        </ul>
      </section>

      <NotesSection notes={notes} />
      <NextSteps
        links={[
          { to: '/practice/ccot', label: 'Practice: continuity or change? →' },
          { to: '/practice/saq', label: 'Try an SAQ' },
          { to: '/', label: 'Back to Learn' },
        ]}
      />
    </>
  )
}
