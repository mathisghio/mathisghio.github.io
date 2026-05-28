import { useInView } from '@/hooks/useInView'
import { WebGLShader } from '@/components/ui/web-gl-shader'
import { PartnershipFormModal } from './PartnershipFormModal'
import { ShinyButton } from '@/components/ui/shiny-button'
import { ExternalLink } from 'lucide-react'

const titlePartners = [
  { name: 'Ozone',       url: 'https://ozonekites.com/team/mathis-ghio/',          description: 'Wing & kite manufacturer and R&D partner',   logoText: 'OZONE'       },
  { name: 'Levitaz',     url: 'https://levitaz.com/team-rider/mathis-ghio/',       description: 'Hydrofoil manufacturer and R&D partner',     logoText: 'LEVITAZ'     },
  { name: 'Forward WIP', url: 'https://www.forward-wip.com/fr/team/mathis-ghio/',  description: 'Protection & accessories partner',         logoText: 'FORWARD WIP' },
]

const officialPartners = [
  { name: 'Overstims',      url: 'https://www.overstims.com/',          description: 'Nutrition partner'         },
  { name: 'FFVoile',        url: 'https://hn.ffvoile.fr/',              description: 'French Sailing Federation'  },
  { name: 'INSA Lyon',      url: 'https://www.insa-lyon.fr/',           description: 'Engineering school'        },
  { name: 'Département 13', url: 'https://www.departement13.fr/',       description: 'Bouches-du-Rhône'          },
  { name: 'Métropole AMP',  url: 'https://ampmetropole.fr/',            description: 'Aix-Marseille-Provence'    },
]

