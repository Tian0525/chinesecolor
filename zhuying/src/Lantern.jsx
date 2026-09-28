import { useId } from 'react'
import { colorById, flameById, speedById } from './data'

// 灯身轮廓（正面，居中 x=160）
const OUTLINE_D = {
  hex: 'M160 58 L92 106 L92 318 L160 368 L228 318 L228 106 Z',
  cat: 'M160 46 L130 66 L92 72 L92 318 L160 368 L228 318 L228 72 L190 66 Z',
  round: 'M160 62 A114 150 0 1 0 160 366 A114 150 0 1 0 160 62 Z',
  petal:
    'M160 50 C150 50 132 62 118 80 C106 92 96 108 92 122 C90 176 90 224 92 278 C96 296 106 314 120 326 C132 344 150 360 160 362 C170 360 188 344 200 326 C214 314 224 296 228 278 C230 224 230 176 228 122 C224 108 214 92 202 80 C188 62 170 50 160 50 Z',
}

const STEP = 84 // 面板步宽
const PANEL_TOP = 120
const PANEL_H = 168
const STRIP_W = STEP * 12

// 肋骨（竹骨架）位置：非圆形轮廓才绘制
const RIB_LINES = {
  hex: [
    [160, 58, 160, 368],
    [126, 96, 126, 330],
    [194, 96, 194, 330],
  ],
  cat: [
    [160, 46, 160, 368],
    [126, 96, 126, 330],
    [194, 96, 194, 330],
  ],
  petal: [
    [160, 50, 160, 362],
    [126, 110, 126, 320],
    [194, 110, 194, 320],
  ],
}

// 灯面（透光片）填充
function filmFill(body, colorHex, isClear) {
  const f = body.film
  if (f === 'frost') return { fill: '#f4eadb', opacity: 0.52 }
  if (f === 'color') return { fill: colorHex, opacity: 0.3 }
  return { fill: colorHex, opacity: isClear ? 0.06 : 0.14 }
}

