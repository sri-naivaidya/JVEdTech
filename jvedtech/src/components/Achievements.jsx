import { useRef, useEffect, useState } from 'react'
import { ACHIEVEMENTS } from '../data/content'

function useInView(threshold = 0.2) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setInView(true)
    }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

function StatCard({ stat, delay }) {
  const [ref, inView] = useInView()
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    
    // Extract numeric value from the stat
    const numericValue = parseInt(stat.number.replace(/\D/g, '')) || 0
    let start = 0
    const duration = 2000 // 2 seconds
    const increment = numericValue / (duration / 50)

    const counter = setInterval(() => {
      start += increment
      if (start >= numericValue) {
        setCount(numericValue)
        clearInterval(counter)
      } else {
        setCount(Math.floor(start))
      }
    }, 50)

    return () => clearInterval(counter)
  }, [inView, stat])

  return (
    <div
      ref={ref}
      className="group text-center"
      style={{
        animation: inView ? `fadeUp 0.6s ease-out ${delay}s both` : 'none',
      }}
    >
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      <div className="p-8 rounded-xl glass group-hover:shadow-lg group-hover:shadow-brand-400/20 transition-all duration-300">
        <div className="font-display text-5xl sm:text-6xl font-bold text-brand-500 mb-3 transition-colors duration-300 group-hover:text-brand-600">
          {inView ? count : 0}{stat.number.includes('+') ? '+' : ''}
        </div>
        <div className="text-xs font-semibold uppercase tracking-widest text-brand-600 mb-2">
          {stat.label}
        </div>
        <p className="text-sm text-foreground-muted">
          {stat.description}
        </p>
      </div>
    </div>
  )
}

export default function Achievements() {
  return (
    <section className="bg-transparent py-32 relative z-10">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-16">
        <span className="text-xs font-semibold uppercase tracking-widest text-white/60 block mb-3">
            About Us
        </span>

        <h2 className="text-4xl sm:text-5xl font-light font-display text-white mb-4 leading-tight">
            Achievements & Impact
        </h2>

        <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            Empowering education and innovation globally with impactful EdTech solutions.
        </p>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ACHIEVEMENTS.map((achievement, index) => (
            <StatCard
              key={`${achievement.label}-${achievement.number}`}
              stat={achievement}
              delay={index * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
