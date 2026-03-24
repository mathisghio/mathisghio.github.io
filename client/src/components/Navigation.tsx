/**
 * Navigation.tsx — Mathis Ghio v4
 *
 * - Overlap séparé pour wing et foil (ratios indépendants)
 * - Hover tab non-actif : air streaks (wing) ou water streaks (foil)
 * - Tilt doux au hover non-actif, gust/dive complet au hover actif
 * - Scroll spy + compact + toggle W/F
 */

import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";

// ─── Config ───────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "About",        href: "#about" },
  { label: "Achievements", href: "#achievements" },
  { label: "Career",       href: "#career" },
  { label: "The Sport",    href: "#sport" },
  { label: "Gallery",      href: "#gallery" },
  { label: "Partners",     href: "#partners" },
  { label: "Press",        href: "#press" },
  { label: "Contact",      href: "#contact" },
];

// Portion VISIBLE au-dessus de la pill (reste caché derrière)
// Wing normal  : H=64,  WING_VISIBLE=0.58 → visibleAbove=37px → pillTopPad=45px
// Foil normal  : H=185, FOIL_VISIBLE=0.20 → visibleAbove=37px → pillTopPad=45px  ← même hauteur
const WING_VISIBLE = 0.58;
const FOIL_VISIBLE = 0.20; // 20% seulement dépasse : foil grand mais très caché derrière la pill

// ─── CSS ─────────────────────────────────────────────────────────────────────

