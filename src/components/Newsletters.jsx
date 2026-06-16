import { NEWSLETTERS } from '../data/resources'
import VisualBackground from './VisualBackground'
import Reveal from './ui/Reveal'
import TiltCard from './ui/TiltCard'
import AnimatedText from './ui/AnimatedText'
import useCmsContent from '../hooks/useCmsContent'

export default function Newsletters() {
  const cmsNewsletters = useCmsContent('/api/public/newsletters', NEWSLETTERS)
  const newsletters = cmsNewsletters.map((item, index) => ({
    ...item,
    id: item.id || item._id || `${item.month}-${item.year}-${index}`,
    published: item.published || `Published: ${item.month || ''} ${item.year || ''}`.trim(),
    href: item.href || item.pdfFile || '#',
  }))

  return (
    <main className="resource-page relative min-h-screen overflow-hidden pt-28">
      <VisualBackground />
      <section className="section-padding relative">
        <div className="section-container">
          <div className="resource-hero">
            <Reveal>
              <nav className="resource-breadcrumb" aria-label="Breadcrumb">
                <a href="/">Home</a>
                <span>Our Newsletters</span>
              </nav>
              <div className="mt-7 inline-flex rounded-full border border-accent/20 bg-rose-50/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent-dark shadow-sm shadow-accent/10 backdrop-blur-xl">
                Resources
              </div>
              <AnimatedText
                as="h1"
                text="Our Newsletters"
                className="mt-8 font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl"
              />
            </Reveal>
            <div className="resource-visual" aria-hidden>
              <div className="resource-orbit resource-orbit-a" />
              <div className="resource-orbit resource-orbit-b" />
              <div className="resource-stack">
                {newsletters.slice(0, 4).map((newsletter) => (
                  <span key={newsletter.id}>{newsletter.published.replace('Published: ', '')}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {newsletters.map((newsletter, index) => (
              <Reveal key={newsletter.id} delay={index * 0.08}>
                <TiltCard className="group h-full">
                  <div className="resource-premium-card flex h-full flex-col overflow-hidden rounded-2xl">
                    <div className="resource-premium-card-head relative border-b border-sky-200 p-6">
                      <div className="absolute right-4 top-4 flex h-16 w-16 flex-col items-center justify-center rounded-2xl border border-white/70 bg-gradient-to-br from-brand-100 via-white to-green-100 text-center shadow-lg shadow-brand-300/15">
                        <div className="text-[10px] font-semibold uppercase text-brand-500">
                          {newsletter.published.replace('Published: ', '').split(' ')[0].slice(0, 3)}
                        </div>
                        <div className="font-display text-lg font-bold text-foreground">
                          {newsletter.published.replace('Published: ', '').split(' ')[1]}
                        </div>
                      </div>
                      <div className="mb-4 flex flex-wrap gap-2 pr-20">
                        <span className="inline-flex rounded-full border border-accent/15 bg-rose-50/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-dark">
                          Newsletter
                        </span>
                        <span className="inline-flex rounded-full border border-brand-200 bg-brand-50/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
                          PDF
                        </span>
                      </div>
                      <h2 className="pr-20 font-display text-2xl font-bold leading-tight text-foreground">
                        {newsletter.title}
                      </h2>
                    </div>

                    <div className="relative flex flex-1 flex-col p-6">
                      <p className="inline-flex w-fit rounded-full border border-accent/15 bg-rose-50/80 px-3 py-1 text-sm font-semibold text-accent-dark">
                        {newsletter.published}
                      </p>
                      <div className="mt-auto flex flex-col gap-3 pt-10 sm:flex-row">
                      <a
                        href={newsletter.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex flex-1 items-center justify-center rounded-full border border-white/80 bg-[linear-gradient(135deg,#7dd3fc_0%,#86efac_82%,rgba(251,113,133,0.38)_135%)] px-5 py-3 text-sm font-semibold text-foreground shadow-lg shadow-brand-300/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-green-200/50"
                      >
                        View PDF
                      </a>
                      <a
                        href={newsletter.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex flex-1 items-center justify-center rounded-full border border-brand-200 bg-white/78 px-5 py-3 text-sm font-semibold text-brand-700 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50"
                      >
                        Download
                      </a>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
