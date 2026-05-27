"use client"
import { forwardRef } from "react"
import type React from "react"

interface ShinyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  href?: string
  target?: string
  rel?: string
}

export const ShinyButton = forwardRef<HTMLButtonElement, ShinyButtonProps>(
  ({ children, className = "", href, target, rel, type = 'button', disabled, ...props }, ref) => {
    if (href) {
      return (
        <a href={href} target={target} rel={rel} className={`shiny-cta ${className}`} {...props as React.AnchorHTMLAttributes<HTMLAnchorElement>}>
          <span>{children}</span>
        </a>
      )
    }
    return (
      <button
        ref={ref}
        className={`shiny-cta ${className}`}
        type={type}
        disabled={disabled}
        style={disabled ? { opacity: 0.45, cursor: 'not-allowed', pointerEvents: 'none' } : undefined}
        {...props}
      >
        <span>{children}</span>
      </button>
    )
  }
)

ShinyButton.displayName = 'ShinyButton'
