import { InteractiveWaves } from './InteractiveWaves'
import { Timeline } from '@/components/ui/timeline'
import { useInView } from '@/hooks/useInView'
import { SectionHeader } from '@/components/SectionHeader'

const imgShadow =
  'rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,42,53,0.06),_0_1px_1px_rgba(0,0,0,0.05),_0_0_0_1px_rgba(34,42,53,0.04),_0_0_4px_rgba(34,42,53,0.08),_0_16px_68px_rgba(47,48,55,0.05),_0_1px_0_rgba(255,255,255,0.1)_inset]'

const timelineData = [
  {
    title: '2007–17',
    content: (
      <div>
        <p className="font-body text-xs md:text-sm font-normal mb-4" style={{ color: 'rgba(241,245,249,0.75)' }}>
          I started competing internationally at age 7. Registered on France's Elite Athlete list since 2017,
          I built my foundations at AVCR, developing a passion for watersports that would define my career.
        </p>
        <div className="mb-8">
          {['International competition from age 7', 'French Elite Athlete list (2017)', 'AVCR club — multidiscipline training'].map((item, i) => (
            <div key={i} className="flex gap-2 items-center text-xs md:text-sm mb-1" style={{ color: 'rgba(148,163,184,0.85)' }}>
              <span style={{ color: '#0EA5E9' }}>✦</span> {item}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663455151996/gejRxzH8i7adBy6yjBjf3b/about-water_efffaf99.JPG" alt="Mathis jeune athlète" className={imgShadow} />
          <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663455151996/gejRxzH8i7adBy6yjBjf3b/portrait_eau_fcd69e14.JPG" alt="Portrait eau" className={imgShadow} />
        </div>
      </div>
    ),
  },
  {
    title: '2018–21',
    content: (
      <div>
        <p className="font-body text-xs md:text-sm font-normal mb-4" style={{ color: 'rgba(241,245,249,0.75)' }}>
          I discovered wingfoil and immediately felt a deep connection to the sport. I progressed rapidly through
          national and European competitions, beginning R&D collaboration with Ozone.
        </p>
        <div className="mb-8">
          {['National wingfoil circuit — top results', 'European debut — immediate podiums', 'R&D partnership with Ozone kicks off', 'Levitaz hydrofoil collaboration begins'].map((item, i) => (
            <div key={i} className="flex gap-2 items-center text-xs md:text-sm mb-1" style={{ color: 'rgba(148,163,184,0.85)' }}>
              <span style={{ color: '#0EA5E9' }}>✦</span> {item}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663455151996/gejRxzH8i7adBy6yjBjf3b/index-gallery-2_397d8419.JPG" alt="Wingfoil action" className={imgShadow} />
          <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663455151996/gejRxzH8i7adBy6yjBjf3b/index-gallery-3_1c7dc267.JPG" alt="Competition" className={imgShadow} />
        </div>
      </div>
    ),
  },
  {
    title: '2022',
    content: (
      <div>
        <p className="font-body text-xs md:text-sm font-normal mb-4" style={{ color: 'rgba(241,245,249,0.75)' }}>
          My breakthrough season. I claimed the Wingfoil Racing World Championship and the GWA Race European title —
          announcing my arrival at the absolute top of the sport.
        </p>
        <div className="mb-8">
          {['🏆 Wingfoil Racing World Champion', '🥇 GWA Race European Champion', '1st place — GWA World Cup'].map((item, i) => (
            <div key={i} className="flex gap-2 items-center text-xs md:text-sm mb-1 font-medium" style={{ color: 'rgba(14,165,233,0.9)' }}>
              {item}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663455151996/gejRxzH8i7adBy6yjBjf3b/index-gallery-4_27ccf7aa.JPG" alt="Podium 2022" className={imgShadow} />
          <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663455151996/gejRxzH8i7adBy6yjBjf3b/index-gallery-5_2015d9ef.JPG" alt="Racing 2022" className={imgShadow} />
        </div>
      </div>
    ),
  },
  {
    title: '2023',
    content: (
      <div>
        <p className="font-body text-xs md:text-sm font-normal mb-4" style={{ color: 'rgba(241,245,249,0.75)' }}>
          I defended and expanded my titles — Double World Champion, Formula Wing European Champion,
          and three World Cup victories. My dominance became undeniable.
        </p>
        <div className="mb-8">
          {['🏆 Double Wingfoil Racing World Champion', '🥇 Formula Wing European Champion', '3× 1st at Wingfoil Racing World Cups', '1st at Défi Wing Superstars'].map((item, i) => (
            <div key={i} className="flex gap-2 items-center text-xs md:text-sm mb-1 font-medium" style={{ color: 'rgba(14,165,233,0.9)' }}>
              {item}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663455151996/gejRxzH8i7adBy6yjBjf3b/index-gallery-6_19d7f02b.JPG" alt="Racing 2023" className={imgShadow} />
          <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663455151996/gejRxzH8i7adBy6yjBjf3b/index-gallery-7_9dcd6816.JPG" alt="Podium 2023" className={imgShadow} />
        </div>
      </div>
    ),
  },
  {
    title: '2024',
    content: (
      <div>
        <p className="font-body text-xs md:text-sm font-normal mb-4" style={{ color: 'rgba(241,245,249,0.75)' }}>
          An extraordinary season. Triple Wingfoil Racing World Champion, Double Formula Wing European Champion,
          three more World Cup wins. Total mastery of the discipline.
        </p>
        <div className="mb-8">
          {['🏆 Triple Wingfoil Racing World Champion', '🥇 Double Formula Wing European Champion', '3× 1st at Wingfoil Racing World Cups', '1st at Défi Wing'].map((item, i) => (
            <div key={i} className="flex gap-2 items-center text-xs md:text-sm mb-1 font-medium" style={{ color: 'rgba(14,165,233,0.9)' }}>
              {item}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663455151996/gejRxzH8i7adBy6yjBjf3b/index-gallery-1_31f119eb.jpg" alt="Action 2024" className={imgShadow} />
          <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663455151996/gejRxzH8i7adBy6yjBjf3b/podium-main_ca0aec18.JPG" alt="Podium 2024" className={imgShadow} />
        </div>
      </div>
    ),
  },
  {
    title: '2025',
    content: (
      <div>
        <p className="font-body text-xs md:text-sm font-normal mb-3" style={{ color: 'rgba(241,245,249,0.75)' }}>
          The most dominant season in wingfoil history. Quadruple World Champion, Formula Wing World Champion,
          Triple European Champion. The GOAT season.
        </p>
        <p className="font-body text-xs md:text-sm font-normal mb-4" style={{ color: 'rgba(148,163,184,0.7)' }}>
          I'm incredibly grateful for what I've been able to achieve — years of dedication, hard work,
          and support from my team and sponsors made this possible.
        </p>
        <div className="mb-8">
          {['🏆 Quadruple Wingfoil Racing World Champion', '🏆 Formula Wing World Champion', '🥇 Triple Formula Wing European Champion', '2× 1st at Wingfoil Racing World Cups', '1st at Défi Wing'].map((item, i) => (
            <div key={i} className="flex gap-2 items-center text-xs md:text-sm mb-1 font-semibold" style={{ color: 'rgba(245,158,11,0.95)' }}>
              {item}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663455151996/gejRxzH8i7adBy6yjBjf3b/hero-main_cc5a0cb5.JPG" alt="Champion 2025" className={imgShadow} />
          <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663455151996/gejRxzH8i7adBy6yjBjf3b/podium-main_ca0aec18.JPG" alt="Podium 2025" className={imgShadow} />
          <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663455151996/gejRxzH8i7adBy6yjBjf3b/index-gallery-1_31f119eb.jpg" alt="Racing 2025" className={imgShadow} />
          <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663455151996/gejRxzH8i7adBy6yjBjf3b/index-gallery-4_27ccf7aa.JPG" alt="Action 2025" className={imgShadow} />
        </div>
      </div>
    ),
  },
]

export function CareerSection() {
  const { ref: headerRef, inView } = useInView(0.05)

  return (
    <section
      id="career"
      className="relative"
      style={{ background: '#08090E', isolation: 'isolate' }}
    >
      {/* Wave background — absolute inset-0 = bounded to this section only */}
      <div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{ opacity: 0.6 }}
      >
        <InteractiveWaves
          strokeColor="rgba(14,165,233,0.4)"
          backgroundColor="transparent"
          pointerSize={1}
        />
      </div>

      {/* Section header */}
      <div className="container relative z-10 pt-24 lg:pt-36" ref={headerRef}>
        <div
          className="mb-0 transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)' }}
        >
          <SectionHeader label="MY CAREER HISTORY" line1="MY JOURNEY" line2="TO THE TOP" className="mb-6" />
          <p className="font-body text-sm md:text-base max-w-sm" style={{ color: 'rgba(148,163,184,0.7)', lineHeight: 1.7 }}>
            From a young sailor on the French Riviera to 5× World Champion — a journey defined by passion,
            dedication, and an insatiable drive to push wingfoil to its limits.
          </p>
        </div>
      </div>

      {/* Timeline — transparent background lets waves show through */}
      <div className="relative z-10">
        <Timeline data={timelineData} />
      </div>
    </section>
  )
}
