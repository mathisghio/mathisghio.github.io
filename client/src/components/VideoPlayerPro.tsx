"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
/**
 * Video Player Pro — cinema glass.
 *
 * Glass control bar with spring physics. Custom progress
 * scrubber — hover to expand, drag to seek. Inline volume
 * slider. Speed pills with layout-animated indicator.
 * Auto-hide on idle. Tick on every interaction.
 *
 * The player disappears. The content remains.
 */

/* ── Types ── */

export interface VideoPlayerProProps {
  src: string;
  poster?: string;
  sound?: boolean;
  autoplay?: boolean;
  onPlayCallback?: () => void;
  onEndedCallback?: () => void;
}

/* ── Audio ── */

let _ctx: AudioContext | null = null;
let _buf: AudioBuffer | null = null;

function audioCtx() {
  if (!_ctx) {
    _ctx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
  }
  if (_ctx.state === "suspended") _ctx.resume();
  return _ctx;
}

function ensureBuf(ac: AudioContext): AudioBuffer {
  if (_buf && _buf.sampleRate === ac.sampleRate) return _buf;
  const rate = ac.sampleRate;
  const len = Math.floor(rate * 0.003);
  const buf = ac.createBuffer(1, len, rate);
  const ch = buf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    const t = i / len;
    ch[i] = (Math.random() * 2 - 1) * (1 - t) ** 4;
  }
  _buf = buf;
  return buf;
}

function tick(last: React.MutableRefObject<number>) {
  const now = performance.now();
  if (now - last.current < 50) return;
  last.current = now;
  try {
    const ac = audioCtx();
    const buf = ensureBuf(ac);
    const src = ac.createBufferSource();
    const gain = ac.createGain();
    src.buffer = buf;
    gain.gain.value = 0.04;
    src.connect(gain);
    gain.connect(ac.destination);
    src.start();
  } catch {
    /* silent */
  }
}

/* ── Helpers ── */

