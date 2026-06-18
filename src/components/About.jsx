import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import SectionHeader from './ui/SectionHeader'
import Reveal from './ui/Reveal'
import TiltCard from './ui/TiltCard'
import useCmsContent from '../hooks/useCmsContent'

const PILLARS = [
  {
    num: '01',
    title: 'Healthcare Excellence',
    description:
      'Delivering educational and care solutions that raise clinical standards and patient outcomes across the healthcare continuum.',
  },
  {
    num: '02',
    title: 'Digital Transformation',
    description:
      'Blending AI, digital strategy, and wellness services to make modern healthcare accessible, actionable, and meaningful.',
  },
  {
    num: '03',
    title: 'People First',
    description:
      'Every program is designed around patient comfort, clinician capability, and compassionate care delivery.',
  },
]

const TEAM_GAP = 24
const TEAM_CARD_HEIGHT = 360

function getVisibleCount(width) {
  if (width >= 1024) return 4
  if (width >= 640) return 2
  return 1
}

function TeamCarousel({ members }) {
  const containerRef = useRef(null)
  const [cardWidth, setCardWidth] = useState(0)
  const [visibleCount, setVisibleCount] = useState(4)
  const [activeIndex, setActiveIndex] = useState(0)

  const maxIndex = Math.max(0, members.length - visibleCount)

  const updateLayout = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const nextVisibleCount = getVisibleCount(container.clientWidth)
    const nextCardWidth =
      (container.clientWidth - TEAM_GAP * (nextVisibleCount - 1)) / nextVisibleCount

    setVisibleCount(nextVisibleCount)
    setCardWidth(nextCardWidth)
    setActiveIndex((current) => Math.min(current, Math.max(0, members.length - nextVisibleCount)))
  }, [members.length])

  useLayoutEffect(() => {
    updateLayout()
  }, [updateLayout])

  useEffect(() => {
    window.addEventListener('resize', updateLayout)
    return () => window.removeEventListener('resize', updateLayout)
  }, [updateLayout])

  const goPrev = () => setActiveIndex((current) => Math.max(0, current - 1))
  const goNext = () => setActiveIndex((current) => Math.min(maxIndex, current + 1))

  return (
    <div className="relative mt-12">
      <button
        type="button"
        onClick={goPrev}
        disabled={activeIndex === 0}
        aria-label="Previous team member"
        className="absolute left-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-green-100 bg-white text-emerald-600 shadow-md transition hover:border-emerald-200 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div ref={containerRef} className="mx-14 overflow-hidden">
        <div
          className="flex gap-6 transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(-${activeIndex * (cardWidth + TEAM_GAP)}px)`,
          }}
        >
          {members.map((member) => (
            <motion.article
              key={member.name}
              data-team-card
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              style={{ width: cardWidth, height: TEAM_CARD_HEIGHT }}
              className="card-premium group flex shrink-0 flex-col p-5 bg-gradient-to-br from-cyan-50 via-green-50 to-emerald-100"
            >
              <div className="flex justify-center">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-28 w-28 rounded-full object-cover object-top"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-cyan-100 via-white to-emerald-100 font-display text-2xl font-bold text-emerald-700 ring-1 ring-white/80">
                    {member.name
                      .split(' ')
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join('')}
                  </div>
                )}
              </div>
              <h3 className="mt-4 min-h-[3rem] text-center text-base font-semibold leading-snug text-foreground">
                {member.name}
              </h3>
              <p className="mt-2 flex-1 text-center text-sm leading-relaxed text-foreground-muted">
                {member.title}
              </p>
              {member.href && member.href !== '#' ? (
              <a
                href={member.href}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center justify-center gap-2 text-sm font-medium text-emerald-600 transition hover:text-brand-500"
              >
                View LinkedIn
                <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                  →
                </span>
              </a>
              ) : null}
            </motion.article>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={goNext}
        disabled={activeIndex >= maxIndex}
        aria-label="Next team member"
        className="absolute right-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-green-100 bg-white text-emerald-600 shadow-md transition hover:border-emerald-200 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  )
}

const HIGHLIGHTS = [
  { value: 'AI', label: 'Driven impact' },
  { value: 'India', label: 'Mumbai headquarters' },
  { value: 'Global', label: 'Healthcare reach' },
]

