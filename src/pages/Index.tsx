import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";

const SECTIONS = [
  { id: "intro", label: "Введение" },
  { id: "construction", label: "Конструкция" },
  { id: "principle", label: "Принцип работы" },
  { id: "schemes", label: "Схемы и чертежи" },
  { id: "specs", label: "Характеристики" },
];

const HOTSPOTS = [
  { id: 1, x: 50, y: 18, label: "Барабан котла", desc: "Разделяет пароводяную смесь, накапливает воду и обеспечивает циркуляцию рабочей среды. Содержит сепарационные устройства." },
  { id: 2, x: 72, y: 40, label: "Пароперегреватель", desc: "Повышает температуру насыщенного пара до 540°C. Бывает радиационным, конвективным и комбинированным. Предотвращает конденсацию в турбине." },
  { id: 3, x: 28, y: 52, label: "Экономайзер", desc: "Подогревает питательную воду за счёт тепла уходящих дымовых газов. Повышает КПД котла и снижает расход топлива." },
  { id: 4, x: 50, y: 74, label: "Топочная камера", desc: "Зона сжигания пылеугольной смеси. Температура факела 1200–1600°C. Стенки выполнены из трубчатых экранов с циркулирующей водой." },
  { id: 5, x: 18, y: 32, label: "Экранные поверхности", desc: "Расположены на стенках топки. Поглощают лучистую теплоту пламени, нагревают и испаряют воду. Объединены в панели, соединённые с барабаном." },
  { id: 6, x: 82, y: 68, label: "Воздухоподогреватель", desc: "Подогревает воздух для горения, используя тепло уходящих газов. Улучшает условия горения и повышает эффективность сжигания." },
  { id: 7, x: 35, y: 80, label: "Горелочное устройство", desc: "Подаёт топливо и воздух в топку. Обеспечивает стабильное эффективное сгорание. Регулирует мощность котла." },
];

const SPECS = [
  { param: "Мощность энергоблока", value: "300", unit: "МВт", icon: "Zap" },
  { param: "Давление пара (турбина К-300-240)", value: "~240", unit: "кгс/см²", icon: "Gauge" },
  { param: "Температура перегретого пара", value: "540–560", unit: "°C", icon: "Thermometer" },
  { param: "Температура факела в топке", value: "1200–1600", unit: "°C", icon: "Flame" },
  { param: "Температура насыщенного пара", value: "280–320", unit: "°C", icon: "Activity" },
  { param: "Температура после перегрева", value: "~540", unit: "°C", icon: "TrendingUp" },
  { param: "Тип котла", value: "Барабанный / прямоточный", unit: "", icon: "Layers" },
  { param: "Вид топлива", value: "Пылеугольный", unit: "", icon: "Wind" },
];

const PRINCIPLE_STEPS = [
  {
    step: "01",
    title: "Подача топлива и воздуха",
    icon: "Wind",
    color: "text-cyan-400",
    desc: "В котёл подаются топливо (угольная пыль, газ или мазут) и воздух от дутьевых вентиляторов. Воздух предварительно подогревается в воздухоподогревателе для улучшения горения. Смесь поступает в горелки, расположенные в топке.",
  },
  {
    step: "02",
    title: "Горение в топке",
    icon: "Flame",
    color: "text-orange-400",
    desc: "В топочной камере топливо сгорает. Температура факела достигает 1200–1600°C. Горячие дымовые газы движутся по П-образному газоходу: сначала вверх, затем через поворотный газоход, потом вниз по конвективной шахте.",
  },
  {
    step: "03",
    title: "Нагрев воды в экранных трубах",
    icon: "Droplets",
    color: "text-blue-400",
    desc: "Вокруг топки расположены экранные трубы. Тепло от факела передаётся воде через стенки труб. Вода начинает кипеть, образуется пароводяная смесь.",
  },
  {
    step: "04",
    title: "Естественная циркуляция",
    icon: "ArrowUpDown",
    color: "text-green-400",
    desc: "Подъёмные трубы (в зоне нагрева) — смесь воды и пара движется вверх. Опускные трубы (вне нагрева) — холодная вода возвращается вниз. Циркуляция происходит из-за разницы плотности: горячая смесь легче, холодная вода тяжелее.",
  },
  {
    step: "05",
    title: "Работа барабана и сепарация",
    icon: "Circle",
    color: "text-purple-400",
    desc: "В верхнем барабане происходит сепарация: вода остаётся внутри, сухой насыщенный пар уходит дальше. Барабан накапливает воду и распределяет её по трубам.",
  },
  {
    step: "06",
    title: "Перегрев пара",
    icon: "TrendingUp",
    color: "text-amber-400",
    desc: "Из барабана насыщенный пар (~280–320°C) поступает в пароперегреватель. Здесь он нагревается до 540°C без увеличения давления. Перегретый пар необходим для эффективной работы турбины.",
  },
  {
    step: "07",
    title: "Подача пара в турбину",
    icon: "Zap",
    color: "text-yellow-400",
    desc: "Перегретый пар под давлением ~240 кгс/см² поступает в паровую турбину К-300-240. Там он расширяется и вращает ротор. Турбина вращает генератор — вырабатывается электроэнергия 300 МВт.",
  },
  {
    step: "08",
    title: "Утилизация тепла и удаление газов",
    icon: "ArrowRight",
    color: "text-gray-400",
    desc: "После топки горячие газы проходят через экономайзер (подогрев питательной воды) и воздухоподогреватель (подогрев воздуха). Это повышает КПД. Затем газы удаляются через дымосос в дымовую трубу.",
  },
];

