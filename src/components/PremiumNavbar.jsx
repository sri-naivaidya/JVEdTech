import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from './ui/Button'

const NAV_LINKS = [
  { label: 'Home', sectionId: 'home' },
  { label: 'About', sectionId: 'about' },
  { label: 'Services', sectionId: 'services' },
  { label: 'Events', sectionId: 'events' },
  { label: 'Careers', sectionId: 'careers' },
  { label: 'Community', sectionId: 'community' },
]

const SECTION_IDS = NAV_LINKS.map((link) => link.sectionId)
const NAV_OFFSET = 88

export default function PremiumNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

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
    setActiveSection(sectionId)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-[1000] transition-all duration-300 ${
          isScrolled
            ? 'border-b border-brand-200/40 bg-white/85 py-3 shadow-sm shadow-brand-900/5 backdrop-blur-xl'
            : 'border-b border-transparent bg-white/60 py-4 backdrop-blur-md'
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
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-300 to-green-300 text-sm font-bold text-foreground shadow-md shadow-brand-300/30 transition-transform duration-300 group-hover:scale-105">
              JV
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              JVED<span className="text-gradient">TECH</span>
            </span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.sectionId
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
            <Button href="#community" variant="primary" className="ml-4 px-5 py-2.5 text-xs">
              Join Community
            </Button>
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
                const isActive = activeSection === link.sectionId
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
              <Button href="#community" variant="primary" className="mt-2 w-full">
                Join Community
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
