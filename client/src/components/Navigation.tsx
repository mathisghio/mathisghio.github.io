/**
 * Navigation.tsx — Mathis Ghio v3
 *
 * - Mascot partiellement derrière la pill (overlap) → header bien moins haut
 * - Scroll spy actif
 * - Compact au scroll
 * - Toggle W ↔ F
 * - Animations CSS pures
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

// Quelle fraction du mascot dépasse au-dessus de la pill (le reste est derrière)
// 0.55 = 55% visible au-dessus, 45% caché derrière la pill
const OVERLAP_RATIO = 0.58;

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
  /* overflow visible pour que le mascot puisse déborder vers le haut */
  overflow: visible;
}
.mgNav.mgCompact {
  padding: 4px 5px;
  gap: 1px;
}

/* ── Mascot wrap ──
   bottom: positif → monte AU-DESSUS de la pill
   On le pousse vers le haut de seulement une fraction de sa hauteur,
   le reste reste derrière la pill (z-index < tabs).
*/
.mgMascotWrap {
  position: absolute;
  /* La valeur de bottom est calculée en JS via style inline */
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
  /* z-index 0 : DERRIÈRE le fond de la pill mais visible par overflow:visible */
  z-index: 0;
  transition: left 0.26s cubic-bezier(.34,1.56,.64,1), bottom 0.4s ease;
}

/* Le fond de la pill doit couvrir la partie basse du mascot.
   On utilise un pseudo-élément pour créer un masque opaque sur la pill
   qui cache la partie basse du mascot. */
.mgNav::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: rgba(0,0,0,0.58);
  z-index: 1; /* au-dessus du mascot (z-index 0) mais sous les tabs (z-index 2+) */
  pointer-events: none;
}
/* Réplique la bordure et le backdrop sur le pseudo (le ::before ne blur pas) */
.mgNav::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  border: 1px solid rgba(255,255,255,0.09);
  z-index: 1;
  pointer-events: none;
}

.mgMascot {
  display: block;
  object-fit: contain;
  filter: drop-shadow(0 4px 20px rgba(70,150,255,0.42));
  transform-origin: 50% 85%;
  transition: width 0.4s ease, height 0.4s ease, filter 0.3s ease;
}

/* ── Tabs : z-index 2 pour passer au-dessus du ::before ── */
.mgTab {
  position: relative;
  z-index: 2;
  cursor: pointer;
  letter-spacing: .028em;
  border-radius: 9999px;
  border: none;
  background: none;
  color: rgba(255,255,255,.46);
  font-family: inherit;
  outline: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: color .22s ease, padding .4s ease, font-size .4s ease;
  padding: 10px 15px;
  font-size: 12.5px;
  font-weight: 600;
}
.mgNav.mgCompact .mgTab {
  padding: 6px 9px;
  font-size: 11px;
}
.mgTab:hover:not(.mgTabActive) { background: rgba(255,255,255,.06); color: rgba(255,255,255,.72); }
.mgTabActive { color: rgba(255,255,255,1); }
.mgTabLabel  { position: relative; z-index: 1; }
.mgTabGlow   { position: absolute; inset: 0; border-radius: 9999px; overflow: hidden; }
.mgGlowInner { position:absolute;inset:0;background:rgba(50,125,255,.2);border-radius:9999px;filter:blur(3px);animation:mgGlowPulse 2.4s ease-in-out infinite }
.mgGlowOuter { position:absolute;inset:-9px;background:rgba(35,105,255,.12);border-radius:9999px;filter:blur(16px);animation:mgGlowPulse 2.4s ease-in-out infinite }
.mgGlowShimmer { position:absolute;inset:0;border-radius:9999px;background:linear-gradient(90deg,transparent,rgba(115,185,255,.18),transparent);animation:mgShimmer 3.2s ease-in-out infinite }
@keyframes mgGlowPulse { 0%,100%{opacity:.18}50%{opacity:.44} }
@keyframes mgShimmer   { 0%,100%{transform:translateX(-120%)}50%{transform:translateX(120%)} }

/* ── Animations mascot ── */
@keyframes mgWingFloat { 0%,100%{transform:translateY(0) rotate(-1.2deg)}50%{transform:translateY(-5px) rotate(1.2deg)} }
@keyframes mgWingGust  { 0%{transform:none}20%{transform:translateY(-12px) rotate(21deg) scale(1.14)}100%{transform:translateY(-11px) rotate(19deg) scale(1.12)} }
@keyframes mgFoilBob   { 0%,100%{transform:translateY(0) rotate(0)}33%{transform:translateY(-3px) rotate(-0.7deg)}66%{transform:translateY(-1.5px) rotate(0.7deg)} }
@keyframes mgFoilDive  { 0%{transform:none}20%{transform:translateY(-9px) rotate(-8deg) scale(1.1)}100%{transform:translateY(-8px) rotate(-6deg) scale(1.08)} }
.mgWingFloat { animation: mgWingFloat 3.2s ease-in-out infinite; }
.mgWingGust  { will-change:transform; animation: mgWingGust .3s cubic-bezier(.15,0,0,1) forwards; filter:drop-shadow(0 4px 22px rgba(70,150,255,.58)); }
.mgFoilBob   { transform-origin:50% 15%; animation: mgFoilBob 3.5s ease-in-out infinite; }
.mgFoilDive  { transform-origin:50% 15%; will-change:transform; animation: mgFoilDive .3s cubic-bezier(.15,0,0,1) forwards; filter:drop-shadow(0 5px 26px rgba(40,190,255,.62)); }

