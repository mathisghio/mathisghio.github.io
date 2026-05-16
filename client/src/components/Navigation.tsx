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
import { Menu, X, ChevronUp } from "lucide-react";

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

export function Navigation() {
  const [scrolled,      setScrolled]      = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
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

  /* ── Scan line : hide after animation completes ── */
  useEffect(() => {
    if (!showScan) return;
    const t = setTimeout(() => setShowScan(false), 980);
    return () => clearTimeout(t);
  }, [showScan]);

  /* ── Scroll detection ── */
  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 80);
      setShowScrollTop(window.scrollY > 400);
    };
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
      // Reveal in next frame: position is painted (no position transition since
      // showMascot is still false) before opacity fades in at the correct spot.
      requestAnimationFrame(() => setShowMascot(true));
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

    let rafId = -1;

    const compute = () => {
      if (scrollSpyPaused.current) return;
      const threshold = pillTopPad + Math.round(window.innerHeight * 0.45);
      let bestIdx = -1;
      ids.forEach((id, i) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (el.getBoundingClientRect().top < threshold) bestIdx = i;
      });
      setActiveIndex(bestIdx);
    };

    const onScroll = () => {
      if (rafId !== -1) return;
      rafId = requestAnimationFrame(() => { rafId = -1; compute(); });
    };

    compute(); // Seed immediately (covers page reload at a scrolled position)
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', compute, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', compute);
      if (rafId !== -1) cancelAnimationFrame(rafId);
    };
  }, [pillTopPad]);

  const handleNav = (href: string, index: number) => {
    setMenuOpen(false); setActiveIndex(index);
    scrollSpyPaused.current = true;
    setTimeout(() => { scrollSpyPaused.current = false; }, 900);

    const target = document.querySelector(href);
    if (!target) return;

    const navHeight = pillTopPad + 52;
    // Gallery, Press, Contact: LampContainer has min-height 65vh + content div
    // at translateY(100px), so the visible title sits ~65vh below the section's
    // DOM start. Add an offset so the nav lands on the title, not the section top.
    const lampOffset = (() => {
      if (!['#gallery', '#press', '#contact'].includes(href)) return 0;
      const section = document.querySelector(href) as HTMLElement | null;
      if (!section) return 0;
      const firstH2 = section.querySelector('h2');
      if (!firstH2) return 0;
      // Subtract 60 to target the final post-animation position
      // (whileInView animates from y:60 → y:0, displacing getBoundingClientRect by +60 before it fires)
      return firstH2.getBoundingClientRect().top - section.getBoundingClientRect().top - 60;
    })();
    const top = (target as HTMLElement).getBoundingClientRect().top + window.scrollY - navHeight - 8 + lampOffset;
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
          transition:    showMascot
            ? "left 0.26s cubic-bezier(.34,1.56,.64,1), top 0.26s cubic-bezier(.34,1.56,.64,1), opacity 0.2s ease"
            : "opacity 0.2s ease",
        }}
      >
        {isActiveHovered    && <div className="mgParticles mgSpray"><span /><span /><span /></div>}
        {isNonActiveHovered && <div className="mgAirStreaks"><span /><span /><span /><span /></div>}
        <img
          src="https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1774530426/mascot_1_xfxno0.png"
          alt="Wing mascot"
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
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 min-h-[60px] lg:min-h-[87px]"
        style={{
          background:     scrolled ? "rgba(8,9,14,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)"        : "none",
          borderBottom:   scrolled ? "1px solid rgba(14,165,233,0.1)" : "none",
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
            className="lg:hidden p-3 -mr-1 text-white rounded-sm touch-manipulation"
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? "Fermer" : "Menu"}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* ── Scroll to top (desktop) ── */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Retour en haut"
        className="hidden lg:flex"
        style={{
          position:       "fixed",
          bottom:         28,
          right:          28,
          zIndex:         50,
          width:          40,
          height:         40,
          borderRadius:   20,
          alignItems:     "center",
          justifyContent: "center",
          background:     "rgba(14,165,233,0.12)",
          border:         "1px solid rgba(14,165,233,0.3)",
          color:          "rgba(14,165,233,0.85)",
          cursor:         "pointer",
          backdropFilter: "blur(8px)",
          transition:     "opacity 0.25s ease, transform 0.25s ease",
          opacity:        showScrollTop ? 1 : 0,
          transform:      showScrollTop ? "translateY(0)" : "translateY(10px)",
          pointerEvents:  showScrollTop ? "auto" : "none",
        }}
      >
        <ChevronUp size={18} />
      </button>

      {/* ── Mobile menu ── */}
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
                  transitionDelay: menuOpen ? `${i * 30}ms` : `${(NAV_ITEMS.length - 1 - i) * 16}ms`,
                  transform:       menuOpen ? "translateX(0) scale(1)" : "translateX(-12px) scale(0.96)",
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
