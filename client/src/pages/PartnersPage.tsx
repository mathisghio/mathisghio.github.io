import { useEffect } from 'react'
import { PartnershipFormModal } from '@/components/PartnershipFormModal'
import { trackSponsorsPageView } from '@/lib/analytics'

const titlePartners = [
  { name: 'Ozone',       description: 'Wing & kite manufacturer — R&D partner',   url: 'https://ozonekites.com/team/mathis-ghio/' },
  { name: 'Levitaz',     description: 'Hydrofoil manufacturer — R&D partner',     url: 'https://levitaz.com/team-rider/mathis-ghio/' },
  { name: 'Forward WIP', description: 'Protection & accessories partner',         url: 'https://www.forward-wip.com/fr/team/mathis-ghio/' },
]

const officialPartners = ['Overstims', 'FFVoile', 'INSA Lyon', 'Département 13', 'Métropole AMP']

const stats = [
  { value: '5×',    label: 'World Champion' },
  { value: '4×',    label: 'European Champion' },
  { value: '10+',   label: 'World Cup Victories' },
  { value: '41.40', label: 'kts Speed Record' },
]

const formats = [
  {
    tier: 'Title Partner',
    color: '#F59E0B',
    items: ['Jersey & equipment logo placement', 'Content creation + social posts', 'Event presence & brand activation', 'Product co-development & R&D access', 'Media kit featuring your brand'],
  },
  {
    tier: 'Official Partner',
    color: '#0EA5E9',
    items: ['Logo on racing equipment', 'Dedicated social media posts', 'Athlete endorsement rights', 'Event access & networking'],
  },
  {
    tier: 'Media Partner',
    color: 'rgba(148,163,184,0.8)',
    items: ['Content collaboration', 'Co-branded race coverage', 'Social media cross-promotion'],
  },
]

