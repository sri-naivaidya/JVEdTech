import { useEffect, useState } from 'react'
import { IconDroplet } from './icons/ServiceIcons'
import Button from './ui/Button'

const LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#achievements', label: 'Impact' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#events', label: 'Events' },
  { href: '#careers', label: 'Careers' },
  { href: '#community', label: 'Community' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('#home')
  const [onDarkHero, setOnDarkHero] = useState(true)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24)
      setOnDarkHero(window.scrollY < window.innerHeight * 0.85)
    }

    const sections = LINKS.map((l) => document.querySelector(l.href)).filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`)
        })
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    sections.forEach((s) => observer.observe(s))

    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const lightNav = scrolled || !onDarkHero

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        lightNav
          ? 'border-b border-brand-600/10 bg-white/95 py-3 shadow-sm shadow-brand-800/5 backdrop-blur-xl'
          : 'bg-transparent py-5'
      }`}
    >
      <nav className="section-container flex items-center justify-between">
        <a
          href="#home"
          className={`group flex items-center gap-2.5 font-display text-base font-bold tracking-[0.15em] sm:text-lg ${
            lightNav ? 'text-brand-800' : 'text-white'
          }`}
        >
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${
              lightNav
                ? 'border-brand-300/50 bg-brand-50 text-brand-600 group-hover:border-brand-400'
                : 'border-white/20 bg-white/10 text-brand-300 group-hover:border-brand-300'
            }`}
          >
            <IconDroplet className="h-3.5 w-2.5" animated />
          </span>
          JV<span className="text-brand-400">EDTECH</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-300 ${
                  active === link.href
                    ? lightNav
                      ? 'bg-brand-100 text-brand-800'
                      : 'bg-white/15 text-white'
                    : lightNav
                      ? 'text-brand-700/70 hover:text-brand-800'
                      : 'text-white/70 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Button
            href="#contact"
            variant={lightNav ? 'primary' : 'on-dark'}
            className="!px-5 !py-2.5 !text-[13px]"
          >
            Get in Touch
          </Button>
        </div>

        <button
          type="button"
          className={`relative flex h-10 w-10 items-center justify-center rounded-full border md:hidden ${
            lightNav
              ? 'border-brand-200 bg-brand-50'
              : 'border-white/20 bg-white/10'
          }`}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`absolute h-0.5 w-4 transition-all ${lightNav ? 'bg-brand-800' : 'bg-white'} ${open ? 'rotate-45' : '-translate-y-1'}`}
          />
          <span
            className={`absolute h-0.5 w-4 transition-all ${lightNav ? 'bg-brand-800' : 'bg-white'} ${open ? 'opacity-0' : ''}`}
          />
          <span
            className={`absolute h-0.5 w-4 transition-all ${lightNav ? 'bg-brand-800' : 'bg-white'} ${open ? '-rotate-45' : 'translate-y-1'}`}
          />
        </button>
      </nav>

      <div
        className={`fixed inset-0 z-40 bg-brand-900/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setOpen(false)}
        aria-hidden
      />

      <div
        className={`glass-strong fixed right-4 top-[4.5rem] z-50 w-[calc(100%-2rem)] max-w-sm rounded-2xl p-6 transition-all duration-300 md:hidden ${
          open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-4 opacity-0'
        }`}
      >
        <ul className="flex flex-col gap-1">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                  active === link.href
                    ? 'bg-brand-100 text-brand-800'
                    : 'text-brand-700 hover:bg-brand-50'
                }`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <Button href="#contact" className="mt-4 w-full" onClick={() => setOpen(false)}>
          Get in Touch
        </Button>
      </div>
    </header>
  )
}