function ZoomableImage({ src, alt }: { src: string; alt: string }) {
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imgRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!zoomed || !imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden rounded border border-[hsl(var(--border))] ${zoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}
      onClick={() => setZoomed(!zoomed)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => zoomed && setZoomed(false)}
    >
      <img
        src={src}
        alt={alt}
        className="w-full block transition-transform duration-300 ease-out"
        style={{
          transform: zoomed ? "scale(2.5)" : "scale(1)",
          transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
        }}
      />
      <div className="absolute top-3 right-3 bg-black/60 text-[var(--cyan)] text-xs font-mono px-2 py-1 rounded flex items-center gap-1">
        <Icon name={zoomed ? "ZoomOut" : "ZoomIn"} size={12} />
        {zoomed ? "Уменьшить" : "Увеличить"}
      </div>
    </div>
  );
}

function InteractiveScheme() {
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  return (
    <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
      <img
        src="https://cdn.poehali.dev/projects/0724ba8c-02ed-4673-94b1-d943092453fd/files/13b3772d-13b2-43d4-b076-e30b76f0c29e.jpg"
        alt="Конструкция котла"
        className="w-full h-full object-cover rounded"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded" />

      {HOTSPOTS.map((h) => (
        <button
          key={h.id}
          className="hotspot"
          style={{ left: `${h.x}%`, top: `${h.y}%`, transform: "translate(-50%,-50%)" }}
          onClick={() => setActiveHotspot(activeHotspot === h.id ? null : h.id)}
        />
      ))}

      {activeHotspot && (() => {
        const h = HOTSPOTS.find((x) => x.id === activeHotspot)!;
        return (
          <div
            className="absolute z-20 bg-[hsl(220,25%,10%)] border border-[var(--cyan)] rounded p-3 w-64 text-sm shadow-xl"
            style={{
              left: h.x > 60 ? "auto" : `${h.x + 3}%`,
              right: h.x > 60 ? `${100 - h.x + 3}%` : "auto",
              top: h.y > 60 ? "auto" : `${h.y + 3}%`,
              bottom: h.y > 60 ? `${100 - h.y + 3}%` : "auto",
            }}
          >
            <div className="font-mono text-[10px] text-[var(--cyan)] mb-1 uppercase tracking-widest">
              Узел {h.id.toString().padStart(2, "0")}
            </div>
            <div className="font-semibold text-white mb-1" style={{ fontFamily: "Oswald, sans-serif" }}>
              {h.label}
            </div>
            <div className="text-[hsl(var(--muted-foreground))] text-xs leading-relaxed">{h.desc}</div>
          </div>
        );
      })()}

      <div className="absolute bottom-3 left-3 bg-black/70 text-xs text-[hsl(var(--muted-foreground))] px-3 py-2 rounded font-mono flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[var(--cyan)] inline-block animate-pulse-cyan" />
        Нажмите на маркер для просмотра узла
      </div>
    </div>
  );
}

function SectionHeader({ num, title, icon }: { num: string; title: string; icon: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="font-mono text-4xl font-bold text-[var(--cyan)]/20 leading-none select-none">
        {num}
      </span>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Icon name={icon} size={18} className="text-[var(--cyan)]" fallback="BookOpen" />
          <h2
            className="text-2xl lg:text-3xl font-bold text-white"
            style={{ fontFamily: "Oswald, sans-serif", letterSpacing: "0.06em" }}
          >
            {title.toUpperCase()}
          </h2>
        </div>
        <div className="w-full h-px bg-gradient-to-r from-[var(--cyan)] to-transparent mt-2 opacity-40" />
      </div>
    </div>
  );
}

