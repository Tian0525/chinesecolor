// 化色·结缘 —— 矿石映射、日主测算与手串配方引擎
// 依《五色·五行 互动网页产品 PRD》V2.0 · 模块 3「化色·结缘」构建

import { ELEMENTS, CYCLE, collectedElements } from './data'

// ---------------- 天干地支 ----------------
export const GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
export const ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

const GAN_ELEM = {
  甲: 'mu', 乙: 'mu', 丙: 'huo', 丁: 'huo', 戊: 'tu',
  己: 'tu', 庚: 'jin', 辛: 'jin', 壬: 'shui', 癸: 'shui',
}

// 十二地支 → 五行（用于时辰补语）
const ZHI_ELEM = {
  子: 'shui', 丑: 'tu', 寅: 'mu', 卯: 'mu', 辰: 'tu', 巳: 'huo',
  午: 'huo', 未: 'tu', 申: 'jin', 酉: 'jin', 戌: 'tu', 亥: 'shui',
}

// 十二时辰（供生辰帖选择）
export const SHICHEN = [
  { zhi: '子', label: '子时 · 23—1 时' },
  { zhi: '丑', label: '丑时 · 1—3 时' },
  { zhi: '寅', label: '寅时 · 3—5 时' },
  { zhi: '卯', label: '卯时 · 5—7 时' },
  { zhi: '辰', label: '辰时 · 7—9 时' },
  { zhi: '巳', label: '巳时 · 9—11 时' },
  { zhi: '午', label: '午时 · 11—13 时' },
  { zhi: '未', label: '未时 · 13—15 时' },
  { zhi: '申', label: '申时 · 15—17 时' },
  { zhi: '酉', label: '酉时 · 17—19 时' },
  { zhi: '戌', label: '戌时 · 19—21 时' },
  { zhi: '亥', label: '亥时 · 21—23 时' },
]

// ---------------- 儒略日 / 日主 ----------------
// 参考点：1900-01-01 = 甲戌日（JDN 2415021）
const REF_JDN = 2415021
const REF_GAN = 0   // 甲
const REF_ZHI = 10  // 戌

function jdn(y, m, d) {
  const a = Math.floor((14 - m) / 12)
  const y2 = y + 4800 - a
  const m2 = m + 12 * a - 3
  return d + Math.floor((153 * m2 + 2) / 5) + 365 * y2
    + Math.floor(y2 / 4) - Math.floor(y2 / 100) + Math.floor(y2 / 400) - 32045
}

// 日主测算：公历生日 → 天干地支 + 本命五行
export function dayMaster(y, m, d) {
  const diff = jdn(y, m, d) - REF_JDN
  const gan = GAN[((diff + REF_GAN) % 10 + 10) % 10]
  const zhi = ZHI[((diff + REF_ZHI) % 12 + 12) % 12]
  return { gan, zhi, elem: GAN_ELEM[gan] }
}

// ---------------- 矿石映射（依 PRD） ----------------
export const GEMS = {
  mu: {
    stones: [
      { name: '绿松石', hex: '#3FB8AF' },
      { name: '青金石', hex: '#2F4B8C' },
      { name: '孔雀石', hex: '#0B8457' },
    ],
    meaning: '生机、破局',
  },
  huo: {
    stones: [
      { name: '南红玛瑙', hex: '#B03A2E' },
      { name: '石榴石', hex: '#9B1B30' },
      { name: '草莓晶', hex: '#E58F8F' },
    ],
    meaning: '热情、行动',
  },
  tu: {
    stones: [
      { name: '黄水晶', hex: '#DDA52C' },
      { name: '虎眼石', hex: '#B8860B' },
      { name: '琥珀', hex: '#CA6924' },
    ],
    meaning: '沉稳、包容',
  },
  jin: {
    stones: [
      { name: '白水晶', hex: '#E8ECEF' },
      { name: '月光石', hex: '#B8C7D6' },
      { name: '珍珠', hex: '#F2EFE6' },
    ],
    meaning: '决断、清明',
  },
  shui: {
    stones: [
      { name: '黑曜石', hex: '#1F1F24' },
      { name: '海蓝宝', hex: '#6AB7CF' },
      { name: '黑玛瑙', hex: '#35353A' },
    ],
    meaning: '智慧、疗愈',
  },
}

// 克制本命者（谁克我）：金克木、水克火、木克土、火克金、土克水
const CONTROLS = { mu: 'jin', huo: 'shui', tu: 'mu', jin: 'huo', shui: 'tu' }

// ---------------- 命名与文案 ----------------
const ELEM_FLAVOR = { mu: '木的生机', huo: '火的炙热', tu: '土的沉稳', jin: '金的清冽', shui: '水的幽深' }
const ELEM_FLAVOR2 = { mu: '生发', huo: '热情', tu: '沉稳', jin: '清明', shui: '智慧' }
const ELEM_YA = { mu: '春华', huo: '霞光', tu: '厚德', jin: '清音', shui: '清华' }

