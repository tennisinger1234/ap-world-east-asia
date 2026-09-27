import { Link } from 'react-router-dom'
import { getSource } from '../lib/content'
import { NoteText } from './Notes'

// Local copies of the openly licensed images (src/assets/photos), keyed by file name.
const FILES = import.meta.glob('../assets/photos/*.jpg', { eager: true, import: 'default' })
const urlFor = (file) => FILES[`../assets/photos/${file}`]

/** A historical photo with a caption (what it is) and its Chicago-style credit line. */
export default function Photo({ photo, className = '', compact = false }) {
  const src = urlFor(photo.file)
  const credit = getSource(photo.sourceId)
  return (
    <figure id={photo.id} className={`overflow-hidden rounded-xl border border-ink-line bg-paper-deep/60 ${className}`}>
      {src ? (
        <div className="flex items-center justify-center bg-paper-deep/80">
          <img
            src={src}
            alt={photo.alt}
            loading="lazy"
            decoding="async"
            className={`w-full object-contain ${compact ? 'max-h-48' : 'max-h-72'}`}
          />
        </div>
      ) : (
        <PhotoPlaceholder name={photo.file} />
      )}
      <figcaption className="space-y-1 px-3 py-2.5 text-xs leading-relaxed">
        <p className="font-medium text-ink">{photo.caption}</p>
        {credit && (
          <p className="faint [overflow-wrap:anywhere]">
            <span className="font-semibold">Credit: </span>
            <NoteText text={credit.bibliography} />{' '}
            <Link to={`/sources?src=${credit.id}`} className="whitespace-nowrap font-semibold text-celadon-deep hover:underline">
              [bib]
            </Link>
          </p>
        )}
      </figcaption>
    </figure>
  )
}

export function PhotoPlaceholder({ name, url }) {
  return (
    <div className="grid min-h-40 place-items-center border-2 border-dashed border-ink-line p-4 text-center text-xs text-ink-faint">
      <div>
        <p className="font-semibold">Image placeholder</p>
        <p>{name}</p>
        {url && <p className="[overflow-wrap:anywhere]">{url}</p>}
      </div>
    </div>
  )
}
