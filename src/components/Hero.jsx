import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Button from './ui/Button'

const STATS = [
  { value: '2024', label: 'Founded with vision' },
  { value: 'AI+', label: 'Medi AI Informatics' },
  { value: 'Global', label: 'Healthcare reach' },
  { value: '100%', label: 'Patient-centered' },
]

export default function Hero() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.hero-eyebrow', { opacity: 0, y: 16, duration: 0.7, delay: 0.15 })
        .from('.hero-line', { scaleX: 0, duration: 0.8 }, 0.25)
        .from('.hero-title', { opacity: 0, y: 48, duration: 1 }, 0.35)
        .from('.hero-sub', { opacity: 0, y: 24, duration: 0.85 }, 0.55)
        .from('.hero-cta > *', { opacity: 0, y: 20, duration: 0.7, stagger: 0.1 }, 0.7)
        .from('.hero-stat', { opacity: 0, y: 32, duration: 0.75, stagger: 0.08 }, 0.85)
        .from('.hero-scroll', { opacity: 0, duration: 0.6 }, 1.1)
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="home"
      ref={sectionRef}
      className="section-dark relative flex min-h-screen items-center overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 mesh-gradient-dark" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0f4d3a_75%)]" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="section-container relative z-10 grid gap-16 pb-24 pt-32 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12 lg:pb-28 lg:pt-36">
        <div>
          <div className="hero-eyebrow mb-8 flex items-center gap-4">
            <span className="hero-line h-px w-12 origin-left bg-gradient-to-r from-brand-300 to-transparent" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-300">
              Healthcare Innovation
            </span>
          </div>

          <h1 className="hero-title font-display text-[2.6rem] font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
            Redefining Global{' '}
            <span className="text-gradient">Healthcare Learning</span>
          </h1>

          <p className="hero-sub mt-7 max-w-lg text-base leading-[1.75] text-white/75 sm:text-lg">
            JV EdTech Medovation bridges compassion and technology — empowering
            professionals through AI-driven education, clinical informatics, and
            digital health innovation.
          </p>

          <div className="hero-cta mt-10 flex flex-wrap items-center gap-4">
            <Button href="#initiatives" variant="light">
              Explore Medi AI
            </Button>
            <Button href="#about" variant="on-dark">
              Learn More
            </Button>
          </div>
        </div>

        <div className="hero-stat grid grid-cols-2 gap-3 sm:gap-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="glass-dark group relative overflow-hidden rounded-2xl p-5 transition duration-500 hover:border-brand-300/40 sm:p-6"
            >
              <div className="card-shine-dark pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100" />
              <p className="relative font-display text-2xl font-bold text-brand-300 sm:text-3xl">
                {stat.value}
              </p>
              <p className="relative mt-2 text-xs leading-snug text-white/65 sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <a
        href="#about"
        className="hero-scroll absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white/50 transition hover:text-brand-300"
        aria-label="Scroll to about"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <span className="flex h-9 w-5 justify-center rounded-full border border-white/25 p-1">
          <span className="h-1.5 w-1 animate-bounce rounded-full bg-brand-300" />
        </span>
      </a>
    </section>
  )
}
