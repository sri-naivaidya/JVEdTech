import Button from './ui/Button'
import SectionHeader from './ui/SectionHeader'

const FEATURES = [
  'AI-powered clinical insights',
  'Accessible patient-centered tools',
  'Training for healthcare professionals',
  'India-focused digital health solutions',
]

const METRICS = [
  { label: 'Clinical AI', value: 85 },
  { label: 'Education', value: 92 },
  { label: 'Accessibility', value: 78 },
]

export default function Initiatives() {
  return (
    <section id="initiatives" className="section-padding section-light">
      <div className="section-container">
        <div className="reveal relative overflow-hidden rounded-3xl border border-brand-600/15 bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 p-8 sm:p-10 lg:p-14">
          <div className="pointer-events-none absolute inset-0 mesh-gradient-dark opacity-70" />

          <div className="relative grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <SectionHeader
                label="Flagship Initiative"
                title="Medi AI Informatics"
                description="Advancing healthcare innovation through AI — smarter, more accessible, patient-centered solutions across India."
                dark
              />

              <ul className="mt-8 space-y-4">
                {FEATURES.map((feature, i) => (
                  <li
                    key={feature}
                    className={`reveal reveal-delay-${i + 1} flex items-center gap-4 text-sm text-white/85`}
                  >
                    <span className="icon-check-wrap flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-brand-300/40 bg-brand-300/15">
                      <svg
                        className="icon-check h-3 w-3 text-brand-300"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          className="icon-check-path"
                          d="M2 6l3 3 5-5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          pathLength="1"
                          strokeDasharray="1"
                          strokeDashoffset="1"
                        />
                      </svg>
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-10">
                <Button href="#contact" variant="light">
                  Partner With Us
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="glass-dark relative overflow-hidden rounded-2xl p-8 sm:p-10">
                <div className="card-shine-dark pointer-events-none absolute inset-0" />
                <div className="relative">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-300">
                    Platform
                  </p>
                  <p className="mt-2 font-display text-6xl font-bold text-gradient sm:text-7xl">
                    AI
                  </p>
                  <p className="mt-1 text-sm text-white/65">Medi AI Informatics</p>

                  <div className="mt-10 space-y-5">
                    {METRICS.map((metric) => (
                      <div key={metric.label}>
                        <div className="mb-2 flex justify-between text-xs">
                          <span className="text-white/65">{metric.label}</span>
                          <span className="font-medium text-brand-300">{metric.value}%</span>
                        </div>
                        <div className="h-1 overflow-hidden rounded-full bg-white/15">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-brand-300 to-brand-400"
                            style={{ width: `${metric.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="mt-8 text-xs leading-relaxed text-white/55">
                    Building a resilient, accessible, patient-centered digital future
                    for healthcare in India.
                  </p>
                </div>
              </div>

              <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-brand-300/25 blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
