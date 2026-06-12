import useScrollReveal from '../hooks/useScrollReveal'
import HomeScreen from './HomeScreen'
import About from './About'
import Services from './Services'
import Careers from './Careers'
import Community from './Community'
import VisualBackground from './VisualBackground'

export default function IntegratedPage() {
  useScrollReveal()

  return (
    <main className="relative overflow-hidden">
      <VisualBackground intensity="soft" />
      <section id="home">
        <HomeScreen />
      </section>
      <About />
      <Services />
      <Careers />
      <Community />
    </main>
  )
}
