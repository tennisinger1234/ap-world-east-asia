import { Link } from 'react-router-dom'

const noteId = (n) => `note-${n}`
const refId = (n) => `ref-${n}`

export function flashElement(el) {
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  el.classList.add('flash')
  setTimeout(() => el.classList.remove('flash'), 1800)
}

// Superscript footnote marker. Uses scrollIntoView instead of #anchors so it works with HashRouter.
export function Fn({ n }) {
  if (!n) return null
  return (
    <button
      type="button"
      id={refId(n)}
      className="fn rounded"
      aria-label={`Footnote ${n}`}
      onClick={() => flashElement(document.getElementById(noteId(n)))}
    >
      {n}
    </button>
  )
}

// Renders "*emphasis*" inside note text as italics (for titles of books and websites).
export function NoteText({ text }) {
  const parts = text.split(/(\*[^*]+\*)/g)
  return parts.map((p, i) =>
    p.startsWith('*') && p.endsWith('*') ? <em key={i}>{p.slice(1, -1)}</em> : <span key={i}>{p}</span>,
  )
}

export function NotesSection({ notes }) {
  if (!notes?.length) return null
  return (
    <section aria-labelledby="notes-heading" className="mt-14 border-t border-ink-line pt-6">
      <h2 id="notes-heading" className="mb-4 text-2xl">
        Notes
      </h2>
      <ol className="space-y-2 text-sm leading-relaxed">
        {notes.map(({ n, parts }) => (
          <li key={n} id={noteId(n)} className="flex gap-3 rounded-md px-2 py-1 transition">
            <button
              type="button"
              className="w-6 shrink-0 self-start text-right font-semibold text-seal hover:underline"
              onClick={() => flashElement(document.getElementById(refId(n)))}
              aria-label={`Back to reference ${n}`}
            >
              {n}.
            </button>
            <span className="muted min-w-0 [overflow-wrap:anywhere]">
              {parts.map((p, i) => (
                <span key={p.sourceId}>
                  <NoteText text={p.text} />
                  <Link
                    to={`/sources?src=${encodeURIComponent(p.sourceId)}`}
                    className="ml-1 whitespace-nowrap text-xs font-semibold text-celadon-deep hover:underline"
                    title="Show in bibliography"
                  >
                    [bib]
                  </Link>
                  {i < parts.length - 1 ? '; ' : '.'}
                </span>
              ))}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
