import { Navigation } from '@/components/Navigation'
import { HeroSection } from '@/components/HeroSection'
import { StatsBanner } from '@/components/StatsBanner'
import { AboutSection } from '@/components/AboutSection'
import { AchievementsSection } from '@/components/AchievementsSection'
import { CareerSection } from '@/components/CareerSection'
import { GoatSection } from '@/components/GoatSection'
import { SportSection } from '@/components/SportSection'
import { GallerySection } from '@/components/GallerySection'
import { PartnersSection } from '@/components/PartnersSection'
import { PressSection } from '@/components/PressSection'
import { ContactSection } from '@/components/ContactSection'

export default function Home() {
  return (
    <div
      className="min-h-screen"
      style={{ background: '#08090E', color: '#F1F5F9' }}
    >
      <Navigation />
      <HeroSection />
      <StatsBanner />
      <AboutSection />
      <AchievementsSection />
      <CareerSection />
      <GoatSection />
      <SportSection />
      <GallerySection />
      <PartnersSection />
      <PressSection />
      <ContactSection />
    </div>
  )
}