function fmt(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/* ── Inline SVG Icons ── */

function IcoPlay({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
      <path d="M4.5 2.5v11l9-5.5-9-5.5z" />
    </svg>
  );
}

function IcoPause({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
      <rect x="3" y="2" width="3.5" height="12" rx="0.75" />
      <rect x="9.5" y="2" width="3.5" height="12" rx="0.75" />
    </svg>
  );
}

function IcoReplay({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 8a5.5 5.5 0 1 1 1.3 3.5" />
      <path d="M2.5 13v-3.5H6" />
    </svg>
  );
}

function IcoVolHi({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M1.5 6v4h2.5l3.5 3V3L4 6H1.5z" fill="currentColor" />
      <path
        d="M10.5 5.5a3 3 0 0 1 0 5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M12.5 3.5a6 6 0 0 1 0 9"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IcoVolLo({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M1.5 6v4h2.5l3.5 3V3L4 6H1.5z" fill="currentColor" />
      <path
        d="M10.5 5.5a3 3 0 0 1 0 5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IcoVolMute({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M1.5 6v4h2.5l3.5 3V3L4 6H1.5z" fill="currentColor" />
      <path
        d="M11 6l4 4m0-4l-4 4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IcoFull({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 5.5V2h3.5" />
      <path d="M14 5.5V2h-3.5" />
      <path d="M2 10.5V14h3.5" />
      <path d="M14 10.5V14h-3.5" />
    </svg>
  );
}

function IcoExitFull({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 5.5h3.5V2" />
      <path d="M14 5.5h-3.5V2" />
      <path d="M2 10.5h3.5V14" />
      <path d="M14 10.5h-3.5V14" />
    </svg>
  );
}

function IcoPiP({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <rect x="7.5" y="7.5" width="5.5" height="3.5" rx="1" fill="currentColor" />
    </svg>
  );
}

function IcoLoop({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 10V6a4 4 0 0 1 4-4h5" />
      <path d="M14 6v4a4 4 0 0 1-4 4H5" />
      <path d="M9 2l2 2-2 2" />
      <path d="M7 14l-2-2 2-2" />
    </svg>
  );
}

/* ── Constants ── */

const SPEEDS = [0.5, 1, 1.5, 2] as const;

const BTN: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 40,
  height: 40,
  borderRadius: 7,
  border: "none",
  background: "transparent",
  cursor: "pointer",
  transition: "background 0.12s, color 0.12s",
};

/* ── Component ── */

export function VideoPlayerPro({
  src,
  poster,
  sound = true,
  autoplay = false,
  onPlayCallback,
  onEndedCallback,
}: VideoPlayerProProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const lastVol = useRef(1);
  const lastSnd = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();
  const lastTap      = useRef<{ side: "left" | "right"; time: number } | null>(null);
  const doubleTapTimer = useRef<ReturnType<typeof setTimeout>>();

  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [vol, setVol] = useState(() => {
    try { return parseFloat(localStorage.getItem("vp-vol") ?? "1") || 1; } catch { return 1; }
  });
  const [muted, setMuted] = useState(false);
  const [prog, setProg] = useState(0);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const [show, setShow] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [err, setErr] = useState<string | null>(null);
  const [scrubbing, setScrubbing] = useState(false);
  const [barHover, setBarHover] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [hoverProg, setHoverProg] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [buffered,     setBuffered]     = useState(0);
  const [buffering,    setBuffering]    = useState(false);
  const [seekFlash,    setSeekFlash]    = useState<"left" | "right" | null>(null);
  const [looping,      setLooping]      = useState(false);
  const [isMobile,    setIsMobile]    = useState(() => window.innerWidth < 1024);
  const [showLandscapeFullscreenTip, setShowLandscapeFullscreenTip] = useState(false);
  const landscapeFullscreenTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ── Reset on src change ── */
  useEffect(() => {
    setErr(null);
    setPlaying(false);
    setEnded(false);
    setProg(0);
    setTime(0);
    setDur(0);
    const v = videoRef.current;
    if (v) {
      try {
        v.pause();
        v.load();
      } catch {
        /* ignore */
      }
    }
  }, [src]);

  /* ── Auto-hide controls ── */
  const resetHide = useCallback(() => {
    setShow(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (!scrubbing) setShow(false);
    }, 3000);
  }, [scrubbing]);

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  /* ── Time sync ── */
  const syncTime = () => {
    const v = videoRef.current;
    if (!v) return;
    const d = v.duration;
    const t = v.currentTime;
    setDur(isFinite(d) ? d : 0);
    setTime(isFinite(t) ? t : 0);
    const p = d > 0 ? (t / d) * 100 : 0;
    setProg(isFinite(p) ? p : 0);
  };

  /* ── Play/pause ── */
  const toggle = async () => {
    const v = videoRef.current;
    if (!v) return;
    if (ended) {
      v.currentTime = 0;
      setEnded(false);
    }
    if (v.paused) {
      try {
        await v.play();
      } catch {
        const c = v.error?.code;
        setErr(
          c === 2
            ? "Network error."
            : c === 3
              ? "Decode error."
              : c === 4
                ? "Source not supported."
                : "Playback failed.",
        );
        setPlaying(false);
      }
    } else {
      v.pause();
    }
    if (sound) tick(lastSnd);
  };

  /* ── Seek ── */
  const seek = useCallback((pct: number) => {
    const v = videoRef.current;
    if (!v) return;
    const t = (pct / 100) * (v.duration || 0);
    if (isFinite(t)) {
      v.currentTime = t;
      setTime(t);
      setProg(pct);
    }
  }, []);

  /* ── Scrub ── */
  const scrubFrom = useCallback(
    (clientX: number) => {
      const bar = progressRef.current;
      if (!bar) return;
      const rect = bar.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      seek((x / rect.width) * 100);
    },
    [seek],
  );

  useEffect(() => {
    if (!scrubbing) return;
    const move = (e: MouseEvent) => scrubFrom(e.clientX);
    const up = () => setScrubbing(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [scrubbing, scrubFrom]);

  /* ── Touch scrub ── */
  useEffect(() => {
    if (!scrubbing) return;
    const move = (e: TouchEvent) => { e.preventDefault(); scrubFrom(e.touches[0].clientX); };
    const end = () => setScrubbing(false);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", end);
    return () => {
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", end);
    };
  }, [scrubbing, scrubFrom]);

  /* ── Autoplay muted + sound nudge ── */
  useEffect(() => {
    if (!autoplay) return;
    const v = videoRef.current;
    if (!v) return;
    const doPlay = () => {
      v.muted = true;
      setMuted(true);
      setVol(0);
      v.play().then(() => setShowNudge(true)).catch(() => {});
    };
    if (v.readyState >= 3) doPlay();
    else v.addEventListener("canplay", doPlay, { once: true });
    return () => v.removeEventListener("canplay", doPlay);
  }, [autoplay]);

  /* ── Auto-dismiss nudge after 6s ── */
  useEffect(() => {
    if (!showNudge) return;
    const t = setTimeout(() => setShowNudge(false), 6000);
    return () => clearTimeout(t);
  }, [showNudge]);

  /* ── Fullscreen state sync ── */
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  /* ── Pause when scrolled out of view (skip if PiP is active) ── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        const v = videoRef.current;
        if (!entry.isIntersecting && v && !v.paused && document.pictureInPictureElement !== v) {
          v.pause();
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* ── Volume ── */
  const setVideoVol = useCallback((v: number) => {
    const vid = videoRef.current;
    if (!vid) return;
    const c = Math.max(0, Math.min(1, v));
    vid.volume = c;
    setVol(c);
    const m = c === 0;
    setMuted(m);
    vid.muted = m;
    if (!m) {
      lastVol.current = c;
      setShowNudge(false);
      try { localStorage.setItem("vp-vol", String(c)); } catch {}
    }
  }, []);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.muted || vol === 0) {
      v.muted = false;
      setVideoVol(lastVol.current > 0 ? lastVol.current : 1);
      setShowNudge(false);
      if (isMobile) {
        if (landscapeFullscreenTimer.current) clearTimeout(landscapeFullscreenTimer.current);
        setShowLandscapeFullscreenTip(true);
        landscapeFullscreenTimer.current = setTimeout(() => setShowLandscapeFullscreenTip(false), 6000);
      }
    } else {
      lastVol.current = vol;
      v.muted = true;
      setMuted(true);
      setVol(0);
      v.volume = 0;
    }
    if (sound) tick(lastSnd);
  };

  /* ── Mobile fullscreen via video element (works on iOS Safari) ── */
  const enterMobileFullscreen = () => {
    const v = videoRef.current;
    if (!v) return;
    const wkv = v as HTMLVideoElement & { webkitEnterFullscreen?: () => void };
    if (wkv.webkitEnterFullscreen) {
      wkv.webkitEnterFullscreen();
    } else if (v.requestFullscreen) {
      v.requestFullscreen().catch(() => {});
    }
  };

  /* ── Fullscreen ── */
  const fullscreen = () => {
    if (isMobile) {
      enterMobileFullscreen();
      return;
    }
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  /* ── Picture-in-Picture ── */
  const pictureInPicture = async () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      if (document.pictureInPictureElement) await document.exitPictureInPicture();
      else await v.requestPictureInPicture();
    } catch {}
  };

  /* ── Loop ── */
  const toggleLoop = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !looping;
    v.loop = next;
    setLooping(next);
  };

  const VolIco =
    muted || vol === 0 ? IcoVolMute : vol > 0.5 ? IcoVolHi : IcoVolLo;

  return (
    <>
      <div
        className="vp"
        ref={containerRef}
        tabIndex={0}
        onMouseMove={resetHide}
        onMouseEnter={resetHide}
        onMouseLeave={() => {
          if (!scrubbing) setShow(false);
        }}
        onTouchStart={resetHide}
        onTouchEnd={(e) => {
          const rect = containerRef.current?.getBoundingClientRect();
          if (!rect) return;
          const x = e.changedTouches[0].clientX - rect.left;
          const side = x < rect.width / 3 ? "left" : x > (rect.width * 2) / 3 ? "right" : null;
          if (!side) return;
          const now = Date.now();
          const last = lastTap.current;
          if (last && last.side === side && now - last.time < 350) {
            clearTimeout(doubleTapTimer.current);
            lastTap.current = null;
            const v = videoRef.current;
            if (!v) return;
            v.currentTime = side === "left"
              ? Math.max(0, v.currentTime - 10)
              : Math.min(v.duration || 0, v.currentTime + 10);
            setSeekFlash(side);
            setTimeout(() => setSeekFlash(null), 700);
          } else {
            lastTap.current = { side, time: now };
          }
        }}
        onKeyDown={(e) => {
          const v = videoRef.current;
          switch (e.key) {
            case " ": case "k": e.preventDefault(); toggle(); break;
            case "ArrowLeft":   e.preventDefault(); if (v) v.currentTime = Math.max(0, v.currentTime - 5); break;
            case "ArrowRight":  e.preventDefault(); if (v) v.currentTime = Math.min(v.duration || 0, v.currentTime + 5); break;
            case "m": case "M": e.preventDefault(); toggleMute(); break;
            case "f": case "F": e.preventDefault(); fullscreen(); break;
          }
        }}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 900,
          margin: "0 auto",
          borderRadius: 14,
          overflow: "hidden",
          background: "#000",
          border: "1px solid rgba(255,255,255,0.06)",
          lineHeight: 0,
          userSelect: scrubbing ? "none" : undefined,
          fontFamily: "system-ui,-apple-system,sans-serif",
        }}
      >
        {/* Video */}
        <video
          ref={videoRef}
          poster={poster}
          preload={autoplay ? "auto" : "metadata"}
          playsInline
          crossOrigin="anonymous"
          onClick={toggle}
          onTimeUpdate={syncTime}
          onLoadedMetadata={syncTime}
          onDurationChange={syncTime}
          onPlay={() => {
            setPlaying(true);
            setErr(null);
            setBuffering(false);
            onPlayCallback?.();
          }}
          onPause={() => setPlaying(false)}
          onWaiting={() => setBuffering(true)}
          onCanPlay={() => setBuffering(false)}
          onProgress={() => {
            const v = videoRef.current;
            if (!v || v.buffered.length === 0 || !v.duration) return;
            setBuffered((v.buffered.end(v.buffered.length - 1) / v.duration) * 100);
          }}
          onEnded={() => {
            setEnded(true);
            setPlaying(false);
            onEndedCallback?.();
          }}
          onError={() => {
            const c = videoRef.current?.error?.code;
            setErr(
              c === 2
                ? "Network error."
                : c === 3
                  ? "Decode error."
                  : c === 4
                    ? "Source not supported."
                    : "Video failed to load.",
            );
            setPlaying(false);
          }}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            cursor: "pointer",
          }}
        >
          <source src={src} type="video/mp4" />
          <track kind="captions" src="/empty.vtt" srcLang="en" label="English" default />
        </video>

        {/* Error overlay */}
        <AnimatePresence>
          {err && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: "rgba(0,0,0,0.7)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                zIndex: 30,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 520,
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                Can&apos;t play video
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.65)",
                  maxWidth: 280,
                  textAlign: "center",
                }}
              >
                {err}
              </div>
              <button
                onClick={() => {
                  setErr(null);
                  videoRef.current?.load();
                }}
                style={{
                  marginTop: 4,
                  fontSize: 11,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.6)",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  padding: "6px 14px",
                  cursor: "pointer",
                  transition: "background 0.12s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.14)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                }}
              >
                Retry
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center play button — when paused & controls hidden */}
        <AnimatePresence>
          {!playing && !err && !show && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={toggle}
              role="button"
              aria-label={ended ? "Replay" : "Play"}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.35)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                {ended ? <IcoReplay size={24} /> : <IcoPlay size={24} />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sound nudge — centered, prominent */}
        <AnimatePresence>
          {showNudge && (
            /* Wrapper handles centering; motion.div handles scale animation only */
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 26 }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                onClick={toggleMute}
                style={{
                  display: "flex", flexDirection: "column",
                  alignItems: "center", gap: 10,
                  background: "rgba(0,0,0,0.72)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  borderRadius: 20,
                  padding: "22px 32px",
                  cursor: "pointer",
                  color: "#fff",
                  userSelect: "none",
                  textAlign: "center",
                  minWidth: 180,
                }}
              >
                <IcoVolMute size={28} />
                <span style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}>Sound off</span>
                <span style={{ fontSize: 12, opacity: 0.6, lineHeight: 1.5, maxWidth: 180 }}>
                  Tap to hear the action
                </span>
                <div style={{
                  marginTop: 4, fontSize: 11, fontWeight: 600,
                  background: "rgba(255,255,255,0.13)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 12, padding: "5px 16px",
                }}>
                  🔊 Unmute
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Landscape fullscreen tip — shown after sound enabled on mobile */}
        <AnimatePresence>
          {showLandscapeFullscreenTip && (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 26 }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                onClick={() => { setShowLandscapeFullscreenTip(false); enterMobileFullscreen(); }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                  background: 'rgba(0,0,0,0.72)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  borderRadius: 20,
                  padding: '22px 32px',
                  cursor: 'pointer',
                  color: '#fff',
                  userSelect: 'none',
                  textAlign: 'center',
                  minWidth: 180,
                }}
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="3" y="8" width="26" height="16" rx="2.5" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" />
                  <circle cx="27" cy="16" r="1.5" fill="rgba(255,255,255,0.85)" />
                </svg>
                <span style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}>Full experience</span>
                <span style={{ fontSize: 12, opacity: 0.6, lineHeight: 1.5, maxWidth: 180 }}>
                  Tap to open in landscape fullscreen
                </span>
                <div style={{
                  marginTop: 4, fontSize: 11, fontWeight: 600,
                  background: 'rgba(255,255,255,0.13)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 12, padding: '5px 16px',
                }}>
                  ⛶ Go fullscreen
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Buffering spinner */}
        {buffering && (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 15, pointerEvents: "none",
          }}>
            <div className="animate-spin" style={{
              width: 36, height: 36, borderRadius: "50%",
              border: "3px solid rgba(255,255,255,0.15)",
              borderTopColor: "rgba(255,255,255,0.85)",
            }} />
          </div>
        )}

        {/* Double-tap seek flash */}
        <AnimatePresence>
          {seekFlash && (
            <motion.div
              key={seekFlash}
              initial={{ opacity: 1, scale: 0.8 }}
              animate={{ opacity: 0, scale: 1.1, y: -16 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              style={{
                position: "absolute",
                top: "50%", transform: "translateY(-50%)",
                [seekFlash === "left" ? "left" : "right"]: "12%",
                background: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(8px)",
                color: "#fff", fontSize: 13, fontWeight: 700,
                padding: "8px 16px", borderRadius: 20,
                pointerEvents: "none", zIndex: 20, whiteSpace: "nowrap",
              }}
            >
              {seekFlash === "left" ? "← −10s" : "+10s →"}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Glass control bar */}
        <AnimatePresence>
          {show && !err && (
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              style={{
                position: "absolute",
                bottom: 12,
                left: "2.5%",
                width: "95%",
                background: "rgba(0,0,0,0.45)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "10px 14px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                zIndex: 20,
              }}
            >
              {/* Progress bar */}
              <div
                ref={progressRef}
                onMouseDown={(e) => { setScrubbing(true); scrubFrom(e.clientX); }}
                onMouseEnter={() => setBarHover(true)}
                onMouseLeave={() => { setBarHover(false); }}
                onMouseMove={(e) => {
                  const bar = progressRef.current;
                  if (!bar) return;
                  const rect = bar.getBoundingClientRect();
                  const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                  setHoverProg((x / rect.width) * 100);
                }}
                onTouchStart={(e) => { setScrubbing(true); scrubFrom(e.touches[0].clientX); }}
                style={{
                  position: "relative",
                  width: "100%",
                  height: barHover || scrubbing ? 6 : 3,
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: 3,
                  cursor: "pointer",
                  transition: "height 0.12s",
                }}
              >
                {/* Buffered range */}
                <div style={{
                  position: "absolute", top: 0, left: 0, height: "100%",
                  width: `${buffered}%`,
                  background: "rgba(255,255,255,0.22)",
                  borderRadius: 3,
                  transition: "width 0.8s ease",
                  pointerEvents: "none",
                }} />
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: `${prog}%`,
                    background: "rgba(255,255,255,0.7)",
                    borderRadius: 3,
                    transition: scrubbing ? "none" : "width 0.1s",
                  }}
                />
                {(barHover || scrubbing) && (
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: `clamp(6px, ${prog}%, calc(100% - 6px))`,
                      transform: "translate(-50%, -50%)",
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: "#fff",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                      transition: scrubbing ? "none" : "left 0.1s",
                    }}
                  />
                )}
                {barHover && dur > 0 && (
                  <div style={{
                    position: "absolute",
                    bottom: "calc(100% + 6px)",
                    left: `clamp(20px, ${hoverProg}%, calc(100% - 20px))`,
                    transform: "translateX(-50%)",
                    background: "rgba(0,0,0,0.75)",
                    backdropFilter: "blur(8px)",
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 500,
                    padding: "2px 7px",
                    borderRadius: 5,
                    pointerEvents: "none",
                    whiteSpace: "nowrap",
                    fontVariantNumeric: "tabular-nums",
                  }}>
                    {fmt((hoverProg / 100) * dur)}
                  </div>
                )}
              </div>

              {/* Control row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {/* Left: play + volume + time */}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {/* Play / Pause */}
                  <button
                    onClick={toggle}
                    aria-label={ended ? "Replay" : playing ? "Pause" : "Play"}
                    style={{
                      ...BTN,
                      background: "rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.85)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.14)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.08)";
                    }}
                  >
                    {ended ? (
                      <IcoReplay />
                    ) : playing ? (
                      <IcoPause />
                    ) : (
                      <IcoPlay />
                    )}
                  </button>

                  {/* Volume icon + slider */}
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <button
                      onClick={toggleMute}
                      aria-label={muted || vol === 0 ? "Unmute" : "Mute"}
                      style={{
                        ...BTN,
                        color: "rgba(255,255,255,0.55)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "rgba(255,255,255,0.9)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "rgba(255,255,255,0.55)";
                      }}
                    >
                      <VolIco />
                    </button>
                    {!isMobile && (
                    <div
                      onMouseDown={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = Math.max(
                          0,
                          Math.min(e.clientX - rect.left, rect.width),
                        );
                        setVideoVol(x / rect.width);
                      }}
                      style={{
                        width: 52,
                        height: 3,
                        background: "rgba(255,255,255,0.12)",
                        borderRadius: 2,
                        cursor: "pointer",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          height: "100%",
                          width: `${vol * 100}%`,
                          background: "rgba(255,255,255,0.5)",
                          borderRadius: 2,
                        }}
                      />
                    </div>
                    )}
                  </div>

                  {/* Time */}
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 450,
                      color: "rgba(255,255,255,0.65)",
                      fontVariantNumeric: "tabular-nums",
                      letterSpacing: "0.01em",
                      whiteSpace: "nowrap",
                      marginLeft: 2,
                    }}
                  >
                    {fmt(time)}
                    <span style={{ opacity: 0.5 }}> / </span>
                    {fmt(dur)}
                  </div>
                </div>

                {/* Right: speed + fullscreen */}
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {/* Speed pills */}
                  {!isMobile && (
                  <div
                    style={{
                      display: "flex",
                      gap: 0,
                      position: "relative",
                      background: "rgba(255,255,255,0.06)",
                      borderRadius: 8,
                      padding: 2,
                    }}
                  >
                    {SPEEDS.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          const v = videoRef.current;
                          if (v) v.playbackRate = s;
                          setSpeed(s);
                          if (sound) tick(lastSnd);
                        }}
                        style={{
                          position: "relative",
                          fontSize: 11,
                          fontWeight: 500,
                          fontVariantNumeric: "tabular-nums",
                          padding: "4px 8px",
                          borderRadius: 6,
                          border: "none",
                          background: "transparent",
                          color:
                            speed === s
                              ? "rgba(255,255,255,0.9)"
                              : "rgba(255,255,255,0.65)",
                          cursor: "pointer",
                          zIndex: 1,
                          transition: "color 0.15s",
                          lineHeight: 1,
                        }}
                      >
                        {speed === s && (
                          <motion.div
                            layoutId="vp-speed"
                            style={{
                              position: "absolute",
                              inset: 0,
                              background: "rgba(255,255,255,0.12)",
                              borderRadius: 6,
                              zIndex: -1,
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 35,
                            }}
                          />
                        )}
                        {s}x
                      </button>
                    ))}
                  </div>
                  )}

                  {/* Loop */}
                  {!isMobile && (
                  <button
                    onClick={toggleLoop}
                    aria-label={looping ? "Disable loop" : "Enable loop"}
                    style={{
                      ...BTN,
                      color: looping ? "#38BDF8" : "rgba(255,255,255,0.65)",
                      background: looping ? "rgba(56,189,248,0.12)" : "transparent",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = looping ? "#38BDF8" : "rgba(255,255,255,0.9)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = looping ? "#38BDF8" : "rgba(255,255,255,0.65)"; }}
                  >
                    <IcoLoop />
                  </button>
                  )}

                  {/* Picture-in-Picture */}
                  {!isMobile && "pictureInPictureEnabled" in document && (
                    <button
                      onClick={pictureInPicture}
                      aria-label="Picture in picture"
                      style={{ ...BTN, color: "rgba(255,255,255,0.65)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.9)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}
                    >
                      <IcoPiP />
                    </button>
                  )}

                  {/* Fullscreen */}
                  <button
                    onClick={fullscreen}
                    aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                    style={{
                      ...BTN,
                      color: "rgba(255,255,255,0.65)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "rgba(255,255,255,0.9)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255,255,255,0.65)";
                    }}
                  >
                    {isFullscreen ? <IcoExitFull /> : <IcoFull />}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default VideoPlayerPro;
