import React from 'react'
import { ELEMENTS } from './data'
import { karmaReading } from './gems'
import { chartGroup } from './StarChart'
import { braceletGroup } from './Bracelet'

// 手串设计图纸海报 —— 极简宋风，自包含 SVG，便于直接导出 PNG
const W = 750
const PAPER = '#F8F6F0'
const INK = '#2C2C2C'
const MUTED = '#8A8274'
const SEAL = '#C3272B'

const FONT = '"Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif'
const FONT_KAI = '"KaiTi", "STKaiti", "KaiTi_GB2312", serif'

function wrap(str, n) {
  const out = []
  for (let i = 0; i < str.length; i += n) out.push(str.slice(i, i + n))
  return out
}

const BraceletPoster = React.forwardRef(function BraceletPoster({ result, colors }, ref) {
  const text = karmaReading(result)
  const lines = wrap(text, 24)
  const cx = W / 2

  const materials = [result.main, ...result.accents, result.spacer, ...(result.linkBead ? [result.linkBead] : [])]

  // 纵向布局
  const ringTop = 250
  const RING = 220
  const ringBottom = ringTop + RING
  const matTitleY = ringBottom + 46
  const matRow0 = matTitleY + 36
  const matStep = 44
  const matEnd = matRow0 + (materials.length - 1) * matStep
  const karmaTitleY = matEnd + 50
  const karmaLine0 = karmaTitleY + 34
  const karmaLineStep = 30
  const karmaEnd = karmaLine0 + (lines.length - 1) * karmaLineStep
  const chartTop = karmaEnd + 42
  const CHART_SCALE = 0.55
  const chartH = 400 * CHART_SCALE
  const ruleY = chartTop + chartH + 26
  const footerY = ruleY + 24
  const H = footerY + 28

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} width={W} height={H} xmlns="http://www.w3.org/2000/svg">
      <style>{`
        .p-bg { fill: ${PAPER}; }
        .p-frame { fill: none; stroke: #D8CFBE; stroke-width: 1.5; }
        .p-rule { stroke: #D8CFBE; stroke-width: 1; }
        .p-ink { fill: ${INK}; }
        .p-muted { fill: ${MUTED}; }
        .bracelet-string, .bracelet-string--static { fill: none; stroke: #C9BFA8; stroke-width: 2.2; }
        .bead__body { stroke: rgba(0,0,0,0.12); stroke-width: 0.7; }
        .chart-ring { fill: none; stroke: #D8CFBE; stroke-width: 1; }
        .chart-pentagon { fill: none; stroke: #CBC2AF; stroke-width: 1; opacity: 0.7; }
        .chart-star { fill: none; stroke: #CBC2AF; stroke-width: 1; stroke-dasharray: 3 4; opacity: 0.6; }
        .chart-node { fill: none; stroke: #CBC2AF; stroke-width: 1.4; }
        .chart-node--lit { fill: none; stroke: #8A8274; }
        .chart-label { fill: #8A8274; font-family: ${FONT}; font-size: 11px; }
        .chart-center { fill: #B2BEC3; font-family: ${FONT_KAI}; font-size: 13px; letter-spacing: 2px; }
        .chart-seg, .chart-seg--static { stroke-width: 2.4; stroke-linecap: round; fill: none; }
        .chart-dot-halo { opacity: 0.16; }
      `}</style>

      <rect x={0} y={0} width={W} height={H} className="p-bg" />
      <rect x={22} y={22} width={W - 44} height={H - 44} rx={6} className="p-frame" />

      {/* 印章 */}
      <rect x={cx - 26} y={64} width={52} height={52} rx={7} fill={SEAL} transform="rotate(-4 375 90)" />
      <text x={cx} y={97} textAnchor="middle" dominantBaseline="central" fill="#fff"
        style={{ fontFamily: FONT_KAI, fontSize: 24, fontWeight: 700 }}>结缘</text>

      {/* 标题 */}
      <text x={cx} y={166} textAnchor="middle" style={{ fontFamily: FONT, fontSize: 40, fill: INK, letterSpacing: 12 }}>手串图纸</text>
      <text x={cx} y={204} textAnchor="middle" style={{ fontFamily: FONT_KAI, fontSize: 18, fill: MUTED, letterSpacing: 4 }}>
        【{result.name}】· 本命{ELEMENTS[result.life].name} · 调和{ELEMENTS[result.balance].name}
      </text>
      <line x1={cx - 110} y1={230} x2={cx + 110} y2={230} className="p-rule" />

      {/* 手串渲染 */}
      <g transform={`translate(${(W - RING) / 2}, ${ringTop})`}>
        {braceletGroup(result.beads, { cx: RING / 2, cy: RING / 2, R: 72, beadR: 10.5, animate: false })}
      </g>

      {/* 材质清单 */}
      <text x={cx} y={matTitleY} textAnchor="middle" style={{ fontFamily: FONT, fontSize: 16, fill: INK, letterSpacing: 2 }}>材质清单</text>
      {materials.map((it, i) => {
        const el = ELEMENTS[it.elem]
        const y = matRow0 + i * matStep
        return (
          <g key={it.role + it.stone.name}>
            <circle cx={118} cy={y - 4} r={12} fill={it.stone.hex} stroke="rgba(0,0,0,0.1)" strokeWidth="0.7" />
            <text x={142} y={y - 2} style={{ fontFamily: FONT, fontSize: 15, fill: INK }}>{it.stone.name}</text>
            <text x={142} y={y + 18} style={{ fontFamily: FONT, fontSize: 12, fill: MUTED }}>{el.five} · {el.name} · {it.role}</text>
            <text x={W - 66} y={y - 2} textAnchor="end" style={{ fontFamily: FONT, fontSize: 15, fill: MUTED }}>× {it.count}</text>
          </g>
        )
      })}

      {/* 五行解读 */}
      <text x={cx} y={karmaTitleY} textAnchor="middle" style={{ fontFamily: FONT, fontSize: 16, fill: INK, letterSpacing: 2 }}>五行解读</text>
      {lines.map((ln, i) => (
        <text key={i} x={cx} y={karmaLine0 + i * karmaLineStep} textAnchor="middle"
          style={{ fontFamily: FONT, fontSize: 13.5, fill: '#4A443C' }}>{ln}</text>
      ))}

      {/* 星盘缩略 */}
      <g transform={`translate(${(W - 400 * CHART_SCALE) / 2}, ${chartTop}) scale(${CHART_SCALE})`}>
        {chartGroup(colors, { backdrop: true, animate: false })}
      </g>

      {/* 底部 */}
      <line x1={cx - 110} y1={ruleY} x2={cx + 110} y2={ruleY} className="p-rule" />
      <text x={cx} y={footerY} textAnchor="middle" style={{ fontFamily: FONT, fontSize: 12, fill: MUTED, letterSpacing: 2 }}>
        广州艺博院 · 五色展 · 化色结缘手作坊
      </text>
    </svg>
  )
})

export default BraceletPoster
