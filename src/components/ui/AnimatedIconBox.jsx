import { useEffect, useRef } from 'react'

export default function AnimatedIconBox({ animation = 'default', children, className = '' }) {
  const boxRef = useRef(null)

  useEffect(() => {
    const node = boxRef.current
    if (!node) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('is-animated')
        }
      },
      { threshold: 0.35, rootMargin: '0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={boxRef}
      className={`icon-box icon-box--${animation} relative flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-200/80 bg-gradient-to-br from-brand-50 to-green-50 text-brand-600 shadow-sm transition duration-500 group-hover:border-brand-300 group-hover:shadow-md group-hover:shadow-brand-300/20 ${className}`}
    >
      <span className="icon-box__ring pointer-events-none absolute inset-0 rounded-2xl" aria-hidden />
      <span className={`icon-anim icon-anim--${animation} relative z-10 flex items-center justify-center`}>
        {children}
      </span>
    </div>
  )
}
