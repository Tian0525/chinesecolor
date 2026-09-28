// 逐影 · 把故事藏进灯里 —— 数据与配置
// 依《逐影 · 互动网页 PRD》V1.0 构建

// ---------------- 灯身选项 ----------------
export const OUTLINES = [
  { id: 'hex', name: '六边形', sub: '经典' },
  { id: 'cat', name: '猫耳六边形', sub: '俏皮' },
  { id: 'round', name: '圆形', sub: '温润' },
  { id: 'petal', name: '花瓣形', sub: '玲珑' },
]

export const BODY_COLORS = [
  { id: 'orange', name: '暖橙', hex: '#E07A3A' },
  { id: 'amber', name: '琥珀金', hex: '#C89B3C' },
  { id: 'white', name: '磨砂白', hex: '#F2EFE9' },
  { id: 'black', name: '哑光黑', hex: '#2A2A2A' },
  { id: 'clear', name: '透明', hex: '#EFE9DC' },
]

export const SURFACES = [
  { id: 'clear', name: '透明' },
  { id: 'frost', name: '磨砂' },
  { id: 'grad', name: '渐变' },
  { id: 'carve', name: '雕刻纹理' },
]

export const BASES = [
  { id: 'walnut', name: '胡桃木' },
  { id: 'ebony', name: '乌檀木' },
  { id: 'acrylic', name: '亚克力' },
  { id: 'mother', name: '螺钿镶嵌' },
]

export const FILMS = [
  { id: 'clear', name: '透明' },
  { id: 'frost', name: '磨砂' },
  { id: 'color', name: '彩色' },
]

export const SCENTS = [
  { id: 'jasmine', name: '青草茉莉', note: '雨后青草，掺一缕茉莉' },
  { id: 'citrus', name: '白茶柑橘', note: '白茶温润，柑橘清亮' },
  { id: 'sandalwood', name: '檀香琥珀', note: '檀香沉静，琥珀回甘' },
  { id: 'cinnamon', name: '橘子肉桂', note: '橘子暖甜，肉桂辛香' },
  { id: 'incense', name: '木质焚香', note: '木香袅袅，焚香入定' },
]

export const FLAMES = [
  { id: 'warm', name: '暖黄', hex: '#ffd98a' },
  { id: 'orange', name: '暖橙', hex: '#ffb85c' },
  { id: 'amber', name: '琥珀', hex: '#ff9d4d' },
]

export const SPEEDS = [
  { id: 'slow', name: '慢', rpm: 3, dur: 22, hint: '缓缓流淌' },
  { id: 'mid', name: '中', rpm: 5, dur: 13, hint: '不疾不徐' },
  { id: 'fast', name: '快', rpm: 8, dur: 8, hint: '光影飞转' },
]

// ---------------- 剪影库（皮影元素，黑剪影绘制） ----------------
function black(ctx) {
  ctx.fillStyle = '#000'
  ctx.strokeStyle = '#000'
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
}

function drawCat(ctx) {
  black(ctx)
  // 身躯（蹲坐）
  ctx.beginPath()
  ctx.moveTo(30, 88)
  ctx.quadraticCurveTo(26, 58, 38, 50)
  ctx.quadraticCurveTo(44, 38, 54, 38)
  ctx.quadraticCurveTo(62, 40, 66, 50)
  ctx.quadraticCurveTo(74, 62, 72, 78)
  ctx.quadraticCurveTo(70, 88, 58, 88)
  ctx.closePath()
  ctx.fill()
  // 头
  ctx.beginPath()
  ctx.arc(48, 34, 14, 0, Math.PI * 2)
  ctx.fill()
  // 耳朵
  ctx.beginPath(); ctx.moveTo(37, 25); ctx.lineTo(35, 12); ctx.lineTo(48, 22); ctx.closePath(); ctx.fill()
  ctx.beginPath(); ctx.moveTo(58, 22); ctx.lineTo(61, 10); ctx.lineTo(67, 26); ctx.closePath(); ctx.fill()
  // 尾巴
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.moveTo(68, 80)
  ctx.quadraticCurveTo(86, 78, 86, 62)
  ctx.quadraticCurveTo(86, 50, 76, 52)
  ctx.stroke()
}

