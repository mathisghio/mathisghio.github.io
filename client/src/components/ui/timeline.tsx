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

  // ResizeObserver ensures height is remeasured after images load
  useEffect(() => {
    const el = ref.current;
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

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  const trackStyle: React.CSSProperties = {
    height: height + "px",
    background:
      "linear-gradient(to bottom, transparent 0%, rgba(14,165,233,0.2) 10%, rgba(14,165,233,0.2) 90%, transparent 100%)",
    WebkitMaskImage:
      "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
    maskImage:
      "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
  };

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
            {/* Left: sticky year + dot */}
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div
                className="h-10 absolute left-3 md:left-3 w-10 rounded-full flex items-center justify-center"
                style={{ background: "#08090E" }}
              >
                <div
                  className="h-4 w-4 rounded-full p-2"
                  style={{
                    background: "rgba(14,165,233,0.12)",
                    border: "1px solid rgba(14,165,233,0.5)",
                    boxShadow: "0 0 10px rgba(14,165,233,0.4)",
                  }}
                />
              </div>
              <h3
                className="hidden md:block md:pl-20 font-display"
                style={{
                  fontSize: "clamp(36px, 4vw, 60px)",
                  color: "rgba(14,165,233,0.55)",
                  letterSpacing: "0.02em",
                  lineHeight: 1,
                }}
              >
                {item.title}
              </h3>
            </div>

            {/* Right: content */}
            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3
                className="md:hidden block text-2xl mb-4 font-display"
                style={{ color: "rgba(14,165,233,0.7)", letterSpacing: "0.02em" }}
              >
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}

        {/* Static faded track */}
        <div
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px]"
          style={trackStyle}
        >
          {/* Animated cyan beam */}
          <motion.div
            className="absolute inset-x-0 top-0 w-[2px] rounded-full"
            style={{
              height: heightTransform,
              opacity: opacityTransform,
              background:
                "linear-gradient(to top, #0EA5E9 0%, #38BDF8 25%, transparent 100%)",
              boxShadow: "0 0 8px 1px rgba(14,165,233,0.55)",
            }}
          />
        </div>
      </div>
    </div>
  );
};
