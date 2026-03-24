"use client";
import { useScroll, useTransform, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full font-sans md:px-10"
      style={{ background: "#08090E" }}
      ref={containerRef}
    >
      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-40 md:gap-10"
          >
            {/* ── Left: sticky year dot + label ── */}
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              {/* Dot */}
              <div
                className="h-10 absolute left-3 md:left-3 w-10 rounded-full flex items-center justify-center"
                style={{ background: "#08090E" }}
              >
                <div
                  className="h-4 w-4 rounded-full p-2"
                  style={{
                    background: "rgba(14,165,233,0.12)",
                    border: "1px solid rgba(14,165,233,0.45)",
                    boxShadow: "0 0 8px rgba(14,165,233,0.35)",
                  }}
                />
              </div>
              {/* Year label — desktop */}
              <h3
                className="hidden md:block md:pl-20 font-display"
                style={{
                  fontSize: "clamp(36px, 4vw, 60px)",
                  color: "rgba(14,165,233,0.5)",
                  letterSpacing: "0.02em",
                  lineHeight: 1,
                }}
              >
                {item.title}
              </h3>
            </div>

            {/* ── Right: content ── */}
            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              {/* Year label — mobile */}
              <h3
                className="md:hidden block text-2xl mb-4 font-display"
                style={{
                  color: "rgba(14,165,233,0.6)",
                  letterSpacing: "0.02em",
                }}
              >
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}

        {/* ── Scroll-animated vertical line ── */}
        <div
          className="absolute left-8 top-0 w-[2px] overflow-hidden"
          style={{
            height: height + "px",
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(14,165,233,0.15) 10%, rgba(14,165,233,0.15) 90%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
          }}
        >
          <motion.div
            className="absolute inset-x-0 top-0 w-[2px] rounded-full"
            style={{
              height: heightTransform,
              opacity: opacityTransform,
              background:
                "linear-gradient(to bottom, transparent 0%, #38BDF8 20%, #0EA5E9 100%)",
              boxShadow: "0 0 6px rgba(14,165,233,0.7)",
            }}
          />
        </div>
      </div>
    </div>
  );
};
