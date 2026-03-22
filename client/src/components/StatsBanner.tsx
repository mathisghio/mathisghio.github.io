const items = [
  '5× WORLD CHAMPION',
  '41.40 KTS SPEED RECORD',
  '4× EUROPEAN CHAMPION',
  '10+ WORLD CUP VICTORIES',
  'GREATEST WINGFOILER OF ALL TIME',
  '77 KM/H TOP SPEED',
  'INSA LYON ENGINEER',
  'FRENCH ELITE ATHLETE',
]

export function StatsBanner() {
  const doubled = [...items, ...items]

  return (
    <div
      className="relative overflow-hidden py-4"
      style={{
        background: 'rgba(14, 165, 233, 0.06)',
        borderTop: '1px solid rgba(14, 165, 233, 0.12)',
        borderBottom: '1px solid rgba(14, 165, 233, 0.12)',
      }}
    >
      <div className="flex" style={{ animation: 'marquee 30s linear infinite' }}>
        {doubled.map((item, i) => (
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
