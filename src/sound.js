// 极轻音效 —— WebAudio 合成（水滴 / 古琴拨弦 / 圆满泛音），无需音频文件，音量极低
let ctx = null
let muted = false

const MUTE_KEY = 'wuse:muted'

function ensureCtx() {
  if (typeof window === 'undefined') return null
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  if (!ctx) ctx = new AC()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

// 初始静音状态（从本地读取，默认开启）
export function loadMuted() {
  try { muted = localStorage.getItem(MUTE_KEY) === '1' } catch { muted = false }
  return muted
}

export function isMuted() {
  return muted
}

export function setMuted(m) {
  muted = m
  try { localStorage.setItem(MUTE_KEY, m ? '1' : '0') } catch { /* 忽略 */ }
}

// 单音合成：振荡器 + 增益包络（快速起音、指数衰减）
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

// 水滴声：高频滑向低频，快速消失
export function playPick() {
  tone({ freq: 1350, end: 320, type: 'sine', dur: 0.22, gain: 0.05 })
}

// 拨弦声：基音 + 八度泛音叠加
export function playCollect() {
  tone({ freq: 330, end: 210, type: 'triangle', dur: 0.3, gain: 0.045 })
  tone({ freq: 660, end: 440, type: 'sine', dur: 0.18, gain: 0.03 })
}

// 圆满泛音：柔和上行五音（青赤黄白黑）
export function playFullCircle() {
  const notes = [392, 440, 523, 659, 784] // G4 A4 C5 E5 G5
  notes.forEach((f, i) => tone({ freq: f, type: 'sine', dur: 0.5, gain: 0.04, when: i * 0.12 }))
}
