import { ELEMENTS, relation, CYCLE } from './data'

// 五行生克星盘 —— 以「相生五边形」为骨架，相克连线为隐线
// 坐标系：400 × 400，圆心 (200, 200)，半径 R
const CX = 200
const CY = 200
const R = 116

// 相生顺序顺时针排列：木(0°) → 火 → 土 → 金 → 水
const POS = {
  mu:   { angle: 0,   dir: '东' },
  huo:  { angle: 72,  dir: '南' },
  tu:   { angle: 144, dir: '中' },
  jin:  { angle: 216, dir: '西' },
  shui: { angle: 288, dir: '北' },
}

function polar(angle, radius, cx = CX, cy = CY) {
  const rad = (angle * Math.PI) / 180
  return { x: cx + radius * Math.sin(rad), y: cy - radius * Math.cos(rad) }
}

const GOLD = '#C6A15B'
const PURPLE = '#7E5AA2'
const INK_SOFT = '#6B625A'

// 计算已收集色点的落位（同元素多色时向外错位）
function layout(colors) {
  return colors.map((c, i) => {
    let occ = 0
    for (let j = 0; j < i; j++) if (colors[j].elem === c.elem) occ++
    const sameCount = colors.filter((cc) => cc.elem === c.elem).length
    const r = R + (sameCount > 1 ? occ * 17 : 0)
    const pos = polar(POS[c.elem].angle, r)
    return { color: c, pos, r: r - R }
  })
}

// 星盘主体（可复用于独立 SVG 或海报内嵌 <g>）
export function chartGroup(colors, { backdrop = true, animate = true } = {}) {
  const nodes = layout(colors)

  // 相生五边形（隐线骨架）
  const pentagon = CYCLE.map((e) => polar(POS[e].angle, R))
  const pentagonPath = pentagon
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ') + ' Z'

  // 相克五角星（隐线）：木→土→水→火→金→木
  const starOrder = ['mu', 'tu', 'shui', 'huo', 'jin']
  const starPath = starOrder
    .map((e, i) => {
      const p = polar(POS[e].angle, R)
      return `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
    })
    .join(' ')

  // 收集路径分段
  const segments = []
  for (let i = 1; i < nodes.length; i++) {
    const a = nodes[i - 1]
    const b = nodes[i]
    const rel = relation(a.color.elem, b.color.elem)
    let stroke = INK_SOFT
    if (rel.kind === 'birth') stroke = GOLD
    else if (rel.kind === 'over') stroke = PURPLE
    segments.push({ a, b, rel, stroke })
  }

  return (
    <g>
      {backdrop && (
        <g className="chart-backdrop">
          <circle cx={CX} cy={CY} r={R + 46} className="chart-ring" />
          <circle cx={CX} cy={CY} r={R - 40} className="chart-ring" />
          <path d={pentagonPath} className="chart-pentagon" />
          <path d={starPath} className="chart-star" />
        </g>
      )}

      {/* 元素节点 */}
      {CYCLE.map((e) => {
        const p = polar(POS[e].angle, R)
        const lp = polar(POS[e].angle, R + 34)
        const el = ELEMENTS[e]
        const isLit = nodes.some((n) => n.color.elem === e)
        return (
          <g key={e}>
            <circle cx={p.x} cy={p.y} r={6} className={isLit ? 'chart-node chart-node--lit' : 'chart-node'} />
            <text x={lp.x} y={lp.y} className="chart-label" textAnchor="middle" dominantBaseline="central">
              {`${el.five}·${el.name}·${el.dir}`}
            </text>
          </g>
        )
      })}

      <text x={CX} y={CY} className="chart-center" textAnchor="middle" dominantBaseline="central">
        五色
      </text>

      {/* 收集路径 */}
      {segments.length > 0 && (
        <g className="chart-path">
          {segments.map((s, i) => (
            <line
              key={i}
              x1={s.a.pos.x}
              y1={s.a.pos.y}
              x2={s.b.pos.x}
              y2={s.b.pos.y}
              stroke={s.stroke}
              className={animate ? 'chart-seg' : 'chart-seg chart-seg--static'}
              style={{ '--i': i }}
            />
          ))}
        </g>
      )}

      {/* 已拾色点（光点） */}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.pos.x} cy={n.pos.y} r={10} fill={n.color.hex} className="chart-dot-halo" style={{ '--i': i }} />
          <circle cx={n.pos.x} cy={n.pos.y} r={5} fill={n.color.hex} stroke="#fff" strokeWidth={1.4} />
        </g>
      ))}
    </g>
  )
}

export default function StarChart({ colors = [], animate = true, backdrop = true, className = '' }) {
  return (
    <svg viewBox="0 0 400 400" className={`starchart ${className}`} role="img" aria-label="五行生克星盘">
      {chartGroup(colors, { backdrop, animate })}
    </svg>
  )
}
