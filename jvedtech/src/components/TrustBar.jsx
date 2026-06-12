const STATS = [
  { value: 'Healthcare', label: 'EdTech Focus' },
  { value: 'Medi AI', label: 'Informatics Platform' },
  { value: 'Mumbai', label: 'India HQ' },
  { value: 'Global', label: 'Collaboration Network' },
]

export default function TrustBar() {
  return (
    <section className="relative border-y border-brand-600/10 bg-brand-50">
      <div className="glow-line absolute inset-x-0 top-0 h-px" />
      <div className="section-container grid grid-cols-2 gap-8 py-10 sm:grid-cols-4 sm:gap-4 sm:py-12">
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className={`reveal text-center sm:text-left ${i > 0 ? `reveal-delay-${i}` : ''}`}
          >
            <p className="font-display text-lg font-semibold text-brand-800 sm:text-xl">
              {stat.value}
            </p>
            <p className="mt-1 text-xs uppercase tracking-widest text-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
