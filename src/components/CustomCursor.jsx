import { useEffect, useRef, useState } from 'react'

const INTERACTIVE_SELECTOR = 'a, button, input, textarea, select, [role="button"], .premium-tilt'

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const positionRef = useRef({ x: 0, y: 0 })
  const targetRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef(0)
  const [active, setActive] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return undefined

    const move = (event) => {
      targetRef.current = { x: event.clientX, y: event.clientY }
      setVisible(true)
    }

    const over = (event) => {
      setActive(Boolean(event.target.closest(INTERACTIVE_SELECTOR)))
    }

    const leave = () => setVisible(false)

    const tick = () => {
      const position = positionRef.current
      const target = targetRef.current
      position.x += (target.x - position.x) * 0.28
      position.y += (target.y - position.y) * 0.28

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mouseover', over, { passive: true })
    document.documentElement.addEventListener('mouseleave', leave)
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
      document.documentElement.removeEventListener('mouseleave', leave)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor ${active ? 'is-active' : ''} ${visible ? 'is-visible' : ''}`}
      aria-hidden
    />
  )
}
