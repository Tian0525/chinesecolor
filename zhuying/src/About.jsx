export default function About({ onBack }) {
  return (
    <div className="page about">
      <header className="about__head">
        <button className="btn btn--ghost btn--sm" onClick={onBack}>
          ← 返回
        </button>
        <h2>关于逐影</h2>
      </header>

      <div className="about__body">
        <section className="about__sec">
          <h3>品牌故事</h3>
          <p>
            逐影，是一盏把故事藏进灯里的走马灯。热气流推动灯内的剪影缓缓旋转，皮影的影子投在磨砂灯面上，忽明忽暗，像一段没有对白的默片。
          </p>
          <p>我们把这份「造物」的乐趣搬到了线上——从空白开始，画剪纸、拼灯身、点蜡烛，亲手做一盏只属于你的灯。</p>
        </section>

        <section className="about__sec">
          <h3>皮影与走马灯</h3>
          <p>
            走马灯，古称「马骑灯」，是中国人最早用热气流驱动旋转的发明之一。灯内点燃蜡烛，热气上升，推动叶轮，让贴在轮上的剪纸人骑旋转起来，影子在灯面上你追我赶。
          </p>
          <p>皮影则用一块幕布、几根竹签，把故事演成连续的动作。逐影把两者合一：十二帧剪纸，就是走马灯里的一段皮影戏。</p>
        </section>

        <section className="about__sec">
          <h3>环保理念</h3>
          <p>
            逐影是一款纯线上创作工具，不消耗一张纸、一根竹、一滴蜡。你设计的是「光与影」，分享的是故事本身。
          </p>
          <p>若你爱上某一盏灯，也可将设计参数导出，寻找身边的手艺人用可再生材料定制实体，让数字的影子回到真实的光里。</p>
        </section>

        <section className="about__sec">
          <h3>制作团队</h3>
          <p>广州美术学院 · 艺术教育专业 · 大三</p>
          <p>课程：中国民间美术 · 2026 年秋</p>
          <p className="about__credit">逐影 · 把故事藏进灯里</p>
        </section>
      </div>
    </div>
  )
}
