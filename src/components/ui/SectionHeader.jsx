import Reveal from './Reveal'
import AnimatedText from './AnimatedText'

export default function SectionHeader({
  label,
  title,
  description,
  align = 'left',
  className = '',
  dark = false,
}) {
  const alignClass = align === 'center' ? 'mx-auto text-center max-w-3xl' : 'max-w-3xl'
  const labelColor = dark ? 'text-brand-300' : 'text-brand-600'
  const lineColor = dark
    ? 'bg-gradient-to-r from-brand-300 to-green-300'
    : 'bg-gradient-to-r from-brand-400 to-green-400'
  const titleColor = dark ? 'text-white' : 'text-foreground'
  const descColor = dark ? 'text-white/75' : 'text-foreground-muted'

  return (
    <Reveal className={`${alignClass} ${className}`}>
      <div
        className={`mb-5 flex items-center gap-3 ${align === 'center' ? 'justify-center' : ''}`}
      >
        <span className={`h-px w-10 ${lineColor}`} />
        <p className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${labelColor}`}>
          {label}
        </p>
        {align === 'center' && <span className={`h-px w-10 ${lineColor}`} />}
      </div>
      <AnimatedText
        as="h2"
        text={title}
        className={`font-display text-3xl font-bold leading-[1.15] sm:text-4xl lg:text-[2.75rem] ${titleColor}`}
        delay={0.08}
      />
      {description && (
        <p className={`mt-5 text-base leading-relaxed sm:text-lg ${descColor}`}>{description}</p>
      )}
    </Reveal>
  )
}
