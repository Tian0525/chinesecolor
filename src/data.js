// 五色·五行 —— 数据与叙事引擎
// 依《五色·五行 互动网页产品 PRD》V1.0 构建

// ---------------- 五行基础 ----------------
export const ELEMENTS = {
  mu:   { key: 'mu',   name: '木', dir: '东', five: '青', canon: '石青', tone: '#2E7D6B', soft: '#d7e5dd' },
  huo:  { key: 'huo',  name: '火', dir: '南', five: '赤', canon: '朱砂', tone: '#C7442B', soft: '#f4ded6' },
  tu:   { key: 'tu',   name: '土', dir: '中', five: '黄', canon: '雌黄', tone: '#C08A3E', soft: '#efe3c8' },
  jin:  { key: 'jin',  name: '金', dir: '西', five: '白', canon: '月白', tone: '#8C949A', soft: '#e2e6e8' },
  shui: { key: 'shui', name: '水', dir: '北', five: '黑', canon: '玄色', tone: '#3E4A5C', soft: '#d9dde2' },
}

// 相生循环：木→火→土→金→水→木
export const CYCLE = ['mu', 'huo', 'tu', 'jin', 'shui']

// 相生关系：GEN[a] = 被 a 所生的元素
const GEN = { mu: 'huo', huo: 'tu', tu: 'jin', jin: 'shui', shui: 'mu' }
// 相克关系：KE[a] = 被 a 所克的元素
const KE = { mu: 'tu', tu: 'shui', shui: 'huo', huo: 'jin', jin: 'mu' }

// 判断两个元素的生克关系，返回 { kind, from, to }
export function relation(a, b) {
  if (a === b) return { kind: 'same' }
  if (GEN[a] === b) return { kind: 'birth', from: a, to: b }
  if (KE[a] === b) return { kind: 'over', from: a, to: b }
  if (GEN[b] === a) return { kind: 'birth', from: b, to: a }
  if (KE[b] === a) return { kind: 'over', from: b, to: a }
  return { kind: 'same' }
}

