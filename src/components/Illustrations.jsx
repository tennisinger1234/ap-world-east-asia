// Original cartoon icons in the mascot's style: rounded shapes, dark outlines, soft Song-inspired colors.
const INK = '#2a2723'
const PAPER = '#fbf3df'
const CELADON = '#8fb8a8'
const CELADON_DEEP = '#4f7f71'
const SEAL = '#b3261e'
const WOOD = '#a0704a'
const GOLD = '#e0a93b'
const SKIN = '#f7dcc4'
const S = { stroke: INK, strokeWidth: 2.4, strokeLinejoin: 'round', strokeLinecap: 'round' }

/** Political: an official's seal with a knob handle, and its red imprint. */
function SealIcon() {
  return (
    <>
      <rect x="30" y="34" width="22" height="18" rx="2" fill={SEAL} opacity=".9" {...S} strokeWidth="2" />
      <path d="M35 39h12M35 43h12M35 47h8" stroke={PAPER} strokeWidth="2" strokeLinecap="round" />
      <path d="M12 44 h20 v8 a2 2 0 0 1 -2 2 h-16 a2 2 0 0 1 -2 -2 Z" fill={SEAL} {...S} />
      <rect x="13" y="30" width="18" height="14" rx="2" fill={CELADON} {...S} />
      <path d="M16 30 C16 18 28 18 28 30 Z" fill={GOLD} {...S} />
      <circle cx="22" cy="23" r="2.2" fill={INK} />
    </>
  )
}

/** Intellectual: an open book with lines of text. */
function BookIcon() {
  return (
    <>
      <path d="M32 18 C24 13 14 13 8 15 V46 C14 44 24 44 32 49 Z" fill={PAPER} {...S} />
      <path d="M32 18 C40 13 50 13 56 15 V46 C50 44 40 44 32 49 Z" fill={PAPER} {...S} />
      <path d="M13 22 H26 M13 28 H26 M13 34 H24 M38 22 H51 M38 28 H51 M38 34 H47" stroke={INK} strokeWidth="1.8" strokeLinecap="round" opacity=".55" />
      <path d="M6 16 V50 C14 47 24 47 32 52 C40 47 50 47 58 50 V16" fill="none" stroke={CELADON_DEEP} strokeWidth="3" strokeLinecap="round" />
      <rect x="44" y="38" width="6" height="6" rx="1" fill={SEAL} />
    </>
  )
}

/** Religious: a Song brick pagoda (like Kaifeng's Iron Pagoda). */
function PagodaIcon() {
  const roof = (y, w) => `M${32 - w} ${y} Q32 ${y - 7} ${32 + w} ${y} Q${32 + w - 3} ${y + 3} ${32 + w - 6} ${y + 2} H${32 - w + 6} Q${32 - w + 3} ${y + 3} ${32 - w} ${y} Z`
  return (
    <>
      <path d="M32 4 V11" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="32" cy="7" r="2.4" fill={GOLD} {...S} strokeWidth="1.6" />
      <rect x="26" y="15" width="12" height="9" fill="#c98a5a" {...S} />
      <rect x="23" y="27" width="18" height="10" fill="#c98a5a" {...S} />
      <rect x="20" y="40" width="24" height="14" fill="#c98a5a" {...S} />
      <path d="M29 54 V47 a3 3 0 0 1 6 0 V54" fill={INK} />
      <path d={roof(15, 11)} fill={CELADON_DEEP} {...S} />
      <path d={roof(27, 14)} fill={CELADON_DEEP} {...S} />
      <path d={roof(40, 17)} fill={CELADON_DEEP} {...S} />
      <path d="M14 56 H50" {...S} />
    </>
  )
}

