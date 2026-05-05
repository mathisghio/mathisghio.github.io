const items = [
  '5× WORLD CHAMPION',
  '41.40 KTS SPEED RECORD',
  '4× EUROPEAN CHAMPION',
  '10+ WORLD CUP VICTORIES',
  'PUSHING WINGFOIL TO ITS LIMITS',
  'MATERIALS SCIENCE ENGINEERING STUDENT · INSA LYON',
  'FRENCH ELITE ATHLETE',
]

export function StatsBanner() {
  return (
    <div
      className="relative overflow-hidden py-4"
      style={{
        background: 'rgba(14, 165, 233, 0.06)',
        borderTop: '1px solid rgba(14, 165, 233, 0.12)',
        borderBottom: '1px solid rgba(14, 165, 233, 0.12)',
      }}
    >
      <div style={{ display: 'flex', width: 'max-content', animation: 'marquee 30s linear infinite', willChange: 'transform' }}>
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-6 flex-shrink-0 px-6">
            <span
              className="font-display text-sm whitespace-nowrap"
              style={{ color: 'rgba(14, 165, 233, 0.8)', letterSpacing: '0.15em' }}
            >
              {item}
            </span>
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: 'rgba(14, 165, 233, 0.4)' }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
