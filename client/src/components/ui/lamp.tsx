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
    <div className={cn('relative flex w-full flex-col items-center justify-start overflow-hidden z-0', className)}>
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0">
        <motion.div
          initial={{ opacity: 0.5, width: '15rem' }}
          whileInView={{ opacity: 1, width: '30rem' }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem] [background-image:conic-gradient(from_70deg_at_center_top,#0EA5E9,transparent,transparent)]"
        >
          <div className="absolute w-full left-0 h-40 bottom-0 z-20 [background:#08090E] [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute w-40 h-full left-0 bottom-0 z-20 [background:#08090E] [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0.5, width: '15rem' }}
          whileInView={{ opacity: 1, width: '30rem' }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-auto left-1/2 h-56 w-[30rem] [background-image:conic-gradient(from_290deg_at_center_top,transparent,transparent,#0EA5E9)]"
        >
          <div className="absolute w-40 h-full right-0 bottom-0 z-20 [background:#08090E] [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute w-full right-0 h-40 bottom-0 z-20 [background:#08090E] [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>
        <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 blur-2xl [background:#08090E]" />
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md" />
        <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full opacity-50 blur-3xl [background:#0EA5E9]" />
        <motion.div
          initial={{ width: '8rem' }}
          whileInView={{ width: '16rem' }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full blur-2xl [background:#0284C7]"
        />
        <motion.div
          initial={{ width: '15rem' }}
          whileInView={{ width: '30rem' }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] [background:#0EA5E9]"
        />
        <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] [background:#08090E]" />
      </div>
      <div className="relative z-50 w-full">{children}</div>
    </div>
  )
}
