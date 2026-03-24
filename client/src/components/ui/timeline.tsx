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
      setHeight(ref.current.getBoundingClientRect().height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full font-sans" ref={containerRef}>
      <div ref={ref} className="relative max-w-5xl mx-auto pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-32 md:gap-10"
          >
            {/* Left: sticky year label */}
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              {/* Dot */}
              <div
                className="h-10 absolute left-3 md:left-3 w-10 rounded-full flex items-center justify-center"
                style={{ background: "#08090E" }}
              >
                <div
                  className="h-4 w-4 rounded-full p-2"
                  style={{
                    background: "rgba(14, 165, 233, 0.15)",
                    border: "1px solid rgba(14, 165, 233, 0.5)",
                    boxShadow: "0 0 10px rgba(14, 165, 233, 0.3)",
                  }}
                />
              </div>
              {/* Year text */}
              <h3
                className="hidden md:block md:pl-20 font-display"
                style={{
                  fontSize: "clamp(32px, 4vw, 56px)",
                  color: "rgba(14, 165, 233, 0.55)",
                  letterSpacing: "0.02em",
                }}
              >
                {item.title}
              </h3>
            </div>

            {/* Right: content */}
            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3
                className="md:hidden block mb-4 font-display"
                style={{
                  fontSize: "clamp(28px, 6vw, 40px)",
                  color: "rgba(14, 165, 233, 0.7)",
                }}
              >
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}

        {/* Static track line */}
        <div
          className="absolute left-8 top-0 w-[2px]"
          style={{
            height: height + "px",
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(14,165,233,0.18) 10%, rgba(14,165,233,0.18) 90%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
            overflow: "hidden",
          }}
        >
          {/* Animated fill */}
          <motion.div
            className="absolute inset-x-0 top-0 w-[2px] rounded-full"
            style={{
              height: heightTransform,
              opacity: opacityTransform,
              background:
                "linear-gradient(to bottom, transparent 0%, #38BDF8 30%, #0EA5E9 100%)",
              boxShadow: "0 0 8px rgba(14, 165, 233, 0.6)",
            }}
          />
        </div>
      </div>
    </div>
  );
};