function drawButterfly(ctx) {
  black(ctx)
  // 上翅
  ctx.beginPath()
  ctx.moveTo(50, 54)
  ctx.quadraticCurveTo(34, 24, 14, 30)
  ctx.quadraticCurveTo(28, 46, 50, 54)
  ctx.closePath(); ctx.fill()
  ctx.beginPath()
  ctx.moveTo(50, 54)
  ctx.quadraticCurveTo(66, 24, 86, 30)
  ctx.quadraticCurveTo(72, 46, 50, 54)
  ctx.closePath(); ctx.fill()
  // 下翅
  ctx.beginPath()
  ctx.moveTo(50, 56)
  ctx.quadraticCurveTo(34, 72, 26, 86)
  ctx.quadraticCurveTo(42, 76, 50, 62)
  ctx.closePath(); ctx.fill()
  ctx.beginPath()
  ctx.moveTo(50, 56)
  ctx.quadraticCurveTo(66, 72, 74, 86)
  ctx.quadraticCurveTo(58, 76, 50, 62)
  ctx.closePath(); ctx.fill()
  // 身体
  ctx.beginPath()
  ctx.ellipse(50, 56, 3.5, 16, 0, 0, Math.PI * 2)
  ctx.fill()
  // 触角
  ctx.lineWidth = 2
  ctx.beginPath(); ctx.moveTo(48, 42); ctx.quadraticCurveTo(42, 34, 38, 30); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(52, 42); ctx.quadraticCurveTo(58, 34, 62, 30); ctx.stroke()
}

function drawFish(ctx) {
  black(ctx)
  // 尾巴
  ctx.beginPath()
  ctx.moveTo(22, 52)
  ctx.lineTo(8, 38)
  ctx.lineTo(12, 52)
  ctx.lineTo(8, 66)
  ctx.closePath(); ctx.fill()
  // 身体
  ctx.beginPath()
  ctx.moveTo(22, 52)
  ctx.quadraticCurveTo(30, 30, 58, 34)
  ctx.quadraticCurveTo(78, 42, 84, 52)
  ctx.quadraticCurveTo(78, 62, 58, 70)
  ctx.quadraticCurveTo(30, 74, 22, 52)
  ctx.closePath(); ctx.fill()
}

