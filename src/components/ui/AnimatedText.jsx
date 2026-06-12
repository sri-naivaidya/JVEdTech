import { motion, useReducedMotion } from 'framer-motion'

export default function AnimatedText({ text, as = 'span', className = '', delay = 0 }) {
  const Component = motion[as] || motion.span
  const reduceMotion = useReducedMotion()
  const words = text.split(' ')

  if (reduceMotion) {
    const StaticComponent = as
    return <StaticComponent className={className}>{text}</StaticComponent>
  }

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10% 0px -12% 0px' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: 0.035,
          },
        },
      }}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: 16, filter: 'blur(10px)' },
            visible: {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              transition: { duration: 0.64, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        >
          {word}
          {index < words.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </Component>
  )
}
