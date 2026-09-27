import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { bibliography, getItem, imageCredits, items, meta, photos, practice } from '../lib/content'
import { flashElement, NoteText } from '../components/Notes'
import { NextSteps, PageHeader } from '../components/ui'

export default function Sources() {
  const [params] = useSearchParams()
  const target = params.get('src')

  useEffect(() => {
    if (!target) return
    const t = setTimeout(() => flashElement(document.getElementById(`src-${target}`)), 250)
    return () => clearTimeout(t)
  }, [target])

  const usage = (id) => items.filter((i) => i.sourceIds.includes(id)).length
  const questions = practice.mcq.length + practice.saq.length + practice.ccot.length

  return (
    <>
      <PageHeader eyebrow="Chicago Manual of Style, 17th ed." title="Sources">
        {meta.bibliographyNote}
      </PageHeader>

      <div className="mb-8 grid gap-3 sm:grid-cols-2">
        <div className="card p-4">
          <p className="font-sans text-4xl font-bold tracking-tight">{bibliography.length}</p>
          <p className="muted text-sm">sources cited, plus {imageCredits.length} image credits</p>
        </div>
        <div className="card p-4">
          <p className="font-sans text-4xl font-bold tracking-tight">{questions}</p>
          <p className="muted text-sm">practice questions, all tied to cited developments</p>
        </div>
      </div>

      <h2 className="mb-4 text-3xl">Bibliography</h2>
      <ol className="scroll space-y-1 px-4 py-6 sm:px-8">
        {bibliography.map((s) => (
          <li key={s.id} id={`src-${s.id}`} className="rounded-md px-3 py-3 transition">
            <p className="pl-8 -indent-8 leading-relaxed [overflow-wrap:anywhere]">
              <NoteText text={s.bibliography} />
            </p>
            <p className="faint mt-1 pl-8 text-xs">
              Cited by {usage(s.id)} {usage(s.id) === 1 ? 'development' : 'developments'}
            </p>
          </li>
        ))}
      </ol>

      <h2 className="mb-2 mt-12 text-3xl">Image credits</h2>
      <p className="muted mb-4 max-w-3xl text-sm">
        Every photo is public domain or openly licensed (The Met Open Access CC0, or Wikimedia Commons public-domain and Creative
        Commons files) and is stored with the site. The mascot, icons, and decorations are original SVG drawings made for this guide.
      </p>
      <ol className="scroll space-y-1 px-4 py-6 sm:px-8">
        {imageCredits.map((s) => {
          const ph = photos.find((p) => p.sourceId === s.id)
          const item = ph?.itemId ? getItem(ph.itemId) : null
          const where = item ? `/learn/${item.category}?focus=${ph.id}` : ph?.society ? `/learn/neighbors?society=${ph.society}` : null
          return (
            <li key={s.id} id={`src-${s.id}`} className="rounded-md px-3 py-3 transition">
              <p className="pl-8 -indent-8 leading-relaxed [overflow-wrap:anywhere]">
                <NoteText text={s.bibliography} />
              </p>
              {where && (
                <p className="faint mt-1 pl-8 text-xs">
                  <Link to={where} className="font-semibold text-celadon-deep hover:underline">
                    See it on {item ? item.title : 'Japan · Korea · Vietnam'} →
                  </Link>
                </p>
              )}
            </li>
          )
        })}
      </ol>


      <NextSteps
        links={[
          { to: '/', label: 'Back to Learn →' },
          { to: '/practice', label: 'Practice' },
        ]}
      />
    </>
  )
}
