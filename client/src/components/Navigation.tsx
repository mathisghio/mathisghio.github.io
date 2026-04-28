/**
 * Navigation.tsx — Mathis Ghio
 *
 * Mascot rendered as position:fixed at viewport level → impossible à clipper
 * quelle que soit la section active (Contact inclus).
 *
 * Overdrive B+C :
 *   B — Scan line cinématique au chargement, lettre par lettre sur le logo
 *   C — Indicateur ligne précise (2px, slide) au lieu du background glow
 */

import { useState, useEffect, useRef, CSSProperties } from "react";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "About",        href: "#about" },
  { label: "Achievements", href: "#achievements" },
  { label: "Career",       href: "#career" },
  { label: "Season",       href: "#season" },
  { label: "For Brands",   href: "#sport" },
  { label: "Gallery",      href: "#gallery" },
  { label: "Partners",     href: "#partners" },
  { label: "Press",        href: "#press" },
  { label: "Contact",      href: "#contact" },
];

const LOGO_CHARS = "MATHIS GHIO".split("");

const WING_VISIBLE = 0.95;

const NAV_CSS = `
/* ── Base pill ── */
.mgNav {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  border-radius: 9999px;
  background: rgba(0,0,0,0.58);
  border: 1px solid rgba(255,255,255,0.09);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow: 0 12px 55px rgba(0,0,0,0.7), inset 0 0 0 .5px rgba(255,255,255,0.04);
  transition: padding 0.4s ease, gap 0.4s ease;
  padding: 8px;
  overflow: visible;
}
.mgNav.mgCompact { padding: 4px 5px; gap: 1px; }
.mgNav::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: rgba(0,0,0,0.58);
  z-index: 1;
  pointer-events: none;
}
.mgNav::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  border: 1px solid rgba(255,255,255,0.09);
  z-index: 1;
  pointer-events: none;
}

/* ── Wing / mascot (intact) ── */
.mgMascot {
  display: block;
  object-fit: contain;
  filter: drop-shadow(0 4px 20px rgba(70,150,255,0.42));
  transform-origin: 50% 85%;
}
@keyframes mgWingFloat {
  0%,100% { transform: translateY(0) rotate(-1.2deg); }
  50%     { transform: translateY(-5px) rotate(1.2deg); }
}
.mgWingFloat { animation: mgWingFloat 3.2s ease-in-out infinite; }
@keyframes mgWingTilt {
  0%   { transform: none; }
  25%  { transform: translateY(-4px) rotate(10deg) scale(1.06); }
  100% { transform: translateY(-3px) rotate(8deg) scale(1.05); }
}
.mgWingTilt { will-change: transform; animation: mgWingTilt .25s cubic-bezier(.15,0,0,1) forwards; }
@keyframes mgWingGust {
  0%   { transform: none; }
  20%  { transform: translateY(-12px) rotate(21deg) scale(1.14); }
  100% { transform: translateY(-11px) rotate(19deg) scale(1.12); }
}
.mgWingGust { will-change: transform; animation: mgWingGust .3s cubic-bezier(.15,0,0,1) forwards; filter: drop-shadow(0 4px 22px rgba(70,150,255,.58)); }
.mgParticles { position:absolute; top:5px; left:50%; pointer-events:none; z-index:25; }
.mgParticles span { position:absolute; border-radius:50%; }
.mgSpray span:nth-child(1){width:5.5px;height:5.5px;background:rgba(155,215,255,.95);animation:mgSp1 .88s ease-out infinite}
.mgSpray span:nth-child(2){width:4px;height:4px;background:rgba(185,228,255,.82);animation:mgSp2 .88s ease-out infinite .12s}
.mgSpray span:nth-child(3){width:3.5px;height:3.5px;background:rgba(210,238,255,.66);animation:mgSp3 .88s ease-out infinite .07s}
@keyframes mgSp1{0%{transform:translate(0,0) scale(0);opacity:0}40%{opacity:1}100%{transform:translate(18px,-16px) scale(1.1);opacity:0}}
@keyframes mgSp2{0%{transform:translate(0,0) scale(0);opacity:0}40%{opacity:.8}100%{transform:translate(-15px,-13px) scale(.88);opacity:0}}
@keyframes mgSp3{0%{transform:translate(0,0) scale(0);opacity:0}40%{opacity:.6}100%{transform:translate(22px,-7px) scale(.7);opacity:0}}
.mgAirStreaks { position:absolute; top:25%; left:50%; transform:translateX(-50%); pointer-events:none; z-index:25; width:100px; height:40px; }
.mgAirStreaks span { position:absolute; height:1.5px; border-radius:1px; background:linear-gradient(90deg,transparent,rgba(200,232,255,0.85),transparent); }
.mgAirStreaks span:nth-child(1){ width:32px; top:6px;  left:0;    animation:mgAir1 .42s ease-out infinite; }
.mgAirStreaks span:nth-child(2){ width:22px; top:16px; left:8px;  animation:mgAir2 .38s ease-out infinite .12s; }
.mgAirStreaks span:nth-child(3){ width:28px; top:27px; left:3px;  animation:mgAir3 .46s ease-out infinite .06s; }
.mgAirStreaks span:nth-child(4){ width:16px; top:11px; left:20px; animation:mgAir4 .35s ease-out infinite .2s; }
@keyframes mgAir1{0%{transform:translateX(-40px);opacity:0}30%{opacity:.9}100%{transform:translateX(70px);opacity:0}}
@keyframes mgAir2{0%{transform:translateX(-35px);opacity:0}30%{opacity:.7}100%{transform:translateX(65px);opacity:0}}
@keyframes mgAir3{0%{transform:translateX(-45px);opacity:0}30%{opacity:.75}100%{transform:translateX(68px);opacity:0}}
@keyframes mgAir4{0%{transform:translateX(-30px);opacity:0}30%{opacity:.55}100%{transform:translateX(55px);opacity:0}}

/* ── Tab buttons ── */
.mgTab {
  position: relative; z-index: 2;
  cursor: pointer; letter-spacing: .028em;
  border-radius: 9999px; border: none; background: none;
  color: rgba(255,255,255,.46); font-family: inherit;
  outline: none; user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: color .22s ease, padding .4s ease, font-size .4s ease;
  padding: 10px 15px; font-size: 12.5px; font-weight: 600;
}
.mgNav.mgCompact .mgTab { padding: 6px 9px; font-size: 11px; }
.mgTab:hover:not(.mgTabActive) { background: rgba(255,255,255,.06); color: rgba(255,255,255,.72); }
.mgTabActive { color: rgba(255,255,255,1); }
.mgTabLabel  { position: relative; z-index: 1; }

/* ── B : Scan line cinématique ── */
@keyframes mgScan {
  0%   { transform: translateX(0);      opacity: 1; }
  82%  { opacity: 1; }
  100% { transform: translateX(100vw);  opacity: 0; }
}
.mgScanLine {
  position: fixed;
  top: 0; left: 0;
  width: 2px; height: 80px;
  background: linear-gradient(180deg,
    rgba(14,165,233,0)   0%,
    rgba(14,165,233,1)  22%,
    rgba(56,189,248,1)  50%,
    rgba(14,165,233,1)  78%,
    rgba(14,165,233,0) 100%
  );
  box-shadow: 0 0 18px rgba(14,165,233,0.85), 0 0 48px rgba(14,165,233,0.35);
  animation: mgScan 0.82s cubic-bezier(0.4, 0, 0.55, 1) forwards;
  pointer-events: none;
  z-index: 200;
}

/* ── B : Logo lettre par lettre ── */
@keyframes mgLetterIn {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}
.mgLetter {
  display: inline-block;
  opacity: 0;
  animation: mgLetterIn 0.18s cubic-bezier(0, 0, 0.2, 1) forwards;
}

/* ── B : Nav items reveal ── */
@keyframes mgTabIn {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}
.mgTabReveal {
  opacity: 0;
  animation: mgTabIn 0.22s ease-out forwards;
}

/* ── C : Indicateur ligne précise ── */
.mgSlider {
  position: absolute;
  bottom: 4px;
  left: 0;
  width: 1px;
  height: 2px;
  background: #0EA5E9;
  border-radius: 2px;
  transform-origin: left center;
  transition: transform 0.32s cubic-bezier(0.25, 0, 0, 1), opacity 0.22s ease;
  box-shadow: 0 0 8px rgba(14,165,233,0.95), 0 0 22px rgba(14,165,233,0.5);
  pointer-events: none;
  z-index: 3;
}

/* ── Reduced motion ── */
@media (prefers-reduced-motion: reduce) {
  .mgMascot, .mgParticles span, .mgAirStreaks span { animation: none !important; }
  .mgScanLine  { display: none; }
  .mgLetter    { opacity: 1 !important; animation: none !important; }
  .mgTabReveal { opacity: 1 !important; animation: none !important; }
}
`;

