"use client"
import type React from "react"

interface ShinyButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  href?: string          // pour les liens
  target?: string
  rel?: string
}

export function ShinyButton({ children, onClick, className = "", href, target, rel }: ShinyButtonProps) {
  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={`shiny-cta ${className}`}>
        <span>{children}</span>
      </a>
    )
  }
  return (
    <button className={`shiny-cta ${className}`} onClick={onClick}>
      <span>{children}</span>
    </button>
  )
}