// ---------------- 色库（18 味传统色） ----------------
export const COLORS = [
  // 木 · 青 · 东
  { id: 'shiqing',   name: '石青', hex: '#1685A9', elem: 'mu',   story: '石青，从矿物里炼出的青。它属「木」，居东，象征生发。古人画青绿山水，那抹「青」，多半就是它。它是从石头里长出来的春天。' },
  { id: 'bise',      name: '碧色', hex: '#1C7C7C', elem: 'mu',   story: '碧色，雨后的青。属「木」，居东。欧阳修写「夜雨染成天水碧」，你看到的碧色，和他说的，是不是同一个？' },
  { id: 'zhuqing',   name: '竹青', hex: '#789262', elem: 'mu',   story: '竹青，竹子的颜色。属「木」，居东。古人爱竹，因为竹有节、虚心。竹青，是一节一节的清高。' },
  { id: 'songhua',   name: '松花', hex: '#057748', elem: 'mu',   story: '松花，松树新发的绿。属「木」，居东。松色苍而松花嫩，是古画里最克制的一抹生意。' },
  // 火 · 赤 · 南
  { id: 'zhusha',    name: '朱砂', hex: '#FF461F', elem: 'huo',  story: '朱砂，朱红的正主。属「火」，居南。古人用朱砂点丹心、盖印章。它是最郑重的一笔红。' },
  { id: 'zhuhong',   name: '朱红', hex: '#ED5126', elem: 'huo',  story: '朱红，比朱砂温一点。属「火」，居南。故宫的墙、过年的对子，都是它。红得热闹，又红得端正。' },
  { id: 'yanzhi',    name: '胭脂', hex: '#9D2933', elem: 'huo',  story: '胭脂，胭脂花染出的红。属「火」，居南。它红里带紫，是女儿家眉目间的一点心事。' },
  { id: 'feihong',   name: '绯红', hex: '#C83C23', elem: 'huo',  story: '绯红，绯是浅赤。属「火」，居南。晚霞初起、桃花初放，都是这层将红未透的绯。' },
  // 土 · 黄 · 中
  { id: 'cihuang',   name: '雌黄', hex: '#FFC64B', elem: 'tu',   story: '雌黄，矿石磨成的黄。属「土」，居中。古代人拿它当修正液用——写错字了，涂点雌黄，重新写。「信口雌黄」说的就是随口改口。它是一抹带着「修正」意味的颜色。' },
  { id: 'zheshi',    name: '赭石', hex: '#845A33', elem: 'tu',   story: '赭石，赭色偏褐。属「土」，居中。古人用它涂染衣料、打底上色。它是大地的肤色，也是古画里最稳的底色。' },
  { id: 'tenghuang', name: '藤黄', hex: '#FFB61E', elem: 'tu',   story: '藤黄，从藤树的树脂里得来。属「土」，居中。它是黄色里最亮的一味，像一勺凝固的阳光。' },
  { id: 'hupo',      name: '琥珀', hex: '#CA6924', elem: 'tu',   story: '琥珀，树脂沉睡千万年成石。属「土」，居中。它把一段松香的光阴，凝成了一小块温润的黄。' },
  // 金 · 白 · 西
  { id: 'yuebai',    name: '月白', hex: '#D6ECF0', elem: 'jin',  story: '月白，月光下的白。属「金」，居西。它不是纯白，白里透着极淡的蓝青，像夜里起了露水。' },
  { id: 'xiangya',   name: '象牙白', hex: '#FFFBF0', elem: 'jin', story: '象牙白，温润如象牙。属「金」，居西。白得不刺眼，像旧纸、像暖玉，是白里最温柔的一种。' },
  { id: 'shuangse',  name: '霜色', hex: '#E9F1F6', elem: 'jin',  story: '霜色，秋霜的白。属「金」，居西。清晨草叶上那一层薄霜，太阳一晒就化，冷得干净。' },
  // 水 · 黑 · 北
  { id: 'xuanse',    name: '玄色', hex: '#4D4B4F', elem: 'shui', story: '玄色，玄不是纯黑，是黑里透红。属「水」，居北。「天地玄黄」，玄是天还未亮时的颜色，藏着最深的水。' },
  { id: 'dailan',    name: '黛蓝', hex: '#425066', elem: 'shui', story: '黛蓝，远山青黛。属「水」，居北。古人画眉用「黛」，「六宫粉黛」里的黛，就是这一抹幽深的蓝。' },
  { id: 'yaqing',    name: '鸦青', hex: '#424C50', elem: 'shui', story: '鸦青，乌鸦羽毛的青黑。属「水」，居北。它黑得发亮，是夜色里最沉静的一笔。' },
]

export function colorById(id) {
  return COLORS.find((c) => c.id === id)
}

// 根据色块明度决定其上文字用墨色还是白色
export function textOnHex(hex) {
  const m = hex.replace('#', '').match(/../g) || []
  const [r, g, b] = m.map((x) => parseInt(x, 16))
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return lum > 0.62 ? '#2C2C2C' : '#FFFFFF'
}

// ---------------- 相生 / 相克 叙事 ----------------
// key 为「生者」元素：a 生 b 的文案
const BIRTH_TEXT = {
  mu:   (a, b) => `木生火。你从${a.name}（木）走到了${b.name}（火）。青是初生的芽，赤是燃烧的焰。你收集的这条路径，暗合了万物生长的蓬勃逻辑——你是那个愿意为生命添柴加火的人。`,
  huo:  (a, b) => `火生土。你从${a.name}（火）走到了${b.name}（土）。焰燃尽后归于尘土，热情沉淀成笃定。燃烧过的人，才懂得承载的分量。`,
  tu:   (a, b) => `土生金。你从${a.name}（土）走到了${b.name}（金）。土中藏金，厚积而薄发。你在沉稳里，等来了一次去芜存菁的闪亮。`,
  jin:  (a, b) => `金生水。你从${a.name}（金）走到了${b.name}（水）。清冽的金色敛去锋芒，化作流动的智慧。金生丽水，是最优雅的一次转身。`,
  shui: (a, b) => `水生木。你从${a.name}（水）走到了${b.name}（木）。幽深的水泽里，藏着破土的新生。冬藏之后是春生，静水流深，自有生机。`,
}