export default function About() {
  const cmsTeam = useCmsContent('/api/public/team', [])
  const teamMembers = cmsTeam.map((member) => ({
    ...member,
    title: member.title || member.designation,
    href: member.href || member.linkedin || '#',
    image: member.image || member.profileImage || '',
  }))

  return (
    <section id="about" className="section-padding section-surface-blue relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 mesh-gradient opacity-50" />
      <div className="section-container relative">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-start lg:gap-20">
          <Reveal>
            <SectionHeader
              label="About Us"
              title="Empowering Lives with Cutting-Edge Solutions in Education, Wellness, and Technology"
              description="JVEDTECH Medovation is a Mumbai-based healthcare innovation firm focused on healthcare education, home wellness, digital transformation, and AI-enabled healthcare solutions."
            />

            <div className="mt-8 space-y-5 text-foreground-muted">
              <p className="max-w-xl text-base leading-relaxed">
                At JVEDTECH, we are dedicated to advancing the standards of healthcare through our tailored educational services and cutting-edge solutions. Our commitment to learning and development drives our mission to adapt and excel in the dynamic healthcare landscape.
              </p>
              <p className="max-w-xl text-base leading-relaxed">
                JVEDTECH started with the vision of bringing high-quality medical services directly to individuals within the comfort of their homes. This focus on home healthcare reflects our core value of accessibility and patient-centric care.
              </p>
              <p className="max-w-xl text-base leading-relaxed">
                JVEDTECH has successfully served a wide range of clients, including healthcare institutions, professionals, and individuals. Our client-focused approach has enabled us to build lasting relationships and make a meaningful impact in the industry.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {['Our Vision', 'Our Mission', 'Our Values'].map((label, i) => {
                const texts = [
                  'Empowering healthcare professionals and students through technology, we deliver top-notch services to individuals and institutions.',
                  'Revolutionizing healthcare learning with AI-driven insights, enhancing patient-care insights, AI diagnostics, telehealth, and real-time monitoring while driving healthcare advancements through strategic collaborations.',
                  'We focus on quality and innovation, combined with empathy and collaboration, to build solutions that work for people.',
                ]
                return (
                  <TiltCard
                    key={label}
                    depth={7}
                    lift={5}
                    className="card-premium rounded-2xl p-5"
                  >
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
                      {label}
                    </span>
                    <p className="mt-3 text-sm leading-relaxed text-foreground-muted">{texts[i]}</p>
                  </TiltCard>
                )
              })}
            </div>

            <div className="mt-10 flex flex-wrap gap-10 border-t border-brand-100 pt-8">
              {HIGHLIGHTS.map((item) => (
                <div key={item.label}>
                  <p className="font-display text-3xl font-bold text-gradient">{item.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-widest text-muted">{item.label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="space-y-4">
            {PILLARS.map((pillar, i) => (
              <Reveal key={pillar.title} delay={i * 0.1}>
                <TiltCard className="card-premium rounded-2xl p-5" depth={7} lift={5}>
                  <div className="card-shine pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100" />
                  <div className="relative flex items-start justify-between gap-4">
                    <div>
                      <span className="font-display text-xs font-semibold tracking-widest text-brand-500">
                        {pillar.num}
                      </span>
                      <h3 className="mt-2 font-display text-xl font-semibold text-foreground">
                        {pillar.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
                        {pillar.description}
                      </p>
                    </div>
                    <span className="font-display text-4xl font-bold text-brand-100 transition group-hover:text-brand-200">
                      {pillar.num}
                    </span>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="about-video-section mt-24">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <Reveal>
              <div>
                <span className="mb-4 inline-flex rounded-full border border-accent/15 bg-rose-50/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent-dark">
                  Featured Video
                </span>
                <h3 className="font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
                  A closer look at our vision for healthcare learning
                </h3>
                <p className="mt-5 text-base leading-relaxed text-foreground-muted">
                  Explore how JV EdTech brings education, wellness, and technology together through a modern healthcare innovation lens.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="about-video-frame">
                <iframe
                  src="https://www.youtube.com/embed/acEgPBlFZoo"
                  title="JV EdTech video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mt-24">
          <SectionHeader
            label="Meet Our Team"
            title="Talented leaders shaping our healthcare vision"
            description="A strong leadership team with deep healthcare, education, and digital expertise guides our strategy and delivery."
            align="center"
          />

      
          <TeamCarousel members={teamMembers} />
        </div>
      </div>
    </section>
  )
}
