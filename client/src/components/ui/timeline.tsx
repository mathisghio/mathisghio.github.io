"use client";
import {
  useScroll,
  useTransform,
  useSpring,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

// ── Wrapper that fades + slides each content block when it enters view ──────
function FadeInBlock({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef  = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  // ── Remeasure whenever images load or the DOM changes ───────────────────
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const measure = () => setHeight(el.getBoundingClientRect().height);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── Scroll progress over the whole container ─────────────────────────────
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  // Spring smoothing to avoid jank
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 22,
    restDelta: 0.001,
  });

  const beamHeight  = useTransform(smoothProgress, [0, 1], [0, height]);
  const beamOpacity = useTransform(smoothProgress, [0, 0.05], [0, 1]);

  return (
    <div
      ref={containerRef}
      className="w-full font-sans"
      style={{ background: "#08090E" }}
    >
      {/* ── Inner wrapper — measured for the beam ── */}
      <div
        ref={contentRef}
        className="relative max-w-7xl mx-auto px-4 md:px-10 pb-20"
      >
        {data.map((item, index) => (
          /*
           * KEY LAYOUT RULE:
           * Each row is a flex container with min-height determined by its
           * right-side content. The left column has `self-start sticky top-40`
           * so it "sticks" at the top while the right side scrolls past,
           * then naturally unsticks when its parent row exits the viewport.
           */
          <div
            key={index}
            className="flex gap-6 md:gap-10 pt-12 md:pt-40"
          >
            {/* ── LEFT: sticky date + dot ────────────────────────────────── */}
            <div
              className="self-start sticky top-40 z-40
                         flex flex-col md:flex-row items-center
                         max-w-[5rem] md:max-w-xs lg:max-w-sm w-full flex-shrink-0"
            >
              {/* Glowing dot */}
              <div
                className="relative h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "#08090E" }}
              >
                <span
                  className="h-4 w-4 rounded-full block"
                  style={{
                    background: "rgba(14,165,233,0.15)",
                    border: "1.5px solid rgba(14,165,233,0.6)",
                    boxShadow:
                      "0 0 0 3px rgba(14,165,233,0.08), 0 0 14px rgba(14,165,233,0.45)",
                  }}
                />
              </div>

              {/* Year label — desktop only (inline with dot) */}
              <h3
                className="hidden md:block pl-4 font-display leading-none"
                style={{
                  fontSize: "clamp(32px, 3.5vw, 56px)",
                  color: "rgba(14,165,233,0.55)",
                  letterSpacing: "0.02em",
                }}
              >
                {item.title}
              </h3>
            </div>

            {/* ── RIGHT: scrollable content ──────────────────────────────── */}
            <div className="flex-1 min-w-0 pb-6">
              {/* Year label — mobile only */}
              <h3
                className="md:hidden block mb-4 font-display"
                style={{
                  fontSize: "clamp(28px, 6vw, 40px)",
                  color: "rgba(14,165,233,0.7)",
                  letterSpacing: "0.02em",
                }}
              >
                {item.title}
              </h3>

              {/* Wrap content in fade-in */}
              <FadeInBlock>{item.content}</FadeInBlock>
            </div>
          </div>
        ))}

        {/* ── Vertical track (always visible, faded) ── */}
        <div
          aria-hidden
          className="absolute left-[2.25rem] md:left-[3.25rem] top-0 w-[2px]"
          style={{
            height: height + "px",
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(14,165,233,0.15) 8%, rgba(14,165,233,0.15) 92%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
            overflow: "hidden",
          }}
        >
          {/* ── Animated cyan beam ── */}
          <motion.div
            aria-hidden
            className="absolute inset-x-0 top-0 w-[2px] rounded-full"
            style={{
              height: beamHeight,
              opacity: beamOpacity,
              background:
                "linear-gradient(to top, #0EA5E9 0%, #38BDF8 30%, transparent 100%)",
              // Glow at the tip of the beam
              boxShadow: "0 -4px 12px 2px rgba(14,165,233,0.7)",
            }}
          />
        </div>
      </div>
    </div>
  );
};