export default function PartnersPage() {
  useEffect(() => {
    trackSponsorsPageView()
    window.scrollTo(0, 0)
  }, [])

  return (
    <div style={{ background: '#08090E', minHeight: '100vh', color: '#F1F5F9' }}>

      {/* Nav minimal */}
      <nav style={{ padding: '20px 24px', borderBottom: '1px solid rgba(14,165,233,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: '#F1F5F9', textDecoration: 'none', letterSpacing: '0.05em' }}>
          MATHIS <span style={{ color: '#0EA5E9' }}>GHIO</span>
        </a>
        <a href="/" style={{ fontSize: '12px', fontFamily: 'DM Sans, sans-serif', color: 'rgba(148,163,184,0.6)', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          ← Back to site
        </a>
      </nav>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px 80px' }}>

        {/* Hero */}
        <div style={{ paddingTop: '72px', paddingBottom: '64px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '32px', height: '1px', background: '#0EA5E9' }} />
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#0EA5E9', fontFamily: 'DM Sans, sans-serif' }}>
              Partnership Opportunities
            </span>
          </div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(52px, 8vw, 96px)', lineHeight: 1, marginBottom: '8px' }}>
            PARTNER WITH
          </h1>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(52px, 8vw, 96px)', lineHeight: 1, background: 'linear-gradient(135deg, #0EA5E9, #38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '28px' }}>
            MATHIS GHIO
          </h1>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '17px', color: 'rgba(241,245,249,0.7)', maxWidth: '560px', lineHeight: 1.7, marginBottom: '36px' }}>
            Mathis Ghio is the most decorated wingfoil racing athlete in history — 5× World Champion, speed record holder, and a growing media presence across Europe and beyond. Partner with him to reach an engaged, performance-driven audience.
          </p>
          <PartnershipFormModal
            trigger={
              <button className="shiny-cta" style={{ fontSize: '15px' }}>
                <span>Request Partnership Info</span>
              </button>
            }
          />
        </div>

        {/* Stats */}
        <div style={{ paddingTop: '56px', paddingBottom: '56px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1px', background: 'rgba(14,165,233,0.08)', borderRadius: '6px', overflow: 'hidden' }}>
            {stats.map((s, i) => (
              <div key={i} style={{ background: '#08090E', padding: '32px 24px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '48px', lineHeight: 1, color: i === 0 ? '#F59E0B' : '#0EA5E9', textShadow: i === 0 ? '0 0 30px rgba(245,158,11,0.4)' : '0 0 30px rgba(14,165,233,0.4)' }}>
                  {s.value}
                </div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(148,163,184,0.6)', marginTop: '8px' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why partner */}
        <div style={{ paddingTop: '56px', paddingBottom: '56px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(32px, 5vw, 56px)', marginBottom: '32px' }}>
            WHY PARTNER WITH MATHIS?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {[
              { icon: '🏆', title: 'Elite Performance', body: 'Top-ranked athlete on the international wingfoil circuit. Results that speak for themselves — brands associate with a winner.' },
              { icon: '📱', title: 'Engaged Audience', body: 'Growing community of watersport enthusiasts, athletes, and outdoor lifestyle followers across Instagram, YouTube, and TikTok.' },
              { icon: '🌍', title: 'European Reach', body: '15+ events per year across France, Italy, Spain, and beyond. On-site brand visibility at every major wingfoil championship.' },
              { icon: '🔬', title: 'R&D Credibility', body: 'Engineering background (INSA Lyon) + world-class athleticism = a credible voice for performance brands. Real product testing, real feedback.' },
            ].map((card, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(14,165,233,0.1)', borderRadius: '6px', padding: '24px' }}>
                <div style={{ fontSize: '24px', marginBottom: '12px' }}>{card.icon}</div>
                <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '16px', color: '#F1F5F9', marginBottom: '8px', letterSpacing: '0.03em' }}>{card.title}</div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(148,163,184,0.7)', lineHeight: 1.6 }}>{card.body}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Partnership formats */}
        <div style={{ paddingTop: '56px', paddingBottom: '56px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(32px, 5vw, 56px)', marginBottom: '32px' }}>
            PARTNERSHIP FORMATS
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {formats.map((f, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${f.color}22`, borderRadius: '6px', padding: '28px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: f.color }} />
                <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '18px', color: f.color, marginBottom: '20px', letterSpacing: '0.05em' }}>
                  {f.tier}
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {f.items.map((item, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(241,245,249,0.75)', lineHeight: 1.5 }}>
                      <span style={{ color: f.color, marginTop: '2px', flexShrink: 0 }}>—</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p style={{ marginTop: '24px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(148,163,184,0.5)', fontStyle: 'italic' }}>
            All partnerships are tailored. Contact us to discuss scope, visibility, and pricing.
          </p>
        </div>

        {/* Current partners */}
        <div style={{ paddingTop: '56px', paddingBottom: '56px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(32px, 5vw, 56px)', marginBottom: '8px' }}>
            TRUSTED BY
          </h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(148,163,184,0.6)', marginBottom: '32px' }}>
            Brands already partnered with Mathis
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
            {titlePartners.map((p, i) => (
              <a key={i} href={p.url} target="_blank" rel="noopener noreferrer"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(245,158,11,0.12)', borderRadius: '6px', padding: '20px', textDecoration: 'none', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: 'rgba(241,245,249,0.9)', marginBottom: '6px', letterSpacing: '0.05em' }}>{p.name}</div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(148,163,184,0.5)' }}>{p.description}</div>
              </a>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {officialPartners.map((p, i) => (
              <span key={i} style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 600, fontSize: '13px', color: 'rgba(241,245,249,0.6)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', padding: '6px 12px', letterSpacing: '0.03em' }}>
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div style={{ paddingTop: '64px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(36px, 6vw, 72px)', marginBottom: '16px' }}>
            LET'S BUILD SOMETHING TOGETHER
          </h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: 'rgba(148,163,184,0.7)', marginBottom: '36px', maxWidth: '480px', margin: '0 auto 36px', lineHeight: 1.7 }}>
            Fill in the form and Mathis will personally get back to you within 48 hours.
          </p>
          <PartnershipFormModal
            trigger={
              <button className="shiny-cta" style={{ fontSize: '16px' }}>
                <span>Start a Partnership Conversation</span>
              </button>
            }
          />
          <div style={{ marginTop: '20px' }}>
            <a href="mailto:contact@mathisghio.com" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(148,163,184,0.5)', textDecoration: 'none' }}>
              Or email directly: contact@mathisghio.com
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
