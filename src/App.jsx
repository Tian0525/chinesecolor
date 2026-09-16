import { useEffect, useMemo, useRef, useState } from 'react'
import { COLORS, colorById, ELEMENTS, CYCLE, bondNarrative, personality, textOnHex } from './data'
import StarChart from './StarChart'
import Poster from './Poster'
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

// ---------------- 收下时 · 屏幕四边水墨晕染 ----------------
function InkWash({ color }) {
  const [r, g, b] = color ? hexToRgb(color.hex) : [44, 44, 44]
  const ink = `rgba(${r}, ${g}, ${b}, 0.30)`
  return (
    <div className="inkwash" aria-hidden="true">
      <span className="inkwash__vignette" />
      {['tl', 'tc', 'tr', 'bl', 'bc', 'br'].map((pos) => (
        <span key={pos} className={`inkwash__blob inkwash__blob--${pos}`} style={{ '--ink': ink }} />
      ))}
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

// ---------------- 羁绊弹层 ----------------
function BondModal({ a, b, onClose }) {
  const bond = bondNarrative(a, b)
  return (
    <div className="overlay">
      <div className="bond" role="dialog" aria-modal="true">
        <div className={`bond__badge bond__badge--${bond.kind}`}>{bond.label}</div>
        <h3 className="bond__title">{bond.title}</h3>
        <div className="bond__pair">
          <span className="bond__dot" style={{ background: a.hex, color: textOnHex(a.hex) }}>{a.name}</span>
          <span className="bond__arrow">→</span>
          <span className="bond__dot" style={{ background: b.hex, color: textOnHex(b.hex) }}>{b.name}</span>
        </div>
        <p className="bond__text">{bond.text}</p>
        <button className="btn btn--ghost" onClick={onClose}>知道了</button>
      </div>
    </div>
  )
}

// ---------------- 海报弹层 ----------------
function PosterModal({ colors, onClose }) {
  const ref = useRef(null)

  function save() {
    const el = ref.current
    const xml = new XMLSerializer().serializeToString(el)
    const svg64 = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml)
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const scale = 2
      canvas.width = 750 * scale
      canvas.height = 1000 * scale
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#F8F6F0'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.scale(scale, scale)
      ctx.drawImage(img, 0, 0, 750, 1000)
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
  const [previewIdx, setPreviewIdx] = useState(null)
  const [bondOpen, setBondOpen] = useState(false)
  const [posterOpen, setPosterOpen] = useState(false)
  const [wash, setWash] = useState(null)
  const fileRef = useRef(null)
  const washSeq = useRef(0)

  const collectedColors = useMemo(() => collected.map(colorById).filter(Boolean), [collected])
  const cardColor = cardId ? colorById(cardId) : null

  useEffect(() => {
    try { localStorage.setItem(STORAGE, JSON.stringify(collected)) } catch { /* 忽略 */ }
  }, [collected])

  function doPick(id) {
    const c = colorById(id)
    setPreview({ color: c, ts: Date.now() })
    setTimeout(() => setCardId(id), 560)
  }

  function collect(id) {
    setCollected((prev) => (prev.includes(id) ? prev : [...prev, id]))
    setCardId(null)
    setPreviewIdx(null)
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

  const pairs = useMemo(() => {
    const p = []
    for (let i = 1; i < collectedColors.length; i++) p.push([collectedColors[i - 1], collectedColors[i]])
    return p
  }, [collectedColors])

  const shownIdx = pairs.length ? Math.min(Math.max(previewIdx ?? pairs.length - 1, 0), pairs.length - 1) : 0

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
            <span className="frame__count">{collected.length} 色</span>
          </header>

          <main className="frame__body">
            {view === 'pick' && (
              <section className="view view--pick">
                <Viewfinder preview={preview} />
                <div className="pick-tools">
                  <button className="btn btn--upload" onClick={() => fileRef.current && fileRef.current.click()}>
                    上传照片 · 自动取色
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" hidden onChange={onUpload} />
                </div>
                <p className="pick-caption">或从册页色样中，拾取你心仪的一味</p>
                <div className="palette">
                  {COLORS.map((c) => {
                    const el = ELEMENTS[c.elem]
                    return (
                      <button key={c.id} className="swatch" onClick={() => doPick(c.id)}>
                        <span className="swatch__chip" style={{ background: c.hex }}>
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
                  <>
                    <div className="cards">
                      {collectedColors.map((c) => {
                        const el = ELEMENTS[c.elem]
                        return (
                          <div key={c.id} className="colorcard">
                            <span className="colorcard__chip" style={{ background: c.hex }} />
                            <div className="colorcard__body">
                              <div className="colorcard__row">
                                <span className="colorcard__name">{c.name}</span>
                                <span className="tag" style={{ '--t': el.tone }}>{el.five} · {el.name} · {el.dir}</span>
                              </div>
                              <p className="colorcard__story">{c.story}</p>
                            </div>
                            <button className="colorcard__del" onClick={() => remove(c.id)} aria-label="移除">×</button>
                          </div>
                        )
                      })}
                    </div>

                    {pairs.length > 0 && (
                      <div className="bond-panel">
                        <div className="bond-panel__head">
                          <h3>色彩羁绊</h3>
                          <div className="bond-panel__nav">
                            <button className="bond-nav" disabled={pairs.length <= 1}
                              onClick={() => setPreviewIdx(Math.max(0, (previewIdx ?? pairs.length - 1) - 1))}>‹</button>
                            <span className="bond-nav__idx">{shownIdx + 1}/{pairs.length}</span>
                            <button className="bond-nav" disabled={pairs.length <= 1}
                              onClick={() => setPreviewIdx(Math.min(pairs.length - 1, (previewIdx ?? pairs.length - 1) + 1))}>›</button>
                          </div>
                        </div>
                        {(() => {
                          const [a, b] = pairs[shownIdx]
                          const bond = bondNarrative(a, b)
                          return (
                            <button className="bond-card" onClick={() => setBondOpen(true)}>
                              <span className={`bond-card__badge bond-card__badge--${bond.kind}`}>{bond.label} · {bond.title}</span>
                              <p className="bond-card__text">{bond.text}</p>
                            </button>
                          )
                        })()}
                      </div>
                    )}
                  </>
                )}
              </section>
            )}

            {view === 'star' && (
              <section className="view view--star">
                <h2 className="view__title">化色 · 游记</h2>
                <p className="view__sub">你的收集路径，是一张五行星盘</p>
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
                    <div className="starview__self">
                      <h3>我的五行自述</h3>
                      <p>{personality(collectedColors)}</p>
                    </div>
                    <button className="btn btn--primary" onClick={() => setPosterOpen(true)}>生成分享海报</button>
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

          {wash && <InkWash key={wash.key} color={wash.color} />}
        </div>
      )}

      {cardColor && <NameCard color={cardColor} onCollect={() => collect(cardColor.id)} />}
      {bondOpen && pairs.length > 0 && (
        <BondModal a={pairs[shownIdx][0]} b={pairs[shownIdx][1]} onClose={() => setBondOpen(false)} />
      )}
      {posterOpen && <PosterModal colors={collectedColors} onClose={() => setPosterOpen(false)} />}
    </div>
  )
}
