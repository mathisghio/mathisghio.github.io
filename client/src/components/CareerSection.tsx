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
          I started competing internationally at age 7 in Optimist class. 
          Registered on France's High Level Athlete list since 2017,
          I built my foundations at AVCR, developing a passion for watersports with windsurfing, that would define the rest of my career.
        </p>
        <div className="mb-8">
          {['International competition from age 7', 'French High level Athlete list (2017)', 'AVCR club windsurfing training'].map((item, i) => (
            <div key={i} className="flex gap-2 items-center text-xs md:text-sm mb-1" style={{ color: 'rgba(148,163,184,0.85)' }}>
              <span style={{ color: '#0EA5E9' }}>✦</span> {item}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img src="" alt="Optimist picture" className={imgShadow} />
          <img src="https://res.cloudinary.com/duacto4ay/image/upload/v1774427172/IMG_3214_Original_q7rood.jpg" alt="Beginning windsurfing" className={imgShadow} />
          <img src="https://res.cloudinary.com/duacto4ay/image/upload/v1774427172/IMG_3214_Original_q7rood.jpg" alt="Funboard frontloop" className={imgShadow} />
        </div>
      </div>
    ),
  },
  {
    title: '2018–21',
    content: (
      <div>
        <p className="font-body text-xs md:text-sm font-normal mb-4" style={{ color: 'rgba(241,245,249,0.75)' }}>
          I began my Olympic windsurfing campaign in 2018 on the RS:X, which transitioned to the iQFoil in 2020. 
          Alongside iQFoil, I discovered wingfoil to further develop my foiling skills, 
          and quickly felt a strong connection to the discipline.
          I then chose to fully commit to wingfoil competition, progressing through national and European events 
          while starting R&D collaborations with my sponsors.
        </p>
        <div className="mb-8">
          {['National wingfoil circuit — top results', 'European debut — immediate podiums', 'R&D partnership with Ozone kicks off', 'Levitaz hydrofoil collaboration begins'].map((item, i) => (
            <div key={i} className="flex gap-2 items-center text-xs md:text-sm mb-1" style={{ color: 'rgba(148,163,184,0.85)' }}>
              <span style={{ color: '#0EA5E9' }}>✦</span> {item}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img src="https://res.cloudinary.com/duacto4ay/image/upload/v1774427164/DSC06512_Original_zwialh.jpg" alt="RS:X_windsurfing_jump" className={imgShadow} />
          <img src="https://res.cloudinary.com/duacto4ay/image/upload/v1774425947/IMG_3046_2030_n9a5eq.jpg" alt="IQFoil jibe" className={imgShadow} />
          <img src="https://res.cloudinary.com/duacto4ay/image/upload/v1774471308/Wing_beginnings_gxn5xh.jpg" alt="Wingfoil beginings" className={imgShadow} />
        </div>
      </div>
    ),
  },
  {
    title: '2022',
    content: (
      <div>
        <p className="font-body text-xs md:text-sm font-normal mb-4" style={{ color: 'rgba(241,245,249,0.75)' }}>
          My breakthrough season, where I won the Wingfoil Racing World Championship and the GWA Race European title,
          marking an important step in my progression.
        </p>
        <div className="mb-8">
          {['🏆 Wingfoil Racing World Champion', '🥇 GWA Race European Champion', '1st place — GWA World Cup'].map((item, i) => (
            <div key={i} className="flex gap-2 items-center text-xs md:text-sm mb-1 font-medium" style={{ color: 'rgba(14,165,233,0.9)' }}>
              {item}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img src="https://res.cloudinary.com/duacto4ay/image/upload/v1774471308/1st_World_Title_hsk2f2.jpg" alt="Racing 2022" className={imgShadow} />
          <img src="https://res.cloudinary.com/duacto4ay/image/upload/v1774471308/1st_World_Title_podium_rokru0.jpg" alt="Podium 2022" className={imgShadow} />
        </div>
      </div>
    ),
  },
  {
    title: '2023',
    content: (
      <div>
        <p className="font-body text-xs md:text-sm font-normal mb-4" style={{ color: 'rgba(241,245,249,0.75)' }}>
          I continued to build consistency at the top level, defending my titles 
          and earning Double Wingfoil Racing World Champion, Formula Wing European Champion, along with three World Cup wins.
        </p>
        <div className="mb-8">
          {['🏆 Double Wingfoil Racing World Champion', '🥇 Double European Champion', '3× 1st at Wingfoil Racing World Cups', '1st at Défi Wing Superstars'].map((item, i) => (
            <div key={i} className="flex gap-2 items-center text-xs md:text-sm mb-1 font-medium" style={{ color: 'rgba(14,165,233,0.9)' }}>
              {item}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img src="https://res.cloudinary.com/duacto4ay/image/upload/v1774471313/3rd_World_Title_iqcsfh.jpg" alt="Racing 1 2023" className={imgShadow} />
          <img src="https://res.cloudinary.com/duacto4ay/image/upload/v1774471498/3rd_World_Title_1_a8drpa.jpg" alt="Racing 2 2023" className={imgShadow} />
          <img src="https://res.cloudinary.com/duacto4ay/image/upload/v1774471313/2nd_World_Title_Podium_vyonqq.jpg" alt="Podium 2023" className={imgShadow} />
        </div>
      </div>
    ),
  },
  {
    title: '2024',
    content: (
      <div>
        <p className="font-body text-xs md:text-sm font-normal mb-4" style={{ color: 'rgba(241,245,249,0.75)' }}>
          A standout season, with a Triple Wingfoil Racing World Champion title,
          Double Formula Wing European Champion, and three additional World Cup victories.
        </p>
        <div className="mb-8">
          {['🏆 Triple Wingfoil Racing World Champion', '🥇 Triple European Champion', '3× 1st at Wingfoil Racing World Cups', '1st at Défi Wing'].map((item, i) => (
            <div key={i} className="flex gap-2 items-center text-xs md:text-sm mb-1 font-medium" style={{ color: 'rgba(14,165,233,0.9)' }}>
              {item}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img src="https://res.cloudinary.com/duacto4ay/image/upload/v1774471313/3rd_World_Title_iqcsfh.jpg" alt="Action 2024" className={imgShadow} />
          <img src="https://res.cloudinary.com/duacto4ay/image/upload/v1774471309/4th_World_Title_podium_p8fzac.jpg" alt="Podium 2024" className={imgShadow} />
        </div>
      </div>
    ),
  },
  {
    title: '2025',
    content: (
      <div>
        <p className="font-body text-xs md:text-sm font-normal mb-3" style={{ color: 'rgba(241,245,249,0.75)' }}>
          My strongest season to date, marking four World Champion titles, 
          a Formula Wing World title, and four European titles.
        </p>
        <p className="font-body text-xs md:text-sm font-normal mb-4" style={{ color: 'rgba(148,163,184,0.7)' }}>
          I'm incredibly grateful for what I've been able to achieve. Multiple years of dedication, hard work,
          and support from my team and sponsors made this possible.
        </p>
        <div className="mb-8">
          {['🏆 Quadruple Wingfoil Racing World Champion', '🏆 Formula Wing World Champion', '🥇 Quadruple European Champion', '2× 1st at Wingfoil Racing World Cups', '1st at Défi Wing'].map((item, i) => (
            <div key={i} className="flex gap-2 items-center text-xs md:text-sm mb-1 font-semibold" style={{ color: 'rgba(245,158,11,0.95)' }}>
              {item}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img src="https://res.cloudinary.com/duacto4ay/image/upload/v1774426748/achievements-bg_ncunhu.jpg" alt="Champion 2025" className={imgShadow} />
          <img src="https://res.cloudinary.com/duacto4ay/image/upload/v1774426876/podium-1_whf6pe.jpg" alt="Beach champion 2025" className={imgShadow} />
          <img src="https://res.cloudinary.com/duacto4ay/image/upload/v1774426735/index-gallery-1_wwaee1.jpg" alt="Racing 2025" className={imgShadow} />
          <img src="https://res.cloudinary.com/duacto4ay/image/upload/v1774426727/index-gallery-2_kvqi4k.jpg" alt="Podium 2 2025" className={imgShadow} />
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
            From a young sailor on the French Riviera to 5× World Champion, my journey is defined by passion,
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
