import { Suspense, lazy, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Preloader from './components/Preloader'
import IntegratedPage from './components/IntegratedPage'
import PremiumNavbar from './components/PremiumNavbar'
import Footer from './components/Footer'
import useScrollReveal from './hooks/useScrollReveal'
import { scrollToSection } from './utils/scrollToSection'

const NaivaidyaChatbot = lazy(() => import('./components/NaivaidyaAssistant.tsx'))

export default function App() {
  const [loading, setLoading] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)

  useScrollReveal([loading])

  useEffect(() => {
    if (loading) return

    window.scrollTo({ top: 0, behavior: 'auto' })
    window.history.replaceState(null, '', window.location.pathname)
  }, [loading])

  useEffect(() => {
    const onDocumentClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]')
      if (!anchor) return

      const sectionId = anchor.getAttribute('href').slice(1)
      if (!sectionId || !document.getElementById(sectionId)) return

      e.preventDefault()
      scrollToSection(sectionId)
    }

    document.addEventListener('click', onDocumentClick)
    return () => document.removeEventListener('click', onDocumentClick)
  }, [])

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      <div
        className={`app-shell transition-opacity duration-1000 ease-out ${
          loading ? 'pointer-events-none h-screen overflow-hidden opacity-0' : 'opacity-100'
        }`}
      >
        {!loading && (
          <>
            <PremiumNavbar />
            <IntegratedPage />
            <Footer />

            <motion.button
              type="button"
              aria-label="Open JVEdTech assistant"
              onClick={() => setChatOpen((prev) => !prev)}
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="fixed bottom-5 right-5 z-[90] flex h-16 w-16 items-center justify-center rounded-full border border-white/70 bg-[linear-gradient(145deg,rgba(125,211,252,0.95),rgba(134,239,172,0.95))] shadow-[0_18px_45px_-18px_rgba(14,165,233,0.75),0_14px_30px_-12px_rgba(52,211,153,0.55)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_24px_55px_-18px_rgba(14,165,233,0.9),0_18px_35px_-12px_rgba(52,211,153,0.7)]"
            >
              <img
                src="/chaat-icon.png"
                alt="JVEdTech assistant"
                className="h-8 w-8 rounded-full object-contain bg-transparent"
              />
            </motion.button>

            {chatOpen && (
              <Suspense fallback={null}>
                <NaivaidyaChatbot onClose={() => setChatOpen(false)} />
              </Suspense>
            )}
          </>
        )}
      </div>
    </>
  )
}
