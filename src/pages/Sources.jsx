import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getItem, items, meta, photos, sourceGroups } from '../lib/content'
import { flashElement, NoteText } from '../components/Notes'
import { NextSteps, PageHeader } from '../components/ui'

function Entry({ s }) {
  const usage = items.filter((i) => i.sourceIds.includes(s.id)).length
  const ph = photos.find((p) => p.sourceId === s.id)
  const item = ph?.itemId ? getItem(ph.itemId) : null
  const where = item ? `/learn/${item.category}?focus=${ph.id}` : ph?.society ? `/learn/neighbors?society=${ph.society}` : null
  return (
    <li id={`src-${s.id}`} className="rounded-md px-3 py-3 transition">
      <p className="pl-8 -indent-8 leading-relaxed [overflow-wrap:anywhere]">
        <NoteText text={s.bibliography} />
      </p>
      <p className="faint mt-1 pl-8 text-xs">
        {where ? (
          <Link to={where} className="font-semibold text-celadon-deep hover:underline">
            See it on {item ? item.title : 'Japan · Korea · Vietnam'} →
          </Link>
        ) : (
          <>
            Cited by {usage} {usage === 1 ? 'development' : 'developments'}
          </>
        )}
      </p>
    </li>
  )
}

export default function Sources() {
  const [params] = useSearchParams()
  const target = params.get('src')

  useEffect(() => {
    if (!target) return
    const t = setTimeout(() => flashElement(document.getElementById(`src-${target}`)), 250)
    return () => clearTimeout(t)
  }, [target])

  return (
    <>
      <PageHeader eyebrow="Chicago Manual of Style, 17th ed." title="Sources">
        {meta.bibliographyNote}
      </PageHeader>

      {sourceGroups.map((g) => (
        <section key={g.title} className="mb-12" aria-labelledby={`h-${g.title}`}>
          <h2 id={`h-${g.title}`} className="mb-1 text-3xl">
            {g.title}
          </h2>
          <p className="muted mb-5 max-w-3xl text-sm">
            {g.title === 'Primary Sources'
              ? 'Texts, artworks, and objects created during the period studied.'
              : 'Later scholarship, course materials, reference works, and modern photographs.'}
          </p>
          {g.parts
            .filter((p) => p.list.length)
            .map((p) => (
              <div key={p.title} className="mb-6">
                <h3 className="mb-2 font-sans text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">{p.title}</h3>
                <ol className="scroll space-y-1 px-4 py-6 sm:px-8">
                  {p.list.map((s) => (
                    <Entry key={s.id} s={s} />
                  ))}
                </ol>
              </div>
            ))}
        </section>
      ))}

      <p className="muted max-w-3xl text-sm">
        Every photo is public domain or openly licensed (The Met Open Access CC0, or Wikimedia Commons public-domain and Creative
        Commons files) and is stored with the site. The mascot, icons, and decorations are original SVG drawings made for this guide.
      </p>

      <NextSteps
        links={[
          { to: '/', label: 'Back to Learn →' },
          { to: '/practice', label: 'Practice' },
        ]}
      />
    </>
  )
}
