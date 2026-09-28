import { useRef } from 'react'
import { scentById, speedById, flameById, colorById } from './data'

const W = 750
const H = 1000
const HEX = 'M375 250 L238 320 L238 470 L375 540 L512 470 L512 320 Z'

export default function PosterCard({ design, meta, onClose }) {
  const ref = useRef(null)
  const color = colorById(design.body.color)
  const scent = scentById(design.candle.scent)
  const speed = speedById(design.candle.speed)
  const flame = flameById(design.candle.flame)
  const title = meta.title || '一盏无名灯'
  const date = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })

  function save() {
    const el = ref.current
    const xml = new XMLSerializer().serializeToString(el)
    const svg64 = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml)
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = W * 2
      canvas.height = H * 2
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#241711'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.scale(2, 2)
      ctx.drawImage(img, 0, 0, W, H)
      const a = document.createElement('a')
      a.download = '我的走马灯.png'
      a.href = canvas.toDataURL('image/png')
      a.click()
    }
    img.src = svg64
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="poster-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="poster-modal__scroll">
          <svg ref={ref} width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="poster-svg">
            <rect width={W} height={H} fill="#241711" />
            <rect x="28" y="28" width={W - 56} height={H - 56} fill="none" stroke="#c89b3c" strokeOpacity="0.45" strokeWidth="1.5" />

            <text x="375" y="86" textAnchor="middle" fill="#f2efe9" fontSize="30" letterSpacing="6" fontFamily="serif">
              我 的 走 马 灯
            </text>

            {/* 灯身插画 */}
            <radialGradient id="pcglow">
              <stop offset="0" stopColor={flame.hex} stopOpacity="0.85" />
              <stop offset="1" stopColor={flame.hex} stopOpacity="0" />
            </radialGradient>
            <path d={HEX} fill={color.hex} fillOpacity="0.16" stroke={color.hex} strokeWidth="4" />
            <circle cx="375" cy="470" r="70" fill="url(#pcglow)" />
            <path d="M375 432 C381 446 381 464 375 476 C369 464 369 446 375 432 Z" fill={flame.hex} />
            <path d="M375 450 C377 455 377 462 375 466 C373 462 373 455 375 450 Z" fill="#fff7e6" opacity="0.92" />
            <rect x="369" y="474" width="12" height="26" rx="2" fill="#f0e4cd" />

            <text x="375" y="614" textAnchor="middle" fill="#f4eadb" fontSize="42" fontFamily="serif">
              {title}
            </text>
            <text x="375" y="660" textAnchor="middle" fill="#c3ab8f" fontSize="18" letterSpacing="2">
              {scent.name} · {speed.name}转速 {speed.rpm}rpm · {flame.name}烛光
            </text>

            {/* 12 帧条 */}
            {design.frames.map((f, i) => {
              const x = 99 + i * 46
              return f ? (
                <image key={i} href={f} x={x} y="700" width="46" height="46" preserveAspectRatio="xMidYMid meet" />
              ) : (
                <rect key={i} x={x} y="700" width="46" height="46" fill="none" stroke="#c89b3c" strokeOpacity="0.25" />
              )
            })}

            <text x="375" y="900" textAnchor="middle" fill="#c89b3c" fontSize="22" letterSpacing="4" fontFamily="serif">
              逐影 · 把故事藏进灯里
            </text>
            <text x="375" y="934" textAnchor="middle" fill="#8a7358" fontSize="14">
              {meta.author} · {date}
            </text>
          </svg>
        </div>
        <div className="poster-modal__bar">
          <button className="btn btn--ghost" onClick={onClose}>
            关闭
          </button>
          <button className="btn btn--primary" onClick={save}>
            保存图片
          </button>
        </div>
      </div>
    </div>
  )
}
