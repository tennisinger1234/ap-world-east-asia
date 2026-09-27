/**
 * "Xiao Shi" (小士), the study-guide mascot: an original cartoon Song scholar-official.
 * Iconic details come from Song dress: the black futou hat with long straight "wings"
 * and a round-collared official robe with a belt. Drawn as simple rounded SVG shapes.
 *
 * Poses: wave (Home), read (Learn), think (questions), cheer (correct/finished), encourage (wrong answer).
 */
const INK = '#2a2723'
const SKIN = '#f7dcc4'
const ROBE = '#6fa08f'
const ROBE_DARK = '#4f7f71'
const PAPER = '#fbf3df'
const ROD = '#8a5a3b'
const SEAL = '#b3261e'
const BLUSH = '#f2a6a0'
const SW = 3

/** An arm drawn as an outlined sleeve tube ending in a hand. */
function Arm({ d, hand, fist }) {
  return (
    <g>
      <path d={d} fill="none" stroke={INK} strokeWidth="22" strokeLinecap="round" />
      <path d={d} fill="none" stroke={ROBE} strokeWidth="16" strokeLinecap="round" />
      {hand && <circle cx={hand[0]} cy={hand[1]} r={fist ? 8 : 7} fill={SKIN} stroke={INK} strokeWidth={SW} />}
    </g>
  )
}