/** Artistic: a celadon meiping vase with a brush. */
function VaseIcon() {
  return (
    <>
      <path d="M27 9 H37 V13 C46 17 48 27 45 38 C43 46 39 52 37 55 H27 C25 52 21 46 19 38 C16 27 18 17 27 13 Z" fill={CELADON} {...S} />
      <path d="M24 22 C22 30 23 38 26 45" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".6" fill="none" />
      <path d="M30 30 q4 -4 8 0 q-4 4 -8 0 Z" fill="#fff" opacity=".8" />
      <path d="M47 16 L57 6" stroke={WOOD} strokeWidth="4" strokeLinecap="round" />
      <path d="M47 16 L43 22 Q41 25 44 24 L49 19 Z" fill={INK} />
    </>
  )
}

/** Technological: a compass with a floating needle. */
function CompassIcon() {
  return (
    <>
      <circle cx="32" cy="32" r="23" fill={WOOD} {...S} />
      <circle cx="32" cy="32" r="16" fill={PAPER} {...S} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <line key={a} x1="32" y1="18" x2="32" y2="21" stroke={INK} strokeWidth="2" strokeLinecap="round" transform={`rotate(${a} 32 32)`} />
      ))}
      <path d="M32 21 L35 32 L32 43 L29 32 Z" fill={SEAL} {...S} strokeWidth="1.8" />
      <path d="M32 32 L35 32 L32 43 L29 32 Z" fill={INK} />
      <circle cx="32" cy="32" r="2.2" fill={GOLD} {...S} strokeWidth="1.4" />
    </>
  )
}

/** Economic: a Song ocean-going junk with battened sails. */
function JunkIcon() {
  return (
    <>
      <path d="M22 12 V40 M40 16 V40" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M22 12 Q12 20 13 38 H22 Z" fill={CELADON} {...S} />
      <path d="M40 16 Q31 24 32 38 H40 Z" fill={CELADON} {...S} />
      <path d="M15 20 H22 M13.5 26 H22 M13 32 H22 M34 24 H40 M32.5 30 H40" stroke={INK} strokeWidth="1.6" opacity=".6" />
      <path d="M6 40 H58 L52 50 H12 Z" fill={WOOD} {...S} />
      <circle cx="18" cy="45" r="1.8" fill={INK} />
      <circle cx="30" cy="45" r="1.8" fill={INK} />
      <circle cx="42" cy="45" r="1.8" fill={INK} />
      <path d="M4 56 q5 -4 10 0 t10 0 t10 0 t10 0 t10 0 t10 0" fill="none" stroke={CELADON_DEEP} strokeWidth="2.4" strokeLinecap="round" />
    </>
  )
}

/** Social: a Song family, parents and a child. */
function FamilyIcon() {
  const head = (cx, cy, r, hat) => (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={SKIN} {...S} />
      {hat === 'futou' && <path d={`M${cx - r} ${cy - 2} C${cx - r} ${cy - r - 5} ${cx + r} ${cy - r - 5} ${cx + r} ${cy - 2} Z M${cx - r - 6} ${cy - 4} H${cx + r + 6}`} fill={INK} stroke={INK} strokeWidth="2.4" strokeLinecap="round" />}
      {hat === 'bun' && <circle cx={cx} cy={cy - r - 2} r={r * 0.45} fill={INK} />}
      {hat === 'tuft' && <path d={`M${cx - 3} ${cy - r} q3 -6 6 0`} fill={INK} stroke={INK} strokeWidth="2" />}
      <circle cx={cx - r * 0.35} cy={cy} r="1.3" fill={INK} />
      <circle cx={cx + r * 0.35} cy={cy} r="1.3" fill={INK} />
      <ellipse cx={cx - r * 0.55} cy={cy + r * 0.35} rx="2" ry="1.2" fill="#f2a6a0" />
      <ellipse cx={cx + r * 0.55} cy={cy + r * 0.35} rx="2" ry="1.2" fill="#f2a6a0" />
    </g>
  )
  return (
    <>
      <path d="M6 56 C6 40 12 34 18 34 C24 34 30 40 30 56 Z" fill={CELADON} {...S} />
      <path d="M34 56 C34 40 40 34 46 34 C52 34 58 40 58 56 Z" fill="#e8b4a0" {...S} />
      <path d="M24 57 C24 48 28 44 32 44 C36 44 40 48 40 57 Z" fill={GOLD} {...S} />
      {head(18, 25, 8, 'futou')}
      {head(46, 25, 8, 'bun')}
      {head(32, 38, 6, 'tuft')}
    </>
  )
}