const NAV_CSS = `
/* ── Pill ── */
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

/* Cache la partie basse du mascot derrière la pill */
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

/* ── Mascot wrap ── */
.mgMascotWrap {
  position: absolute;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
  z-index: 0;
  transition: left 0.26s cubic-bezier(.34,1.56,.64,1), top 0.4s ease;
}

/* ── Photo mascot ── */
.mgMascot {
  display: block;
  object-fit: contain;
  filter: drop-shadow(0 4px 20px rgba(70,150,255,0.42));
  transform-origin: 50% 85%;
  transition: width 0.4s ease, height 0.4s ease, filter 0.3s ease;
}

/* Idle */
@keyframes mgWingFloat { 0%,100%{transform:translateY(0) rotate(-1.2deg)}50%{transform:translateY(-5px) rotate(1.2deg)} }
@keyframes mgFoilBob   { 0%,100%{transform:translateY(0) rotate(0)}33%{transform:translateY(-3px) rotate(-.7deg)}66%{transform:translateY(-1.5px) rotate(.7deg)} }
.mgWingFloat { animation: mgWingFloat 3.2s ease-in-out infinite; }
.mgFoilBob   { transform-origin:50% 15%; animation: mgFoilBob 3.5s ease-in-out infinite; }

/* Hover tab non-actif — tilt doux */
@keyframes mgWingTilt {
  0%   { transform: none; }
  25%  { transform: translateY(-4px) rotate(10deg) scale(1.06); }
  100% { transform: translateY(-3px) rotate(8deg)  scale(1.05); }
}
@keyframes mgFoilLean {
  0%   { transform: none; }
  25%  { transform: translateY(-4px) rotate(-5deg) scale(1.05); }
  100% { transform: translateY(-3px) rotate(-4deg) scale(1.04); }
}
.mgWingTilt { will-change:transform; animation: mgWingTilt .25s cubic-bezier(.15,0,0,1) forwards; }
.mgFoilLean { transform-origin:50% 15%; will-change:transform; animation: mgFoilLean .25s cubic-bezier(.15,0,0,1) forwards; }

/* Hover actif (plein pilote) */
@keyframes mgWingGust { 0%{transform:none}20%{transform:translateY(-12px) rotate(21deg) scale(1.14)}100%{transform:translateY(-11px) rotate(19deg) scale(1.12)} }
@keyframes mgFoilDive { 0%{transform:none}20%{transform:translateY(-9px) rotate(-8deg) scale(1.1)}100%{transform:translateY(-8px) rotate(-6deg) scale(1.08)} }
.mgWingGust { will-change:transform; animation: mgWingGust .3s cubic-bezier(.15,0,0,1) forwards; filter:drop-shadow(0 4px 22px rgba(70,150,255,.58)); }
.mgFoilDive { transform-origin:50% 15%; will-change:transform; animation: mgFoilDive .3s cubic-bezier(.15,0,0,1) forwards; filter:drop-shadow(0 5px 26px rgba(40,190,255,.62)); }

/* ── Particules (hover actif) ── */
.mgParticles { position:absolute; top:5px; left:50%; pointer-events:none; z-index:25; }
.mgParticles span { position:absolute; border-radius:50%; }
.mgSpray span:nth-child(1){width:5.5px;height:5.5px;background:rgba(155,215,255,.95);animation:mgSp1 .88s ease-out infinite}
.mgSpray span:nth-child(2){width:4px;height:4px;background:rgba(185,228,255,.82);animation:mgSp2 .88s ease-out infinite .12s}
.mgSpray span:nth-child(3){width:3.5px;height:3.5px;background:rgba(210,238,255,.66);animation:mgSp3 .88s ease-out infinite .07s}
@keyframes mgSp1{0%{transform:translate(0,0) scale(0);opacity:0}40%{opacity:1}100%{transform:translate(18px,-16px) scale(1.1);opacity:0}}
@keyframes mgSp2{0%{transform:translate(0,0) scale(0);opacity:0}40%{opacity:.8}100%{transform:translate(-15px,-13px) scale(.88);opacity:0}}
@keyframes mgSp3{0%{transform:translate(0,0) scale(0);opacity:0}40%{opacity:.6}100%{transform:translate(22px,-7px) scale(.7);opacity:0}}
.mgBubbles span{background:transparent}
.mgBubbles span:nth-child(1){width:6px;height:6px;border:1.2px solid rgba(125,218,255,.88);animation:mgBub1 1s ease-out infinite}
.mgBubbles span:nth-child(2){width:4.5px;height:4.5px;border:1.2px solid rgba(158,228,255,.72);animation:mgBub2 1s ease-out infinite .16s}
.mgBubbles span:nth-child(3){width:3.5px;height:3.5px;border:1.2px solid rgba(190,235,255,.56);animation:mgBub3 1s ease-out infinite .08s}
@keyframes mgBub1{0%{transform:translate(0,0) scale(0);opacity:0}32%{opacity:.9}100%{transform:translate(9px,-20px) scale(1);opacity:0}}
@keyframes mgBub2{0%{transform:translate(0,0) scale(0);opacity:0}32%{opacity:.7}100%{transform:translate(-7px,-16px) scale(.84);opacity:0}}
@keyframes mgBub3{0%{transform:translate(0,0) scale(0);opacity:0}32%{opacity:.54}100%{transform:translate(14px,-10px) scale(.66);opacity:0}}

/* ── Filets d'air (wing, hover non-actif) ── */
/* Lignes horizontales qui traversent de gauche à droite */
.mgAirStreaks {
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
  z-index: 25;
  width: 100px;
  height: 40px;
}
.mgAirStreaks span {
  position: absolute;
  height: 1.5px;
  border-radius: 1px;
  background: linear-gradient(90deg, transparent, rgba(200,232,255,0.85), transparent);
}
.mgAirStreaks span:nth-child(1) { width:32px; top:6px;  left:0; animation: mgAir1 .42s ease-out infinite; }
.mgAirStreaks span:nth-child(2) { width:22px; top:16px; left:8px; animation: mgAir2 .38s ease-out infinite .12s; }
.mgAirStreaks span:nth-child(3) { width:28px; top:27px; left:3px; animation: mgAir3 .46s ease-out infinite .06s; }
.mgAirStreaks span:nth-child(4) { width:16px; top:11px; left:20px; animation: mgAir4 .35s ease-out infinite .2s; }

@keyframes mgAir1 { 0%{transform:translateX(-40px);opacity:0} 30%{opacity:.9} 100%{transform:translateX(70px);opacity:0} }
@keyframes mgAir2 { 0%{transform:translateX(-35px);opacity:0} 30%{opacity:.7} 100%{transform:translateX(65px);opacity:0} }
@keyframes mgAir3 { 0%{transform:translateX(-45px);opacity:0} 30%{opacity:.75} 100%{transform:translateX(68px);opacity:0} }
@keyframes mgAir4 { 0%{transform:translateX(-30px);opacity:0} 30%{opacity:.55} 100%{transform:translateX(55px);opacity:0} }

/* ── Filets d'eau (foil, hover non-actif) ── */
/* Lignes légèrement inclinées, couleur eau, traversent horizontalement */
.mgWaterStreaks {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
  z-index: 25;
  width: 80px;
  height: 50px;
}
.mgWaterStreaks span {
  position: absolute;
  height: 1.5px;
  border-radius: 1px;
  background: linear-gradient(90deg, transparent, rgba(80,220,255,0.82), rgba(180,245,255,0.6), transparent);
  transform: rotate(-4deg);
}
.mgWaterStreaks span:nth-child(1) { width:30px; top:5px;  left:0;  animation: mgWat1 .48s ease-out infinite; }
.mgWaterStreaks span:nth-child(2) { width:20px; top:16px; left:10px; animation: mgWat2 .44s ease-out infinite .14s; }
.mgWaterStreaks span:nth-child(3) { width:26px; top:28px; left:2px; animation: mgWat3 .52s ease-out infinite .07s; }
.mgWaterStreaks span:nth-child(4) { width:14px; top:40px; left:15px; animation: mgWat4 .40s ease-out infinite .22s; }

@keyframes mgWat1 { 0%{transform:translateX(-40px) rotate(-4deg);opacity:0} 25%{opacity:.85} 100%{transform:translateX(65px) rotate(-4deg);opacity:0} }
@keyframes mgWat2 { 0%{transform:translateX(-35px) rotate(-4deg);opacity:0} 25%{opacity:.65} 100%{transform:translateX(60px) rotate(-4deg);opacity:0} }
@keyframes mgWat3 { 0%{transform:translateX(-42px) rotate(-4deg);opacity:0} 25%{opacity:.7}  100%{transform:translateX(62px) rotate(-4deg);opacity:0} }
@keyframes mgWat4 { 0%{transform:translateX(-30px) rotate(-4deg);opacity:0} 25%{opacity:.5}  100%{transform:translateX(50px) rotate(-4deg);opacity:0} }

/* ── Tabs ── */
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
.mgTabGlow   { position: absolute; inset: 0; border-radius: 9999px; overflow: hidden; }
.mgGlowInner { position:absolute;inset:0;background:rgba(50,125,255,.2);border-radius:9999px;filter:blur(3px);animation:mgGlowPulse 2.4s ease-in-out infinite }
.mgGlowOuter { position:absolute;inset:-9px;background:rgba(35,105,255,.12);border-radius:9999px;filter:blur(16px);animation:mgGlowPulse 2.4s ease-in-out infinite }
.mgGlowShimmer { position:absolute;inset:0;border-radius:9999px;background:linear-gradient(90deg,transparent,rgba(115,185,255,.18),transparent);animation:mgShimmer 3.2s ease-in-out infinite }
@keyframes mgGlowPulse { 0%,100%{opacity:.18}50%{opacity:.44} }
@keyframes mgShimmer   { 0%,100%{transform:translateX(-120%)}50%{transform:translateX(120%)} }

/* ── Toggle W/F ── */
.mgToggle {
  position: relative; z-index: 2;
  display: flex; align-items: center; gap: 3px;
  padding: 5px 8px; border-radius: 9999px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05);
  cursor: pointer; margin-left: 4px;
  transition: background .2s, border-color .2s, padding .4s;
  flex-shrink: 0;
}
.mgNav.mgCompact .mgToggle { padding: 3px 6px; }
.mgToggle:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); }
.mgToggleLabel {
  font-size: 9.5px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
  transition: color .2s, font-size .4s;
}
.mgNav.mgCompact .mgToggleLabel { font-size: 8.5px; }
.mgToggleDot { width:4px; height:4px; border-radius:50%; background:rgba(255,255,255,.25); flex-shrink:0; }

@media (prefers-reduced-motion: reduce) {
  .mgMascot, .mgGlowInner, .mgGlowOuter, .mgGlowShimmer,
  .mgParticles span, .mgAirStreaks span, .mgWaterStreaks span { animation: none !important; }
}
`;

