import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import Button from './ui/Button'

const USE_VIDEO_BACKGROUND = true
const HERO_VIDEO_SRC = '/bg-video.mp4'

const headingWords = [
  { text: 'Redefining Global', className: 'text-white drop-shadow-2xl' },
  {
    text: 'Healthcare Learning.',
    className: 'text-gradient-accent drop-shadow-2xl',
  },
  {
    text: 'Where compassion meets technology.',
    className: 'italic text-white/90 drop-shadow-xl',
  },
]

export default function HomeScreen() {
  const sectionRef = useRef(null)
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !USE_VIDEO_BACKGROUND) return

    video.muted = true
    const playVideo = () => {
      video.play().catch(() => {})
    }

    playVideo()
    video.addEventListener('loadeddata', playVideo)

    return () => video.removeEventListener('loadeddata', playVideo)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: [0.22, 1, 0.36, 1] } })

      tl.from('.hero-content', { opacity: 0, duration: 1.2 })
        .from('.hero-badge', { opacity: 0, y: 16, duration: 0.55 }, 0.2)
        .from('.hero-word', {
  opacity: 0,
  x: -200,
  duration: 2.5,
  stagger: 0.4,
  ease: 'expo.out'
}, 0.8)
        .from('.hero-sub', {
  opacity: 0,
  x: -120,
  duration: 2,
  ease: 'expo.out'
}, 2.2)
        .from('.hero-cta > *', {
  opacity: 0,
  y: 50,
  duration: 1.5,
  stagger: 0.25,
  ease: 'back.out(1.7)'
}, 3)
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-[100vh] overflow-hidden bg-surface-dark pt-24 lg:pt-28"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {USE_VIDEO_BACKGROUND ? (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src={HERO_VIDEO_SRC}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
          />
        ) : (
          <div className="absolute inset-0 bg-surface-dark" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-surface-dark/70 via-surface-dark/50 to-surface-dark/90" />
        <div className="mesh-gradient-dark absolute inset-0 opacity-60" />
      </div>

      <div className="hero-content relative z-20 flex min-h-[calc(100vh-6rem)] items-center">
        <div className="section-container w-full max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-10">
            <div className="max-w-3xl space-y-8 backdrop-blur-[2px] rounded-3xl p-6 border border-white/10 bg-black/10">
              <div className="space-y-5">
                <div className="hero-badge inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/15 px-5 py-2.5 shadow-2xl shadow-brand-300/20 backdrop-blur-md">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-300 opacity-60" />
                    <span className="relative inline-flex size-2 rounded-full bg-green-300" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
                    Healthcare Innovation
                  </span>
                </div>

                <h1 className="font-display max-w-4xl text-balance text-5xl font-extrabold leading-[1.05] text-white sm:text-5xl lg:text-6xl xl:text-[4.25rem]">
                  <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-2">
                    {headingWords.map((word, index) => (
                      <span
                        key={word.text + index}
                        className={`hero-word inline-block will-change-transform ${word.className}`}
                      >
                        {word.text}
                      </span>
                    ))}
                  </span>
                </h1>

                <p className="hero-sub max-w-xl text-base leading-relaxed text-white/70 lg:text-lg">
                  JV EdTech Medovation bridges compassion and technology — empowering
                  professionals through AI-driven education, clinical informatics, and
                  digital health innovation.
                </p>
              </div>

              <div className="hero-cta flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button href="#services" variant="primary" className="px-8 py-4 text-base">
                  Explore Medi AI
                </Button>
                <Button href="#about" variant="on-dark" className="px-8 py-4 text-base">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 sm:block"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/40">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="h-8 w-5 rounded-full border border-white/20 p-1"
          >
            <div className="mx-auto h-1.5 w-1 rounded-full bg-brand-300" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
