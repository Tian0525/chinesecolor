import { useMemo, useRef, useState } from 'react'
import { ELEMENTS } from './data'
import { SHICHEN, buildBracelet, destinyReading, encounterReading, karmaReading } from './gems'
import * as sound from './sound'
import BraceletPoster from './BraceletPoster'

// ---------------- 手串 · 珠子环（可复用的 SVG <g>） ----------------
export function braceletGroup(beads, { cx, cy, R, beadR, animate = false, halo = false } = {}) {
  const n = beads.length
  const pos = beads.map((b, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2
    return { bead: b, x: cx + R * Math.cos(angle), y: cy + R * Math.sin(angle) }
  })
  return (
    <g>
      {halo && <circle cx={cx} cy={cy} r={R + beadR * 2.5} className="bracelet-halo" />}
      <circle cx={cx} cy={cy} r={R} className={animate ? 'bracelet-string' : 'bracelet-string bracelet-string--static'} fill="none" />
      {pos.map((p, i) => (
        <g key={p.bead.key || i} className={animate ? 'bead' : 'bead bead--static'} style={{ '--i': i }}>
          <circle cx={p.x} cy={p.y} r={beadR} fill={p.bead.stone.hex} className="bead__body" />
          <circle cx={p.x - beadR * 0.32} cy={p.y - beadR * 0.32} r={beadR * 0.28} fill="#ffffff" opacity="0.72" />
        </g>
      ))}
    </g>
  )
}

// ---------------- 手串渲染（独立 SVG） ----------------
export function BraceletRing({ beads, size = 260, animate = true, center = null }) {
  const cx = size / 2
  const cy = size / 2
  const R = size * 0.34
  const beadR = size * 0.047
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="bracelet" role="img" aria-label="专属五行手串">
      {braceletGroup(beads, { cx, cy, R, beadR, animate, halo: animate })}
      {center && (
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" className="bracelet-center">
          {center}
        </text>
      )}
    </svg>
  )
}

