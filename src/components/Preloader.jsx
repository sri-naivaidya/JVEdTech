import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import CrystalScene3D from './CrystalScene3D'

function DropletIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M16 2C16 2 4 18 4 28C4 35.732 9.268 42 16 42C22.732 42 28 35.732 28 28C28 18 16 2 16 2Z"
        fill="white"
      />
    </svg>
  )
}

const HOLD_DURATION_MS = 2200
const AUTO_START_CRYSTAL_MS = 1800

export default function Preloader({ onComplete }) {
  const rootRef = useRef(null)
  const holdRef = useRef(null)
  const progressRef = useRef(0)
  const rafRef = useRef(0)
  const holdingRef = useRef(false)
  const phaseRef = useRef('droplet')

  const [phase, setPhase] = useState('droplet')
  const [holdProgress, setHoldProgress] = useState(0)
  const [exiting, setExiting] = useState(false)

  const finishIntro = useCallback(() => {
    if (phaseRef.current === 'exit') return
    phaseRef.current = 'exit'
    setExiting(true)

    const ctx = gsap.context(() => {
      gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = ''
          onComplete?.()
        },
      })
        .to('.preloader-crystal-wrap', {
          scale: 2.2,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.in',
        })
        .to('.preloader-flash', { opacity: 0.35, duration: 0.15 }, 0.35)
        .to('.preloader-flash', { opacity: 0, duration: 0.5 }, 0.5)
        .to(rootRef.current, { opacity: 0, duration: 0.4 }, 0.7)
    }, rootRef)
  }, [onComplete])

  const startHoldLoop = useCallback(() => {
    let last = performance.now()

    const tick = (now) => {
      const dt = now - last
      last = now

      if (holdingRef.current && phaseRef.current === 'crystal') {
        progressRef.current = Math.min(1, progressRef.current + dt / HOLD_DURATION_MS)
        setHoldProgress(progressRef.current)

        if (progressRef.current >= 1) {
          holdingRef.current = false
          finishIntro()
          return
        }
      } else if (phaseRef.current === 'crystal' && progressRef.current > 0 && !holdingRef.current) {
        progressRef.current = Math.max(0, progressRef.current - dt / 3200)
        setHoldProgress(progressRef.current)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [finishIntro])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    phaseRef.current = 'droplet'

    const ctx = gsap.context(() => {
      gsap.set('.preloader-droplet', { y: -72, opacity: 0, scale: 0.6 })
      gsap.set('.preloader-line', { scaleX: 0, opacity: 0 })
      gsap.set('.preloader-ripple', { scale: 0, opacity: 0 })
      gsap.set('.preloader-crystal-wrap', { opacity: 0, scale: 0.6 })
      gsap.set('.preloader-hint', { opacity: 0, y: 12 })
      gsap.set('.preloader-progress-track', { opacity: 0 })
      gsap.set('.preloader-flash', { opacity: 0 })

      const tl = gsap.timeline()

      tl.to('.preloader-line', {
        opacity: 1,
        scaleX: 1,
        duration: 1,
        ease: 'power3.inOut',
      }, 0.15)
        .to('.preloader-droplet', { opacity: 1, scale: 1, duration: 0.45 }, 0.3)
        .to('.preloader-droplet', { y: 0, duration: 0.8, ease: 'power2.in' }, 0.45)
        .to('.preloader-droplet', { y: 5, duration: 0.1 }, 1.2)
        .to('.preloader-droplet', { y: 0, duration: 0.4, ease: 'bounce.out' }, 1.3)
        .to('.preloader-ripple', {
          scale: 2,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
        }, 1.25)
        .to('.preloader-droplet-stage', {
          opacity: 0,
          scale: 0.85,
          duration: 0.55,
          ease: 'power2.in',
        }, AUTO_START_CRYSTAL_MS / 1000)
        .call(() => {
          phaseRef.current = 'crystal'
          setPhase('crystal')
        }, null, AUTO_START_CRYSTAL_MS / 1000)
        .to('.preloader-crystal-wrap', {
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: 'power3.out',
        }, AUTO_START_CRYSTAL_MS / 1000 + 0.05)
        .to('.preloader-hint', { opacity: 1, y: 0, duration: 0.5 }, AUTO_START_CRYSTAL_MS / 1000 + 0.4)
        .to('.preloader-progress-track', { opacity: 1, duration: 0.4 }, AUTO_START_CRYSTAL_MS / 1000 + 0.5)
    }, rootRef)

    startHoldLoop()

    const autoTimer = setTimeout(() => {
      if (phaseRef.current === 'crystal' && progressRef.current < 1) {
        progressRef.current = 1
        setHoldProgress(1)
        setTimeout(finishIntro, 400)
      }
    }, AUTO_START_CRYSTAL_MS + HOLD_DURATION_MS + 3500)

    return () => {
      ctx.revert()
      clearTimeout(autoTimer)
      cancelAnimationFrame(rafRef.current)
      document.body.style.overflow = ''
    }
  }, [finishIntro, startHoldLoop])

  const onHoldStart = () => {
    if (phase !== 'crystal' || exiting) return
    holdingRef.current = true
  }

  const onHoldEnd = () => {
    holdingRef.current = false
  }

  return (
    <div
      ref={rootRef}
      className="preloader-root fixed inset-0 z-[9999] flex cursor-pointer select-none flex-col items-center justify-center bg-[#000000]"
      style={{ backgroundColor: '#000000' }}
      aria-label="Loading experience"
      role="status"
      onMouseDown={onHoldStart}
      onMouseUp={onHoldEnd}
      onMouseLeave={onHoldEnd}
      onTouchStart={onHoldStart}
      onTouchEnd={onHoldEnd}
    >
      <div className="preloader-flash pointer-events-none absolute inset-0 bg-white" aria-hidden />

      {/* Phase 1: Droplet (Resn-style teardrop) */}
      <div className="preloader-droplet-stage absolute flex flex-col items-center">
        <div className="preloader-droplet relative z-10 mb-3">
          <DropletIcon className="h-9 w-7 sm:h-11 sm:w-8" />
        </div>
        <div
          className="preloader-ripple pointer-events-none absolute left-1/2 top-[calc(100%-2px)] h-8 w-8 -translate-x-1/2 rounded-full border border-white/40"
          aria-hidden
        />
        <div
          className="preloader-line h-px w-[min(38vw,220px)] bg-white sm:w-[min(36vw,280px)]"
          style={{ transformOrigin: 'center center' }}
        />
      </div>

      {/* Phase 2: Crystal (Resn-inspired hold to enter) */}
      <div
        ref={holdRef}
        className={`preloader-crystal-wrap absolute flex flex-col items-center justify-center transition-opacity duration-300 ${
          phase === 'crystal' ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        style={{ width: 'min(96vw, 640px)', height: 'min(85vh, 720px)' }}
      >
        <div className="relative h-[min(52vw,360px)] w-full sm:h-[min(48vh,400px)]">
          <CrystalScene3D progress={holdProgress} active={phase === 'crystal'} />
        </div>

        <p className="preloader-hint mt-6 text-center text-[11px] font-medium uppercase tracking-[0.35em] text-white/55">
          {holdProgress >= 1 ? 'Entering…' : 'Click & hold the crystal'}
        </p>

        <div className="preloader-progress-track mt-4 h-px w-48 overflow-hidden rounded-full bg-white/15 sm:w-56">
          <div
            className="h-full bg-gradient-to-r from-brand-300 via-white to-brand-300 transition-[width] duration-75"
            style={{ width: `${holdProgress * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
