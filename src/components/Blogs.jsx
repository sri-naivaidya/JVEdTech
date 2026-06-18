import { BLOGS } from '../data/resources'
import VisualBackground from './VisualBackground'
import Reveal from './ui/Reveal'
import TiltCard from './ui/TiltCard'
import AnimatedText from './ui/AnimatedText'
import useCmsContent from '../hooks/useCmsContent'

export default function Blogs() {
  const cmsBlogs = useCmsContent('/api/public/blogs', BLOGS)
  const blogs = cmsBlogs.map((blog, index) => ({
    ...blog,
    id: blog.id || blog.slug || blog._id || String(index + 1),
    topic: blog.topic || `Topic: ${blog.category || 'JVedtech'}`,
    date: blog.date || `Date: ${new Date(blog.publishDate || blog.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
    excerpt: blog.excerpt || String(blog.content || '').replace(/<[^>]+>/g, '').slice(0, 220),
    href: blog.href || `/blogs/${blog.slug || blog._id}`,
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
                <span>Our Blogs</span>
              </nav>
              <div className="mt-7 inline-flex rounded-full border border-accent/20 bg-rose-50/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent-dark shadow-sm shadow-accent/10 backdrop-blur-xl">
                Resources
              </div>
              <AnimatedText
                as="h1"
                text="Our Blogs"
                className="mt-8 font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl"
              />
            </Reveal>
            <div className="resource-visual" aria-hidden>
              <div className="resource-orbit resource-orbit-a" />
              <div className="resource-orbit resource-orbit-b" />
              <div className="resource-stack">
                {blogs.map((blog) => (
                  <span key={blog.id}>{blog.date.replace('Date: ', '')}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {blogs.map((blog, index) => (
              <Reveal key={blog.id} delay={index * 0.08}>
                <TiltCard className="group h-full">
                  <div className="resource-premium-card flex h-full flex-col overflow-hidden rounded-2xl">
                    <div className="resource-premium-card-head relative border-b border-sky-200 p-6">
                      <div className="absolute right-4 top-4 flex h-16 w-16 flex-col items-center justify-center rounded-2xl border border-white/70 bg-gradient-to-br from-brand-100 via-white to-green-100 text-center shadow-lg shadow-brand-300/15">
                        <div className="text-[10px] font-semibold uppercase text-brand-500">
                          {blog.date.replace('Date: ', '').split(' ')[0]}
                        </div>
                        <div className="font-display text-xl font-bold text-foreground">
                          {blog.id.padStart(2, '0')}
                        </div>
                      </div>
                      <div className="mb-4 flex flex-wrap gap-2 pr-20">
                        <span className="inline-flex rounded-full border border-accent/15 bg-rose-50/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-dark">
                          {blog.topic.replace('Topic: ', '')}
                        </span>
                        <span className="inline-flex rounded-full border border-brand-200 bg-brand-50/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
                          Article
                        </span>
                      </div>
                      <h2 className="pr-20 font-display text-2xl font-bold leading-tight text-foreground">
                        {blog.title}
                      </h2>
                    </div>

                    <div className="relative flex flex-1 flex-col p-6">
                      <p className="flex-1 text-base leading-relaxed text-foreground-muted">
                        {blog.excerpt}
                      </p>
                      <div className="mt-6 border-t border-sky-200 pt-4">
                        <p className="text-sm font-semibold text-foreground-muted">{blog.date}</p>
                      </div>
                      <a
                        href={blog.href}
                        className="mt-6 inline-flex items-center justify-center rounded-full border border-white/80 bg-[linear-gradient(135deg,rgba(125,211,252,0.95)_0%,rgba(134,239,172,0.9)_76%,rgba(251,113,133,0.3)_130%)] px-5 py-3 text-sm font-semibold text-foreground shadow-lg shadow-brand-300/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/15"
                      >
                        Read More
                      </a>
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