export function Navigation() {
  const [scrolled,      setScrolled]      = useState(false);
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [activeIndex,   setActiveIndex]   = useState(-1);
  const [pillHovered,   setPillHovered]   = useState(false);
  const [hoveredTabIdx, setHoveredTabIdx] = useState<number | null>(null);

  const [mascotPos,  setMascotPos]  = useState({ x: -200, y: -200 });
  const [showMascot, setShowMascot] = useState(false);

  /* ── Overdrive B : scan line ── */
  const [showScan, setShowScan] = useState(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  /* ── Overdrive C : sliding indicator ── */
  const [sliderStyle, setSliderStyle] = useState<CSSProperties>({
    opacity: 0,
    transform: "translateX(0px) scaleX(1)",
  });

  const pillRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const scrollSpyPaused = useRef(false);

  const compact = scrolled;

  const mascotW      = 86;
  const mascotH      = 50;
  const visibleAbove = Math.round(mascotH * WING_VISIBLE);
  const pillTopPad   = visibleAbove;

  const isActiveHovered    = pillHovered && hoveredTabIdx === activeIndex;
  const isNonActiveHovered = hoveredTabIdx !== null && hoveredTabIdx !== activeIndex;
  const mascotClass = isActiveHovered    ? "mgMascot mgWingGust"
                    : isNonActiveHovered ? "mgMascot mgWingTilt"
                    :                      "mgMascot mgWingFloat";

  /* ── Inject CSS ── */
  useEffect(() => {
    if (document.getElementById("mg-nav-css")) return;
    const s = document.createElement("style");
    s.id = "mg-nav-css"; s.textContent = NAV_CSS;
    document.head.appendChild(s);
  }, []);

  /* ── Scan line : hide after animation completes ── */
  useEffect(() => {
    if (!showScan) return;
    const t = setTimeout(() => setShowScan(false), 980);
    return () => clearTimeout(t);
  }, [showScan]);

  /* ── Scroll detection ── */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* ── Mascot position ── */
  useEffect(() => {
    const measure = () => {
      const pill = pillRef.current;
      if (!pill) return;

      if (activeIndex === -1) {
        const pr = pill.getBoundingClientRect();
        setMascotPos({ x: pr.left + pr.width / 2, y: pr.top - visibleAbove });
        setShowMascot(false);
        return;
      }

      const btn = btnRefs.current[activeIndex];
      if (!btn) return;
      const br = btn.getBoundingClientRect();
      const pr = pill.getBoundingClientRect();
      setMascotPos({
        x: br.left + br.width / 2,
        y: pr.top  - visibleAbove,
      });
      setShowMascot(true);
    };
    measure();
    const t = setTimeout(measure, 420);
    return () => clearTimeout(t);
  }, [activeIndex, compact, visibleAbove]);

  /* ── Overdrive C : slider position ── */
  useEffect(() => {
    const updateSlider = () => {
      if (activeIndex === -1) {
        setSliderStyle(s => ({ ...s, opacity: 0 }));
        return;
      }
      const btn  = btnRefs.current[activeIndex];
      const pill = pillRef.current;
      if (!btn || !pill) return;
      const btnRect  = btn.getBoundingClientRect();
      const pillRect = pill.getBoundingClientRect();
      const x = btnRect.left - pillRect.left;
      const w = btnRect.width;
      setSliderStyle({ opacity: 1, transform: `translateX(${x}px) scaleX(${w})` });
    };

    const t = setTimeout(updateSlider, 80);
    window.addEventListener("resize", updateSlider);
    return () => { clearTimeout(t); window.removeEventListener("resize", updateSlider); };
  }, [activeIndex, compact]);

  /* ── Scroll spy ── */
  useEffect(() => {
    const ids = NAV_ITEMS.map(item => item.href.slice(1));
    const visibleSet = new Set<string>();

    const isInHero = () => {
      const firstEl = document.getElementById(ids[0]);
      return !firstEl || firstEl.getBoundingClientRect().top > 0;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (scrollSpyPaused.current) return;

        entries.forEach(e => {
          if (e.isIntersecting) visibleSet.add(e.target.id);
          else visibleSet.delete(e.target.id);
        });

        if (entries.some(e => e.target.id === "goat" && e.isIntersecting)) {
          setActiveIndex(2);
          return;
        }
        visibleSet.delete("goat");

        if (visibleSet.size === 0) {
          if (isInHero()) {
            setActiveIndex(-1);
          } else {
            const aboveIdx = ids.reduce((best, id, i) => {
              const el = document.getElementById(id);
              if (!el) return best;
              return el.getBoundingClientRect().top < 0 ? i : best;
            }, -1);
            if (aboveIdx !== -1) setActiveIndex(aboveIdx);
            else setActiveIndex(-1);
          }
        } else {
          const sorted = ids.filter(id => visibleSet.has(id));
          if (sorted.length > 0) setActiveIndex(ids.indexOf(sorted[0]));
        }
      },
      { rootMargin: "-85% 0px -30% 0px", threshold: 0 }
    );

    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    const goatEl = document.getElementById("goat");
    if (goatEl) observer.observe(goatEl);

    return () => observer.disconnect();
  }, []);

  const handleNav = (href: string, index: number) => {
    setMenuOpen(false); setActiveIndex(index);
    scrollSpyPaused.current = true;
    setTimeout(() => { scrollSpyPaused.current = false; }, 900);

    const target = document.querySelector(href);
    if (!target) return;

    const navHeight = pillTopPad + 52;
    const top = (target as HTMLElement).getBoundingClientRect().top + window.scrollY - navHeight - 8;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <>
      {/* ── Overdrive B : scan line ── */}
      {showScan && <div className="mgScanLine" aria-hidden="true" />}

      {/* ── Mascot — position:fixed, hors de tout contexte de clipping ── */}
      <div
        aria-hidden="true"
        className="hidden lg:block"
        style={{
          position:      "fixed",
          left:          mascotPos.x,
          top:           mascotPos.y,
          transform:     "translateX(-50%)",
          pointerEvents: "none",
          zIndex:        55,
          opacity:       showMascot ? 1 : 0,
          transition:    "left 0.26s cubic-bezier(.34,1.56,.64,1), top 0.26s cubic-bezier(.34,1.56,.64,1), opacity 0.2s ease",
        }}
      >
        {isActiveHovered    && <div className="mgParticles mgSpray"><span /><span /><span /></div>}
        {isNonActiveHovered && <div className="mgAirStreaks"><span /><span /><span /><span /></div>}
        <img
          src="https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1774530426/mascot_1_xfxno0.png"
          alt=""
          width={mascotW}
          height={mascotH}
          className={mascotClass}
          draggable={false}
          decoding="async"
          // @ts-expect-error attribut HTML standard
          fetchpriority="low"
        />
      </div>

      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background:     scrolled ? "rgba(8,9,14,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)"        : "none",
          borderBottom:   scrolled ? "1px solid rgba(14,165,233,0.1)" : "none",
          minHeight:      pillTopPad + (compact ? 36 : 40),
        }}
      >
        <div className="container flex items-center justify-between pt-3 pb-3">

          {/* ── Logo ── */}
          <button
            onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setActiveIndex(-1); }}
            className="flex items-center gap-3 group"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            {/* Monogramme MG */}
            <div
              className="w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0"
              style={{
                background:  "#0EA5E9",
                boxShadow:   "0 0 14px rgba(14,165,233,0.5), 0 0 0 1px rgba(14,165,233,0.25)",
                transition:  "box-shadow 0.3s ease",
              }}
            >
              <span className="font-display text-white leading-none" style={{ fontSize: "0.9rem" }}>MG</span>
            </div>

            {/* Nom lettre par lettre */}
            <span
              className="hidden sm:block font-heading font-bold uppercase"
              style={{ letterSpacing: "0.16em", fontSize: "1.05rem", color: "rgba(241,245,249,0.92)" }}
              aria-label="Mathis Ghio"
            >
              {LOGO_CHARS.map((char, i) => (
                <span
                  key={i}
                  className="mgLetter"
                  style={{ animationDelay: `${110 + i * 30}ms` }}
                >
                  {char}
                </span>
              ))}
            </span>
          </button>

          {/* ── Pill desktop ── */}
          <div className="hidden lg:block" style={{ paddingTop: pillTopPad }}>
            <div
              ref={pillRef}
              className={`mgNav${compact ? " mgCompact" : ""}`}
              onMouseEnter={() => setPillHovered(true)}
              onMouseLeave={() => { setPillHovered(false); setHoveredTabIdx(null); }}
            >
              {/* ── Overdrive C : sliding indicator ── */}
              <div className="mgSlider" aria-hidden="true" style={sliderStyle} />

              {NAV_ITEMS.map((item, i) => {
                const active = i === activeIndex;
                return (
                  <button
                    key={item.href}
                    ref={el => { btnRefs.current[i] = el; }}
                    className={`mgTab mgTabReveal${active ? " mgTabActive" : ""}`}
                    style={{ animationDelay: `${390 + i * 32}ms` }}
                    onClick={() => handleNav(item.href, i)}
                    onMouseEnter={() => setHoveredTabIdx(i)}
                    onMouseLeave={() => setHoveredTabIdx(null)}
                    aria-current={active ? "page" : undefined}
                  >
                    <span className="mgTabLabel">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Hamburger ── */}
          <button
            className="lg:hidden p-2 text-white"
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? "Fermer" : "Menu"}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile menu (intact) ── */}
      <style>{`
        .mgMobileMenu { position:fixed;inset:0;z-index:45;display:flex;align-items:center;justify-content:center;background:rgba(5,6,10,0.80);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);transition:opacity 0.26s ease; }
        .mgMobileInner { position:relative;display:flex;flex-direction:column;gap:8px;padding:10px;min-width:224px;max-width:272px;width:72vw;transition:transform 0.36s cubic-bezier(.34,1.56,.64,1),opacity 0.24s ease; }
        .mgMobileBtn { position:relative;width:100%;cursor:pointer;outline:none;border:none;border-radius:11px;background:linear-gradient(180deg,rgba(24,27,58,0.72) 0%,rgba(13,14,30,0.85) 100%);padding:13px 22px;display:flex;align-items:center;gap:12px;font-family:'Barlow Condensed','Arial Narrow',sans-serif;font-size:14.5px;font-weight:700;letter-spacing:0.13em;text-align:left;text-transform:uppercase;color:rgba(255,255,255,0.42);user-select:none;-webkit-tap-highlight-color:transparent;transition:color 0.22s ease,background 0.22s ease;overflow:hidden; }
        .mgMobileBtn::before { content:'';position:absolute;inset:0;border-radius:11px;padding:1px;background:conic-gradient(from 180deg at 50% 50%,rgba(255,255,255,0.08) 0deg,rgba(255,255,255,0.04) 60deg,rgba(255,255,255,0.02) 120deg,rgba(255,255,255,0.00) 180deg,rgba(255,255,255,0.02) 240deg,rgba(255,255,255,0.04) 300deg,rgba(255,255,255,0.08) 360deg);-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;transition:background 0.24s ease,opacity 0.24s ease; }
        .mgMobileBtn::after { content:'';position:absolute;top:0;left:-60%;width:40%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent);transform:skewX(-15deg);pointer-events:none;transition:left 0.5s ease; }
        .mgMobileBtn:hover { color:rgba(255,255,255,0.88);background:linear-gradient(180deg,rgba(14,165,233,0.10) 0%,rgba(14,165,233,0.04) 100%); }
        .mgMobileBtn:hover::before { background:conic-gradient(from 180deg at 50% 50%,rgba(14,165,233,0.55) 0deg,rgba(56,189,248,0.20) 90deg,rgba(14,165,233,0.08) 180deg,rgba(56,189,248,0.20) 270deg,rgba(14,165,233,0.55) 360deg); }
        .mgMobileBtn:hover::after { left:120%; }
        .mgMobileBtn.mgMobileBtnActive { color:rgba(255,255,255,1);background:linear-gradient(180deg,rgba(14,165,233,0.16) 0%,rgba(14,165,233,0.06) 100%); }
        .mgMobileBtn.mgMobileBtnActive::before { background:conic-gradient(from 180deg at 50% 50%,rgba(14,165,233,0.80) 0deg,rgba(56,189,248,0.30) 90deg,rgba(14,165,233,0.18) 180deg,rgba(56,189,248,0.30) 270deg,rgba(14,165,233,0.80) 360deg); }
        .mgMobileDot { width:5px;height:5px;border-radius:50%;flex-shrink:0;transition:background 0.22s ease,box-shadow 0.22s ease; }
      `}</style>

      <div
        className="mgMobileMenu lg:hidden"
        style={{ opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? "all" : "none" }}
      >
        <div className="absolute inset-0" onClick={() => setMenuOpen(false)} />
        <div
          className="mgMobileInner"
          style={{ transform: menuOpen ? "scale(1) translateY(0)" : "scale(0.94) translateY(14px)", opacity: menuOpen ? 1 : 0 }}
        >
          {NAV_ITEMS.map((item, i) => {
            const active = i === activeIndex;
            return (
              <button
                key={item.href}
                onClick={() => handleNav(item.href, i)}
                className={`mgMobileBtn${active ? " mgMobileBtnActive" : ""}`}
                style={{
                  transitionDelay: menuOpen ? `${i * 30}ms` : "0ms",
                  transform:       menuOpen ? "translateX(0) scale(1)" : "translateX(-8px) scale(0.97)",
                  opacity:         menuOpen ? 1 : 0,
                }}
              >
                <span
                  className="mgMobileDot"
                  style={{
                    background: active ? "#0EA5E9" : "rgba(255,255,255,0.16)",
                    boxShadow:  active ? "0 0 8px rgba(14,165,233,0.95)" : "none",
                  }}
                />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