/* ── Particules : z-index 2 pour passer au-dessus de la pill aussi ── */
.mgParticles { position:absolute; top:5px; left:50%; pointer-events:none; z-index: 25; }
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

/* ── Toggle W/F : z-index 2 pour rester au-dessus du ::before ── */
.mgToggle {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 5px 8px;
  border-radius: 9999px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05);
  cursor: pointer;
  margin-left: 4px;
  transition: background .2s ease, border-color .2s ease, padding .4s ease;
  flex-shrink: 0;
}
.mgNav.mgCompact .mgToggle { padding: 3px 6px; }
.mgToggle:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); }
.mgToggleLabel {
  font-size: 9.5px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
  transition: color .2s ease, font-size .4s ease;
}
.mgNav.mgCompact .mgToggleLabel { font-size: 8.5px; }
.mgToggleDot { width:4px; height:4px; border-radius:50%; background:rgba(255,255,255,0.25); flex-shrink:0; }

@media (prefers-reduced-motion: reduce) {
  .mgMascot, .mgGlowInner, .mgGlowOuter, .mgGlowShimmer, .mgParticles span { animation: none !important; }
}
`;

// ─── Composant ────────────────────────────────────────────────────────────────

export function Navigation() {
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hovered,     setHovered]     = useState(false);
  const [mascotLeft,  setMascotLeft]  = useState(0);
  const [mascot,      setMascot]      = useState<"wing" | "foil">("wing");

  const pillRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const scrollSpyPaused = useRef(false);

  const isWing  = mascot === "wing";
  const compact = scrolled;

  // ── Dimensions du mascot ─────────────────────────────────────────────────
  // Wing  : landscape, ratio ~1.72
  // Foil  : portrait, agrandi pour mieux correspondre à la wing (ratio ~0.56)
  const mascotW = isWing ? (compact ? 72  : 110) : (compact ? 52  : 80);
  const mascotH = isWing ? (compact ? 42  : 64)  : (compact ? 92  : 142);

  // bottom du mascotWrap :
  // On veut que OVERLAP_RATIO de la hauteur soit visible au-dessus de la pill.
  // bottom = -(mascotH * (1 - OVERLAP_RATIO)) → valeur NÉGATIVE = partiellement sous la pill
  // En CSS bottom positif = monte au-dessus ; bottom négatif = descend sous.
  // On veut bottom = -(hauteur cachée) pour que la partie visible dépasse.
  // => bottom = mascotH * OVERLAP_RATIO - mascotH = -mascotH * (1 - OVERLAP_RATIO)
  // Mais "bottom: -X" sur un enfant absolu = descend SOUS la pill.
  // On veut que le haut du mascot dépasse de mascotH * OVERLAP_RATIO au-dessus.
  // => bottom du bord bas du mascot = -(mascotH - mascotH*OVERLAP_RATIO) = -mascotH*(1-OVERLAP_RATIO)
  const visibleAbove  = Math.round(mascotH * OVERLAP_RATIO);  // px qui dépassent vers le haut
  const hiddenInPill  = mascotH - visibleAbove;               // px cachés derrière la pill
  // bottom = 100% - hiddenInPill : le bas du mascot est hiddenInPill px sous le bord sup de la pill
  // En pratique on utilise une valeur en px calculée après mount.
  // Plus simple : bottom = visibleAbove (le bord bas du mascot est visibleAbove px au-dessus de la pill)
  // NON — on veut que le bord HAUT soit visibleAbove px au-dessus du bord sup de la pill.
  // => bord haut du mascot = 100% + (quelque chose)
  // => bord bas du mascot = bord haut + mascotH
  // => bottom (bord bas) = 100% + visibleAbove + mascotH - mascotH = 100% + visibleAbove... non
  //
  // Reprenons : bottom = distance entre le bas du pill et le bas du mascot.
  // Si bottom = X, le bas du mascot est à X pixels au-dessus du bas du pill.
  // La pill a une hauteur H_pill. Le bord supérieur de la pill est à H_pill depuis son bas.
  // Le bord haut du mascot est à X + mascotH depuis le bas du pill.
  // On veut que le bord haut du mascot soit à (H_pill + visibleAbove) depuis le bas de la pill.
  // => X + mascotH = H_pill + visibleAbove
  // => X = H_pill + visibleAbove - mascotH
  // On ne connaît pas H_pill facilement, donc on utilise "calc(100% + visibleAbove - mascotH)"
  // mais ça donne une valeur négative si mascotH > 100% + visibleAbove, ce qui est toujours le cas.
  //
  // PLUS SIMPLE : utiliser top au lieu de bottom.
  // top = -(visibleAbove) → le haut du mascot est visibleAbove px au-dessus du bord haut de la pill.
  // => ça marchera nickel.

  // top du mascotWrap = -visibleAbove (négatif = monte au-dessus)
  const mascotTop = -visibleAbove;

  // paddingTop du wrapper = juste assez pour que le mascot ne soit pas tronqué par la nav bar
  // = visibleAbove + petite marge
  const pillTopPad = visibleAbove + 8;

  // ── CSS injection ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (document.getElementById("mg-nav-css")) return;
    const s = document.createElement("style");
    s.id = "mg-nav-css";
    s.textContent = NAV_CSS;
    document.head.appendChild(s);
  }, []);

  // ── Scroll → compact + fond de barre ─────────────────────────────────────
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // ── Position horizontale du mascot ────────────────────────────────────────
  useEffect(() => {
    const pill = pillRef.current;
    const btn  = btnRefs.current[activeIndex];
    if (!pill || !btn) return;
    const pr = pill.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    setMascotLeft(br.left - pr.left + br.width / 2);
  }, [activeIndex, compact]);

  // ── Scroll spy ────────────────────────────────────────────────────────────
  useEffect(() => {
    const sectionIds = NAV_ITEMS.map(item => item.href.slice(1));

    const observer = new IntersectionObserver(
      (entries) => {
        if (scrollSpyPaused.current) return;
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          const id  = visible[0].target.id;
          const idx = sectionIds.indexOf(id);
          if (idx !== -1) setActiveIndex(idx);
        }
      },
      { rootMargin: "-15% 0px -60% 0px", threshold: 0 }
    );

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // ── Click nav ─────────────────────────────────────────────────────────────
  const handleNav = (href: string, index: number) => {
    setMenuOpen(false);
    setActiveIndex(index);
    scrollSpyPaused.current = true;
    setTimeout(() => { scrollSpyPaused.current = false; }, 900);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleMascot = () => setMascot(m => m === "wing" ? "foil" : "wing");

  const mascotClass = isWing
    ? hovered ? "mgMascot mgWingGust" : "mgMascot mgWingFloat"
    : hovered ? "mgMascot mgFoilDive" : "mgMascot mgFoilBob";

  return (
    <>
      {/* ── Barre principale ────────────────────────────────────────────────── */}
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
              style={{
                background: "linear-gradient(135deg,#0EA5E9,#0284C7)",
                boxShadow:  "0 0 15px rgba(14,165,233,0.4)",
              }}
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

          {/* ── Pill desktop ────────────────────────────────────────────────── */}
          <div
            className="hidden lg:block"
            style={{
              paddingTop: pillTopPad,
              transition: "padding-top 0.4s ease",
            }}
          >
            <div
              ref={pillRef}
              className={`mgNav${compact ? " mgCompact" : ""}`}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              {/* Mascot — positionné via top pour l'overlap */}
              <div
                className="mgMascotWrap"
                style={{
                  left:   mascotLeft,
                  top:    mascotTop,
                  bottom: "auto",   // on écrase le bottom CSS
                }}
                aria-hidden="true"
              >
                {hovered && (
                  <div className={`mgParticles ${isWing ? "mgSpray" : "mgBubbles"}`}>
                    <span /><span /><span />
                  </div>
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
                title={`Passer au ${isWing ? "foil" : "wing"}`}
                aria-label={`Changer de mascot : ${isWing ? "wing" : "foil"}`}
              >
                <span className="mgToggleLabel" style={{ color: isWing ? "rgba(120,180,255,.9)" : "rgba(255,255,255,.35)" }}>W</span>
                <span className="mgToggleDot" />
                <span className="mgToggleLabel" style={{ color: !isWing ? "rgba(80,220,255,.9)" : "rgba(255,255,255,.35)" }}>F</span>
              </button>
            </div>
          </div>

          {/* Hamburger mobile */}
          <button
            className="lg:hidden p-2 text-white"
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? "Fermer" : "Menu"}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* ── Menu mobile ─────────────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-40 lg:hidden transition-all duration-300"
        style={{
          opacity:        menuOpen ? 1 : 0,
          pointerEvents:  menuOpen ? "all" : "none",
          background:     "rgba(8,9,14,0.97)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex flex-col items-center justify-start min-h-full pt-24 pb-12 gap-6 overflow-y-auto h-full px-8">
          {NAV_ITEMS.map((item, i) => (
            <button
              key={item.href}
              onClick={() => handleNav(item.href, i)}
              className="font-display text-3xl text-white uppercase tracking-widest transition-all duration-200 hover:text-cyan-400 flex-shrink-0"
              style={{
                transitionDelay: menuOpen ? `${i * 50}ms` : "0ms",
                transform: menuOpen ? "translateY(0)"  : "translateY(20px)",
                opacity:   menuOpen ? 1 : 0,
              }}
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