// 调和克制的「收束」文案，按本命元素
const BALANCE_RATIONALE = {
  mu:   { overwhelm: '木不逞强', benefit: '方能生发有序' },
  huo:  { overwhelm: '火不燎原', benefit: '方能温暖而不灼人' },
  tu:   { overwhelm: '土不壅塞', benefit: '方能承载而不凝滞' },
  jin:  { overwhelm: '金不伤物', benefit: '方能决断而不伤人' },
  shui: { overwhelm: '水不泛滥', benefit: '方能滋养万物' },
}

// 手串名：本命二字雅称 · 首知遇二字雅称（确定性、无空态）
export function braceletName(life, know) {
  const first = ELEM_YA[life]
  const second = know.length ? ELEM_YA[know[0]] : '本真'
  return `${first}·${second}`
}

// 天命解读（本命五行）
export function destinyReading(dm, birth) {
  const el = ELEMENTS[dm.elem]
  let hour = ''
  if (birth.zhi && ZHI_ELEM[birth.zhi]) {
    const he = ELEMENTS[ZHI_ELEM[birth.zhi]]
    hour = `你生于${birth.zhi}时，时柱属${he.name}，为这层底色再添一分${ELEM_FLAVOR2[he.key]}。`
  }
  return `你的日主为「${dm.gan}${dm.zhi}」，本命属${el.name}（${el.five}）。${ELEM_FLAVOR[dm.elem]}，是你与生俱来的底色。${hour}（此为日主天干的简化测算，供观展结缘一乐。）`
}

// 知遇解读（观展星盘）
export function encounterReading(colors) {
  const elems = collectedElements(colors)
  const names = elems.map((e) => ELEMENTS[e].name).join('、')
  return `你在展厅里拾起的颜色，落在${names}。这些是你此刻最被吸引的能量，也是这次观展留在你身上的印记。`
}

// 结缘解读（三位一体调和方案）
export function karmaReading(b) {
  const mainEl = ELEMENTS[b.life]
  const spacerEl = ELEMENTS[b.balance]
  const r = BALANCE_RATIONALE[b.life]
  const accents = b.accents.map((a) => `${a.stone.name}（知遇${ELEMENTS[a.elem].name}）`).join('、')

  let s = `这串【${b.name}】，主珠采用${b.main.stone.name}（本命${mainEl.name}）`
  if (accents) s += `，配以${accents}`
  s += `，并穿插${b.spacer.stone.name}（调和${spacerEl.name}），以${spacerEl.name}克${mainEl.name}，${r.overwhelm}，${r.benefit}。`
  s += `这是一串为你调和「${ELEM_FLAVOR2[b.life]}」与「${ELEM_FLAVOR2[b.balance]}」的手串。`
  return s
}

// ---------------- 配方生成 ----------------
function hashCode(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0
  return Math.abs(h)
}

// 将各珠按数量展开为环形排列顺序（隔珠起收、主珠居中、配珠分列两侧）
function buildBeadOrder(main, accents, spacer, linkBead) {
  const list = []
  const push = (stone, elem, role, key) => list.push({ stone, elem, role, key })
  push(spacer.stone, spacer.elem, 'spacer', 'sp0')
  for (const a of accents) for (let i = 0; i < a.count; i++) push(a.stone, a.elem, 'accent', `${a.elem}-${i}`)
  for (let i = 0; i < main.count; i++) push(main.stone, main.elem, 'main', `main-${i}`)
  for (let i = accents.length - 1; i >= 0; i--) {
    const a = accents[i]
    for (let j = 0; j < a.count; j++) push(a.stone, a.elem, 'accent', `${a.elem}-r${j}`)
  }
  if (linkBead) push(linkBead.stone, linkBead.elem, 'link', 'link')
  push(spacer.stone, spacer.elem, 'spacer', 'sp1')
  return list
}

// 三位一体：天命（日主）· 知遇（收集）· 调和（克本命）→ 手串配方
export function buildBracelet(birth, collectedColors, linkCode = '') {
  const dm = dayMaster(birth.y, birth.m, birth.d)
  const life = dm.elem
  const know = collectedElements(collectedColors).filter((e) => e !== life)
  const balance = CONTROLS[life]

  const main = { elem: life, stone: GEMS[life].stones[0], count: 3, role: '主珠 · 本命' }
  const accents = know.map((e, i) => ({ elem: e, stone: GEMS[e].stones[i % 3], count: 2, role: '配珠 · 知遇' }))
  const spacer = { elem: balance, stone: GEMS[balance].stones[0], count: 3, role: '隔珠 · 调和' }

  let linkBead = null
  if (String(linkCode || '').trim()) {
    const e = CYCLE[hashCode(linkCode) % 5]
    linkBead = { elem: e, stone: GEMS[e].stones[1], count: 1, role: '馆藏联名 · 隐藏款' }
  }

  const name = braceletName(life, know)
  const beads = buildBeadOrder(main, accents, spacer, linkBead)

  return { dm, life, know, balance, main, accents, spacer, linkBead, name, beads, birth }
}
