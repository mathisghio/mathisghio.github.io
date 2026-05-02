import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export const LampContainer = ({
  children,
  className,
  contentOffset,
  minHeight,
}: {
  children: React.ReactNode
  className?: string
  contentOffset?: number
  minHeight?: string
}) => {
  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center overflow-hidden w-full z-0 lamp-container',
        className
      )}
      style={{ background: '#08090E', ...(minHeight && !className?.includes('min-h') ? { minHeight } : {}) }}
    >
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0">

        {/* ── Cône gauche ── */}
        <motion.div
          initial={{ opacity: 0.3, width: '10rem' }}
          whileInView={{ opacity: 1, width: '35rem' }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          style={{
            backgroundImage:
              'conic-gradient(from 70deg at center top, #0EA5E9 0deg, #0284C7 15deg, transparent 60deg, transparent 360deg)',
          }}
          className="absolute inset-auto right-1/2 h-64 overflow-visible w-[35rem]"
        >
          <div
            className="absolute w-full left-0 h-44 bottom-0 z-20"
            style={{
              background: '#08090E',
              WebkitMaskImage: 'linear-gradient(to top, white 60%, transparent)',
              maskImage: 'linear-gradient(to top, white 60%, transparent)',
            }}
          />
          <div
            className="absolute w-40 h-full left-0 bottom-0 z-20"
            style={{
              background: '#08090E',
              WebkitMaskImage: 'linear-gradient(to right, white, transparent)',
              maskImage: 'linear-gradient(to right, white, transparent)',
            }}
          />
        </motion.div>

        {/* ── Cône droit ── */}
        <motion.div
          initial={{ opacity: 0.3, width: '10rem' }}
          whileInView={{ opacity: 1, width: '35rem' }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          style={{
            backgroundImage:
              'conic-gradient(from 290deg at center top, transparent 0deg, transparent 300deg, #0284C7 345deg, #0EA5E9 360deg)',
          }}
          className="absolute inset-auto left-1/2 h-64 w-[35rem]"
        >
          <div
            className="absolute w-40 h-full right-0 bottom-0 z-20"
            style={{
              background: '#08090E',
              WebkitMaskImage: 'linear-gradient(to left, white, transparent)',
              maskImage: 'linear-gradient(to left, white, transparent)',
            }}
          />
          <div
            className="absolute w-full right-0 h-44 bottom-0 z-20"
            style={{
              background: '#08090E',
              WebkitMaskImage: 'linear-gradient(to top, white 60%, transparent)',
              maskImage: 'linear-gradient(to top, white 60%, transparent)',
            }}
          />
        </motion.div>

        {/* ── Blur de fond bas ── */}
        <div
          className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 blur-2xl"
          style={{ background: '#08090E' }}
        />

        {/* ── Backdrop blur overlay ── */}
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md" />

        {/* ── Halo central large diffus ── */}
        <div
          className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full opacity-60 blur-3xl"
          style={{ background: 'linear-gradient(90deg, #0EA5E9, #38BDF8, #0EA5E9)' }}
        />

        {/* ── Halo central intense (animé) ── */}
        <motion.div
          initial={{ width: '6rem' }}
          whileInView={{ width: '18rem' }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-auto z-30 h-36 -translate-y-[6rem] rounded-full blur-2xl opacity-80"
          style={{ background: '#0284C7' }}
        />

        {/* ── Ligne "fil de lampe" ── */}
        <motion.div
          initial={{ width: '10rem', opacity: 0 }}
          animate={{ width: '32rem', opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-auto z-50 -translate-y-[7rem]"
          style={{
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #38BDF8, #fff, #38BDF8, transparent)',
            boxShadow: '0 0 12px 3px rgba(56,189,248,0.9), 0 0 28px 6px rgba(14,165,233,0.6)',
          }}
        />

        {/* ── Masque bas ── */}
        <div
          className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem]"
          style={{ background: '#08090E' }}
        />
      </div>

      {/* ── Contenu ── */}
      <div
        className="relative z-50 flex flex-col items-center px-5 w-full"
        style={{ transform: `translateY(${contentOffset ?? -256}px)` }}
      >
        {children}
      </div>
    </div>
  )
}
