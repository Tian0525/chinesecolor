import { Fragment, useEffect, useId, useMemo, useRef, useState } from 'react'
import { COLORS, colorById, ELEMENTS, CYCLE, bondNarrative, personality, textOnHex, isFullCircle, fullCircleNarrative } from './data'
import StarChart from './StarChart'
import Poster from './Poster'
import KarmaModal from './Bracelet'
import * as sound from './sound'
import './App.css'

const STORAGE = 'wuse:wuxing'

function loadCollected() {
  try {
    const v = JSON.parse(localStorage.getItem(STORAGE))
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

function hexToRgb(hex) {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

// 向白色线性混合 a（0~1），返回 rgb() 字符串
function tint(hex, a) {
  const [r, g, b] = hexToRgb(hex)
  const f = (v) => Math.round(v + (255 - v) * a)
  return `rgb(${f(r)}, ${f(g)}, ${f(b)})`
}

// 柔边高斯模糊：本色居中，向四周柔和晕开至纯白（无硬边）
function softWash(hex) {
  return `radial-gradient(ellipse at 50% 50%,
    ${hex} 0%,
    ${hex} 44%,
    ${tint(hex, 0.25)} 60%,
    ${tint(hex, 0.55)} 74%,
    ${tint(hex, 0.85)} 86%,
    #ffffff 95%,
    #ffffff 100%)`
}

function nearestColor(r, g, b) {
  let best = COLORS[0]
  let bestD = Infinity
  for (const c of COLORS) {
    const [cr, cg, cb] = hexToRgb(c.hex)
    const d = (cr - r) ** 2 + (cg - g) ** 2 + (cb - b) ** 2
    if (d < bestD) { bestD = d; best = c }
  }
  return best
}

// ---------------- 毛笔逐字显现 ----------------
function BrushText({ text }) {
  return (
    <>
      {Array.from(text).map((ch, i) => (
        <span key={i} className="brush-char" style={{ '--i': i }}>
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </>
  )
}

// ---------------- 印章 ----------------
function Seal({ children = '五色', size = 44 }) {
  return (
    <span className="seal" style={{ width: size, height: size, fontSize: size * 0.52 }}>
      {children}
    </span>
  )
}

// ---------------- 玉璧取景框 ----------------
function Viewfinder({ preview }) {
  return (
    <div className="viewfinder-wrap">
      <svg viewBox="0 0 240 240" className="viewfinder">
        <circle cx="120" cy="120" r="112" className="vf-outer" />
        <circle cx="120" cy="120" r="86" className="vf-inner" />
        {preview && (
          <g key={preview.ts}>
            <circle cx="120" cy="120" r="86" fill={preview.color.hex} className="vf-fill" />
            <circle cx="120" cy="120" r="86" fill="none" className="vf-ripple" />
            <circle cx="120" cy="120" r="86" fill="none" className="vf-ripple vf-ripple--2" />
          </g>
        )}
        <g className="vf-ticks">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line
              key={a}
              x1={120 + 96 * Math.sin((a * Math.PI) / 180)}
              y1={120 - 96 * Math.cos((a * Math.PI) / 180)}
              x2={120 + 104 * Math.sin((a * Math.PI) / 180)}
              y2={120 - 104 * Math.cos((a * Math.PI) / 180)}
              className="vf-tick"
            />
          ))}
        </g>
        {!preview && (
          <text x="120" y="116" textAnchor="middle" className="vf-hint" dominantBaseline="central">
            拾
          </text>
        )}
        {!preview && (
          <text x="120" y="146" textAnchor="middle" className="vf-hint vf-hint--sub" dominantBaseline="central">
            对准喜欢的颜色
          </text>
        )}
      </svg>
    </div>
  )
}

// ---------------- 拾色成功时 · 取景中心水墨涟漪 ----------------
function InkWash({ color }) {
  const [r, g, b] = color ? hexToRgb(color.hex) : [44, 44, 44]
  const ink = `rgba(${r}, ${g}, ${b}, 0.32)`
  const ring = `rgba(${r}, ${g}, ${b}, 0.30)`
  return (
    <div className="inkwash" aria-hidden="true">
      <span className="inkwash__bloom" style={{ '--ink': ink }} />
      <span className="inkwash__ring" style={{ '--ring': ring }} />
      <span className="inkwash__ring inkwash__ring--2" style={{ '--ring': ring }} />
    </div>
  )
}

// ---------------- 人工树 · 点灯 ----------------
const LIGHTS = [
  { elem: 'mu', x: 150, y: 128 },
  { elem: 'huo', x: 262, y: 112 },
  { elem: 'tu', x: 214, y: 196 },
  { elem: 'jin', x: 118, y: 204 },
  { elem: 'shui', x: 282, y: 214 },
]

function Tree({ collected }) {
  const [lit, setLit] = useState([])
  const [glow, setGlow] = useState(false)
  const collectedElems = useMemo(() => [...new Set(collected.map((c) => c.elem))], [collected])
  const order = CYCLE.filter((e) => collectedElems.includes(e))
  const hasAny = order.length > 0

  function release() {
    if (!hasAny) return
    setLit([])
    setGlow(false)
    order.forEach((e, i) => {
      setTimeout(() => setLit((prev) => [...prev, e]), 350 + i * 680)
    })
    setTimeout(() => setGlow(true), 350 + order.length * 680 + 400)
  }

  return (
    <div className="tree-stage">
      <svg viewBox="0 0 400 300" className="tree">
        {/* 枝干 */}
        <g className="tree-wood">
          <path d="M 200 290 C 198 230 196 200 200 165" />
          <path d="M 200 230 C 178 206 160 168 150 128" />
          <path d="M 200 218 C 222 198 248 158 262 112" />
          <path d="M 200 190 C 184 176 160 190 118 204" />
          <path d="M 200 184 C 218 176 246 190 282 214" />
          <path d="M 200 200 C 206 186 210 178 214 196" />
        </g>
        {/* 光点 */}
        {LIGHTS.map((l) => {
          const el = ELEMENTS[l.elem]
          const isCollected = collectedElems.includes(l.elem)
          const isLit = lit.includes(l.elem)
          return (
            <g key={l.elem}>
              {isLit && <circle cx={l.x} cy={l.y} r={16} fill={el.tone} className="tree-halo" />}
              <circle
                cx={l.x}
                cy={l.y}
                r={8}
                className={isLit ? 'tree-dot tree-dot--lit' : 'tree-dot'}
                fill={isLit ? el.tone : isCollected ? el.soft : '#C9CDCF'}
              />
              <text x={l.x} y={l.y + 26} textAnchor="middle" className={isLit ? 'tree-label tree-label--lit' : 'tree-label'}>
                {el.name}
              </text>
            </g>
          )
        })}
        {/* 混色光晕 */}
        {glow && <circle cx="200" cy="120" r="52" className="tree-crown" />}
      </svg>

      <div className="tree-actions">
        <div className={`beacon ${hasAny ? 'beacon--on' : ''}`}>
          <span className="beacon__dot" />
          {hasAny ? '人工树 · 已在附近' : '尚未拾色 · 树在等待'}
        </div>
        <button className="btn btn--release" disabled={!hasAny} onClick={release}>
          {lit.length === order.length && order.length > 0 ? '再释放一次' : '释 放'}
        </button>
        {glow && <p className="tree-note">你的五行之气，正与这棵树对话。</p>}
      </div>
    </div>
  )
}

// ---------------- 名帖（拾取结果） ----------------
function NameCard({ color, onCollect }) {
  const el = ELEMENTS[color.elem]
  return (
    <div className="overlay">
      <div className="namecard" role="dialog" aria-modal="true">
        <div className="namecard__swatch" style={{ background: color.hex }}>
          <span className="namecard__name" style={{ color: textOnHex(color.hex) }}>{color.name}</span>
        </div>
        <div className="namecard__meta">
          <span className="tag" style={{ '--t': el.tone }}>{el.five} · {el.name}</span>
          <span className="tag tag--dir">{el.dir}方</span>
          <span className="hex">{color.hex}</span>
        </div>
        <p className="namecard__story">{color.story}</p>
        <button className="btn btn--primary" onClick={onCollect}>收下</button>
      </div>
    </div>
  )
}

// ---------------- 羁绊卡 · 两色之间的感悟 ----------------
function BondCard({ a, b }) {
  const bond = bondNarrative(a, b)
  return (
    <div className={`bondcard bondcard--${bond.kind}`}>
      <div className="bondcard__head">
        <span className={`bondcard__badge bondcard__badge--${bond.kind}`}>{bond.label}</span>
        <span className="bondcard__title">{bond.title}</span>
      </div>
      <p className="bondcard__text"><BrushText text={bond.text} /></p>
      <div className="bondcard__pair">
        <span className="bondcard__dot" style={{ background: a.hex, color: textOnHex(a.hex) }}>{a.name}</span>
        <span className="bondcard__flow">↓</span>
        <span className="bondcard__dot" style={{ background: b.hex, color: textOnHex(b.hex) }}>{b.name}</span>
      </div>
    </div>
  )
}

// ---------------- 色块放大欣赏 ----------------
function SwatchView({ color, onClose }) {
  const el = ELEMENTS[color.elem]
  return (
    <div className="overlay" onClick={onClose}>
      <div className="swatchview" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="swatchview__block" style={{ background: color.hex }}>
          <span className="swatchview__name" style={{ color: textOnHex(color.hex) }}>{color.name}</span>
        </div>
        <div className="swatchview__meta">
          <span className="tag" style={{ '--t': el.tone }}>{el.five} · {el.name}</span>
          <span className="tag tag--dir">{el.dir}方</span>
          <span className="hex">{color.hex}</span>
        </div>
        <p className="swatchview__story">{color.story}</p>
        <button className="btn btn--ghost" onClick={onClose}>收起</button>
      </div>
    </div>
  )
}

// ---------------- 作品关联 · 图版（缩略图 + 色块高亮） ----------------
function ArtworkFigure({ color, detail = false }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const a = color.artwork
  const poly = a.highlight.map((p) => p.join(',')).join(' ')

  // 局部放大：视野缩放到高亮区域
  let viewBox = '0 0 400 300'
  if (detail) {
    const xs = a.highlight.map((p) => p[0])
    const ys = a.highlight.map((p) => p[1])
    const pad = 26
    const minX = Math.min(...xs) - pad
    const maxX = Math.max(...xs) + pad
    const minY = Math.min(...ys) - pad
    const maxY = Math.max(...ys) + pad
    viewBox = `${minX} ${minY} ${maxX - minX} ${maxY - minY}`
  }

  return (
    <svg viewBox={viewBox} className="artwork__fig" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`awp-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F4EFE1" />
          <stop offset="1" stopColor="#D9D0BE" />
        </linearGradient>
        <radialGradient id={`awc-${uid}`}>
          <stop offset="0" stopColor={color.hex} stopOpacity="0.5" />
          <stop offset="1" stopColor={color.hex} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#awp-${uid})`} />
      <circle cx="120" cy="120" r="82" fill={`url(#awc-${uid})`} />
      <circle cx="292" cy="214" r="96" fill={`url(#awc-${uid})`} opacity="0.72" />
      <path d="M 0 210 C 90 170 180 250 260 208 C 320 178 360 190 400 172" fill="none" stroke="#B8AD97" strokeWidth="2" opacity="0.55" />
      <polygon points={poly} fill={color.hex} opacity="0.34" className="artwork__hl-fill" />
      <polygon points={poly} fill="none" stroke={color.hex} strokeWidth="1.8" strokeDasharray="5 4" className="artwork__hl-line" />
    </svg>
  )
}

// ---------------- 作品关联 · 高清查看 ----------------
function ArtworkView({ color, onClose }) {
  const a = color.artwork
  const [detail, setDetail] = useState(false)
  return (
    <div className="overlay" onClick={onClose}>
      <div className="artwork-view" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="artwork-view__head">
          <span className="artwork-view__title">《{a.title}》</span>
          <span className="artwork-view__by">{a.artist} · {a.dynasty}</span>
        </div>
        <div className="artwork-view__stage">
          <ArtworkFigure color={color} detail={detail} />
          <span className="artwork-view__hl-note" style={{ borderColor: color.hex, color: color.hex }}>
            高亮区 · {color.name} {color.hex}
          </span>
        </div>
        <p className="artwork-view__fn">{a.colorFunction}</p>
        <p className="artwork-view__prompt">{a.observationPrompt}</p>
        {a.location && <p className="artwork-view__loc">📍 {a.location}</p>}
        <div className="artwork-view__actions">
          <button className="btn btn--ghost" onClick={() => setDetail((d) => !d)}>
            {detail ? '看全幅' : '看局部放大'}
          </button>
          <button className="btn btn--ghost" onClick={onClose}>收起</button>
        </div>
        <p className="artwork-view__credit">作品图片由广州艺术博物院提供 · 仅用于本展览配套数字体验</p>
      </div>
    </div>
  )
}

// ---------------- NFC 名帖 · 自动收下 ----------------
function NfcToast({ color, onDone }) {
  const el = ELEMENTS[color.elem]
  const [r, g, b] = hexToRgb(color.hex)
  const ink = `rgba(${r}, ${g}, ${b}, 0.38)`
  useEffect(() => {
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <div className="nfctoast" role="status">
      <span className="nfctoast__bloom" style={{ '--ink': ink }} />
      <div className="nfctoast__card">
        <span className="nfctoast__name" style={{ color: textOnHex(color.hex), background: color.hex }}>{color.name}</span>
        <div className="nfctoast__meta">
          <span className="tag" style={{ '--t': el.tone }}>{el.five} · {el.name}</span>
          <span className="tag tag--dir">{el.dir}方</span>
          <span className="hex">{color.hex}</span>
        </div>
        <span className="nfctoast__hint">碰一下 · 颜色已收入五色册</span>
      </div>
    </div>
  )
}

// ---------------- 五行大圆满 · 集齐五色的庆祝 ----------------
function FullCircleToast({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3400)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <div className="fulltoast" role="status">
      <span className="fulltoast__bloom" />
      <div className="fulltoast__card">
        <span className="fulltoast__seal">圆满</span>
        <span className="fulltoast__title">五行大圆满</span>
        <span className="fulltoast__hint">青赤黄白黑 · 相生相克，皆入你怀</span>
      </div>
    </div>
  )
}

// ---------------- 海报弹层 ----------------
function PosterModal({ colors, onClose }) {
  const ref = useRef(null)

  function save() {
    const el = ref.current
    const w = Number(el.getAttribute('width')) || 750
    const h = Number(el.getAttribute('height')) || 1000
    const xml = new XMLSerializer().serializeToString(el)
    const svg64 = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml)
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const scale = 2
      canvas.width = w * scale
      canvas.height = h * scale
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#F8F6F0'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.scale(scale, scale)
      ctx.drawImage(img, 0, 0, w, h)
      const a = document.createElement('a')
      a.download = '我的五行星盘.png'
      a.href = canvas.toDataURL('image/png')
      a.click()
    }
    img.src = svg64
  }

  return (
    <div className="overlay">
      <div className="poster-modal" role="dialog" aria-modal="true">
        <div className="poster-modal__scroll">
          <Poster ref={ref} colors={colors} />
        </div>
        <div className="poster-modal__bar">
          <button className="btn btn--ghost" onClick={onClose}>关闭</button>
          <button className="btn btn--primary" onClick={save}>保存图片</button>
        </div>
      </div>
    </div>
  )
}