// ─── Composant ────────────────────────────────────────────────────────────────

export function Navigation() {
  const [scrolled,       setScrolled]       = useState(false);
  const [menuOpen,       setMenuOpen]       = useState(false);
  const [activeIndex,    setActiveIndex]    = useState(0);
  const [pillHovered,    setPillHovered]    = useState(false);
  const [hoveredTabIdx,  setHoveredTabIdx]  = useState<number | null>(null);
  const [mascotLeft,     setMascotLeft]     = useState(0);
  const [mascot,         setMascot]         = useState<"wing" | "foil">("wing");

  const pillRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const scrollSpyPaused = useRef(false);

  const isWing  = mascot === "wing";
  const compact = scrolled;

  // ── Dimensions ─────────────────────────────────────────────────────────────
  // Wing  : landscape 110×64  → visibleAbove = round(64×0.58) = 37px
  // Foil  : portrait  96×185  → visibleAbove = round(185×0.20) = 37px  ← même pillTopPad
  const mascotW = isWing ? (compact ? 72  : 110) : (compact ? 62  : 96);
  const mascotH = isWing ? (compact ? 42  : 64)  : (compact ? 115 : 185);

  // Partie visible au-dessus de la pill
  const overlapRatio   = isWing ? WING_VISIBLE : FOIL_VISIBLE;
  const visibleAbove   = Math.round(mascotH * overlapRatio);
  const mascotTop      = -visibleAbove;
  const pillTopPad     = visibleAbove + 8;

  // ── États de l'animation mascot ────────────────────────────────────────────
  // Priorité : hover actif > hover non-actif > idle
  const isActiveTabHovered    = pillHovered && hoveredTabIdx === activeIndex;
  const isNonActiveTabHovered = hoveredTabIdx !== null && hoveredTabIdx !== activeIndex;

  const mascotClass = isWing
    ? isActiveTabHovered    ? "mgMascot mgWingGust"
    : isNonActiveTabHovered ? "mgMascot mgWingTilt"
    :                         "mgMascot mgWingFloat"
    : isActiveTabHovered    ? "mgMascot mgFoilDive"
    : isNonActiveTabHovered ? "mgMascot mgFoilLean"
    :                         "mgMascot mgFoilBob";

  const showActiveParticles = isActiveTabHovered;
  const showSpeedStreaks    = isNonActiveTabHovered;

  // ── CSS injection ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (document.getElementById("mg-nav-css")) return;
    const s = document.createElement("style");
    s.id = "mg-nav-css";
    s.textContent = NAV_CSS;
    document.head.appendChild(s);
  }, []);

  // ── Scroll → compact ───────────────────────────────────────────────────────
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // ── Position mascot ────────────────────────────────────────────────────────
  useEffect(() => {
    const pill = pillRef.current;
    const btn  = btnRefs.current[activeIndex];
    if (!pill || !btn) return;
    const pr = pill.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    setMascotLeft(br.left - pr.left + br.width / 2);
  }, [activeIndex, compact, mascot]);

  // ── Scroll spy ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const ids = NAV_ITEMS.map(item => item.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        if (scrollSpyPaused.current) return;
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          const idx = ids.indexOf(visible[0].target.id);
          if (idx !== -1) setActiveIndex(idx);
        }
      },
      { rootMargin: "-15% 0px -60% 0px", threshold: 0 }
    );
    ids.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleNav = (href: string, index: number) => {
    setMenuOpen(false);
    setActiveIndex(index);
    scrollSpyPaused.current = true;
    setTimeout(() => { scrollSpyPaused.current = false; }, 900);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleMascot = () => setMascot(m => m === "wing" ? "foil" : "wing");

  return (
    <>
      {/* ── Barre principale ─────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background:     scrolled ? "rgba(8,9,14,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)"        : "none",
          borderBottom:   scrolled ? "1px solid rgba(14,165,233,0.1)" : "none",
        }}
      >
        <div className="container flex items-center justify-between py-4">

          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3"
          >
            <div
              className="w-8 h-8 rounded-sm flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#0EA5E9,#0284C7)", boxShadow: "0 0 15px rgba(14,165,233,0.4)" }}
            >
              <span className="font-display text-white text-sm leading-none">MG</span>
            </div>
            <span
              className="hidden sm:block font-heading font-bold text-white text-lg tracking-wider uppercase"
              style={{ letterSpacing: "0.15em" }}
            >
              Mathis Ghio
            </span>
          </button>

          {/* ── Pill desktop ─────────────────────────────────────────────── */}
          <div
            className="hidden lg:block"
            style={{ paddingTop: pillTopPad, transition: "padding-top 0.4s ease" }}
          >
            <div
              ref={pillRef}
              className={`mgNav${compact ? " mgCompact" : ""}`}
              onMouseEnter={() => setPillHovered(true)}
              onMouseLeave={() => { setPillHovered(false); setHoveredTabIdx(null); }}
            >
              {/* Mascot */}
              <div
                className="mgMascotWrap"
                style={{ left: mascotLeft, top: mascotTop, bottom: "auto" }}
                aria-hidden="true"
              >
                {/* Particules (hover actif) */}
                {showActiveParticles && (
                  <div className={`mgParticles ${isWing ? "mgSpray" : "mgBubbles"}`}>
                    <span /><span /><span />
                  </div>
                )}

                {/* Filets de vitesse (hover non-actif) */}
                {showSpeedStreaks && (
                  isWing
                    ? <div className="mgAirStreaks"><span/><span/><span/><span/></div>
                    : <div className="mgWaterStreaks"><span/><span/><span/><span/></div>
                )}

                <img
                  src={isWing ? "/images/wing-mascot.webp" : "/images/foil-mascot.webp"}
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

              {/* Tabs */}
              {NAV_ITEMS.map((item, i) => {
                const active = i === activeIndex;
                return (
                  <button
                    key={item.href}
                    ref={el => { btnRefs.current[i] = el; }}
                    className={`mgTab${active ? " mgTabActive" : ""}`}
                    onClick={() => handleNav(item.href, i)}
                    onMouseEnter={() => setHoveredTabIdx(i)}
                    onMouseLeave={() => setHoveredTabIdx(null)}
                    aria-current={active ? "page" : undefined}
                  >
                    {active && (
                      <span className="mgTabGlow" aria-hidden="true">
                        <span className="mgGlowInner" />
                        <span className="mgGlowOuter" />
                        <span className="mgGlowShimmer" />
                      </span>
                    )}
                    <span className="mgTabLabel">{item.label}</span>
                  </button>
                );
              })}

              {/* Toggle W ↔ F */}
              <button
                className="mgToggle"
                onClick={toggleMascot}
                onMouseEnter={() => setHoveredTabIdx(null)}
                aria-label={`Mascot : ${isWing ? "wing" : "foil"}`}
              >
                <span className="mgToggleLabel" style={{ color: isWing ? "rgba(120,180,255,.9)" : "rgba(255,255,255,.35)" }}>W</span>
                <span className="mgToggleDot" />
                <span className="mgToggleLabel" style={{ color: !isWing ? "rgba(80,220,255,.9)" : "rgba(255,255,255,.35)" }}>F</span>
              </button>
            </div>
          </div>

          {/* Hamburger mobile */}
          <button className="lg:hidden p-2 text-white" onClick={() => setMenuOpen(v => !v)} aria-label={menuOpen ? "Fermer" : "Menu"}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* ── Menu mobile ──────────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-40 lg:hidden transition-all duration-300"
        style={{ opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? "all" : "none", background: "rgba(8,9,14,0.97)", backdropFilter: "blur(20px)" }}
      >
        <div className="flex flex-col items-center justify-start min-h-full pt-24 pb-12 gap-6 overflow-y-auto h-full px-8">
          {NAV_ITEMS.map((item, i) => (
            <button
              key={item.href}
              onClick={() => handleNav(item.href, i)}
              className="font-display text-3xl text-white uppercase tracking-widest transition-all duration-200 hover:text-cyan-400 flex-shrink-0"
              style={{ transitionDelay: menuOpen ? `${i * 50}ms` : "0ms", transform: menuOpen ? "translateY(0)" : "translateY(20px)", opacity: menuOpen ? 1 : 0 }}
            >
              {item.label}
            </button>
          ))}
          <a
            href="mailto:contact@mathisghio.com"
            className="mt-4 px-8 py-3 font-heading font-bold text-sm uppercase tracking-widest text-white rounded-sm flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#0EA5E9,#0284C7)", letterSpacing: "0.15em" }}
          >
            Contact
          </a>
        </div>
      </div>
    </>
  );
}
