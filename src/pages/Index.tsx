import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";

const SECTIONS = [
  { id: "intro", label: "Введение" },
  { id: "construction", label: "Конструкция" },
  { id: "schemes", label: "Схемы и чертежи" },
  { id: "specs", label: "Характеристики" },
  { id: "operation", label: "Эксплуатация" },
];

const HOTSPOTS = [
  { id: 1, x: 50, y: 20, label: "Паровой коллектор", desc: "Верхний барабан, в котором собирается пар. Рабочее давление до 1,6 МПа. Выполнен из легированной стали." },
  { id: 2, x: 72, y: 45, label: "Пароперегреватель", desc: "Повышает температуру насыщенного пара до 250–450°C. Состоит из змеевиков из жаростойкой стали." },
  { id: 3, x: 28, y: 55, label: "Водяной экономайзер", desc: "Предварительный нагрев питательной воды уходящими газами. Повышает КПД на 8–12%." },
  { id: 4, x: 50, y: 75, label: "Топочная камера", desc: "Зона сжигания топлива. Температура факела до 1200–1600°C. Экранирована трубами с водой." },
  { id: 5, x: 18, y: 35, label: "Водяной барабан", desc: "Нижний коллектор водяного контура. Собирает конденсат и распределяет питательную воду." },
  { id: 6, x: 82, y: 70, label: "Воздухоподогреватель", desc: "Нагрев воздуха для горения уходящими газами. Снижает потери тепла с дымовыми газами." },
];

const SPECS = [
  { param: "Паропроизводительность", value: "10–100 т/ч", unit: "", icon: "Gauge" },
  { param: "Рабочее давление пара", value: "0.7–4.0", unit: "МПа", icon: "Activity" },
  { param: "Температура перегретого пара", value: "250–440", unit: "°C", icon: "Thermometer" },
  { param: "Температура питательной воды", value: "100–150", unit: "°C", icon: "Droplets" },
  { param: "КПД котлоагрегата", value: "88–93", unit: "%", icon: "Zap" },
  { param: "Температура уходящих газов", value: "120–160", unit: "°C", icon: "Wind" },
  { param: "Давление топлива", value: "0.003–0.03", unit: "МПа", icon: "Flame" },
  { param: "Поверхность нагрева", value: "200–2000", unit: "м²", icon: "Square" },
];

