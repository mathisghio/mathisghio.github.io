interface SectionHeaderProps {
  label: string
  line1: string
  line2: string
  lightColor?: boolean // pour les sections avec LampContainer (texte clair)
}

export function SectionHeader({ label, line1, line2, lightColor }: SectionHeaderProps) {
  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <div className="section-line" style={lightColor ? { background: 'linear-gradient(90deg, rgba(241,245,249,0.4), transparent)' } : undefined} />
        <span className="font-body text-xs uppercase tracking-widest" style={{ color: lightColor ? 'rgba(241,245,249,0.6)' : '#0EA5E9', letterSpacing: '0.2em' }}>
          {label}
        </span>
      </div>
      <h2 className="font-display text-white leading-none" style={{ fontSize: 'clamp(48px, 8vw, 110px)' }}>{line1}</h2>
      <h2 className="font-display leading-none" style={{ fontSize: 'clamp(48px, 8vw, 110px)', background: 'linear-gradient(135deg, #0EA5E9, #38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{line2}</h2>
    </>
  )
}
