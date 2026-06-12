export function scrollToSection(sectionId) {
  const navOffset = 88

  if (sectionId === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    window.history.replaceState(null, '', '/')
    return
  }

  const el = document.getElementById(sectionId)
  if (!el) return

  const top = el.getBoundingClientRect().top + window.scrollY - navOffset
  window.scrollTo({ top, behavior: 'smooth' })
  window.history.replaceState(null, '', `#${sectionId}`)
}