const ICONS = {
  political: SealIcon,
  intellectual: BookIcon,
  religious: PagodaIcon,
  artistic: VaseIcon,
  technological: CompassIcon,
  economic: JunkIcon,
  social: FamilyIcon,
}

const ICON_LABEL = {
  political: 'an official seal',
  intellectual: 'an open book',
  religious: 'a pagoda',
  artistic: 'a celadon vase and brush',
  technological: 'a compass',
  economic: 'a junk ship',
  social: 'a family',
}

export function CategoryIcon({ id, size = 48, className = '', decorative = true }) {
  const Icon = ICONS[id]
  if (!Icon) return null
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative ? 'true' : undefined}
      aria-label={decorative ? undefined : ICON_LABEL[id]}
    >
      <Icon />
    </svg>
  )
}

/** Auspicious cloud (xiangyun), a scrolling cloud motif common in Song decorative arts. */
export function Cloud({ className = '', flip = false }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 50" className={className} style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      <path
        d="M10 40 H100 C112 40 114 26 104 23 C104 12 90 8 83 15 C80 4 62 2 56 13 C48 6 34 10 36 21 C26 17 16 24 20 31 C12 30 6 36 10 40 Z"
        fill="rgb(var(--paper-card))"
        stroke="rgb(var(--celadon))"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path d="M62 24 a6 6 0 1 1 6 6 a3 3 0 1 1 -2 -4" fill="none" stroke="rgb(var(--celadon))" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M38 30 a5 5 0 1 0 -5 -5" fill="none" stroke="rgb(var(--celadon))" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M92 30 a4 4 0 1 1 4 -4" fill="none" stroke="rgb(var(--celadon))" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

/** Line icons for the tab bar (24px, currentColor). */
export function TabIcon({ name, className = 'h-6 w-6' }) {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round' }
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      {name === 'home' && (
        <>
          <path {...p} d="M2.5 10.5 Q12 3 21.5 10.5 M4.5 9.5 Q3.8 11 3 11.3 M19.5 9.5 Q20.2 11 21 11.3" />
          <path {...p} d="M5.5 10 V20 H18.5 V10" />
          <path {...p} d="M10 20 V15 H14 V20" />
        </>
      )}
      {name === 'learn' && (
        <>
          <path {...p} d="M12 6 C9 4 5 4 3 5 V19 C5 18 9 18 12 20 C15 18 19 18 21 19 V5 C19 4 15 4 12 6 Z" />
          <path {...p} d="M12 6 V20" />
        </>
      )}
      {name === 'practice' && (
        <>
          <path {...p} d="M15 3.5 L20.5 9 L10 19.5 L4.5 20 L5 14.5 Z" />
          <path {...p} d="M13 5.5 L18.5 11" />
        </>
      )}
      {name === 'connections' && (
        <>
          <circle {...p} cx="6" cy="6" r="2.6" />
          <circle {...p} cx="18" cy="12" r="2.6" />
          <circle {...p} cx="6" cy="18" r="2.6" />
          <path {...p} d="M8.4 7.2 L15.6 10.8 M8.4 16.8 L15.6 13.2" />
        </>
      )}
      {name === 'sources' && (
        <>
          <path {...p} d="M6 4 H17 a2 2 0 0 1 2 2 V18 a2 2 0 0 0 2 2 H8 a2 2 0 0 1 -2 -2 Z" />
          <path {...p} d="M3 6 a2 2 0 0 1 3 -2 M9.5 9 H15.5 M9.5 12.5 H15.5 M9.5 16 H13" />
        </>
      )}
    </svg>
  )
}