function drawBird(ctx) {
  black(ctx)
  // 身体
  ctx.beginPath()
  ctx.ellipse(50, 54, 18, 9, -0.08, 0, Math.PI * 2)
  ctx.fill()
  // 头 + 喙
  ctx.beginPath(); ctx.arc(70, 46, 8, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.moveTo(76, 44); ctx.lineTo(88, 46); ctx.lineTo(76, 49); ctx.closePath(); ctx.fill()
  // 上翅
  ctx.beginPath()
  ctx.moveTo(46, 48)
  ctx.quadraticCurveTo(36, 20, 14, 24)
  ctx.quadraticCurveTo(34, 36, 46, 50)
  ctx.closePath(); ctx.fill()
  // 尾
  ctx.beginPath()
  ctx.moveTo(34, 56)
  ctx.lineTo(20, 52)
  ctx.lineTo(22, 58)
  ctx.lineTo(14, 62)
  ctx.lineTo(30, 62)
  ctx.closePath(); ctx.fill()
}

function drawRabbit(ctx) {
  black(ctx)
  // 身体
  ctx.beginPath()
  ctx.moveTo(30, 86)
  ctx.quadraticCurveTo(26, 58, 40, 52)
  ctx.quadraticCurveTo(46, 46, 56, 46)
  ctx.quadraticCurveTo(64, 48, 66, 58)
  ctx.quadraticCurveTo(68, 74, 60, 86)
  ctx.closePath(); ctx.fill()
  // 头
  ctx.beginPath(); ctx.arc(52, 42, 12, 0, Math.PI * 2); ctx.fill()
  // 耳朵
  ctx.beginPath(); ctx.ellipse(44, 22, 5, 14, -0.12, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.ellipse(58, 21, 5, 15, 0.12, 0, Math.PI * 2); ctx.fill()
}

function drawFlower(ctx) {
  black(ctx)
  for (let i = 0; i < 5; i++) {
    const a = (i * 2 * Math.PI) / 5 - Math.PI / 2
    ctx.beginPath()
    ctx.arc(50 + 15 * Math.cos(a), 50 + 15 * Math.sin(a), 12, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.beginPath()
  ctx.arc(50, 50, 9, 0, Math.PI * 2)
  ctx.fill()
}

function drawGrass(ctx) {
  black(ctx)
  ctx.lineWidth = 5
  ctx.beginPath(); ctx.moveTo(50, 88); ctx.quadraticCurveTo(45, 60, 34, 46); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(50, 88); ctx.quadraticCurveTo(50, 56, 50, 40); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(50, 88); ctx.quadraticCurveTo(56, 58, 66, 44); ctx.stroke()
  // 中间叶
  ctx.beginPath()
  ctx.moveTo(50, 62)
  ctx.quadraticCurveTo(38, 58, 34, 50)
  ctx.quadraticCurveTo(44, 55, 50, 58)
  ctx.closePath(); ctx.fill()
}

function drawCloud(ctx) {
  black(ctx)
  ctx.beginPath()
  ctx.arc(32, 56, 13, 0, Math.PI * 2)
  ctx.arc(50, 46, 18, 0, Math.PI * 2)
  ctx.arc(68, 56, 13, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.rect(24, 50, 52, 16)
  ctx.fill()
}

function drawMountain(ctx) {
  black(ctx)
  ctx.beginPath()
  ctx.moveTo(8, 86)
  ctx.lineTo(36, 38)
  ctx.lineTo(52, 64)
  ctx.lineTo(66, 42)
  ctx.lineTo(92, 86)
  ctx.closePath()
  ctx.fill()
}

function drawBamboo(ctx) {
  black(ctx)
  ctx.lineWidth = 6
  ctx.beginPath(); ctx.moveTo(50, 12); ctx.lineTo(50, 88); ctx.stroke()
  ctx.lineWidth = 4
  ctx.beginPath(); ctx.moveTo(50, 40); ctx.quadraticCurveTo(34, 34, 28, 26); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(50, 56); ctx.quadraticCurveTo(66, 50, 72, 42); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(50, 70); ctx.quadraticCurveTo(36, 66, 30, 56); ctx.stroke()
}

function drawDeer(ctx) {
  black(ctx)
  // 腿
  ctx.lineWidth = 5
  ctx.beginPath(); ctx.moveTo(38, 70); ctx.lineTo(38, 90); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(56, 70); ctx.lineTo(56, 90); ctx.stroke()
  // 身体
  ctx.beginPath(); ctx.ellipse(48, 60, 20, 13, 0, 0, Math.PI * 2); ctx.fill()
  // 颈 + 头
  ctx.beginPath()
  ctx.moveTo(58, 56)
  ctx.quadraticCurveTo(68, 44, 74, 40)
  ctx.lineTo(70, 34)
  ctx.lineTo(66, 40)
  ctx.quadraticCurveTo(60, 48, 50, 50)
  ctx.closePath(); ctx.fill()
  ctx.beginPath(); ctx.arc(72, 36, 7, 0, Math.PI * 2); ctx.fill()
  // 鹿角
  ctx.lineWidth = 2.5
  ctx.beginPath(); ctx.moveTo(70, 30); ctx.lineTo(64, 18); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(70, 30); ctx.lineTo(76, 20); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(64, 20); ctx.lineTo(58, 14); ctx.stroke()
}

export const STICKERS = [
  { id: 'cat', name: '猫', draw: drawCat },
  { id: 'butterfly', name: '蝴蝶', draw: drawButterfly },
  { id: 'fish', name: '鱼', draw: drawFish },
  { id: 'bird', name: '鸟', draw: drawBird },
  { id: 'rabbit', name: '兔', draw: drawRabbit },
  { id: 'flower', name: '花', draw: drawFlower },
  { id: 'grass', name: '草', draw: drawGrass },
  { id: 'cloud', name: '云', draw: drawCloud },
  { id: 'mountain', name: '山', draw: drawMountain },
  { id: 'bamboo', name: '竹', draw: drawBamboo },
  { id: 'deer', name: '鹿', draw: drawDeer },
]

// ---------------- 帧合成 ----------------
// op: { id, x(0~1), y(0~1), scale, flip }
export function composeFrameToDataURL(ops = [], size = 480) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  for (const op of ops) {
    const s = STICKERS.find((x) => x.id === op.id)
    if (!s) continue
    const k = (op.scale ?? 1) * (size / 100)
    ctx.save()
    ctx.translate(op.x * size, op.y * size)
    ctx.scale(op.flip ? -k : k, k)
    ctx.translate(-50, -50)
    s.draw(ctx)
    ctx.restore()
  }
  return c.toDataURL('image/png')
}

function buildFrames(opsAt, size = 480) {
  return Array.from({ length: 12 }, (_, i) => composeFrameToDataURL(opsAt(i), size))
}

// ---------------- 空设计 ----------------
export function emptyDesign() {
  return {
    frames: Array(12).fill(''),
    body: { outline: 'hex', color: 'orange', surface: 'frost', base: 'walnut', film: 'clear' },
    candle: { scent: 'jasmine', flame: 'warm', speed: 'mid', lit: false },
    story: { title: '' },
  }
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// ---------------- 模板灵感 ----------------
function tCatButterfly() {
  const frames = buildFrames((i) => {
    const t = i / 11
    const bx = 0.2 + t * 0.6
    const by = 0.32 + Math.sin(t * Math.PI * 2) * 0.1
    return [
      { id: 'cat', x: 0.62, y: 0.72, scale: 0.9 },
      { id: 'butterfly', x: bx, y: by, scale: 0.5, flip: Math.sin(t * Math.PI * 2) > 0 },
      { id: 'flower', x: 0.16, y: 0.84, scale: 0.5 },
    ]
  })
  return {
    ...emptyDesign(),
    frames,
    body: { outline: 'hex', color: 'orange', surface: 'frost', base: 'walnut', film: 'clear' },
    candle: { scent: 'cinnamon', flame: 'orange', speed: 'mid', lit: false },
    story: { title: '狸奴扑蝶' },
  }
}

function tFishDream() {
  const frames = buildFrames((i) => {
    const t = i / 11
    const fx = 0.16 + t * 0.68
    const fy = 0.5 + Math.sin(t * Math.PI * 2) * 0.06
    return [
      { id: 'fish', x: fx, y: fy, scale: 0.7, flip: true },
      { id: 'grass', x: 0.2, y: 0.84, scale: 0.5 },
      { id: 'grass', x: 0.8, y: 0.86, scale: 0.55 },
      { id: 'cloud', x: 0.6, y: 0.2, scale: 0.6 },
    ]
  })
  return {
    ...emptyDesign(),
    frames,
    body: { outline: 'round', color: 'amber', surface: 'grad', base: 'mother', film: 'color' },
    candle: { scent: 'citrus', flame: 'warm', speed: 'slow', lit: false },
    story: { title: '游鱼入梦' },
  }
}

function tMagpie() {
  const frames = buildFrames((i) => {
    const t = i / 11
    const bx = 0.14 + t * 0.72
    const by = 0.34 + Math.sin(t * Math.PI * 2) * 0.12
    return [
      { id: 'bird', x: bx, y: by, scale: 0.62, flip: true },
      { id: 'mountain', x: 0.5, y: 0.82, scale: 0.9 },
      { id: 'cloud', x: 0.76, y: 0.2, scale: 0.55 },
      { id: 'bamboo', x: 0.14, y: 0.62, scale: 0.6 },
    ]
  })
  return {
    ...emptyDesign(),
    frames,
    body: { outline: 'hex', color: 'black', surface: 'carve', base: 'ebony', film: 'clear' },
    candle: { scent: 'incense', flame: 'amber', speed: 'fast', lit: false },
    story: { title: '喜鹊绕梁' },
  }
}

function tRabbit() {
  const frames = buildFrames((i) => {
    const t = i / 11
    const bounce = Math.abs(Math.sin(t * Math.PI * 2)) * 0.08
    return [
      { id: 'rabbit', x: 0.5, y: 0.66 - bounce, scale: 0.8 },
      { id: 'flower', x: 0.2, y: 0.82, scale: 0.5 },
      { id: 'flower', x: 0.8, y: 0.84, scale: 0.55 },
      { id: 'cloud', x: 0.5, y: 0.18, scale: 0.6 },
    ]
  })
  return {
    ...emptyDesign(),
    frames,
    body: { outline: 'petal', color: 'white', surface: 'frost', base: 'acrylic', film: 'frost' },
    candle: { scent: 'jasmine', flame: 'warm', speed: 'mid', lit: false },
    story: { title: '瑞兔逐祥' },
  }
}

function tButterflyDream() {
  const frames = buildFrames((i) => {
    const t = i / 11
    const a = t * Math.PI * 2
    return [
      { id: 'butterfly', x: 0.34 + 0.16 * Math.cos(a), y: 0.44 + 0.16 * Math.sin(a), scale: 0.55, flip: Math.cos(a) > 0 },
      { id: 'butterfly', x: 0.66 - 0.16 * Math.cos(a), y: 0.6 - 0.16 * Math.sin(a), scale: 0.42, flip: Math.sin(a) > 0 },
      { id: 'flower', x: 0.5, y: 0.8, scale: 0.6 },
      { id: 'grass', x: 0.18, y: 0.8, scale: 0.5 },
      { id: 'grass', x: 0.82, y: 0.8, scale: 0.5 },
    ]
  })
  return {
    ...emptyDesign(),
    frames,
    body: { outline: 'round', color: 'clear', surface: 'clear', base: 'mother', film: 'color' },
    candle: { scent: 'sandalwood', flame: 'orange', speed: 'slow', lit: false },
    story: { title: '蝶梦庄周' },
  }
}

function tMountainMoon() {
  const frames = buildFrames((i) => {
    const t = i / 11
    const cx = 0.5 + Math.sin(t * Math.PI * 2) * 0.04
    return [
      { id: 'mountain', x: 0.5, y: 0.78, scale: 0.95 },
      { id: 'cloud', x: cx, y: 0.24, scale: 0.6 },
      { id: 'bird', x: 0.7, y: 0.3, scale: 0.5, flip: true },
    ]
  })
  return {
    ...emptyDesign(),
    frames,
    body: { outline: 'hex', color: 'amber', surface: 'grad', base: 'walnut', film: 'clear' },
    candle: { scent: 'incense', flame: 'amber', speed: 'slow', lit: false },
    story: { title: '山月随人归' },
  }
}

function tBambooShadow() {
  const frames = buildFrames((i) => {
    const t = i / 11
    const bx = 0.16 + t * 0.6
    return [
      { id: 'bamboo', x: 0.24, y: 0.62, scale: 0.85 },
      { id: 'bamboo', x: 0.72, y: 0.64, scale: 0.7 },
      { id: 'bird', x: bx, y: 0.34, scale: 0.55, flip: true },
      { id: 'grass', x: 0.5, y: 0.86, scale: 0.5 },
    ]
  })
  return {
    ...emptyDesign(),
    frames,
    body: { outline: 'cat', color: 'white', surface: 'carve', base: 'ebony', film: 'clear' },
    candle: { scent: 'citrus', flame: 'warm', speed: 'mid', lit: false },
    story: { title: '竹影横窗' },
  }
}

export const TEMPLATES = [
  { id: 'cat-butterfly', name: '狸奴扑蝶', desc: '猫儿看蝶，蝶儿逗猫。', build: tCatButterfly },
  { id: 'fish-dream', name: '游鱼入梦', desc: '一尾鱼，游进你的梦里。', build: tFishDream },
  { id: 'magpie', name: '喜鹊绕梁', desc: '喜鹊登枝，绕梁而歌。', build: tMagpie },
  { id: 'rabbit', name: '瑞兔逐祥', desc: '瑞兔逐月，一步一祥。', build: tRabbit },
  { id: 'butterfly-dream', name: '蝶梦庄周', desc: '不知周之梦为蝴蝶与。', build: tButterflyDream },
]

// ---------------- 随机生成 ----------------
export function randomDesign() {
  const d = emptyDesign()
  const ids = STICKERS.map((s) => s.id)
  d.frames = buildFrames(() => {
    const n = 1 + Math.floor(Math.random() * 3)
    const ops = []
    for (let j = 0; j < n; j++) {
      ops.push({
        id: pick(ids),
        x: 0.2 + Math.random() * 0.6,
        y: 0.24 + Math.random() * 0.56,
        scale: 0.42 + Math.random() * 0.5,
        flip: Math.random() < 0.3,
      })
    }
    return ops
  })
  d.body = {
    outline: pick(OUTLINES.map((o) => o.id)),
    color: pick(BODY_COLORS.map((c) => c.id)),
    surface: pick(SURFACES.map((s) => s.id)),
    base: pick(BASES.map((b) => b.id)),
    film: pick(FILMS.map((f) => f.id)),
  }
  d.candle = {
    scent: pick(SCENTS.map((s) => s.id)),
    flame: pick(FLAMES.map((f) => f.id)),
    speed: pick(SPEEDS.map((s) => s.id)),
    lit: false,
  }
  d.story.title = '一盏无名灯'
  return d
}

// ---------------- 画廊种子（惰性构建，避免启动时生成大量位图） ----------------
const seedDesigns = [
  { title: '狸奴扑蝶', author: '阿茶', likes: 128, theme: '狸奴扑蝶', build: tCatButterfly },
  { title: '游鱼入梦', author: '小满', likes: 96, theme: '游鱼入梦', build: tFishDream },
  { title: '喜鹊绕梁', author: '南枝', likes: 74, theme: '喜鹊绕梁', build: tMagpie },
  { title: '瑞兔逐祥', author: '月白', likes: 152, theme: '瑞兔逐祥', build: tRabbit },
  { title: '蝶梦庄周', author: '拾光', likes: 83, theme: '蝶梦庄周', build: tButterflyDream },
  { title: '山月随人归', author: '云深', likes: 61, theme: '自由创作', build: tMountainMoon },
  { title: '竹影横窗', author: '见素', likes: 55, theme: '自由创作', build: tBambooShadow },
]

export const GALLERY_SEED = seedDesigns.map((w, i) => ({
  id: 'seed-' + i,
  title: w.title,
  author: w.author,
  likes: w.likes,
  theme: w.theme,
  createdAt: Date.now() - (i + 1) * 86400000,
  build: w.build,
}))

// ---------------- 查询辅助 ----------------
export function scentById(id) { return SCENTS.find((s) => s.id === id) || SCENTS[0] }
export function speedById(id) { return SPEEDS.find((s) => s.id === id) || SPEEDS[1] }
export function flameById(id) { return FLAMES.find((s) => s.id === id) || FLAMES[0] }
export function colorById(id) { return BODY_COLORS.find((c) => c.id === id) || BODY_COLORS[0] }