export default function Index() {
  const [activeSection, setActiveSection] = useState("intro");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen blueprint-bg text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[hsl(220,27%,6%)]/95 backdrop-blur border-b border-[hsl(var(--border))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded border border-[var(--cyan)] flex items-center justify-center glow-cyan">
              <Icon name="Flame" size={16} className="text-[var(--cyan)]" />
            </div>
            <div>
              <div className="font-mono text-[10px] text-[hsl(var(--muted-foreground))] uppercase tracking-widest leading-none">
                Учебное пособие
              </div>
              <div className="text-white font-semibold text-sm leading-tight" style={{ fontFamily: "Oswald, sans-serif", letterSpacing: "0.08em" }}>
                Конструкция котла
              </div>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`nav-item text-xs font-mono uppercase tracking-widest transition-colors ${
                  activeSection === s.id
                    ? "text-[var(--cyan)] active"
                    : "text-[hsl(var(--muted-foreground))] hover:text-white"
                }`}
              >
                {s.label}
              </button>
            ))}
          </nav>

          <button
            className="lg:hidden text-[hsl(var(--muted-foreground))] hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Icon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[hsl(var(--border))] bg-[hsl(220,27%,6%)]">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="block w-full text-left px-6 py-3 text-sm font-mono uppercase tracking-widest text-[hsl(var(--muted-foreground))] hover:text-[var(--cyan)] hover:bg-[var(--cyan-dim)] transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative border-b border-[hsl(var(--border))] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://cdn.poehali.dev/projects/0724ba8c-02ed-4673-94b1-d943092453fd/files/2d36c162-096c-4f2d-ace0-6da0453639a7.jpg"
            alt="Котёл"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(220,27%,8%)] via-[hsl(220,27%,8%)]/80 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-32">
          <div className="font-mono text-xs text-[var(--cyan)] uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
            <span className="w-8 h-px bg-[var(--cyan)]" />
            ТЭЦ / Паровые котлы / Документация
          </div>
          <h1
            className="text-5xl lg:text-7xl font-bold text-white leading-none mb-2"
            style={{ fontFamily: "Oswald, sans-serif", letterSpacing: "0.04em", textShadow: "0 0 40px rgba(0,200,240,0.3)" }}
          >
            КОНСТРУКЦИЯ
          </h1>
          <h1
            className="text-5xl lg:text-7xl font-bold leading-none mb-6"
            style={{
              fontFamily: "Oswald, sans-serif",
              letterSpacing: "0.04em",
              color: "var(--cyan)",
            }}
          >
            КОТЛА
          </h1>
          <p className="text-[hsl(var(--muted-foreground))] text-lg max-w-xl leading-relaxed mb-8">
            Учебное пособие по конструкции и принципу работы пылеугольных котлоагрегатов
            тепловых электростанций мощностью 300 МВт
          </p>
          <div className="flex flex-wrap gap-4">
            {[
              { icon: "BookOpen" as const, text: "5 разделов" },
              { icon: "Target" as const, text: "Интерактивные схемы" },
              { icon: "Zap" as const, text: "Энергоблок 300 МВт" },
            ].map((b) => (
              <div
                key={b.text}
                className="flex items-center gap-2 border border-[hsl(var(--border))] px-4 py-2 rounded text-sm text-[hsl(var(--muted-foreground))] font-mono"
              >
                <Icon name={b.icon} size={14} className="text-[var(--cyan)]" />
                {b.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-20">

        {/* 01 Введение */}
        <section id="intro">
          <SectionHeader num="01" title="Введение" icon="BookOpen" />
          <div className="grid lg:grid-cols-2 gap-8 mt-8">
            <div className="space-y-4 text-[hsl(var(--muted-foreground))] leading-relaxed">
              <p>
                <span className="text-white font-medium">Котельная установка тепловой электростанции</span> предназначена
                для преобразования химической энергии топлива в тепловую энергию водяного пара.
              </p>
              <p>
                На энергоблоках мощностью 300 МВт применяются высокопроизводительные
                пылеугольные котлы барабанного или прямоточного типа. Они рассчитаны на
                работу с высокими параметрами пара и обеспечивают стабильную подачу пара к турбине.
              </p>
              <div className="border border-[hsl(var(--border))] rounded p-4 space-y-2">
                <div className="font-mono text-xs text-[var(--cyan)] uppercase tracking-widest mb-3">
                  Основные функции котлоагрегата
                </div>
                {[
                  "Сжигание топлива",
                  "Передача теплоты продуктами сгорания рабочему телу",
                  "Получение перегретого пара заданных параметров",
                  "Обеспечение надёжной и экономичной работы энергетического блока",
                ].map((f) => (
                  <div key={f} className="flex items-start gap-2 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)] mt-1.5 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <div className="font-mono text-xs text-[var(--cyan)] uppercase tracking-widest mb-3">
                Параметры пара для турбины К-300-240
              </div>
              {[
                { label: "Давление пара", value: "~240 кгс/см²", icon: "Gauge", pct: 95 },
                { label: "Температура перегрева", value: "540–560 °C", icon: "Thermometer", pct: 88 },
                { label: "Мощность блока", value: "300 МВт", icon: "Zap", pct: 100 },
              ].map((item) => (
                <div key={item.label} className="param-card p-4 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Icon name={item.icon} size={14} className="text-[var(--cyan)]" />
                      <span className="text-sm font-medium text-white">{item.label}</span>
                    </div>
                    <span className="font-mono text-xs text-[var(--cyan)]">{item.value}</span>
                  </div>
                  <div className="tech-progress">
                    <div className="tech-progress-bar" style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* 02 Конструкция */}
        <section id="construction">
          <SectionHeader num="02" title="Основные элементы конструкции" icon="Layers" />
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: "Flame", title: "Топочная камера", color: "text-orange-400",
                desc: "Предназначена для сжигания топлива. Происходит подача пылеугольной смеси, смешивание с воздухом, горение и образование высокотемпературных продуктов сгорания. Стенки выполнены из трубчатых экранов с циркулирующей водой.",
                bullets: [],
              },
              {
                icon: "Grid3x3", title: "Экранные поверхности нагрева", color: "text-blue-400",
                desc: "Располагаются на стенках топки. Поглощают лучистую теплоту пламени, нагревают и испаряют воду. Трубы объединяются в панели и соединяются с барабаном котла или коллектором.",
                bullets: [],
              },
              {
                icon: "Circle", title: "Барабан котла", color: "text-cyan-400",
                desc: "Выполняет разделение пароводяной смеси, накопление воды и обеспечение циркуляции рабочей среды. Внутри размещены сепарационные устройства, отделяющие пар от воды.",
                bullets: [],
              },
              {
                icon: "Activity", title: "Пароперегреватель", color: "text-purple-400",
                desc: "Повышает температуру пара выше температуры насыщения. Увеличивает термический КПД, предотвращает конденсацию пара в турбине. Бывает радиационным, конвективным и комбинированным.",
                bullets: [],
              },
              {
                icon: "Waves", title: "Экономайзер", color: "text-green-400",
                desc: "Служит для подогрева питательной воды за счёт теплоты уходящих дымовых газов. Повышает КПД котла, снижает температуру дымовых газов и уменьшает расход топлива.",
                bullets: [],
              },
              {
                icon: "Wind", title: "Воздухоподогреватель", color: "text-amber-400",
                desc: "Подогревает воздух, поступающий в топку. Улучшает условия горения, повышает эффективность сжигания и уменьшает потери теплоты.",
                bullets: [],
              },
              {
                icon: "Settings", title: "Горелочное устройство", color: "text-red-400",
                desc: "Подаёт топливо и воздух в топку. Обеспечивает стабильное и эффективное сгорание. Регулирует мощность котла.",
                bullets: [],
              },
            ].map((card) => (
              <div key={card.title} className="param-card rounded p-5 space-y-3">
                <div className={card.color}>
                  <Icon name={card.icon} size={24} fallback="Settings" />
                </div>
                <h3 className="text-white font-semibold text-lg leading-tight" style={{ fontFamily: "Oswald, sans-serif" }}>
                  {card.title}
                </h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="section-divider" />

        {/* 03 Схемы */}
        <section id="schemes">
          <SectionHeader num="03" title="Технические схемы и чертежи" icon="Map" />
          <div className="mt-8 space-y-8">
            <div className="bracket-corner p-4 border border-[hsl(var(--border))] rounded bg-[hsl(var(--card))]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-mono text-xs text-[var(--cyan)] uppercase tracking-widest">Схема 01</div>
                  <h3 className="text-white text-xl font-semibold" style={{ fontFamily: "Oswald, sans-serif" }}>
                    Разрезная схема котлоагрегата
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-[hsl(var(--muted-foreground))] border border-[hsl(var(--border))] px-3 py-1.5 rounded">
                  <Icon name="MousePointer" size={12} className="text-[var(--cyan)]" />
                  Интерактивная
                </div>
              </div>
              <InteractiveScheme />
            </div>

            <div className="bracket-corner p-4 border border-[hsl(var(--border))] rounded bg-[hsl(var(--card))]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-mono text-xs text-[var(--cyan)] uppercase tracking-widest">Схема 02</div>
                  <h3 className="text-white text-xl font-semibold" style={{ fontFamily: "Oswald, sans-serif" }}>
                    Принципиальная тепловая схема
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-[hsl(var(--muted-foreground))] border border-[hsl(var(--border))] px-3 py-1.5 rounded">
                  <Icon name="ZoomIn" size={12} className="text-[var(--cyan)]" />
                  Нажмите для увеличения
                </div>
              </div>
              <ZoomableImage
                src="https://cdn.poehali.dev/projects/0724ba8c-02ed-4673-94b1-d943092453fd/files/2d36c162-096c-4f2d-ace0-6da0453639a7.jpg"
                alt="Тепловая схема котла"
              />
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* 04 Принцип работы */}
        <section id="principle">
          <SectionHeader num="04" title="Принцип работы котлоагрегата" icon="GitBranch" />
          <div className="mt-8 space-y-4">
            {PRINCIPLE_STEPS.map((step, idx) => (
              <div key={step.step} className="param-card rounded overflow-hidden">
                <div className="flex items-start gap-0">
                  <div className="flex flex-col items-center px-5 py-5 border-r border-[hsl(var(--border))] min-w-[72px]">
                    <span className="font-mono text-xs text-[hsl(var(--muted-foreground))] mb-2">{step.step}</span>
                    <Icon name={step.icon} size={20} className={step.color} fallback="Settings" />
                    {idx < PRINCIPLE_STEPS.length - 1 && (
                      <div className="w-px flex-1 bg-[hsl(var(--border))] mt-3 min-h-[16px]" />
                    )}
                  </div>
                  <div className="px-5 py-5 flex-1">
                    <h3 className="text-white font-semibold text-base mb-2" style={{ fontFamily: "Oswald, sans-serif" }}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="section-divider" />

        {/* 05 Характеристики */}
        <section id="specs">
          <SectionHeader num="05" title="Технические характеристики" icon="Gauge" />
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SPECS.map((s) => (
              <div key={s.param} className="param-card rounded p-4">
                <div className="flex items-start justify-between mb-3">
                  <Icon name={s.icon} size={20} className="text-[var(--cyan)]" fallback="Settings" />
                  <span className="font-mono text-xs text-[hsl(var(--muted-foreground))] border border-[hsl(var(--border))] px-1.5 py-0.5 rounded">ТТХ</span>
                </div>
                <div className="text-2xl font-bold text-white mb-0.5" style={{ fontFamily: "Oswald, sans-serif" }}>
                  {s.value}
                  <span className="text-base text-[var(--cyan)] ml-1">{s.unit}</span>
                </div>
                <div className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">{s.param}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 overflow-x-auto border border-[hsl(var(--border))] rounded">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[hsl(var(--muted))] border-b border-[hsl(var(--border))]">
                  {["Параметр", "Значение", "Примечание"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-mono text-xs uppercase tracking-widest text-[var(--cyan)]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Мощность энергоблока", "300 МВт", "Турбина К-300-240"],
                  ["Давление пара", "~240 кгс/см²", "На входе в турбину"],
                  ["Температура перегретого пара", "540–560 °C", "После пароперегревателя"],
                  ["Температура факела в топке", "1200–1600 °C", "Пылеугольное сжигание"],
                  ["Температура насыщенного пара", "280–320 °C", "На выходе из барабана"],
                  ["Тип котла", "Барабанный / прямоточный", "Для блоков 300 МВт"],
                  ["Движение газов", "П-образный газоход", "Вверх → поворот → вниз"],
                  ["Вид топлива", "Угольная пыль", "Пылеугольные горелки"],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-[hsl(var(--border))] hover:bg-[var(--cyan-dim)] transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{row[0]}</td>
                    <td className="px-4 py-3 font-mono text-[var(--cyan)] text-xs">{row[1]}</td>
                    <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-[hsl(var(--border))] bg-[hsl(220,27%,6%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded border border-[var(--cyan)]/50 flex items-center justify-center">
              <Icon name="Flame" size={12} className="text-[var(--cyan)]" />
            </div>
            <span className="text-xs font-mono text-[hsl(var(--muted-foreground))]">
              Учебное пособие «Конструкция котла»
            </span>
          </div>
          <div className="text-xs font-mono text-[hsl(var(--muted-foreground))]">
            Версия 1.0 / 2026
          </div>
        </div>
      </footer>
    </div>
  );
}