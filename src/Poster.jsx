import React from 'react'
import { personality } from './data'
import { chartGroup } from './StarChart'

// 分享海报 —— 极简宋风。整幅为自包含 SVG，便于直接导出 PNG。
const W = 750
const H = 1000
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

const Poster = React.forwardRef(function Poster({ colors = [] }, ref) {
  const text = personality(colors)
  const lines = wrap(text, 20)
  const cx = W / 2

  // 已拾颜色名称（去重、保序）
  const names = [...new Set(colors.map((c) => c.name))]
  const swatches = names.slice(0, 5)
  const swW = 64
  const swGap = 18
  const swTotal = swatches.length * swW + (swatches.length - 1) * swGap
  const swStart = (W - swTotal) / 2

  const today = new Date()
  const dateStr = `${today.getFullYear()} 年 ${today.getMonth() + 1} 月 ${today.getDate()} 日`

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} width={W} height={H} xmlns="http://www.w3.org/2000/svg">
      <style>{`
        .p-bg { fill: ${PAPER}; }
        .p-frame { fill: none; stroke: #D8CFBE; stroke-width: 1.5; }
        .p-rule { stroke: #D8CFBE; stroke-width: 1; }
        .p-ink { fill: ${INK}; }
        .p-muted { fill: ${MUTED}; }
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

      {/* 背景与边框 */}
      <rect x={0} y={0} width={W} height={H} className="p-bg" />
      <rect x={22} y={22} width={W - 44} height={H - 44} rx={6} className="p-frame" />

      {/* 印章 */}
      <rect x={cx - 26} y={64} width={52} height={52} rx={7} fill={SEAL} transform="rotate(-4 375 90)" />
      <text x={cx} y={97} textAnchor="middle" dominantBaseline="central" fill="#fff"
        style={{ fontFamily: FONT_KAI, fontSize: 27, fontWeight: 700 }}>五色</text>

      {/* 标题 */}
      <text x={cx} y={168} textAnchor="middle" style={{ fontFamily: FONT, fontSize: 46, fill: INK, letterSpacing: 16 }}>五色·五行</text>
      <text x={cx} y={204} textAnchor="middle" style={{ fontFamily: FONT, fontSize: 15, fill: MUTED, letterSpacing: 4 }}>一本会呼吸的五行色彩图鉴</text>
      <line x1={cx - 90} y1={232} x2={cx + 90} y2={232} className="p-rule" />

      {/* 星盘 */}
      <g transform={`translate(${(W - 440) / 2}, 252) scale(1.1)`}>
        {chartGroup(colors, { backdrop: true, animate: false })}
      </g>

      {/* 个人自述 */}
      <text x={cx} y={740} textAnchor="middle" style={{ fontFamily: FONT, fontSize: 16, fill: INK, letterSpacing: 2 }}>我的五行自述</text>
      {lines.map((ln, i) => (
        <text key={i} x={cx} y={776 + i * 30} textAnchor="middle"
          style={{ fontFamily: FONT, fontSize: 14, fill: '#4A443C', lineHeight: 1 }}>{ln}</text>
      ))}

      {/* 已拾色样 */}
      <text x={cx} y={864} textAnchor="middle" style={{ fontFamily: FONT, fontSize: 15, fill: INK, letterSpacing: 2 }}>拾得之色</text>
      <g>
        {swatches.map((name, i) => {
          const c = colors.find((cc) => cc.name === name)
          const x = swStart + i * (swW + swGap) + swW / 2
          return (
            <g key={name}>
              <circle cx={x} cy={898} r={20} fill={c.hex} stroke="#fff" strokeWidth={1.5} />
              <text x={x} y={934} textAnchor="middle" style={{ fontFamily: FONT, fontSize: 13, fill: '#4A443C' }}>{name}</text>
            </g>
          )
        })}
      </g>

      {/* 底部 */}
      <line x1={cx - 110} y1={956} x2={cx + 110} y2={956} className="p-rule" />
      <text x={cx} y={980} textAnchor="middle" style={{ fontFamily: FONT, fontSize: 12, fill: MUTED, letterSpacing: 2 }}>广州艺博院 · 五色展 · {dateStr}</text>
    </svg>
  )
})

export default Poster
