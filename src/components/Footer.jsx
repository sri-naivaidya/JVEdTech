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
      { label: 'Careers', href: '#careers' },
      { label: 'Community', href: '#community' },
    ],
  },
  {
    title: 'Our Services',
    links: [
      { label: 'EduGlobe', href: '#services' },
      { label: 'Digital Ads Pro', href: '#services' },
      { label: 'Medi AI Informatics', href: '#services' },
      { label: 'In-Home Wellness', href: '#services' },
      { label: 'Holistic Wellbeing', href: '#services' },
      { label: 'Leadership Programs', href: '#services' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Events', href: '/events' },
      { label: 'Blogs', href: '/blogs' },
      { label: 'Newsletters', href: '/newsletters' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/70 bg-white/75 pt-16 pb-8 shadow-[0_-24px_90px_-70px_rgba(14,165,233,0.55)] backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-0 mesh-gradient opacity-25" />
      <div className="section-container relative">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
          <Reveal className="sm:col-span-2 lg:col-span-2">
            <a
              href="#home"
              className="group flex items-center gap-3 font-display text-lg font-bold tracking-tight text-foreground no-underline"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-100 to-green-100 text-brand-600 ring-1 ring-white/80 transition group-hover:scale-105">
                <IconDroplet className="h-3.5 w-2.5" animated />
              </span>
              JV<span className="text-gradient">EDTECH</span>
            </a>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-foreground-muted">
              Where compassion meets technology {'\u2014'} redefining global healthcare learning.
            </p>
            <div className="mt-6 flex gap-3">
              <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
                Healthcare
              </span>
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                Education
              </span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-accent-dark">
                AI Innovation
              </span>
            </div>
          </Reveal>

          {FOOTER_LINKS.map((group, i) => (
            <Reveal key={group.title} delay={i * 0.05}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-600">
                {group.title}
              </p>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-foreground-muted transition hover:text-brand-600"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}

          <Reveal delay={0.15}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-600">
              Get in Touch
            </p>
            <ul className="mt-4 space-y-3 text-sm text-foreground-muted">
              <li>
                <a href={`mailto:${CONTACT_INFO.email}`} className="transition hover:text-brand-600">
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`}
                  className="transition hover:text-brand-600"
                >
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li className="text-xs text-muted">{CONTACT_INFO.address}</li>
              <li className="mt-3 border-t border-brand-100 pt-3">
                <a
                  href={CONTACT_INFO.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-semibold text-brand-700 transition hover:text-brand-500"
                >
                  <span>Join WhatsApp Community</span>
                  <span>{'\u2192'}</span>
                </a>
              </li>
            </ul>
          </Reveal>
        </div>

        <div className="glow-line mt-14 h-px w-full opacity-60" />

        <div className="mt-8 flex flex-col items-center justify-between gap-4 text-center text-xs text-muted sm:flex-row sm:text-left">
          <p>{'\u00A9'} {new Date().getFullYear()} JV EdTech Medovation. All rights reserved.</p>
          <p className="uppercase tracking-[0.25em] text-brand-600/70">
            Compassion {'\u00B7'} Technology {'\u00B7'} Innovation
          </p>
        </div>
      </div>
    </footer>
  )
}
