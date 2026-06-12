import { motion } from 'framer-motion'
import SectionHeader from './ui/SectionHeader'
import Reveal from './ui/Reveal'

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

const TEAM_MEMBERS = [
  {
    name: 'Dr. Jyoti Rao',
    title: 'Co-Founder & CEO',
    href: 'https://www.linkedin.com/in/dr-jyoti-dongre-rao-11520726/',
  },
  {
    name: 'Ms. Marilyn Olivera',
    title: 'Director Clinical Education and Operations',
    href: 'https://www.linkedin.com/in/marilynolivera/',
  },
  {
    name: 'Mr. Dinesh Kamble',
    title: 'Board of Director',
    href: 'https://www.linkedin.com/in/dinesh-k-a409a06b/',
  },
  {
    name: 'Ms. Vinita Deopurkar',
    title: 'Associate - Clinical Education',
    href: 'https://www.linkedin.com/in/vinita-suresh-deopurkar-526a7424/',
  },
]

const HIGHLIGHTS = [
  { value: 'AI', label: 'Driven impact' },
  { value: 'India', label: 'Mumbai headquarters' },
  { value: 'Global', label: 'Healthcare reach' },
]

export default function About() {
  return (
    <section id="about" className="section-padding relative overflow-hidden bg-gradient-to-br from-green-50 via-cyan-50 to-emerald-100">
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
                  <motion.div
                    key={label}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.25 }}
                    className="card-premium rounded-2xl p-5 bg-gradient-to-br from-green-50 via-emerald-50 to-cyan-50 border border-green-100"
                  >
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
                      {label}
                    </span>
                    <p className="mt-3 text-sm leading-relaxed text-foreground-muted">{texts[i]}</p>
                  </motion.div>
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
                <motion.article
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.25 }}
                  className="card-premium rounded-2xl p-5 bg-gradient-to-br from-green-50 via-cyan-50 to-emerald-100"
                >
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
                </motion.article>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-24">
          <SectionHeader
            label="Meet Our Team"
            title="Talented leaders shaping our healthcare vision"
            description="A strong leadership team with deep healthcare, education, and digital expertise guides our strategy and delivery."
            align="center"
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {TEAM_MEMBERS.map((member, i) => (
              <Reveal key={member.name} delay={i * 0.08}>
                <motion.article
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="card-premium group p-6 bg-gradient-to-br from-cyan-50 via-green-50 to-emerald-100"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-100 to-green-100 text-sm font-bold text-emerald-600">
                    {member.name.split(' ').slice(-1)[0][0]}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                  <p className="mt-2 text-sm text-foreground-muted">{member.title}</p>
                  <a
                    href={member.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-emerald-600 transition hover:text-brand-500"
                  >
                    View LinkedIn
                    <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                      →
                    </span>
                  </a>
                </motion.article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
