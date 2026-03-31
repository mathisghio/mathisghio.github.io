import { Timeline } from '@/components/ui/timeline'
import { useInView } from '@/hooks/useInView'
import { SectionHeader } from '@/components/SectionHeader'

/*
 * imgShadow  — pour les images sans zoom (objectPosition seul suffit)
 * imgZoomWrap — div wrapper pour les images zoomées (overflow:hidden requis
 *               pour que le scale ne déborde pas hors du cadre)
 * imgZoomInner — classe de l'img à l'intérieur du wrapper zoom
 */
const SHADOW = 'shadow-[0_0_24px_rgba(34,42,53,0.06),_0_1px_1px_rgba(0,0,0,0.05),_0_0_0_1px_rgba(34,42,53,0.04),_0_0_4px_rgba(34,42,53,0.08),_0_16px_68px_rgba(47,48,55,0.05),_0_1px_0_rgba(255,255,255,0.1)_inset]'
const imgShadow  = `rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full ${SHADOW}`
const imgZoomWrap  = `rounded-lg overflow-hidden h-20 md:h-44 lg:h-60 w-full ${SHADOW}`
const imgZoomInner = 'w-full h-full object-cover'

const timelineData = [
  {
    title: '2007–17',
    content: (
      <div>
        <p className="font-body text-xs md:text-sm font-normal mb-4" style={{ color: 'rgba(241,245,249,0.75)' }}>
          I started competing internationally at age 7 in Optimist class.<br />
          Registered on France's High Level Athlete list since 2017,<br />
          I built my foundations at AVCR, where I developed a passion for watersports and won my first world title <br />
          in the Bic Techno 293 Junior class, a defining step in my career.
        </p>
        <div className="mb-8">
          {['International competition from age 7', 'French High level Athlete list (2017)', 'AVCR club windsurfing training'].map((item, i) => (
            <div key={i} className="flex gap-2 items-center text-xs md:text-sm mb-1" style={{ color: 'rgba(148,163,184,0.85)' }}>
              <span style={{ color: '#0EA5E9' }}>✦</span> {item}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">

          {/* Cadrage tiers supérieur — montre le haut de la voile / skipper */}
          <img
            src="https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1774849109/optimist_sailing_oxryfl.jpg"
            alt="Optimist picture"
            className={imgShadow}
            loading="lazy"
            style={{ objectPosition: 'center 30%' }}
          />

          {/* Zoom 1.3× — centré vers le haut pour montrer le visage */}
          <div className={imgZoomWrap}>
            <img
              src="https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1774849109/windsurfing_start_ahixiw.jpg"
              alt="Beginning windsurfing"
              className={imgZoomInner}
              loading="lazy"
              style={{ transform: 'scale(1.3)', transformOrigin: 'center top' }}
            />
          </div>

          {/* Pas de style particulier */}
          <img
            src="https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1774427172/IMG_3214_Original_q7rood.jpg"
            alt="Funboard frontloop"
            className={imgShadow}
            loading="lazy"
          />

          <img
            src="https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1774849232/Junior_World_Champion_vl4ald.jpg"
            alt="1st World Title windsurfing"
            className={imgShadow}
            loading="lazy"
          />

        </div>
      </div>
    ),
  },
  {
    title: '2018–21',
    content: (
      <div>
        <p className="font-body text-xs md:text-sm font-normal mb-4" style={{ color: 'rgba(241,245,249,0.75)' }}>
          I began my Olympic windsurfing campaign in 2018 on the RS:X, which transitioned to the iQFoil in 2020.<br />
          Alongside iQFoil, I discovered wingfoil to further develop my foiling skills, and quickly felt a strong connection to the discipline.<br />
          I then chose to fully commit to wingfoil competition, progressing through national and European events <br />
          while starting R&D collaborations with my sponsors.
        </p>
        <div className="mb-8">
          {['National wingfoil circuit — top results', 'European debut — immediate podiums', 'R&D partnerships with Levitaz and Forward Wip kicks off'].map((item, i) => (
            <div key={i} className="flex gap-2 items-center text-xs md:text-sm mb-1" style={{ color: 'rgba(148,163,184,0.85)' }}>
              <span style={{ color: '#0EA5E9' }}>✦</span> {item}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">

          <img
            src="https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1774427164/DSC06512_Original_zwialh.jpg"
            alt="RS:X windsurfing jump"
            className={imgShadow}
            loading="lazy"
          />

          <img
            src="https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1774425947/IMG_3046_2030_n9a5eq.jpg"
            alt="IQFoil jibe"
            className={imgShadow}
            loading="lazy"
          />

          {/* Cadrage haut — montre le visage */}
          <img
            src="https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1774471308/Wing_beginnings_gxn5xh.jpg"
            alt="Wingfoil beginnings"
            className={imgShadow}
            loading="lazy"
            style={{ objectPosition: 'center top' }}
          />

          <img
            src="https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1774481055/podium_national_jexlqb.avif"
            alt="Wingfoil first national win"
            className={imgShadow}
            loading="lazy"
          />

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

          {/* Tiers supérieur — évite de couper la tête */}
          <img
            src="https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1774471308/1st_World_Title_hsk2f2.jpg"
            alt="Racing 2022"
            className={imgShadow}
            loading="lazy"
            style={{ objectPosition: 'center 30%' }}
          />

          <img
            src="https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1774471308/1st_World_Title_podium_rokru0.jpg"
            alt="Podium 2022"
            className={imgShadow}
            loading="lazy"
            style={{ objectPosition: 'center 30%' }}
          />

        </div>
      </div>
    ),
  },
  {
    title: '2023',
    content: (
      <div>
        <p className="font-body text-xs md:text-sm font-normal mb-4" style={{ color: 'rgba(241,245,249,0.75)' }}>
          I continued to build consistency at the top level, defending my titles and earning <br />
          Double Wingfoil Racing World Champion, Formula Wing European Champion, along with three World Cup wins.
        </p>
        <div className="mb-8">
          {['🏆 Double Wingfoil Racing World Champion', '🥇 Double European Champion', '3× 1st at Wingfoil Racing World Cups', '1st at Défi Wing Superstars'].map((item, i) => (
            <div key={i} className="flex gap-2 items-center text-xs md:text-sm mb-1 font-medium" style={{ color: 'rgba(14,165,233,0.9)' }}>
              {item}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">

          {/* Tiers inférieur — montre le bas de l'image */}
          <img
            src="https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1774471314/2nd_World_Title_a7dlok.jpg"
            alt="Racing 2023"
            className={imgShadow}
            loading="lazy"
            style={{ objectPosition: 'center 70%' }}
          />

          {/* Zoom 1.3× vers le haut */}
          <div className={imgZoomWrap}>
            <img
              src="https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1774471313/2nd_World_Title_Podium_vyonqq.jpg"
              alt="Podium 2023"
              className={imgZoomInner}
              loading="lazy"
              style={{ transform: 'scale(1.3)', transformOrigin: 'center top' }}
            />
          </div>

        </div>
      </div>
    ),
  },
  {
    title: '2024',
    content: (
      <div>
        <p className="font-body text-xs md:text-sm font-normal mb-4" style={{ color: 'rgba(241,245,249,0.75)' }}>
          A standout season, with a Triple Wingfoil Racing World Champion title, <br />
          Double Formula Wing European Champion, and three additional World Cup victories.
        </p>
        <div className="mb-8">
          {['🏆 Triple Wingfoil Racing World Champion', '🥇 Triple European Champion', '3× 1st at Wingfoil Racing World Cups', '1st at Défi Wing', 'Start of the R&D partnership with Ozone'].map((item, i) => (
            <div key={i} className="flex gap-2 items-center text-xs md:text-sm mb-1 font-medium" style={{ color: 'rgba(14,165,233,0.9)' }}>
              {item}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">

          {/* Zoom léger 1.1× */}
          <div className={imgZoomWrap}>
            <img
              src="https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1774471313/3rd_World_Title_iqcsfh.jpg"
              alt="Podium 2024"
              className={imgZoomInner}
              loading="lazy"
              style={{ transform: 'scale(1.1)' }}
            />
          </div>

          <div className={imgZoomWrap}>
            <img
              src="https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1774471498/3rd_World_Title_1_a8drpa.jpg"
              alt="Trophy 2024"
              className={imgZoomInner}
              loading="lazy"
              style={{ transform: 'scale(1.1)' }}
            />
          </div>

        </div>
      </div>
    ),
  },
  {
    title: '2025',
    content: (
      <div>
        <p className="font-body text-xs md:text-sm font-normal mb-3" style={{ color: 'rgba(241,245,249,0.75)' }}>
          My strongest season to date, marking four World Champion titles, <br />
          a Formula Wing World title, and four European titles.
        </p>
        <p className="font-body text-xs md:text-sm font-normal mb-4" style={{ color: 'rgba(148,163,184,0.7)' }}>
          I'm incredibly grateful for what I've been able to achieve. Multiple years of dedication, hard work, <br />
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

          {/* Zoom 1.2× */}
          <div className={imgZoomWrap}>
            <img
              src="https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1774426748/achievements-bg_ncunhu.jpg"
              alt="Champion 2025"
              className={imgZoomInner}
              loading="lazy"
              style={{ transform: 'scale(1.2)' }}
            />
          </div>

          <div className={imgZoomWrap}>
            <img
              src="https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1774426876/podium-1_whf6pe.jpg"
              alt="Beach champion 2025"
              className={imgZoomInner}
              loading="lazy"
              style={{ transform: 'scale(1.2)' }}
            />
          </div>

          <img
            src="https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1774471309/4th_World_Title_podium_p8fzac.jpg"
            alt="Podium Jeri 2025"
            className={imgShadow}
            loading="lazy"
          />

          <img
            src="https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1774426727/index-gallery-2_kvqi4k.jpg"
            alt="Podium Cagliari 2025"
            className={imgShadow}
            loading="lazy"
          />

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
      <div
        aria-hidden
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: [
            'radial-gradient(ellipse 80% 50% at 10% 20%, rgba(14,165,233,0.10) 0%, transparent 60%)',
            'radial-gradient(ellipse 60% 40% at 90% 80%, rgba(14,165,233,0.07) 0%, transparent 60%)',
            'radial-gradient(ellipse 100% 30% at 50% 50%, rgba(14,165,233,0.05) 0%, transparent 70%)',
          ].join(', '),
        }}
      />

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

      <div className="relative z-10">
        <Timeline data={timelineData} />
      </div>
    </section>
  )
}