export function PartnersSection() {
  const { ref, inView } = useInView(0.1)

  return (
    <section
      id="partners"
      ref={ref}
      className="section-edge-fade relative py-10 lg:py-20 overflow-hidden"
      style={{ background: '#08090E' }}
    >
      {/*
       * WebGL sine-wave shader — chromatic aberration lines.
       * xScale 1.2 + yScale 0.35 = wide flat waves.
       * speed 0.006 = slower than default.
       * opacity 0.18 = atmospheric, not overpowering.
       */}
      {/* Desktop wave — S-curve chromatic sinusoid in the lower third.
           NOTE: gl_FragCoord.y is 0 at the GL bottom but the canvas is
           displayed with y=0 at the CSS top → yOffset POSITIVE = wave moves DOWN.
           yOffset=+0.55 centres the wave at ~77% from the top (lower third).
           xScale=1.0 / yScale=0.45 ≈ demo defaults → same S-curve feel. */}
      <div
        className="hidden lg:block"
        style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: 0, right: 0, height: '280px' }}
      >
        <WebGLShader
          xScale={1.0}
          yScale={0.40}
          distortion={0.08}
          speed={0.010}
          opacity={0.92}
          yOffset={0}
        />
      </div>

      {/* Mobile wave 1 — Title Partners level */}
      <div className="lg:hidden">
        <WebGLShader
          xScale={1.2}
          yScale={0.35}
          distortion={0.06}
          speed={0.022}
          opacity={0.58}
          yOffset={-3.0}
        />
      </div>

      {/* Mobile wave 2 — Official Partners level */}
      <div className="lg:hidden">
        <WebGLShader
          xScale={1.2}
          yScale={0.35}
          distortion={0.06}
          speed={0.022}
          opacity={0.38}
          yOffset={0.60}
        />
      </div>

      {/* Dark overlay so text stays legible over the shader */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: 'rgba(8,9,14,0.15)' }}
      />

      {/* Edge fades */}
      <div className="absolute inset-0 z-[2] pointer-events-none"
        style={{ background: 'linear-gradient(180deg, #08090E 0%, transparent 10%, transparent 90%, #08090E 100%)' }} />
      <div className="absolute inset-0 z-[2] pointer-events-none"
        style={{ background: 'linear-gradient(90deg, #08090E 0%, transparent 6%, transparent 94%, #08090E 100%)' }} />

      {/* ── Content ── */}
      <div className="container relative z-20">

        {/* Header */}
        <div
          className="mb-10 lg:mb-16 transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)' }}
        >
          <div className="flex items-center gap-3 mb-4 lg:mb-6">
            <div className="section-line" />
            <span className="font-body text-xs uppercase tracking-widest" style={{ color: '#0EA5E9', letterSpacing: '0.2em' }}>Partners</span>
          </div>
          <h2 className="font-display text-white leading-none" style={{ fontSize: 'clamp(48px, 8vw, 110px)' }}>BUILT WITH</h2>
          <h2 className="font-display leading-none" style={{ fontSize: 'clamp(48px, 8vw, 110px)', color: '#0EA5E9' }}>
            THE BEST
          </h2>
        </div>

        {/* Title partners */}
        <div
          className="mb-10 lg:mb-16 transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '200ms' }}
        >
          <h3 className="font-body text-xs uppercase tracking-widest mb-5 lg:mb-8" style={{ color: 'rgba(245,158,11,0.7)', letterSpacing: '0.2em' }}>
            Title Partners
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {titlePartners.map((partner, i) => (
              <a key={i} href={partner.url} target="_blank" rel="noopener noreferrer"
                className="group relative p-5 lg:p-8 rounded-sm card-hover flex flex-col items-center text-center overflow-hidden"
                style={{ background: 'rgba(8,9,14,0.75)', backdropFilter: 'blur(16px)', border: '1px solid rgba(245,158,11,0.22)', textDecoration: 'none' }}>
                {/* Gold top accent line */}
                <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.7), transparent)' }} />
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.10) 0%, transparent 65%)' }} />
                <span className="mb-3 font-body text-[0.6rem] uppercase tracking-widest" style={{ color: 'rgba(245,158,11,0.55)', letterSpacing: '0.22em' }}>
                  Title Partner
                </span>
                <div className="font-display text-3xl lg:text-4xl mb-2 transition-all duration-300 group-hover:text-cyan-400" style={{ color: 'rgba(241,245,249,0.95)' }}>
                  {partner.logoText}
                </div>
                <p className="font-body text-xs" style={{ color: 'rgba(148,163,184,0.6)' }}>{partner.description}</p>
                <div className="mt-4 w-8 h-px transition-all duration-300 group-hover:w-16" style={{ background: '#F59E0B' }} />
              </a>
            ))}
          </div>
        </div>

        {/* Official partners */}
        <div
          className="transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '400ms' }}
        >
          <h3 className="font-body text-xs uppercase tracking-widest mb-5 lg:mb-8" style={{ color: 'rgba(148,163,184,0.5)', letterSpacing: '0.2em' }}>
            Official Partners
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {officialPartners.map((partner, i) => (
              <a key={i} href={partner.url} target="_blank" rel="noopener noreferrer"
                className="group flex flex-col gap-1 px-4 py-3 rounded-sm transition-all duration-300"
                style={{ background: 'rgba(8,9,14,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none' }}>
                <span className="font-heading font-semibold text-sm transition-all duration-300 group-hover:text-cyan-400"
                  style={{ color: 'rgba(241,245,249,0.8)', fontFamily: 'Barlow Condensed, sans-serif' }}>
                  {partner.name}
                </span>
                <span className="font-body text-xs leading-tight" style={{ color: 'rgba(148,163,184,0.45)' }}>{partner.description}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Partnership CTA */}
        <div
          className="mt-10 lg:mt-16 p-5 lg:p-8 rounded-sm transition-all duration-700"
          style={{
            background: 'rgba(8,9,14,0.75)', backdropFilter: 'blur(16px)',
            border: '1px solid rgba(14,165,233,0.15)',
            opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '600ms',
          }}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="lg:max-w-[620px]">
              <h3 className="font-heading font-bold text-2xl text-white mb-2" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Ready to build something lasting?
              </h3>
              <p className="font-body text-sm" style={{ color: 'rgba(148,163,184,0.7)' }}>
                Title partnerships, R&D collaborations, product co-development, brand activations —<br className="hidden lg:block" />
                5 continents, 5 world titles, an engineering mind behind every result.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <ShinyButton
                href="https://canva.link/s85g1kf1ihu4mgu"
                target="_blank"
                rel="noopener noreferrer"
                className="[--shiny-cta-highlight:#F59E0B] [--shiny-cta-bg:rgba(245,158,11,0.06)]"
              >
                <span className="flex items-center gap-2">
                  <ExternalLink size={13} style={{ flexShrink: 0 }} />
                  View Partnership Deck
                </span>
              </ShinyButton>
              <PartnershipFormModal trigger={<ShinyButton>Start a Conversation</ShinyButton>} />
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
