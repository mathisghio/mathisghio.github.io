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

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const measure = () => setHeight(el.getBoundingClientRect().height);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 22,
    restDelta: 0.001,
  });

  const beamHeight  = useTransform(smoothProgress, [0, 1], [0, height]);
  const beamOpacity = useTransform(smoothProgress, [0, 0.05], [0, 1]);

  return (
    /*
     * background: transparent — let the CareerSection wave layer show through.
     * Previously this was "#08090E" which completely blocked the waves.
     */
    <div
      ref={containerRef}
      className="w-full font-sans"
      style={{ background: "transparent" }}
    >
      <div
        ref={contentRef}
        className="relative max-w-7xl mx-auto px-4 md:px-10 pb-20"
      >
        {data.map((item, index) => (
          <div
            key={index}
            className={`flex gap-3 md:gap-10 pt-8 ${index === 0 ? 'md:pt-16' : 'md:pt-3'}`}
          >
            {/* LEFT: sticky — date on mobile, dot + year on desktop */}
            <div
              className="self-start sticky top-24 md:top-40 z-40
                         flex flex-col md:flex-row items-center
                         w-10 flex-shrink-0
                         md:w-auto md:max-w-xs lg:max-w-sm"
            >
              {/* Mobile: year text replaces dot */}
              <h3
                className="md:hidden font-display text-center leading-tight"
                style={{
                  fontSize: "11px",
                  color: "rgba(14,165,233,0.72)",
                  letterSpacing: "0.02em",
                  wordBreak: "break-all",
                }}
              >
                {item.title}
              </h3>

              {/* Desktop: dot */}
              <div
                className="hidden md:flex relative h-10 w-10 rounded-full items-center justify-center flex-shrink-0"
                style={{ background: "transparent" }}
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

              {/* Desktop: year */}
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

            {/* RIGHT: scrollable content — year heading moved to left column */}
            <div className="flex-1 min-w-0 pb-6">
              <FadeInBlock>{item.content}</FadeInBlock>
            </div>
          </div>
        ))}

        {/* Vertical track */}
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
          <motion.div
            aria-hidden
            className="absolute inset-x-0 top-0 w-[2px] rounded-full"
            style={{
              height: beamHeight,
              opacity: beamOpacity,
              background:
                "linear-gradient(to top, #0EA5E9 0%, #38BDF8 30%, transparent 100%)",
              boxShadow: "0 -4px 12px 2px rgba(14,165,233,0.7)",
            }}
          />
        </div>
      </div>
    </div>
  );
};
