export function IconEducation({ className = 'h-6 w-6' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <g className="icon-edu-stack">
        <path
          className="icon-layer icon-layer-1"
          d="M12 3L2 8l10 5 10-5-10-5z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className="icon-layer icon-layer-2"
          d="M2 17l10 5 10-5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className="icon-layer icon-layer-3"
          d="M2 12l10 5 10-5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}

export function IconAI({ className = 'h-6 w-6' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect className="icon-ai-body" x="4" y="4" width="16" height="16" rx="3" />
      <circle className="icon-ai-eye icon-ai-eye-l" cx="9" cy="9" r="1" fill="currentColor" stroke="none" />
      <circle className="icon-ai-eye icon-ai-eye-r" cx="15" cy="9" r="1" fill="currentColor" stroke="none" />
      <path className="icon-ai-smile" d="M9 15a3 3 0 006 0" strokeLinecap="round" />
    </svg>
  )
}

export function IconChart({ className = 'h-6 w-6' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path className="icon-bar icon-bar-1" d="M4 19V5" strokeLinecap="round" />
      <path className="icon-bar icon-bar-2" d="M10 19V9" strokeLinecap="round" />
      <path className="icon-bar icon-bar-3" d="M16 19v-6" strokeLinecap="round" />
      <path className="icon-bar icon-bar-4" d="M22 19V3" strokeLinecap="round" />
    </svg>
  )
}

export function IconMegaphone({ className = 'h-6 w-6' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path className="icon-mega-stand" d="M4 10v4M8 8v8" strokeLinecap="round" />
      <path
        className="icon-mega-cone"
        d="M12 5v14l8-4-8-4z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path className="icon-wave icon-wave-1" d="M21 9.5c1.2 1 1.2 3 0 4" strokeLinecap="round" />
      <path className="icon-wave icon-wave-2" d="M23 8c2 1.8 2 5.2 0 7" strokeLinecap="round" />
    </svg>
  )
}

export function IconGlobe({ className = 'h-6 w-6' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <g className="icon-globe-spin">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3a15 15 0 010 18" />
        <path d="M12 3a15 15 0 000 18" />
      </g>
    </svg>
  )
}

export function IconBulb({ className = 'h-6 w-6' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path className="icon-bulb-base" d="M9 18h6M10 22h4" strokeLinecap="round" />
      <path
        className="icon-bulb-glass"
        d="M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path className="icon-bulb-ray icon-bulb-ray-1" d="M12 1v2" strokeLinecap="round" />
      <path className="icon-bulb-ray icon-bulb-ray-2" d="M18 3l-1.5 1.5" strokeLinecap="round" />
      <path className="icon-bulb-ray icon-bulb-ray-3" d="M6 3l1.5 1.5" strokeLinecap="round" />
    </svg>
  )
}

export function IconDroplet({ className = 'h-5 w-4', animated = false }) {
  return (
    <svg
      className={`${className} ${animated ? 'icon-droplet-anim' : ''}`}
      viewBox="0 0 20 28"
      fill="currentColor"
    >
      <path d="M10 1C10 1 2 12 2 19.5C2 24.3 5.7 28 10 28C14.3 28 18 24.3 18 19.5C18 12 10 1 10 1Z" />
    </svg>
  )
}
