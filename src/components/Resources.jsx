import { BLOGS, NEWSLETTERS } from '../data/resources'
import VisualBackground from './VisualBackground'
import Reveal from './ui/Reveal'
import TiltCard from './ui/TiltCard'
import Button from './ui/Button'
import AnimatedText from './ui/AnimatedText'

const RESOURCE_CATEGORIES = [
  {
    label: 'Events',
    href: '/events',
    description: 'Webinars, workshops, and summits for healthcare education and AI-driven innovation.',
    meta: 'Learning & Networking',
  },
  {
    label: 'Blogs',
    href: '/blogs',
    description: BLOGS[0]?.excerpt || 'Insights and perspectives from JVedtech.',
    meta: `${BLOGS.length} articles`,
  },
  {
    label: 'Newsletters',
    href: '/newsletters',
    description: NEWSLETTERS[0]?.title || 'JVedtech newsletters and updates.',
    meta: `${NEWSLETTERS.length} editions`,
  },
]

export default function Resources() {
  const featuredBlog = BLOGS[0]
  const latestNewsletter = NEWSLETTERS[0]

  return (
    <main className="resource-page relative min-h-screen overflow-hidden pt-28">
      <VisualBackground />
      <section className="section-padding relative">
        <div className="section-container">
          <div className="resource-hero resource-hub-hero">
            <Reveal>
              <nav className="resource-breadcrumb" aria-label="Breadcrumb">
                <a href="/">Home</a>
                <span>Resources</span>
              </nav>
              <div className="mt-7 inline-flex rounded-full border border-accent/20 bg-rose-50/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent-dark shadow-sm shadow-accent/10 backdrop-blur-xl">
                Resources
              </div>
              <AnimatedText
                as="h1"
                text="Explore JVedtech insights, events, and updates"
                className="mt-8 max-w-3xl font-display text-4xl font-bold leading-[1.05] text-foreground sm:text-5xl lg:text-6xl"
                delay={0.12}
              />
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground-muted">
                A central hub for upcoming Events, Blogs, and Newsletters from JVedtech.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/events">View Events</Button>
                <Button href="/blogs" variant="secondary">Read Blogs</Button>
              </div>
            </Reveal>

            <div className="resource-visual resource-hub-visual" aria-hidden>
              <div className="resource-orbit resource-orbit-a" />
              <div className="resource-orbit resource-orbit-b" />
              <div className="resource-cinematic-core">
                <span>JV</span>
                <strong>Resources</strong>
              </div>
              <div className="resource-stack">
                {RESOURCE_CATEGORIES.map((item) => (
                  <span key={item.label}>{item.label}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="resources-feature-band mt-12">
            <div className="grid gap-6 lg:grid-cols-3">
              {RESOURCE_CATEGORIES.map((item, index) => (
                <Reveal key={item.label} delay={index * 0.08}>
                  <TiltCard className="resource-card resource-category-card group h-full">
                    <div className="relative flex h-full flex-col">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
                        {item.meta}
                      </p>
                      <h2 className="mt-4 font-display text-3xl font-bold text-foreground">
                        {item.label}
                      </h2>
                      <p className="mt-4 flex-1 text-base leading-relaxed text-foreground-muted">
                        {item.description}
                      </p>
                      <a
                        href={item.href}
                        className="mt-8 inline-flex items-center justify-center rounded-full border border-white/80 bg-[linear-gradient(135deg,rgba(125,211,252,0.95)_0%,rgba(134,239,172,0.9)_86%,rgba(251,113,133,0.26)_138%)] px-5 py-3 text-sm font-semibold text-foreground shadow-lg shadow-brand-300/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-green-200/50"
                      >
                        View {item.label}
                      </a>
                    </div>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            {featuredBlog && (
              <Reveal>
                <TiltCard className="resource-card resource-spotlight-card">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-dark">
                    Featured Blog
                  </p>
                  <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-foreground">
                    {featuredBlog.title}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-foreground-muted">
                    {featuredBlog.excerpt}
                  </p>
                  <a
                    href={featuredBlog.href}
                    className="mt-8 inline-flex items-center justify-center rounded-full border border-brand-200 bg-white/78 px-5 py-3 text-sm font-semibold text-brand-700 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50"
                  >
                    Read More
                  </a>
                </TiltCard>
              </Reveal>
            )}

            {latestNewsletter && (
              <Reveal delay={0.1}>
                <TiltCard className="resource-card resource-spotlight-card">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
                    Featured Newsletter
                  </p>
                  <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-foreground">
                    {latestNewsletter.title}
                  </h2>
                  <p className="mt-4 inline-flex rounded-full border border-accent/15 bg-rose-50/80 px-3 py-1 text-sm font-semibold text-accent-dark">
                    {latestNewsletter.published}
                  </p>
                  <a
                    href={latestNewsletter.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-8 inline-flex items-center justify-center rounded-full border border-brand-200 bg-white/78 px-5 py-3 text-sm font-semibold text-brand-700 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50"
                  >
                    View PDF
                  </a>
                </TiltCard>
              </Reveal>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
