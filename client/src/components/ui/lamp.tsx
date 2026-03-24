import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export const LampContainer = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center overflow-hidden w-full z-0',
        className
      )}
      style={{ background: '#08090E', minHeight: '70vh' }}
    >
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0">

        {/* Cône gauche */}
        <motion.div
          initial={{ opacity: 0.5, width: '15rem' }}
          whileInView={{ opacity: 1, width: '30rem' }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          style={{
            backgroundImage:
              'conic-gradient(from 70deg at center top, #0EA5E9, transparent, transparent)',
          }}
          className="absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem]"
        >
          <div
            className="absolute w-full left-0 h-40 bottom-0 z-20"
            style={{
              background: '#08090E',
              WebkitMaskImage: 'linear-gradient(to top, white, transparent)',
              maskImage: 'linear-gradient(to top, white, transparent)',
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

        {/* Cône droit */}
        <motion.div
          initial={{ opacity: 0.5, width: '15rem' }}
          whileInView={{ opacity: 1, width: '30rem' }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          style={{
            backgroundImage:
              'conic-gradient(from 290deg at center top, transparent, transparent, #0EA5E9)',
          }}
          className="absolute inset-auto left-1/2 h-56 w-[30rem]"
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
            className="absolute w-full right-0 h-40 bottom-0 z-20"
            style={{
              background: '#08090E',
              WebkitMaskImage: 'linear-gradient(to top, white, transparent)',
              maskImage: 'linear-gradient(to top, white, transparent)',
            }}
          />
        </motion.div>

        {/* Blur de fond bas */}
        <div
          className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 blur-2xl"
          style={{ background: '#08090E' }}
        />
        {/* Backdrop blur overlay */}
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md" />

        {/* Halo central large */}
        <div
          className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full opacity-50 blur-3xl"
          style={{ background: '#0EA5E9' }}
        />

        {/* Halo central intense (animé) */}
        <motion.div
          initial={{ width: '8rem' }}
          whileInView={{ width: '16rem' }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-auto z-30 h-36 -translate-y-[6rem] rounded-full blur-2xl"
          style={{ background: '#0284C7' }}
        />

        {/* Ligne horizontale — le "fil" de la lampe */}
        <motion.div
          initial={{ width: '15rem' }}
          whileInView={{ width: '30rem' }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-auto z-50 h-0.5 -translate-y-[7rem]"
          style={{ background: 'linear-gradient(90deg, transparent, #0EA5E9, #38BDF8, #0EA5E9, transparent)' }}
        />

        {/* Masque bas qui cache le bas des cônes */}
        <div
          className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem]"
          style={{ background: '#08090E' }}
        />
      </div>

      {/* Contenu — remonté dans la zone de lumière */}
      <div className="relative z-50 flex -translate-y-64 flex-col items-center px-5 w-full">
        {children}
      </div>
    </div>
  )
}