function RolledScroll({ x, y, tilt = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt})`}>
      <rect x="-6" y="-18" width="12" height="36" rx="6" fill={PAPER} stroke={INK} strokeWidth={SW} />
      <rect x="-8" y="-21" width="16" height="6" rx="3" fill={ROD} stroke={INK} strokeWidth="2" />
      <rect x="-8" y="15" width="16" height="6" rx="3" fill={ROD} stroke={INK} strokeWidth="2" />
      <rect x="-6" y="-2" width="12" height="4" fill={SEAL} />
    </g>
  )
}

function OpenScroll() {
  return (
    <g>
      <rect x="74" y="172" width="92" height="36" rx="3" fill={PAPER} stroke={INK} strokeWidth={SW} />
      {[88, 100, 112, 128, 140, 152].map((x) => (
        <line key={x} x1={x} y1="179" x2={x} y2={x % 3 ? 200 : 194} stroke={INK} strokeWidth="2" strokeLinecap="round" opacity=".55" />
      ))}
      <rect x="124" y="190" width="8" height="8" rx="1.5" fill={SEAL} />
      <rect x="68" y="168" width="9" height="44" rx="4.5" fill={ROD} stroke={INK} strokeWidth="2.5" />
      <rect x="163" y="168" width="9" height="44" rx="4.5" fill={ROD} stroke={INK} strokeWidth="2.5" />
    </g>
  )
}

function Sparkle({ x, y, s = 1, color = '#e0a93b' }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M0 -9 C1.5 -2 2 -1.5 9 0 C2 1.5 1.5 2 0 9 C-1.5 2 -2 1.5 -9 0 C-2 -1.5 -1.5 -2 0 -9 Z"
      fill={color}
      stroke={INK}
      strokeWidth="1.5"
    />
  )
}

function Face({ pose }) {
  const eyes = {
    wave: 'open',
    read: 'down',
    think: 'up',
    cheer: 'happy',
    encourage: 'open',
  }[pose]
  return (
    <g>
      {/* brows */}
      {pose === 'think' ? (
        <>
          <path d="M99 99 Q106 95 113 98" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <path d="M127 96 Q134 92 141 96" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
        </>
      ) : pose === 'encourage' ? (
        <>
          <path d="M99 101 Q106 97 113 100" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <path d="M127 100 Q134 97 141 101" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
        </>
      ) : null}

      {/* eyes */}
      {eyes === 'open' && (
        <>
          <ellipse cx="106" cy="113" rx="4.6" ry="5.6" fill={INK} />
          <ellipse cx="134" cy="113" rx="4.6" ry="5.6" fill={INK} />
          <circle cx="107.6" cy="111" r="1.7" fill="#fff" />
          <circle cx="135.6" cy="111" r="1.7" fill="#fff" />
        </>
      )}
      {eyes === 'up' && (
        <>
          <ellipse cx="108" cy="110" rx="4.6" ry="5.6" fill={INK} />
          <ellipse cx="136" cy="110" rx="4.6" ry="5.6" fill={INK} />
          <circle cx="110" cy="107.5" r="1.7" fill="#fff" />
          <circle cx="138" cy="107.5" r="1.7" fill="#fff" />
        </>
      )}
      {eyes === 'down' && (
        <>
          <path d="M100 114 Q106 119 112 114" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M128 114 Q134 119 140 114" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      )}
      {eyes === 'happy' && (
        <>
          <path d="M100 116 Q106 107 112 116" stroke={INK} strokeWidth="3.2" fill="none" strokeLinecap="round" />
          <path d="M128 116 Q134 107 140 116" stroke={INK} strokeWidth="3.2" fill="none" strokeLinecap="round" />
        </>
      )}

      {/* blush */}
      <ellipse cx="97" cy="125" rx="7" ry="4" fill={BLUSH} opacity=".75" />
      <ellipse cx="143" cy="125" rx="7" ry="4" fill={BLUSH} opacity=".75" />

      {/* mouth */}
      {pose === 'cheer' && (
        <g>
          <path d="M109 125 Q120 143 131 125 Z" fill="#8a2f28" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
          <path d="M114 133 Q120 138 126 133 Q120 131 114 133 Z" fill="#e8807a" />
        </g>
      )}
      {pose === 'think' && <ellipse cx="124" cy="130" rx="3.4" ry="3.8" fill="#8a2f28" stroke={INK} strokeWidth="2.2" />}
      {pose === 'read' && <path d="M115 128 Q120 131 125 128" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />}
      {(pose === 'wave' || pose === 'encourage') && (
        <path d="M111 126 Q120 135 129 126" stroke={INK} strokeWidth="2.8" fill="none" strokeLinecap="round" />
      )}
    </g>
  )
}

function Hat() {
  return (
    <g>
      {/* long straight futou wings */}
      <rect x="18" y="86" width="70" height="7" rx="3.5" fill={INK} />
      <rect x="152" y="86" width="70" height="7" rx="3.5" fill={INK} />
      {/* raised back of the cap and the crown */}
      <path d="M97 72 C99 50 141 50 143 72 Z" fill={INK} />
      <path d="M81 97 C80 64 160 64 159 97 Z" fill={INK} />
      <rect x="80" y="88" width="80" height="11" rx="5.5" fill={INK} />
      <path d="M104 62 C110 58 122 57 128 59" stroke="#56524a" strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  )
}

function Body() {
  return (
    <g>
      <ellipse cx="120" cy="229" rx="52" ry="7" fill="#000" opacity=".1" />
      <ellipse cx="106" cy="224" rx="11" ry="6" fill={INK} />
      <ellipse cx="134" cy="224" rx="11" ry="6" fill={INK} />
      <path d="M82 222 C79 194 86 170 101 157 Q120 149 139 157 C154 170 161 194 158 222 Z" fill={ROBE} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M120 172 L120 220" stroke={ROBE_DARK} strokeWidth="2.5" strokeLinecap="round" opacity=".7" />
      <path d="M103 159 Q120 176 137 159" fill="#fbf7ee" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      <rect x="89" y="189" width="62" height="10" rx="5" fill="#9c3a2b" stroke={INK} strokeWidth="2.5" />
      <circle cx="120" cy="194" r="3.2" fill="#e0a93b" stroke={INK} strokeWidth="1.5" />
    </g>
  )
}

function Head() {
  return (
    <g>
      <circle cx="79" cy="114" r="6.5" fill={SKIN} stroke={INK} strokeWidth={SW} />
      <circle cx="161" cy="114" r="6.5" fill={SKIN} stroke={INK} strokeWidth={SW} />
      <circle cx="120" cy="112" r="41" fill={SKIN} stroke={INK} strokeWidth={SW} />
    </g>
  )
}

export default function Mascot({ pose = 'wave', size = 140, className = '', title, float = true }) {
  const label = title ?? {
    wave: 'Xiao Shi, a cartoon Song scholar-official, waving hello',
    read: 'Xiao Shi reading an open scroll',
    think: 'Xiao Shi thinking, hand on chin',
    cheer: 'Xiao Shi cheering with both arms up',
    encourage: 'Xiao Shi giving an encouraging thumbs-up',
  }[pose]

  return (
    <svg
      viewBox="0 0 240 240"
      width={size}
      height={size}
      role="img"
      aria-label={label}
      className={`${float ? 'animate-float' : ''} overflow-visible ${className}`}
    >
      <Body />

      {/* arms behind/around the body, per pose */}
      {pose === 'wave' && (
        <>
          <Arm d="M101 166 C92 178 88 190 90 200" hand={[90, 204]} />
          <RolledScroll x={78} y={200} tilt={-12} />
          <g className="origin-[140px_164px] animate-wave">
            <Arm d="M139 166 C156 158 170 142 176 122" hand={[178, 114]} />
            <path d="M191 100 q6 6 4 14 M198 94 q9 9 6 22" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" opacity=".55" />
          </g>
        </>
      )}
      {pose === 'read' && (
        <>
          <Arm d="M101 166 C92 174 84 182 80 190" />
          <Arm d="M139 166 C148 174 156 182 160 190" />
          <OpenScroll />
          <circle cx="73" cy="192" r="7" fill={SKIN} stroke={INK} strokeWidth={SW} />
          <circle cx="167" cy="192" r="7" fill={SKIN} stroke={INK} strokeWidth={SW} />
        </>
      )}
      {pose === 'think' && (
        <>
          <Arm d="M101 166 C92 178 88 190 90 200" hand={[90, 204]} />
          <RolledScroll x={78} y={200} tilt={-12} />
          <circle cx="176" cy="74" r="4" fill="#fff" stroke={INK} strokeWidth="2" />
          <circle cx="188" cy="58" r="6.5" fill="#fff" stroke={INK} strokeWidth="2" />
          <circle cx="206" cy="34" r="16" fill="#fff" stroke={INK} strokeWidth="2.5" />
          <text x="206" y="41" textAnchor="middle" fontSize="21" fontWeight="700" fontFamily="Georgia, serif" fill={SEAL}>?</text>
        </>
      )}
      {pose === 'cheer' && (
        <>
          <Arm d="M101 164 C86 156 76 140 70 124" hand={[67, 116]} />
          <Arm d="M139 164 C154 156 164 140 170 124" hand={[173, 116]} />
          <Sparkle x={40} y={96} s={1.1} />
          <Sparkle x={202} y={92} s={1.2} color="#7fb09f" />
          <Sparkle x={34} y={168} s={0.8} color="#e8807a" />
          <Sparkle x={208} y={164} s={0.9} />
          <rect x="52" y="60" width="7" height="4" rx="1" fill={SEAL} transform="rotate(25 55 62)" />
          <rect x="184" y="56" width="7" height="4" rx="1" fill="#7fb09f" transform="rotate(-20 187 58)" />
        </>
      )}
      {pose === 'encourage' && (
        <>
          <Arm d="M101 166 C92 178 88 190 90 200" hand={[90, 204]} />
          <RolledScroll x={78} y={200} tilt={-12} />
          <Arm d="M139 166 C152 172 162 170 168 160" hand={[170, 156]} fist />
          <rect x="166" y="136" width="8" height="16" rx="4" fill={SKIN} stroke={INK} strokeWidth="2.6" />
          <path d="M196 118 c-4 -7 -14 -4 -12 4 c1 5 8 9 12 13 c4 -4 11 -8 12 -13 c2 -8 -8 -11 -12 -4 Z" fill={SEAL} stroke={INK} strokeWidth="2" />
        </>
      )}

      <Head />
      <Hat />
      <Face pose={pose} />
      {/* the thinking hand rests on the chin, in front of the face */}
      {pose === 'think' && <Arm d="M139 168 C152 168 156 160 150 152" hand={[146, 150]} />}
    </svg>
  )
}