// ---------------- 生辰帖（卷轴风选择年月日 + 时辰） ----------------
function BirthForm({ birth, setY, setM, setD, setZhi, days, years, onGenerate }) {
  return (
    <div className="birthform">
      <span className="karma__seal">结缘</span>
      <h2 className="karma__title">生辰帖</h2>
      <p className="karma__sub">写下你的出生年月日，算一算你的本命五行（日主）。时辰可选。</p>

      <div className="birthform__fields">
        <label className="birthform__field">
          <span className="birthform__label">年</span>
          <select value={birth.y} onChange={(e) => setY(Number(e.target.value))}>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </label>
        <label className="birthform__field">
          <span className="birthform__label">月</span>
          <select value={birth.m} onChange={(e) => setM(Number(e.target.value))}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </label>
        <label className="birthform__field">
          <span className="birthform__label">日</span>
          <select value={birth.d} onChange={(e) => setD(Number(e.target.value))}>
            {Array.from({ length: days }, (_, i) => i + 1).map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </label>
        <label className="birthform__field birthform__field--wide">
          <span className="birthform__label">时辰（可选）</span>
          <select value={birth.zhi} onChange={(e) => setZhi(e.target.value)}>
            <option value="">不填</option>
            {SHICHEN.map((s) => <option key={s.zhi} value={s.zhi}>{s.label}</option>)}
          </select>
        </label>
      </div>

      <button className="btn btn--primary birthform__submit" onClick={onGenerate}>测算本命 · 生成手串</button>
      <p className="karma__hint">日主天干的简化测算，供观展结缘一乐。</p>
    </div>
  )
}

// ---------------- 结缘弹层 ----------------
export default function KarmaModal({ colors, onClose }) {
  const [birth, setBirth] = useState({ y: 1995, m: 6, d: 15, zhi: '' })
  const [result, setResult] = useState(null)
  const [gen, setGen] = useState(0)
  const [linkCode, setLinkCode] = useState('')
  const [linkNote, setLinkNote] = useState('')
  const [posterOpen, setPosterOpen] = useState(false)
  const posterRef = useRef(null)

  const years = useMemo(() => {
    const arr = []
    for (let y = 2019; y >= 1945; y--) arr.push(y)
    return arr
  }, [])

  const days = new Date(birth.y, birth.m, 0).getDate()

  function setY(y) { setBirth((b) => ({ ...b, y, d: Math.min(b.d, new Date(y, b.m, 0).getDate()) })) }
  function setM(m) { setBirth((b) => ({ ...b, m, d: Math.min(b.d, new Date(b.y, m, 0).getDate()) })) }
  function setD(d) { setBirth((b) => ({ ...b, d })) }
  function setZhi(zhi) { setBirth((b) => ({ ...b, zhi })) }

  function generate() {
    sound.playKarma()
    setLinkNote('')
    setResult(buildBracelet(birth, colors, ''))
    setGen((g) => g + 1)
  }

  function redeem() {
    if (!linkCode.trim()) return
    sound.playKarma()
    const r = buildBracelet(birth, colors, linkCode.trim())
    setResult(r)
    setGen((g) => g + 1)
    setLinkNote(`已兑换「${r.linkBead.stone.name}」馆藏联名隐藏款 · 代表${ELEMENTS[r.linkBead.elem].name}之气`)
  }

  function savePoster() {
    const el = posterRef.current
    if (!el) return
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
      a.download = `${result.name}·手串图纸.png`
      a.href = canvas.toDataURL('image/png')
      a.click()
    }
    img.src = svg64
  }

  const items = result
    ? [result.main, ...result.accents, result.spacer, ...(result.linkBead ? [result.linkBead] : [])]
    : []

  return (
    <>
      <div className="overlay">
        <div className="karma" role="dialog" aria-modal="true">
          <div className="karma__scroll">
            {!result ? (
              <BirthForm
                birth={birth}
                setY={setY}
                setM={setM}
                setD={setD}
                setZhi={setZhi}
                days={days}
                years={years}
                onGenerate={generate}
              />
            ) : (
              <div className="karma-result">
                <div className="karma-result__ring">
                  <BraceletRing key={gen} beads={result.beads} center={ELEMENTS[result.life].name} />
                </div>
                <div className="karma-result__name">
                  <span className="karma__seal">结缘</span>
                  <h2 className="karma__title">【{result.name}】</h2>
                </div>

                <div className="karma-badges">
                  <span className="tag" style={{ '--t': ELEMENTS[result.life].tone }}>天命 · {result.dm.gan}{result.dm.zhi} · 本命{ELEMENTS[result.life].name}</span>
                  <span className="tag" style={{ '--t': ELEMENTS[result.balance].tone }}>调和 · {ELEMENTS[result.balance].name}克{ELEMENTS[result.life].name}</span>
                </div>

                <div className="readings">
                  <div className="reading">
                    <span className="reading__head">天命 · 本命</span>
                    <p className="reading__text">{destinyReading(result.dm, birth)}</p>
                  </div>
                  <div className="reading">
                    <span className="reading__head">知遇 · 观展</span>
                    <p className="reading__text">{encounterReading(colors)}</p>
                  </div>
                  <div className="reading reading--karma">
                    <span className="reading__head">结缘 · 方案</span>
                    <p className="reading__text">{karmaReading(result)}</p>
                  </div>
                </div>

                <div className="recipe">
                  <div className="recipe__head">
                    <h4>专属配方单</h4>
                    <span className="recipe__hint">凭此单到线下手作坊，像抓中药一样抓珠</span>
                  </div>
                  {items.map((it) => {
                    const el = ELEMENTS[it.elem]
                    return (
                      <div key={it.role + it.stone.name} className="recipe__item">
                        <span className="recipe__dot" style={{ background: it.stone.hex }} />
                        <span className="recipe__stone">{it.stone.name}</span>
                        <span className="recipe__elem" style={{ color: el.tone }}>{el.name}</span>
                        <span className="recipe__role">{it.role}</span>
                        <span className="recipe__count">× {it.count}</span>
                      </div>
                    )
                  })}
                </div>

                <div className="linkcode">
                  <div className="linkcode__head">
                    <h4>馆藏联名 · 联动码</h4>
                    <span className="recipe__hint">做过艺博院色彩人格测试？输入联动码，赠你一颗隐藏款隔珠</span>
                  </div>
                  <div className="linkcode__row">
                    <input
                      value={linkCode}
                      onChange={(e) => { setLinkCode(e.target.value); setLinkNote('') }}
                      placeholder="输入联动码"
                      className="linkcode__input"
                    />
                    <button className="btn btn--ghost" onClick={redeem} disabled={!linkCode.trim()}>兑换</button>
                  </div>
                  {linkNote && <p className="linkcode__note">{linkNote}</p>}
                </div>

                <div className="made">
                  <div className="made__text">
                    <h4>线下转化 · 物华结缘手作坊</h4>
                    <p>持配方单到展厅手作坊，现场抓珠亲手穿串；不愿动手，也可由艺博院代工定制，配馆藏元素包装盒与品牌证书。</p>
                  </div>
                  <button className="btn btn--ghost" onClick={() => sound.playCollect()}>下单代工定制（演示）</button>
                </div>
              </div>
            )}
          </div>
          <div className="karma__bar">
            <button className="btn btn--ghost" onClick={onClose}>关闭</button>
            {result ? (
              <>
                <button className="btn btn--ghost" onClick={generate}>重新测算</button>
                <button className="btn btn--primary" onClick={() => setPosterOpen(true)}>手串图纸</button>
              </>
            ) : (
              <button className="btn btn--primary" onClick={generate}>测算本命</button>
            )}
          </div>
        </div>
      </div>

      {posterOpen && result && (
        <div className="overlay overlay--top">
          <div className="poster-modal" role="dialog" aria-modal="true">
            <div className="poster-modal__scroll">
              <BraceletPoster ref={posterRef} result={result} colors={colors} />
            </div>
            <div className="poster-modal__bar">
              <button className="btn btn--ghost" onClick={() => setPosterOpen(false)}>关闭</button>
              <button className="btn btn--primary" onClick={savePoster}>保存图片</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
