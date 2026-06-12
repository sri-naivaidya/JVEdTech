import { IconDroplet } from './icons/ServiceIcons'
import { CONTACT_INFO } from '../data/content'
import Reveal from './ui/Reveal'

const FOOTER_LINKS = [
  {
    title: 'Navigation',
    links: [
      { label: 'Home', href: '#home' },
      { label: 'About', href: '#about' },
      { label: 'Services', href: '#services' },
      { label: 'Events', href: '#events' },
      { label: 'Careers', href: '#careers' },
      { label: 'Community', href: '#community' },
    ],
  },
  {
    title: 'Our Services',
    links: [
      { label: 'EduGlobe', href: '#services' },
      { label: 'Digital Ads Pro', href: '#services' },
      { label: 'Medi AI Informatics', href: '#initiatives' },
      { label: 'In-Home Wellness', href: '#services' },
      { label: 'Holistic Wellbeing', href: '#services' },
      { label: 'Leadership Programs', href: '#services' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '#' },
      { label: 'Newsroom', href: '#' },
      { label: 'Webinars', href: '#events' },
      { label: 'Careers', href: '#careers' },
      { label: 'Community', href: '#community' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-surface-dark pt-16 pb-8">
      <div className="section-container">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
          <Reveal className="sm:col-span-2 lg:col-span-2">
            <a
              href="#home"
              className="group flex items-center gap-3 font-display text-lg font-bold tracking-tight text-white no-underline"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-300/20 to-green-300/20 text-brand-300 ring-1 ring-white/10 transition group-hover:scale-105">
                <IconDroplet className="h-3.5 w-2.5" animated />
              </span>
              JV<span className="text-gradient">EDTECH</span>
            </a>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              Where compassion meets technology — redefining global healthcare learning.
            </p>
            <div className="mt-6 flex gap-3">
              <span className="rounded-full bg-brand-300/10 px-3 py-1 text-xs font-medium text-brand-300">
                Healthcare
              </span>
              <span className="rounded-full bg-green-300/10 px-3 py-1 text-xs font-medium text-green-300">
                Education
              </span>
              <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent-light">
                AI Innovation
              </span>
            </div>
          </Reveal>

          {FOOTER_LINKS.map((group, i) => (
            <Reveal key={group.title} delay={i * 0.05}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-300/80">
                {group.title}
              </p>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-white/60 transition hover:text-brand-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}

          <Reveal delay={0.15}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-300/80">
              Get in Touch
            </p>
            <ul className="mt-4 space-y-3 text-sm text-white/60">
              <li>
                <a href={`mailto:${CONTACT_INFO.email}`} className="transition hover:text-brand-300">
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`}
                  className="transition hover:text-brand-300"
                >
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li className="text-xs text-white/40">{CONTACT_INFO.address}</li>
              <li className="mt-3 border-t border-white/10 pt-3">
                <a
                  href={CONTACT_INFO.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-semibold text-brand-300 transition hover:text-brand-200"
                >
                  <span>Join WhatsApp Community</span>
                  <span>→</span>
                </a>
              </li>
            </ul>
          </Reveal>
        </div>

        <div className="glow-line mt-14 h-px w-full opacity-60" />

        <div className="mt-8 flex flex-col items-center justify-between gap-4 text-center text-xs text-white/40 sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} JV EdTech Medovation. All rights reserved.</p>
          <p className="uppercase tracking-[0.25em] text-brand-300/60">
            Compassion · Technology · Innovation
          </p>
        </div>
      </div>
    </footer>
  )
}
