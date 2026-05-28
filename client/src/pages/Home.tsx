import { Navigation } from '@/components/Navigation'
import { HeroSection } from '@/components/HeroSection'
import { StatsBanner } from '@/components/StatsBanner'
import { AudienceSection } from '@/components/AudienceSection'
import { AboutSection } from '@/components/AboutSection'
import { AchievementsSection } from '@/components/AchievementsSection'
import { CareerSection } from '@/components/CareerSection'
import { GoatSection } from '@/components/GoatSection'
import { GlobeSection } from '@/components/GlobeSection'
import { SportSection } from '@/components/SportSection'
import { GallerySection } from '@/components/GallerySection'
import { GalleryRainBackground } from '@/components/GalleryRainBackground'
import { PartnersSection } from '@/components/PartnersSection'
import { PressSection } from '@/components/PressSection'
import { ContactSection } from '@/components/ContactSection'
import { useEffect } from 'react'
import { useMeta } from '@/lib/meta'
import { trackScrollDepth } from '@/lib/analytics'

const HOME_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': 'https://mathisghio.com/#person',
  name: 'Mathis Ghio',
  jobTitle: 'Professional Wingfoil Racing Athlete',
  url: 'https://mathisghio.com',
  email: 'contact@mathisghio.com',
  image: 'https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1774426876/podium-1_whf6pe.jpg',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Marseille',
    addressRegion: 'Bouches-du-Rhône',
    addressCountry: 'FR',
  },
  sameAs: [
    'https://instagram.com/mathisghio',
    'https://www.facebook.com/MathisGhioWing',
    'https://fr.linkedin.com/in/mathis-ghio-93075515a',
    'https://ozonekites.com/team/mathis-ghio/',
    'https://levitaz.com/team-rider/mathis-ghio/',
  ],
  description: '5× Wingfoil Racing World Champion, 4× European Champion. Speed record holder at 41.39 knots. Based in Marseille, France.',
  award: ['5× Wingfoil Racing World Champion', '4× Formula Wing European Champion', '41.40 kts Speed Record'],
  knowsAbout: ['Wingfoil Racing', 'Hydrofoil', 'Watersports', 'Brand Partnerships'],
  affiliation: [
    { '@type': 'Organization', name: 'Ozone', url: 'https://ozonekites.com' },
    { '@type': 'Organization', name: 'Levitaz', url: 'https://levitaz.com' },
    { '@type': 'Organization', name: 'Forward WIP' },
    { '@type': 'Organization', name: 'FFVoile' },
  ],
}

export default function Home() {
  // Restore scroll position on refresh (desktop browsers reset to top, unlike mobile)
  useEffect(() => {
    const saved = sessionStorage.getItem('mg_scrollY')
    if (saved) {
      const y = parseInt(saved, 10)
      sessionStorage.removeItem('mg_scrollY')
      // Two rAF so React has painted before scrolling
      requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo(0, y)))
    }
    const save = () => sessionStorage.setItem('mg_scrollY', String(window.scrollY))
    window.addEventListener('beforeunload', save)
    return () => window.removeEventListener('beforeunload', save)
  }, [])

  useEffect(() => {
    const fired = new Set<number>()
    const onScroll = () => {
      const pct = Math.round(((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100)
      for (const d of [25, 50, 75, 100] as const) {
        if (pct >= d && !fired.has(d)) { fired.add(d); trackScrollDepth(d) }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useMeta({
    title: 'Mathis Ghio — 5× Wingfoil World Champion',
    description: 'Mathis Ghio — Professional Wingfoil Athlete based in Marseille. 5× World Champion, 4× European Champion, 41.40 kts Speed Record.',
    url: 'https://mathisghio.com',
    schema: HOME_SCHEMA,
  })

  return (
    <div
      className="min-h-screen"
      style={{ background: '#08090E', color: '#F1F5F9' }}
    >
      <div className="mgProgressBar" aria-hidden="true" />
      <Navigation />
      <HeroSection />
      <StatsBanner />
      <AboutSection />
      <AchievementsSection />
      <CareerSection />
      <GoatSection />
      <GlobeSection />
      <SportSection />
      {/* Gallery + Audience share one continuous rain — no seam */}
      <div className="relative" style={{ background: '#08090E' }}>
        <GalleryRainBackground />
        {/* Fade rain out before Partners */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ height: '220px', background: 'linear-gradient(180deg, transparent, #08090E)', zIndex: 3 }}
        />
        <GallerySection />
        <AudienceSection />
      </div>
      <PartnersSection />
      <PressSection />
      <ContactSection />
    </div>
  )
}
