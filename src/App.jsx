import { Suspense, lazy, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Preloader from './components/Preloader'
import IntegratedPage from './components/IntegratedPage'
import PremiumNavbar from './components/PremiumNavbar'
import Footer from './components/Footer'
import Blogs from './components/Blogs'
import Newsletters from './components/Newsletters'
import Events from './components/Events'
import Resources from './components/Resources'
import BlogArticle from './components/BlogArticle'
import AdminPanel from './components/AdminPanel'
import CustomCursor from './components/CustomCursor'
import useScrollReveal from './hooks/useScrollReveal'
import { scrollToSection } from './utils/scrollToSection'

const NaivaidyaChatbot = lazy(() => import('./components/NaivaidyaAssistant.tsx'))

export default function App() {
  const [loading, setLoading] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)
  const [routePath, setRoutePath] = useState(() => window.location.pathname)

  useScrollReveal([loading])

  useEffect(() => {
    if (loading) return

    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [loading])

  useEffect(() => {
    const onPopState = () => setRoutePath(window.location.pathname)
    const onNavigate = () => setRoutePath(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    window.addEventListener('app:navigate', onNavigate)
    return () => {
      window.removeEventListener('popstate', onPopState)
      window.removeEventListener('app:navigate', onNavigate)
    }
  }, [])

  useEffect(() => {
    const onDocumentClick = (e) => {
      const homeHashAnchor = e.target.closest('a[href^="/#"]')
      if (homeHashAnchor) {
        const href = homeHashAnchor.getAttribute('href')
        const sectionId = href?.slice(2)
        if (!sectionId) return

        e.preventDefault()
        if (window.location.pathname !== '/' || window.location.hash !== `#${sectionId}`) {
          window.history.pushState(null, '', `/#${sectionId}`)
          setRoutePath('/')
          window.dispatchEvent(new CustomEvent('app:navigate'))
        }
        window.setTimeout(() => scrollToSection(sectionId), 60)
        return
      }

      const routeAnchor = e.target.closest('a[href^="/"]')
      if (routeAnchor) {
        const nextPath = routeAnchor.getAttribute('href')
        if (!nextPath || nextPath.startsWith('/#')) return
        e.preventDefault()
        if (nextPath && window.location.pathname !== nextPath) {
          window.history.pushState(null, '', nextPath)
          setRoutePath(nextPath)
          window.dispatchEvent(new CustomEvent('app:navigate'))
        }
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      const anchor = e.target.closest('a[href^="#"]')
      if (!anchor) return

      const sectionId = anchor.getAttribute('href').slice(1)
      if (!sectionId) return

      if (window.location.pathname !== '/' && !document.getElementById(sectionId)) {
        e.preventDefault()
        window.history.pushState(null, '', `/#${sectionId}`)
        setRoutePath('/')
        window.dispatchEvent(new CustomEvent('app:navigate'))
        window.setTimeout(() => scrollToSection(sectionId), 60)
        return
      }

      if (!document.getElementById(sectionId)) return

      e.preventDefault()
      scrollToSection(sectionId)
    }

    document.addEventListener('click', onDocumentClick)
    return () => document.removeEventListener('click', onDocumentClick)
  }, [])

  const CurrentPage =
    routePath.startsWith('/admin')
      ? () => <AdminPanel currentPath={routePath} />
      : routePath === '/resources'
      ? Resources
      : routePath === '/events'
      ? () => <Events standalone />
      : routePath === '/blogs'
        ? Blogs
        : routePath.startsWith('/blogs/')
          ? () => <BlogArticle blogId={routePath.split('/')[2]} />
          : routePath === '/newsletters'
            ? Newsletters
            : IntegratedPage

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      {!loading && !routePath.startsWith('/admin') && <CustomCursor />}
      <div
        className={`app-shell transition-opacity duration-1000 ease-out ${
          loading ? 'pointer-events-none h-screen overflow-hidden opacity-0' : 'opacity-100'
        }`}
      >
        {!loading && (
          <>
            {!routePath.startsWith('/admin') && <PremiumNavbar currentPath={routePath} />}
            <CurrentPage />
            {!routePath.startsWith('/admin') && <Footer />}

            {!routePath.startsWith('/admin') && <motion.button
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
            </motion.button>}

            {!routePath.startsWith('/admin') && chatOpen && (
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
