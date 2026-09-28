// 极轻音效 —— WebAudio 合成（落笔 / 贴纸 / 点燃 / 烛火噼啪），无需音频文件，音量极低
let ctx = null
let muted = false
let crackleNodes = null
let crackleTimer = null

const MUTE_KEY = 'zhuying:muted'

function ensureCtx() {
  if (typeof window === 'undefined') return null
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  if (!ctx) ctx = new AC()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

export function loadMuted() {
  try { muted = localStorage.getItem(MUTE_KEY) === '1' } catch { muted = false }
  return muted
}

export function isMuted() { return muted }

export function setMuted(m) {
  muted = m
  try { localStorage.setItem(MUTE_KEY, m ? '1' : '0') } catch { /* 忽略 */ }
  if (m) stopCrackle()
}

// 单音合成：振荡器 + 增益包络
function tone({ freq = 440, end = null, type = 'sine', dur = 0.3, gain = 0.05, when = 0 }) {
  const c = ensureCtx()
  if (!c || muted) return
  const t0 = c.currentTime + when
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (end) osc.frequency.exponentialRampToValueAtTime(Math.max(end, 1), t0 + dur)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g).connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.05)
}

// 落笔：极轻的摩擦感
export function playStroke() {
  tone({ freq: 920, end: 520, type: 'triangle', dur: 0.045, gain: 0.016 })
}

// 贴纸落下
export function playStamp() {
  tone({ freq: 540, type: 'sine', dur: 0.09, gain: 0.03 })
  tone({ freq: 810, type: 'sine', dur: 0.06, gain: 0.02, when: 0.02 })
}

// 撤销 / 清空
export function playErase() {
  tone({ freq: 700, end: 360, type: 'triangle', dur: 0.07, gain: 0.02 })
}

// 点燃：一口气 + 开始烛火噼啪
export function playIgnite() {
  tone({ freq: 170, end: 640, type: 'sawtooth', dur: 0.5, gain: 0.024 })
  tone({ freq: 880, end: 1320, type: 'sine', dur: 0.4, gain: 0.02, when: 0.08 })
  startCrackle()
}

// 烛火噼啪：持续低频气流噪声 + 随机短促 crackle
function startCrackle() {
  stopCrackle()
  const c = ensureCtx()
  if (!c || muted) return
  const buffer = c.createBuffer(1, c.sampleRate * 2, c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.5
  const src = c.createBufferSource()
  src.buffer = buffer
  src.loop = true
  const bp = c.createBiquadFilter()
  bp.type = 'lowpass'
  bp.frequency.value = 900
  const g = c.createGain()
  g.gain.value = 0.011
  src.connect(bp).connect(g).connect(c.destination)
  src.start()
  crackleNodes = { src, g }

  function pop() {
    if (muted) return
    tone({ freq: 1400 + Math.random() * 2200, end: 300, type: 'square', dur: 0.02, gain: 0.011 })
    crackleTimer = setTimeout(pop, 350 + Math.random() * 1600)
  }
  crackleTimer = setTimeout(pop, 500)
}

export function stopCrackle() {
  if (crackleNodes) {
    try { crackleNodes.src.stop() } catch { /* 忽略 */ }
    crackleNodes = null
  }
  if (crackleTimer) {
    clearTimeout(crackleTimer)
    crackleTimer = null
  }
}

// 提交到画廊 / 点亮（点赞）
export function playLike() {
  tone({ freq: 660, type: 'sine', dur: 0.12, gain: 0.028 })
  tone({ freq: 990, type: 'sine', dur: 0.16, gain: 0.02, when: 0.06 })
}
