import { useId } from 'react'

/** Layered ink-wash mountains with a red sun. Pure SVG; colours follow the theme tokens. */
export function InkMountains({ className = '', sun = true, tall = false }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox={tall ? '0 0 1200 360' : '0 0 1200 300'}
      preserveAspectRatio="xMidYMax slice"
    >
      <defs>
        <filter id={`brush-${id}`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018 0.06" numOctaves="3" seed="4" />
          <feDisplacementMap in="SourceGraphic" scale="9" />
          <feGaussianBlur stdDeviation="0.7" />
        </filter>
        <linearGradient id={`mist-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgb(var(--paper))" stopOpacity="0" />
          <stop offset="1" stopColor="rgb(var(--paper))" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id={`fade-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgb(var(--ink))" stopOpacity="1" />
          <stop offset="1" stopColor="rgb(var(--ink))" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      <g transform={tall ? 'translate(0 60)' : undefined}>
        {sun && <circle cx="1085" cy="78" r="30" fill="rgb(var(--seal))" opacity="0.78" />}
        <g filter={`url(#brush-${id})`}>
          <path
            d="M0 210 C80 170 140 120 210 150 S330 90 410 130 S540 60 620 120 S760 100 830 140 S960 80 1040 130 S1150 120 1200 140 L1200 300 L0 300Z"
            fill="rgb(var(--celadon))"
            opacity="0.28"
          />
          <path
            d="M0 240 C70 200 120 170 190 200 S290 150 360 190 S470 120 530 175 S640 190 700 210 S820 150 900 190 S1050 170 1200 205 L1200 300 L0 300Z"
            fill={`url(#fade-${id})`}
            opacity="0.16"
          />
          <path
            d="M740 300 C790 240 820 160 872 92 C892 66 912 68 928 94 C958 146 990 206 1062 248 C1112 274 1162 280 1200 284 L1200 300Z"
            fill={`url(#fade-${id})`}
            opacity="0.3"
          />
          <path d="M880 104 C900 150 905 200 896 260" fill="none" stroke="rgb(var(--ink))" strokeWidth="2" opacity="0.18" />
          <path
            d="M0 282 C100 252 200 262 300 272 S480 258 560 276 C600 284 640 290 700 300 L0 300Z"
            fill="rgb(var(--ink))"
            opacity="0.3"
          />
        </g>
        {/* a lone pine on the near hill */}
        <g stroke="rgb(var(--ink))" strokeLinecap="round" opacity="0.55" fill="none">
          <path d="M150 268 C152 250 149 236 153 220" strokeWidth="2.2" />
          <path d="M153 232 l-16 4 M152 244 l18 2 M153 226 l12 -6 M151 238 l-12 -2" strokeWidth="1.6" />
        </g>
        <rect x="0" y="180" width="1200" height="120" fill={`url(#mist-${id})`} />
      </g>
    </svg>
  )
}

/** Red seal-stamp. `text` is a letter or a single character. */
export function SealStamp({ text, size = 44, className = '', title, animate = false }) {
  return (
    <span
      className={`inline-grid shrink-0 place-items-center ${animate ? 'animate-stamp' : '-rotate-[4deg]'} ${className}`}
      style={{ width: size, height: size }}
      title={title}
      aria-hidden={title ? undefined : 'true'}
    >
      <svg viewBox="0 0 48 48" width={size} height={size}>
        <rect x="2" y="2" width="44" height="44" rx="5" fill="rgb(var(--seal))" />
        <rect x="6" y="6" width="36" height="36" rx="2.5" fill="none" stroke="rgb(var(--paper-card))" strokeWidth="1.6" opacity=".9" />
        <text
          x="24"
          y="25"
          dominantBaseline="central"
          textAnchor="middle"
          fontFamily='"Cormorant Garamond", "Songti SC", "Noto Serif", serif'
          fontWeight="700"
          fontSize={text.length > 1 ? 16 : 26}
          fill="rgb(var(--paper-card))"
        >
          {text}
        </text>
      </svg>
    </span>
  )
}

/** A short brush stroke used as a section divider. */
export function BrushDivider({ className = '' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 400 16" className={`h-4 w-48 ${className}`} preserveAspectRatio="none">
      <path
        d="M4 10 C60 4 130 3 200 7 S330 12 396 5"
        fill="none"
        stroke="rgb(var(--celadon))"
        strokeWidth="6"
        strokeLinecap="round"
        opacity=".7"
      />
      <circle cx="394" cy="5" r="3" fill="rgb(var(--seal))" />
    </svg>
  )
}