// key 为「克者」元素：a 克 b 的文案
const OVER_TEXT = {
  mu:   (a, b) => `木克土。你从${a.name}（木）走到了${b.name}（土）。青是雨后的水，黄是矿物的粉，一个清透破开沉浊。在《千里江山图》里，这两种颜色曾相遇——青绿为骨，雌黄为魂。你似乎在寻找一种突破与修正的美感。`,
  tu:   (a, b) => `土克水。你从${a.name}（土）走到了${b.name}（水）。土筑堤岸，水被收纳。沉浊收束了幽深，像黄河改道，大地的脾性压过了流水的任性。`,
  shui: (a, b) => `水克火。你从${a.name}（水）走到了${b.name}（火）。幽深熄灭了炽烈。可熄灭不是终结，是另一种更持久的温度。你在以柔克刚。`,
  huo:  (a, b) => `火克金。你从${a.name}（火）走到了${b.name}（金）。炽烈软化了清冽。在炼炉里，金子失去形状，却因此成为器物。你在以热烈，成全一种成形。`,
  jin:  (a, b) => `金克木。你从${a.name}（金）走到了${b.name}（木）。清冽斩断了初生。可斧斤以时入山林，节制不是扼杀，是让生长更有序。你在寻找一种克制。`,
}

// 生成两色之间的「羁绊」叙事
export function bondNarrative(a, b) {
  const rel = relation(a.elem, b.elem)
  if (rel.kind === 'same') {
    const e = ELEMENTS[a.elem]
    return {
      kind: 'same',
      label: '同气',
      title: `${a.name} · ${b.name}`,
      text: `你连着拾了两味${e.name}的颜色（${a.name}、${b.name}）。同气相求，这是缘分。你在同一抹底色里，反复流连。`,
    }
  }
  const fromColor = rel.from === a.elem ? a : b
  const toColor = rel.from === a.elem ? b : a
  const fromElem = ELEMENTS[rel.from]
  const toElem = ELEMENTS[rel.to]
  if (rel.kind === 'birth') {
    return {
      kind: 'birth',
      label: '相生',
      title: `${fromElem.name}生${toElem.name}`,
      text: BIRTH_TEXT[rel.from](fromColor, toColor),
    }
  }
  return {
    kind: 'over',
    label: '相克',
    title: `${fromElem.name}克${toElem.name}`,
    text: OVER_TEXT[rel.from](fromColor, toColor),
  }
}

// ---------------- 个人色彩自述（星盘） ----------------
const ELEM_FLAVOR = {
  mu:   '木的生机',
  huo:  '火的炙热',
  tu:   '土的沉稳',
  jin:  '金的清冽',
  shui: '水的幽深',
}

const ELEM_PERSONA = {
  mu:   '一个愿意为生命添柴加火的人',
  huo:  '一个把热情酿成笃定的人',
  tu:   '一个懂得承载与修正的人',
  jin:  '一个在清冽中寻找秩序的人',
  shui: '一个静水流深、以柔克刚的人',
}

export function personality(colors) {
  if (!colors || colors.length === 0) return ''
  const elems = colors.map((c) => c.elem)
  const first = ELEMENTS[elems[0]]
  const last = ELEMENTS[elems[elems.length - 1]]
  const uniq = [...new Set(elems)]
  const middle = uniq.slice(1, -1)

  let journey = `你从${first.name}出发`
  if (middle.length) {
    journey += `，经过${middle.map((e) => ELEMENTS[e].name).join('、')}`
  }
  journey += `，抵达${last.name}。`

  let flavor = `你在${uniq.map((e) => ELEM_FLAVOR[e]).join('、')}之间来回。`

  let verdict
  const rel = relation(first.key, last.key)
  if (rel.kind === 'birth') {
    verdict = `这条路径暗合相生，${ELEM_PERSONA[first.key]}。`
  } else if (rel.kind === 'over') {
    verdict = `这条路径暗藏制衡，${ELEM_PERSONA[last.key]}。`
  } else {
    verdict = `你与${first.name}同气相求，${ELEM_PERSONA[first.key]}。`
  }

  return `${journey}${flavor}${verdict}`
}