// ---------------- 封面 ----------------
function Cover({ onEnter }) {
  return (
    <div className="cover">
      <div className="cover__inner">
        <Seal>五色</Seal>
        <h1 className="cover__title">五色·五行</h1>
        <p className="cover__sub">天地有大美而不言</p>
        <p className="cover__desc">
          一本会呼吸的五行色彩图鉴。五色对应五行，五行相生相克。
          <br />
          你是看展人，更是色彩的「采气者」与「观道人」。
        </p>
        <StarChart colors={[]} animate={false} className="cover__chart" />
        <button className="btn btn--primary btn--enter" onClick={onEnter}>翻开册页 · 开始拾色</button>
        <p className="cover__foot">广州艺博院 · 五色展 互动体验</p>
      </div>
    </div>
  )
}

// ---------------- 主应用 ----------------
const NAV = [
  { key: 'pick', glyph: '拾', label: '识色·拾取' },
  { key: 'collection', glyph: '集', label: '知色·典故' },
  { key: 'star', glyph: '星', label: '化色·游记' },
  { key: 'tree', glyph: '灯', label: '释色·点灯' },
]

export default function App() {
  const [entered, setEntered] = useState(false)
  const [view, setView] = useState('pick')
  const [collected, setCollected] = useState(loadCollected)
  const [cardId, setCardId] = useState(null)
  const [preview, setPreview] = useState(null)
  const [posterOpen, setPosterOpen] = useState(false)
  const [swatchId, setSwatchId] = useState(null)
  const [karmaOpen, setKarmaOpen] = useState(false)
  const [wash, setWash] = useState(null)
  const [artworkId, setArtworkId] = useState(null)
  const [nfcToast, setNfcToast] = useState(null)
  const [nfcReading, setNfcReading] = useState(false)
  const [nfcSupported] = useState(() => 'NDEFReader' in window)
  const [muted, setMutedState] = useState(() => sound.loadMuted())
  const [fullToast, setFullToast] = useState(false)
  const fileRef = useRef(null)
  const washSeq = useRef(0)
  const wasFullRef = useRef(null)

  const collectedColors = useMemo(() => collected.map(colorById).filter(Boolean), [collected])
  const fullCircle = useMemo(() => isFullCircle(collectedColors), [collectedColors])
  const cardColor = cardId ? colorById(cardId) : null
  const swatchColor = swatchId ? colorById(swatchId) : null
  const artworkColor = artworkId ? colorById(artworkId) : null

  useEffect(() => {
    try { localStorage.setItem(STORAGE, JSON.stringify(collected)) } catch { /* 忽略 */ }
  }, [collected])

  // 首次集齐五色（本次会话内的过渡）：金色庆祝 + 圆满音效
  useEffect(() => {
    if (wasFullRef.current === null) {
      wasFullRef.current = fullCircle
      return
    }
    if (fullCircle && !wasFullRef.current) {
      wasFullRef.current = true
      sound.playFullCircle()
      setFullToast(true)
    } else if (!fullCircle) {
      wasFullRef.current = false
    }
  }, [fullCircle])

  function toggleMute() {
    const next = !muted
    setMutedState(next)
    sound.setMuted(next)
  }

  // NFC / 二维码 URL 入口：?color=shiqing → 自动进入并收下（无需确认）
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('color')
    if (!id || !colorById(id)) return
    // 清理参数，避免刷新时重复触发
    const url = new URL(window.location.href)
    url.searchParams.delete('color')
    window.history.replaceState({}, '', url.pathname + url.search + url.hash)
    setEntered(true)
    setCollected((prev) => (prev.includes(id) ? prev : [...prev, id]))
    setNfcToast(colorById(id))
  }, [])

  function autoCollect(id) {
    const c = colorById(id)
    if (!c) return
    if (navigator.vibrate) navigator.vibrate(15)
    sound.playCollect()
    setCollected((prev) => (prev.includes(id) ? prev : [...prev, id]))
    setNfcToast(c)
  }

  // Web NFC（Android Chrome）：读取标签 URL 中的 color 参数
  async function startNfc() {
    if (!('NDEFReader' in window) || nfcReading) return
    setNfcReading(true)
    try {
      const ndef = new window.NDEFReader()
      await ndef.scan()
      ndef.addEventListener('reading', ({ message }) => {
        for (const rec of message.records) {
          let text = ''
          try { text = new TextDecoder().decode(rec.data) } catch { continue }
          const m = text.match(/color=([A-Za-z0-9_-]+)/)
          if (m && colorById(m[1])) {
            autoCollect(m[1])
            setNfcReading(false)
            break
          }
        }
      })
    } catch {
      setNfcReading(false)
    }
  }

  function doPick(id) {
    const c = colorById(id)
    sound.playPick()
    setPreview({ color: c, ts: Date.now() })
    washSeq.current += 1
    setWash({ key: washSeq.current, color: c })
    setTimeout(() => setCardId(id), 560)
  }

  function collect(id) {
    sound.playCollect()
    setCollected((prev) => (prev.includes(id) ? prev : [...prev, id]))
    setCardId(null)
    washSeq.current += 1
    setWash({ key: washSeq.current, color: colorById(id) })
  }

  function remove(id) {
    setCollected((prev) => prev.filter((x) => x !== id))
  }

  function onUpload(e) {
    const file = e.target.files && e.target.files[0]
    e.target.value = ''
    if (!file) return
    const img = new Image()
    img.onload = () => {
      const c = document.createElement('canvas')
      c.width = 48; c.height = 48
      const ctx = c.getContext('2d')
      ctx.drawImage(img, 0, 0, 48, 48)
      const d = ctx.getImageData(0, 0, 48, 48).data
      let r = 0, g = 0, b = 0, n = 0
      for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; n++ }
      const near = nearestColor(r / n, g / n, b / n)
      doPick(near.id)
    }
    img.src = URL.createObjectURL(file)
  }

  function enter() { setEntered(true); setView('pick') }

  return (
    <div className="app">
      {!entered ? (
        <Cover onEnter={enter} />
      ) : (
        <div className="frame">
          <header className="frame__head">
            <div className="frame__brand" onClick={() => setView('pick')}>
              <Seal size={30}>色</Seal>
              <span className="frame__title">五色·五行</span>
            </div>
            <div className="frame__head-right">
              <button
                className="sound-toggle"
                onClick={toggleMute}
                aria-label={muted ? '开启音效' : '静音'}
                title={muted ? '开启音效' : '静音'}
              >
                {muted ? '🔇' : '🔊'}
              </button>
              <span className="frame__count">{collected.length} 色</span>
            </div>
          </header>

          <main className="frame__body">
            {view === 'pick' && (
              <section className="view view--pick">
                <div className="viewfinder-stage">
                  <Viewfinder preview={preview} />
                  {wash && <InkWash key={wash.key} color={wash.color} />}
                </div>
                <div className="pick-tools">
                  {nfcSupported && (
                    <button className="btn btn--nfc" onClick={startNfc} disabled={nfcReading}>
                      {nfcReading ? '正在感应 NFC 标签…' : '碰一下 NFC · 拾色'}
                    </button>
                  )}
                  <button className="btn btn--upload" onClick={() => fileRef.current && fileRef.current.click()}>
                    上传照片 · 自动取色
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" hidden onChange={onUpload} />
                </div>
                {!nfcSupported && (
                  <p className="nfc-note">此设备暂不支持 Web NFC，可用二维码或上传照片拾色</p>
                )}
                <p className="pick-caption">或从册页色样中，拾取你心仪的一味</p>
                <div className="palette">
                  {COLORS.map((c) => {
                    const el = ELEMENTS[c.elem]
                    return (
                      <button key={c.id} className="swatch" onClick={() => doPick(c.id)}>
                        <span className="swatch__chip" style={{ background: softWash(c.hex) }}>
                          <span className="swatch__elem" style={{ color: el.tone }}>{el.name}</span>
                        </span>
                        <span className="swatch__name">{c.name}</span>
                      </button>
                    )
                  })}
                </div>
              </section>
            )}

            {view === 'collection' && (
              <section className="view">
                <h2 className="view__title">知色 · 典故</h2>
                <p className="view__sub">你拾起的每一味颜色，都是一段闲话</p>

                {collectedColors.length === 0 ? (
                  <div className="empty">
                    <p>还没有拾取颜色。</p>
                    <button className="btn btn--ghost" onClick={() => setView('pick')}>去拾色</button>
                  </div>
                ) : (
                  <div className="scroll-feed">
                    {fullCircle && (
                      <div className="fullcircle">
                        <span className="fullcircle__badge">五行大圆满</span>
                        <p className="fullcircle__text"><BrushText text={fullCircleNarrative(collectedColors)} /></p>
                      </div>
                    )}
                    {collectedColors.map((c, i) => {
                      const el = ELEMENTS[c.elem]
                      const next = collectedColors[i + 1]
                      return (
                        <Fragment key={c.id}>
                          <div className="colorcard">
                            <button
                              className="colorcard__chip"
                              style={{ background: c.hex }}
                              onClick={() => setSwatchId(c.id)}
                              title="点按放大欣赏"
                              aria-label={`放大欣赏 ${c.name}`}
                            />
                            <div className="colorcard__body">
                              <div className="colorcard__row">
                                <span className="colorcard__name">{c.name}</span>
                                <span className="tag" style={{ '--t': el.tone }}>{el.five} · {el.name} · {el.dir}</span>
                                <span className="colorcard__hex">{c.hex}</span>
                              </div>
                              <p className="colorcard__story"><BrushText text={c.story} /></p>
                              {c.artwork ? (
                                <button className="artwork" onClick={() => setArtworkId(c.id)} aria-label={`查看《${c.artwork.title}》作品关联`}>
                                  <ArtworkFigure color={c} />
                                  <span className="artwork__meta">
                                    <span className="artwork__title">《{c.artwork.title}》</span>
                                    <span className="artwork__by">{c.artwork.artist} · {c.artwork.dynasty}</span>
                                    {c.artwork.location && <span className="artwork__loc">{c.artwork.location}</span>}
                                  </span>
                                  <span className="artwork__prompt">{c.artwork.observationPrompt}</span>
                                </button>
                              ) : (
                                <div className="artwork artwork--empty">
                                  这一味颜色在广州艺博院的馆藏里，还有更多落点正在整理中。
                                </div>
                              )}
                            </div>
                            <button className="colorcard__del" onClick={() => remove(c.id)} aria-label="移除">×</button>
                          </div>
                          {next && <BondCard a={c} b={next} />}
                        </Fragment>
                      )
                    })}
                  </div>
                )}
              </section>
            )}

            {view === 'star' && (
              <section className="view view--star">
                <h2 className="view__title">化色 · 游记</h2>
                <p className="view__sub">你的收集路径，是一张五行星盘。拾满三色，还能结下一串专属手串</p>
                {collectedColors.length < 3 ? (
                  <div className="empty">
                    <StarChart colors={collectedColors} animate={false} className="empty__chart" />
                    <p>拾满三色，解锁你的五行星盘</p>
                    <div className="progress"><span style={{ width: `${(collectedColors.length / 3) * 100}%` }} /></div>
                    <button className="btn btn--ghost" onClick={() => setView('pick')}>继续拾色</button>
                  </div>
                ) : (
                  <div className="starview">
                    <StarChart colors={collectedColors} className="starview__chart" />
                    {fullCircle && (
                      <div className="fullcircle fullcircle--star">
                        <span className="fullcircle__badge">五行大圆满</span>
                        <p className="fullcircle__text">{fullCircleNarrative(collectedColors)}</p>
                      </div>
                    )}
                    <div className="starview__self">
                      <h3>我的五行自述</h3>
                      <p>{personality(collectedColors)}</p>
                    </div>
                    <div className="starview__actions">
                      <button className="btn btn--primary" onClick={() => setKarmaOpen(true)}>结缘 · 定制手串</button>
                      <button className="btn btn--ghost" onClick={() => setPosterOpen(true)}>生成分享海报</button>
                    </div>
                  </div>
                )}
              </section>
            )}

            {view === 'tree' && (
              <section className="view view--tree">
                <h2 className="view__title">释色 · 点灯</h2>
                <p className="view__sub">线上拾色，线下点灯。你的五行之气，将在这棵树上流转</p>
                <Tree collected={collectedColors} />
              </section>
            )}
          </main>

          <nav className="tabbar">
            {NAV.map((n) => (
              <button
                key={n.key}
                className={`tab ${view === n.key ? 'tab--active' : ''}`}
                onClick={() => setView(n.key)}
              >
                <span className="tab__glyph">{n.glyph}</span>
                <span className="tab__label">{n.label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}

      {cardColor && <NameCard color={cardColor} onCollect={() => collect(cardColor.id)} />}
      {swatchColor && <SwatchView color={swatchColor} onClose={() => setSwatchId(null)} />}
      {artworkColor && <ArtworkView color={artworkColor} onClose={() => setArtworkId(null)} />}
      {nfcToast && <NfcToast color={nfcToast} onDone={() => setNfcToast(null)} />}
      {fullToast && <FullCircleToast onDone={() => setFullToast(false)} />}
      {posterOpen && <PosterModal colors={collectedColors} onClose={() => setPosterOpen(false)} />}
      {karmaOpen && <KarmaModal colors={collectedColors} onClose={() => setKarmaOpen(false)} />}
    </div>
  )
}
