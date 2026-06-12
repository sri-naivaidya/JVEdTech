import useScrollReveal from '../hooks/useScrollReveal'
import HomeScreen from './HomeScreen'
import About from './About'
import Services from './Services'
import Events from './Events'
import Careers from './Careers'
import Community from './Community'

export default function IntegratedPage() {
  useScrollReveal()

  return (
    <main className="relative overflow-hidden">
      <section id="home">
        <HomeScreen />
      </section>
      <About />
      <Services />
      <Events />
      <Careers />
      <Community />
    </main>
  )
}
