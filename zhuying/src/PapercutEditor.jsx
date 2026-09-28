import { useEffect, useRef, useState } from 'react'
import { STICKERS } from './data'
import * as sound from './sound'

const SIZE = 480 // 画布内部分辨率

// 灯面六边形引导线（480×480 内接）
const GUIDE = 'M240 30 L58 135 L58 345 L240 450 L422 345 L422 135 Z'

function StickerIcon({ id, size = 44 }) {
  const ref = useRef(null)
  useEffect(() => {
    const s = STICKERS.find((x) => x.id === id)
    if (!s) return
    const c = ref.current
    const ctx = c.getContext('2d')
    ctx.clearRect(0, 0, size, size)
    ctx.save()
    ctx.translate(size / 2, size / 2)
    const k = (size / 100) * 0.86
    ctx.scale(k, k)
    ctx.translate(-50, -50)
    s.draw(ctx)
    ctx.restore()
  }, [id, size])
  return <canvas ref={ref} width={size} height={size} />
}

function drawStickerAt(ctx, s, x, y, px, flip) {
  const k = px / 100
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(flip ? -k : k, k)
  ctx.translate(-50, -50)
  s.draw(ctx)
  ctx.restore()
}

export default function PapercutEditor({ frames, onChange }) {
  const canvasRef = useRef(null)
  const framesRef = useRef(frames)
  const historyRef = useRef([])
  const drawingRef = useRef(false)
  const lastRef = useRef(null)
  const playRef = useRef(null)

  const [tool, setTool] = useState('brush')
  const [stickerId, setStickerId] = useState('cat')
  const [size, setSize] = useState(16)
  const [stickerSize, setStickerSize] = useState(140)
  const [symmetry, setSymmetry] = useState(false)
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [canUndo, setCanUndo] = useState(false)

  useEffect(() => { framesRef.current = frames }, [frames])

  // 载入当前帧
  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    ctx.clearRect(0, 0, SIZE, SIZE)
    const src = frames[active]
    if (src) {
      const img = new Image()
      img.onload = () => ctx.drawImage(img, 0, 0)
      img.src = src
    }
    historyRef.current = []
    setCanUndo(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  function ctx2d() {
    return canvasRef.current.getContext('2d')
  }

  function pushHistory() {
    const c = canvasRef.current
    historyRef.current.push(c.toDataURL('image/png'))
    if (historyRef.current.length > 40) historyRef.current.shift()
    setCanUndo(true)
  }

  function snapshot() {
    const c = canvasRef.current
    const url = c.toDataURL('image/png')
    const next = framesRef.current.slice()
    next[active] = url
    onChange(next)
  }

  function pos(e) {
    const rect = canvasRef.current.getBoundingClientRect()
    return {
      x: ((e.clientX - rect.left) / rect.width) * SIZE,
      y: ((e.clientY - rect.top) / rect.height) * SIZE,
    }
  }

  function seg(a, b) {
    const ctx = ctx2d()
    ctx.save()
    if (tool === 'erase') ctx.globalCompositeOperation = 'destination-out'
    ctx.strokeStyle = '#000'
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = size
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.stroke()
    if (symmetry) {
      ctx.beginPath()
      ctx.moveTo(SIZE - a.x, a.y)
      ctx.lineTo(SIZE - b.x, b.y)
      ctx.stroke()
    }
    ctx.restore()
  }

  function onDown(e) {
    if (playing) return
    canvasRef.current.setPointerCapture(e.pointerId)
    if (tool === 'sticker') {
      const p = pos(e)
      const s = STICKERS.find((x) => x.id === stickerId)
      if (!s) return
      pushHistory()
      drawStickerAt(ctx2d(), s, p.x, p.y, stickerSize, false)
      if (symmetry) drawStickerAt(ctx2d(), s, SIZE - p.x, p.y, stickerSize, true)
      snapshot()
      sound.playStamp()
      return
    }
    const p = pos(e)
    drawingRef.current = true
    lastRef.current = p
    pushHistory()
    seg(p, p)
    sound.playStroke()
  }

  function onMove(e) {
    if (!drawingRef.current) return
    const p = pos(e)
    seg(lastRef.current, p)
    lastRef.current = p
  }

  function onUp() {
    if (!drawingRef.current) return
    drawingRef.current = false
    lastRef.current = null
    snapshot()
  }

  function undo() {
    const prev = historyRef.current.pop()
    if (prev == null) return
    setCanUndo(historyRef.current.length > 0)
    const ctx = ctx2d()
    const img = new Image()
    img.onload = () => {
      ctx.clearRect(0, 0, SIZE, SIZE)
      ctx.drawImage(img, 0, 0)
      snapshot()
    }
    img.src = prev
    sound.playErase()
  }

  function clearFrame() {
    pushHistory()
    ctx2d().clearRect(0, 0, SIZE, SIZE)
    snapshot()
    sound.playErase()
  }

  function copyPrev() {
    const src = frames[active > 0 ? active - 1 : 11]
    pushHistory()
    const ctx = ctx2d()
    ctx.clearRect(0, 0, SIZE, SIZE)
    if (src) {
      const img = new Image()
      img.onload = () => { ctx.drawImage(img, 0, 0); snapshot() }
      img.src = src
    } else {
      snapshot()
    }
  }

  function togglePlay() {
    if (playing) {
      clearInterval(playRef.current)
      playRef.current = null
      setPlaying(false)
      return
    }
    setPlaying(true)
    let i = active
    playRef.current = setInterval(() => {
      i = (i + 1) % 12
      setActive(i)
    }, 150)
  }

  function pickFrame(i) {
    if (playing) {
      clearInterval(playRef.current)
      playRef.current = null
      setPlaying(false)
    }
    setActive(i)
  }

  useEffect(() => () => clearInterval(playRef.current), [])

  const drawn = frames.some((f) => f)

  return (
    <div className="editor">
      {/* 工具栏 */}
      <div className="editor__tools">
        <div className="toolseg">
          <button className={`tool ${tool === 'brush' ? 'tool--on' : ''}`} onClick={() => setTool('brush')}>画笔</button>
          <button className={`tool ${tool === 'sticker' ? 'tool--on' : ''}`} onClick={() => setTool('sticker')}>剪影</button>
          <button className={`tool ${tool === 'erase' ? 'tool--on' : ''}`} onClick={() => setTool('erase')}>镂空</button>
        </div>

        <label className={`opt ${symmetry ? 'opt--on' : ''}`}>
          <input type="checkbox" checked={symmetry} onChange={(e) => setSymmetry(e.target.checked)} />
          对称
        </label>

        {tool !== 'sticker' ? (
          <label className="slider">
            <span>笔粗细</span>
            <input type="range" min="4" max="48" value={size} onChange={(e) => setSize(Number(e.target.value))} />
            <b>{size}</b>
          </label>
        ) : (
          <label className="slider">
            <span>剪影大小</span>
            <input type="range" min="60" max="240" value={stickerSize} onChange={(e) => setStickerSize(Number(e.target.value))} />
            <b>{stickerSize}</b>
          </label>
        )}

        <div className="toolseg">
          <button className="tool tool--minor" onClick={undo} disabled={!canUndo}>撤销</button>
          <button className="tool tool--minor" onClick={clearFrame}>清空</button>
          <button className="tool tool--minor" onClick={copyPrev}>复制上帧</button>
        </div>
      </div>

      {/* 剪影库 */}
      {tool === 'sticker' && (
        <div className="stickers">
          {STICKERS.map((s) => (
            <button
              key={s.id}
              className={`sticker ${stickerId === s.id ? 'sticker--on' : ''}`}
              onClick={() => { setStickerId(s.id); sound.playStamp() }}
              title={s.name}
            >
              <StickerIcon id={s.id} />
              <span>{s.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* 灯面画布 */}
      <div className="editor__stage">
        <canvas
          ref={canvasRef}
          width={SIZE}
          height={SIZE}
          className="editor__canvas"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        />
        <svg className="editor__guide" viewBox="0 0 480 480" aria-hidden="true">
          <path d={GUIDE} fill="none" stroke="rgba(242,239,233,0.35)" strokeWidth="2" strokeDasharray="7 6" />
          {symmetry && <line x1="240" y1="20" x2="240" y2="460" stroke="rgba(224,122,58,0.5)" strokeWidth="1.5" strokeDasharray="5 5" />}
        </svg>
        <span className="editor__frameno">第 {active + 1} / 12 帧</span>
      </div>

      {/* 帧位导航 */}
      <div className="frames">
        {frames.map((f, i) => (
          <button
            key={i}
            className={`frame ${i === active ? 'frame--on' : ''} ${playing && i === active ? 'frame--play' : ''}`}
            onClick={() => pickFrame(i)}
          >
            {f ? <img src={f} alt={`第${i + 1}帧`} /> : <span className="frame__empty">{i + 1}</span>}
            <em>{i + 1}</em>
          </button>
        ))}
      </div>

      <div className="editor__bar">
        <p className="editor__hint">
          {tool === 'brush' && '手绘黑色剪影，模拟皮影的透光轮廓'}
          {tool === 'sticker' && '在灯面上点一下，落下剪影'}
          {tool === 'erase' && '擦出镂空，让光透进来'}
        </p>
        <button className={`btn btn--primary ${playing ? 'btn--playing' : ''}`} onClick={togglePlay}>
          {playing ? '停止播放' : '▶ 播放预览'}
        </button>
        {drawn && <span className="editor__done">已绘制 {frames.filter(Boolean).length} 帧</span>}
      </div>
    </div>
  )
}
