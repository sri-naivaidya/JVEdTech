import { motion } from 'framer-motion'

const variants = {
  primary:
    'btn-gradient text-foreground shadow-lg shadow-brand-300/25 hover:shadow-brand-400/35 hover:shadow-xl',
  secondary:
    'border border-brand-200 bg-white text-foreground hover:border-brand-300 hover:bg-brand-50 shadow-sm',
  ghost: 'text-foreground-muted hover:text-brand-600 hover:bg-brand-50/80',
  light: 'bg-white text-foreground shadow-md shadow-brand-900/8 hover:bg-brand-50 hover:shadow-lg',
  'on-dark':
    'border border-white/25 bg-white/10 text-white backdrop-blur-sm hover:border-brand-300/50 hover:bg-white/15',
  accent:
    'bg-accent text-white shadow-lg shadow-accent/25 hover:bg-accent-dark hover:shadow-accent/35',
  outline:
    'border-2 border-foreground/10 bg-transparent text-foreground hover:border-brand-300 hover:bg-brand-50/50',
}

const MotionLink = motion.a
const MotionButton = motion.button

export default function Button({
  children,
  href,
  variant = 'primary',
  className = '',
  type = 'button',
  onClick,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 disabled:pointer-events-none disabled:opacity-60'

  const classes = `${base} ${variants[variant]} ${className}`
  const motionProps = {
    whileHover: { scale: 1.02, y: -1 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
  }

  if (href) {
    return (
      <MotionLink href={href} className={classes} onClick={onClick} {...motionProps} {...props}>
        {children}
      </MotionLink>
    )
  }

  return (
    <MotionButton type={type} className={classes} onClick={onClick} {...motionProps} {...props}>
      {children}
    </MotionButton>
  )
}
