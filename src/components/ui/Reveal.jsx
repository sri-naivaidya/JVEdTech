import { motion, useReducedMotion } from 'framer-motion'

export default function Reveal({ children, className = '', as = 'div', delay = 0 }) {
  const Component = motion[as] || motion.div
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    const StaticComponent = as
    return <StaticComponent className={className}>{children}</StaticComponent>
  }

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-12% 0px -10% 0px' }}
      transition={{ duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  )
}
