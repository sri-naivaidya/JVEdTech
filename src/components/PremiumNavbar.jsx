import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from './ui/Button'

const NAV_LINKS = [
  { label: 'Home', sectionId: 'home' },
  { label: 'About', sectionId: 'about' },
  { label: 'Services', sectionId: 'services' },
  { label: 'Careers', sectionId: 'careers' },
  { label: 'Community', sectionId: 'community' },
]

const SECTION_IDS = NAV_LINKS.map((link) => link.sectionId)
const RESOURCE_LINKS = [
  { label: 'Events', href: '/events' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'Newsletters', href: '/newsletters' },
]
const NAV_OFFSET = 88

export default function PremiumNavbar({ currentPath = '/', onAdminOpen }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [resourcesOpen, setResourcesOpen] = useState(false)

  const updateActiveSection = useCallback(() => {
    const scrollPos = window.scrollY + NAV_OFFSET

    let current = 'home'
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id)
      if (!el) continue
      if (el.offsetTop <= scrollPos) {
        current = id
      }
    }

    setActiveSection(current)
  }, [])

  useEffect(() => {
    const scrollHandler = () => {
      setIsScrolled(window.scrollY > 20)
      updateActiveSection()
    }

    scrollHandler()
    window.addEventListener('scroll', scrollHandler, { passive: true })
    return () => window.removeEventListener('scroll', scrollHandler)
  }, [updateActiveSection])

  useEffect(() => {
    updateActiveSection()
  }, [updateActiveSection])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const handleNavClick = (sectionId) => {
    setIsMobileMenuOpen(false)
    setResourcesOpen(false)
    setActiveSection(sectionId)
  }

  const navigateToResources = () => {
    setResourcesOpen(false)
    setIsMobileMenuOpen(false)
    if (window.location.pathname !== '/resources') {
      window.history.pushState(null, '', '/resources')
      window.dispatchEvent(new CustomEvent('app:navigate'))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const activeResource = RESOURCE_LINKS.find((link) => (
    link.href === currentPath || (link.href === '/blogs' && currentPath.startsWith('/blogs/'))
  ))

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-[1000] transition-all duration-300 ${
          isScrolled
            ? 'border-b border-white/70 bg-white/82 py-3 shadow-[0_18px_55px_-34px_rgba(14,165,233,0.65)] backdrop-blur-2xl'
            : 'border-b border-transparent bg-white/62 py-4 shadow-[0_18px_60px_-46px_rgba(14,165,233,0.42)] backdrop-blur-xl'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="section-container flex items-center justify-between">
          <a
            href="#home"
            onClick={() => handleNavClick('home')}
            className="group flex items-center gap-3 no-underline"
          >
            <img
              src="/jvedtech-logo.png"
              alt="JV EdTech"
              className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              JVED<span className="text-gradient">TECH</span>
            </span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const isActive = currentPath === '/' && activeSection === link.sectionId
              return (
                <a
                  key={link.label}
                  href={`#${link.sectionId}`}
                  onClick={() => handleNavClick(link.sectionId)}
                  className={`relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-foreground'
                      : 'text-foreground-muted hover:text-foreground'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-brand-100/80"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </a>
              )
            })}
            <div
              className="relative"
              onMouseEnter={() => setResourcesOpen(true)}
              onMouseLeave={() => setResourcesOpen(false)}
            >
              <button
                type="button"
                onFocus={() => setResourcesOpen(true)}
                onClick={navigateToResources}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 hover:text-foreground ${
                  currentPath === '/resources' || currentPath === '/events' || currentPath === '/blogs' || currentPath === '/newsletters'
                    ? 'bg-brand-100/80 text-foreground'
                    : 'text-foreground-muted'
                }`}
                aria-expanded={resourcesOpen}
                aria-haspopup="true"
              >
                {activeResource?.label || 'Resources'}
              </button>
              <AnimatePresence>
                {resourcesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute left-1/2 top-full mt-3 w-72 -translate-x-1/2 overflow-hidden rounded-[1.4rem] border border-white/80 bg-white/88 p-2.5 shadow-[0_28px_80px_-28px_rgba(14,165,233,0.48),0_16px_44px_-34px_rgba(251,113,133,0.55)] backdrop-blur-2xl"
                  >
                    {RESOURCE_LINKS.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        onClick={() => {
                          setResourcesOpen(false)
                        }}
                        className={`group relative block overflow-hidden rounded-2xl px-4 py-3.5 text-sm font-semibold transition hover:bg-gradient-to-r hover:from-brand-50 hover:via-green-50 hover:to-rose-50 hover:text-foreground hover:shadow-sm ${
                          currentPath === link.href || (link.href === '/blogs' && currentPath.startsWith('/blogs/'))
                            ? 'bg-gradient-to-r from-brand-50 via-green-50 to-rose-50 text-foreground shadow-sm'
                            : 'text-foreground-muted'
                        }`}
                      >
                        <span className="absolute left-3 top-1/2 h-7 w-1 -translate-y-1/2 rounded-full bg-accent opacity-0 transition group-hover:opacity-100" />
                        <span className="relative ml-3">{link.label}</span>
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Button href="#community" variant="primary" className="ml-4 px-5 py-2.5 text-xs">
              Join Community
            </Button>
            <button
              type="button"
              onClick={onAdminOpen}
              className="ml-2 rounded-full border border-brand-200/70 bg-white/78 px-4 py-2.5 text-xs font-bold text-foreground shadow-[0_14px_34px_-24px_rgba(14,165,233,0.55)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-green-200 hover:bg-gradient-to-r hover:from-brand-50 hover:via-white hover:to-green-50 hover:shadow-[0_20px_44px_-26px_rgba(20,184,166,0.58)]"
            >
              Admin
            </button>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-200/60 bg-white/80 text-foreground transition hover:bg-brand-50 md:hidden"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-[72px] z-[999] border-b border-brand-200/40 bg-white/95 p-4 shadow-lg backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = currentPath === '/' && activeSection === link.sectionId
                return (
                  <a
                    key={link.label}
                    href={`#${link.sectionId}`}
                    onClick={() => handleNavClick(link.sectionId)}
                    className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? 'bg-brand-100 text-foreground'
                        : 'text-foreground-muted hover:bg-brand-50 hover:text-foreground'
                    }`}
                  >
                    {link.label}
                  </a>
                )
              })}
              <div className="mt-2 rounded-2xl border border-brand-100 bg-white/70 p-2">
                <a
                  href="/resources"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-600"
                >
                  Resources
                </a>
                {RESOURCE_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                    }}
                    className={`block rounded-xl px-3 py-3 text-sm font-medium transition hover:bg-gradient-to-r hover:from-brand-50 hover:to-rose-50 hover:text-foreground ${
                      currentPath === link.href || (link.href === '/blogs' && currentPath.startsWith('/blogs/')) ? 'bg-brand-50 text-foreground' : 'text-foreground-muted'
                    }`}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <Button href="#community" variant="primary" className="mt-2 w-full">
                Join Community
              </Button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  onAdminOpen?.()
                }}
                className="mt-2 rounded-xl border border-brand-200/70 bg-white/85 px-4 py-3 text-sm font-bold text-foreground shadow-sm transition hover:bg-brand-50"
              >
                Admin Login
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
