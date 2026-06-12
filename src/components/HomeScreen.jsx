import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Button from './ui/Button'

const USE_VIDEO_BACKGROUND = true
const HERO_VIDEO_SRC = '/bg-video.mp4'

const headingWords = [
  { text: 'Redefining Global', className: 'text-foreground drop-shadow-sm' },
  {
    text: 'Healthcare Learning.',
    className: 'text-gradient-accent drop-shadow-sm',
  },
  {
    text: 'Where compassion meets technology.',
    className: 'italic text-foreground-muted drop-shadow-sm',
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

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-[100vh] overflow-hidden bg-white pt-24 lg:pt-28"
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
          <div className="absolute inset-0 bg-white" />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0.13)_34%,rgba(255,255,255,0.025)_66%,rgba(255,255,255,0)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-transparent to-white/8" />
        <div className="mesh-gradient absolute inset-0 opacity-[0.045] mix-blend-screen" />
        <div className="hero-video-frame" />
      </div>

      <div className="hero-content relative z-20 flex min-h-[calc(100vh-6rem)] items-center">
        <div className="section-container w-full max-w-7xl">
          <div className="max-w-[44rem]">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="hero-copy-panel space-y-7 rounded-3xl p-5 sm:p-7 lg:p-8"
            >
              <div className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="hero-badge inline-flex items-center gap-2.5 rounded-full border border-accent/20 bg-white/62 px-5 py-2.5 shadow-2xl shadow-accent/10 backdrop-blur-sm"
                >
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full rounded-full bg-accent opacity-35" />
                    <span className="relative inline-flex size-2 rounded-full bg-accent" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-dark">
                    Healthcare Innovation
                  </span>
                </motion.div>

                <h1 className="hero-title font-display max-w-4xl text-balance text-5xl font-semibold leading-[0.98] text-foreground sm:text-5xl lg:text-6xl xl:text-[4.35rem]">
                  <span className="flex flex-col gap-2">
                    {headingWords.map((word, index) => (
                      <motion.span
                        key={word.text + index}
                        initial={{ opacity: 0, y: 22, filter: 'blur(12px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{
                          duration: 0.82,
                          delay: 0.22 + index * 0.14,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className={`hero-word block will-change-transform ${word.className}`}
                      >
                        {word.text}
                      </motion.span>
                    ))}
                  </span>
                </h1>

                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.62, ease: [0.22, 1, 0.36, 1] }}
                  className="hero-sub max-w-xl text-base leading-relaxed text-foreground-muted lg:text-lg"
                >
                  JV EdTech Medovation bridges compassion and technology {'\u2014'} empowering
                  professionals through AI-driven education, clinical informatics, and
                  digital health innovation.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.78, ease: [0.22, 1, 0.36, 1] }}
                className="hero-cta flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <Button href="#services" variant="primary" className="px-8 py-4 text-base">
                  Explore Medi AI
                </Button>
                <Button href="#about" variant="secondary" className="px-8 py-4 text-base">
                  Learn More
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