const RULES = [
  {
    step: "01",
    title: "Пуск котла",
    icon: "Play",
    color: "text-cyan-400",
    items: [
      "Проверить уровень воды в барабане (норма: средняя отметка водоуказателя)",
      "Открыть воздушный клапан для удаления воздуха из тракта",
      "Включить тягодутьевые машины и провентилировать топку 10 минут",
      "Розжиг горелок с минимальной нагрузкой",
      "Прогрев котла вести медленно: подъём давления не более 0,1 МПа/мин",
    ],
  },
  {
    step: "02",
    title: "Нормальная эксплуатация",
    icon: "Settings",
    color: "text-green-400",
    items: [
      "Поддерживать уровень воды в допустимых пределах ±50 мм от нормы",
      "Контролировать давление пара каждые 30 минут",
      "Регулярная продувка нижних точек (не реже 1 раза в смену)",
      "Ежесменный контроль плотности фланцевых соединений",
      "Вести журнал параметров: давление, температура, расход",
    ],
  },
  {
    step: "03",
    title: "Аварийная остановка",
    icon: "AlertTriangle",
    color: "text-red-400",
    items: [
      "Немедленно погасить горелки при упуске воды или резком упаде давления",
      "Отключить питательные насосы при упуске воды",
      "Открыть аварийный клапан сброса пара",
      "Сообщить начальнику смены и зафиксировать в журнале",
      "Не вводить воду в горячий котёл при упуске — опасность взрыва!",
    ],
  },
  {
    step: "04",
    title: "Техническое обслуживание",
    icon: "Wrench",
    color: "text-amber-400",
    items: [
      "Ежемесячно: проверка предохранительных клапанов, арматуры",
      "Раз в 6 месяцев: осмотр поверхностей нагрева, очистка от накипи",
      "Ежегодно: гидравлическое испытание на 1,25 рабочего давления",
      "Раз в 2 года: внутренний осмотр барабанов и коллекторов",
      "По регламенту: химводоочистка и контроль качества питательной воды",
    ],
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
            Комплексное учебное пособие по устройству, принципу работы и эксплуатации
            промышленных паровых котлоагрегатов
          </p>
          <div className="flex flex-wrap gap-4">
            {[
              { icon: "BookOpen" as const, text: "5 разделов" },
              { icon: "Target" as const, text: "Интерактивные схемы" },
              { icon: "Shield" as const, text: "Правила безопасности" },
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
                <span className="text-white font-medium">Паровой котёл</span> — теплообменное устройство, в котором за счёт
                тепла, выделяемого при сжигании топлива, нагревается вода и вырабатывается пар
                с заданными параметрами давления и температуры.
              </p>
              <p>
                Котлоагрегаты широко применяются на тепловых электростанциях, в промышленной
                теплоэнергетике, системах отопления и технологических процессах, требующих
                пара или горячей воды.
              </p>
              <p>
                Настоящее пособие охватывает классификацию котлов, их конструктивные элементы,
                термодинамические процессы, технические параметры и требования безопасной
                эксплуатации в соответствии с ФНП «Требования к сосудам под давлением».
              </p>
            </div>
            <div className="space-y-3">
              {[
                { label: "Водотрубные котлы", value: 85, desc: "Основной тип на ТЭЦ" },
                { label: "Жаротрубные котлы", value: 60, desc: "Малая и средняя мощность" },
                { label: "Комбинированные", value: 45, desc: "Специальное применение" },
              ].map((item) => (
                <div key={item.label} className="param-card p-4 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-white">{item.label}</span>
                    <span className="font-mono text-xs text-[var(--cyan)]">{item.value}%</span>
                  </div>
                  <div className="tech-progress mb-1">
                    <div className="tech-progress-bar" style={{ width: `${item.value}%` }} />
                  </div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))]">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* 02 Конструкция */}
        <section id="construction">
          <SectionHeader num="02" title="Описание конструкции" icon="Layers" />
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: "Droplets", title: "Барабан котла", color: "text-blue-400", desc: "Цилиндрический сосуд из листовой стали. Верхний барабан — паровой коллектор. Нижний — водяной коллектор. Оснащены арматурой и водоуказателями." },
              { icon: "Flame", title: "Топочная камера", color: "text-orange-400", desc: "Экранирована трубами с циркулирующей водой. Обеспечивает полное сжигание топлива. Стены выполнены из огнеупорного кирпича и обмуровки." },
              { icon: "Activity", title: "Пароперегреватель", color: "text-cyan-400", desc: "Змеевики из жаростойких сталей в зоне высоких температур. Повышает энтальпию пара. Бывает радиационным, конвективным и смешанным." },
              { icon: "Waves", title: "Экономайзер", color: "text-green-400", desc: "Пакеты оребрённых труб в хвостовой части газохода. Утилизирует тепло уходящих газов для подогрева питательной воды." },
              { icon: "Wind", title: "Воздухоподогреватель", color: "text-purple-400", desc: "Рекуперативный теплообменник. Нагревает воздух для горелок до 200–300°C. Снижает температуру уходящих газов до 120–160°C." },
              { icon: "Settings", title: "Горелочные устройства", color: "text-amber-400", desc: "Обеспечивают подачу и смешение топлива с воздухом. Типы: вихревые, прямоточные, комбинированные. Регулировка мощности от 30 до 100%." },
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

        {/* 04 Характеристики */}
        <section id="specs">
          <SectionHeader num="04" title="Технические характеристики" icon="Gauge" />
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
                  {["Параметр", "Котёл ДКВР", "Котёл ДЕ", "Котёл Е (ГМ)", "Единица"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-mono text-xs uppercase tracking-widest text-[var(--cyan)]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Паропроизводительность", "2,5–10", "4–16", "10–100", "т/ч"],
                  ["Давление пара", "0,7–1,4", "0,7–1,4", "1,4–4,0", "МПа"],
                  ["Темп. перегр. пара", "—", "—", "250–440", "°C"],
                  ["КПД (расч.)", "88–91", "88–91", "90–93", "%"],
                  ["Вид топлива", "Газ/мазут", "Газ/мазут", "Газ/мазут", "—"],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-[hsl(var(--border))] hover:bg-[var(--cyan-dim)] transition-colors">
                    {row.map((cell, j) => (
                      <td key={j} className={`px-4 py-3 ${j === 0 ? "text-white font-medium" : j === 4 ? "font-mono text-[var(--cyan)] text-xs" : "text-[hsl(var(--muted-foreground))]"}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="section-divider" />

        {/* 05 Эксплуатация */}
        <section id="operation">
          <SectionHeader num="05" title="Правила эксплуатации и обслуживания" icon="Shield" />
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            {RULES.map((rule) => (
              <div key={rule.step} className="param-card rounded overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]">
                  <span className="font-mono text-xs text-[hsl(var(--muted-foreground))]">{rule.step}</span>
                  <Icon name={rule.icon} size={18} className={rule.color} fallback="Settings" />
                  <h3 className="text-white font-semibold text-base" style={{ fontFamily: "Oswald, sans-serif" }}>
                    {rule.title}
                  </h3>
                </div>
                <ul className="p-5 space-y-3">
                  {rule.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[hsl(var(--muted-foreground))]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)] mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-6 border border-red-500/40 bg-red-500/5 rounded p-5 flex gap-4">
            <Icon name="AlertTriangle" size={24} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-red-400 font-semibold mb-2" style={{ fontFamily: "Oswald, sans-serif" }}>
                Важно: требования безопасности
              </h4>
              <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
                Эксплуатация котлов допускается только лицами, прошедшими обучение и аттестацию
                в соответствии с ФНП «Требования к сосудам, работающим под давлением» (Приказ
                Ростехнадзора № 536 от 15.12.2020). Самовольные изменения конструкции и
                отклонения от регламента строго запрещены.
              </p>
            </div>
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