export default function Lantern({ design, lit = true, rotating = true, className = '' }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const frames = design?.frames || []
  const body = design?.body || {}
  const outline = OUTLINE_D[body.outline] || OUTLINE_D.hex
  const color = colorById(body.color)
  const isClear = body.color === 'clear'
  const surface = body.surface || 'clear'
  const base = body.base || 'walnut'
  const flame = flameById(design?.candle?.flame)
  const speed = speedById(design?.candle?.speed)

  const film = filmFill(body, color.hex, isClear)
  const ribs = RIB_LINES[body.outline] || []
  const spinning = rotating && lit

  const panels = []
  const count = rotating ? 24 : 12 // 静态时只渲染 12 帧，省去无缝循环的重复
  for (let i = 0; i < count; i++) {
    const frame = frames[i % 12]
    const x = i * STEP
    panels.push(
      <g key={i} transform={`translate(${x} 0)`}>
        <rect x={1} y={PANEL_TOP} width={STEP - 2} height={PANEL_H} fill="rgba(0,0,0,0.05)" />
        {frame ? (
          <image
            href={frame}
            x={0}
            y={PANEL_TOP + (PANEL_H - STEP) / 2}
            width={STEP}
            height={STEP}
            preserveAspectRatio="xMidYMid meet"
          />
        ) : (
          <path
            d={`M${STEP / 2} ${PANEL_TOP + 20} L${STEP / 2 + 18} ${PANEL_TOP + PANEL_H / 2} L${STEP / 2} ${PANEL_TOP + PANEL_H - 20} L${STEP / 2 - 18} ${PANEL_TOP + PANEL_H / 2} Z`}
            fill="none"
            stroke="rgba(0,0,0,0.16)"
            strokeWidth="1.5"
          />
        )}
        <line x1={STEP} y1={PANEL_TOP} x2={STEP} y2={PANEL_TOP + PANEL_H} stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
      </g>,
    )
  }

  return (
    <svg viewBox="0 0 320 500" className={`lantern ${className}`} role="img" aria-label="走马灯">
      <defs>
        <clipPath id={`c${uid}`}>
          <path d={outline} />
        </clipPath>
        <linearGradient id={`grad${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.3" />
          <stop offset="0.5" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.3" />
        </linearGradient>
        <pattern id={`carve${uid}`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="#000" strokeOpacity="0.26" strokeWidth="1" />
        </pattern>
        <filter id={`blur${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
        <radialGradient id={`glow${uid}`}>
          <stop offset="0" stopColor={flame.hex} stopOpacity="0.9" />
          <stop offset="0.45" stopColor={flame.hex} stopOpacity="0.34" />
          <stop offset="1" stopColor={flame.hex} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`bw${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7a5636" />
          <stop offset="1" stopColor="#43291a" />
        </linearGradient>
        <linearGradient id={`be${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#32251c" />
          <stop offset="1" stopColor="#17110d" />
        </linearGradient>
        <linearGradient id={`ba${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#efe9dc" stopOpacity="0.7" />
          <stop offset="1" stopColor="#d6cab4" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id={`bm${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b2117" />
          <stop offset="1" stopColor="#18100a" />
        </linearGradient>
        <pattern id={`mot${uid}`} width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="2.2" fill="#4db6ac" opacity="0.5" />
          <circle cx="12" cy="10" r="2.2" fill="#b39ddb" opacity="0.45" />
          <circle cx="8" cy="14" r="1.8" fill="#f48fb1" opacity="0.4" />
        </pattern>
      </defs>

      {/* 顶部提环 */}
      <g className="lantern__hook">
        <circle cx="160" cy="22" r="7" fill="none" stroke={isClear ? '#c9b99a' : color.hex} strokeWidth="2.5" />
        <line x1="160" y1="29" x2="160" y2="50" stroke={isClear ? '#c9b99a' : color.hex} strokeWidth="2.5" />
      </g>

      {/* 灯身骨架 */}
      <path d={outline} fill="none" stroke={isClear ? 'rgba(201,185,154,0.6)' : color.hex} strokeWidth="5.5" />
      {ribs.map((r, i) => (
        <line key={i} x1={r[0]} y1={r[1]} x2={r[2]} y2={r[3]} stroke={color.hex} strokeWidth="1.6" opacity="0.35" />
      ))}

      {/* 烛光（在剪影之后） */}
      {lit && (
        <g clipPath={`url(#c${uid})`}>
          <ellipse cx="160" cy="330" rx="70" ry="70" fill={`url(#glow${uid})`} className="lantern__glow" />
        </g>
      )}

      {/* 剪影走马灯带 */}
      <g clipPath={`url(#c${uid})`}>
        <g
          className={spinning ? 'lantern__strip lantern__strip--spin' : 'lantern__strip'}
          style={spinning ? { '--shift': `-${STRIP_W}px`, animationDuration: `${speed.dur}s` } : undefined}
          opacity={lit ? 1 : 0.32}
          filter={surface === 'frost' ? `url(#blur${uid})` : undefined}
        >
          {panels}
        </g>
      </g>

      {/* 灯面（透光片，覆于剪影之上） */}
      <path d={outline} fill={film.fill} opacity={film.opacity} />

      {/* 表面处理 */}
      {surface === 'grad' && <path d={outline} fill={`url(#grad${uid})`} opacity="0.34" />}
      {surface === 'carve' && <path d={outline} fill={`url(#carve${uid})`} opacity="0.22" />}

      {/* 蜡烛 */}
      {lit && (
        <g className="lantern__candle">
          <rect x="154" y="330" width="12" height="26" rx="2" fill="#f0e4cd" />
          <line x1="160" y1="332" x2="160" y2="322" stroke="#8a7358" strokeWidth="1.5" />
          <path d="M160 298 C165 306 165 316 160 325 C155 316 155 306 160 298 Z" fill={flame.hex} className="lantern__flame" />
          <path d="M160 309 C162 312 162 317 160 320 C158 317 158 312 160 309 Z" fill="#fff7e6" opacity="0.9" className="lantern__flame" />
        </g>
      )}

      {/* 底座 */}
      <g>
        <path
          d="M122 372 L198 372 L208 414 L112 414 Z"
          fill={base === 'walnut' ? `url(#bw${uid})` : base === 'ebony' ? `url(#be${uid})` : base === 'acrylic' ? `url(#ba${uid})` : `url(#bm${uid})`}
        />
        {base === 'mother' && <path d="M122 372 L198 372 L208 414 L112 414 Z" fill={`url(#mot${uid})`} />}
        <rect x="112" y="368" width="96" height="6" rx="2" fill={isClear ? '#c9b99a' : color.hex} opacity="0.8" />
      </g>

      {/* 流苏 */}
      <g className="lantern__tassel">
        <circle cx="160" cy="424" r="5" fill="#c89b3c" />
        {[148, 156, 164, 172].map((x) => (
          <line key={x} x1={x} y1="430" x2={x - 6} y2="462" stroke="#c89b3c" strokeWidth="2" strokeLinecap="round" />
        ))}
        <line x1="160" y1="430" x2="160" y2="464" stroke="#c89b3c" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  )
}
