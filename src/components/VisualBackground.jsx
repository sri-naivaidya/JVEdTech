export default function VisualBackground({ intensity = 'default' }) {
  const soft = intensity === 'soft'

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className={`premium-mesh ${soft ? 'opacity-45' : 'opacity-75'}`} />
      <div className="cinematic-light cinematic-light-a" />
      <div className="cinematic-light cinematic-light-b" />
      <div className="floating-shape floating-shape-a" />
      <div className="floating-shape floating-shape-b" />
      <div className="floating-shape floating-shape-c" />
      <div className="depth-grid" />
    </div>
  )
}
