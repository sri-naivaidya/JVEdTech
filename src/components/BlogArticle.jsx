import { BLOGS } from '../data/resources'
import VisualBackground from './VisualBackground'
import TiltCard from './ui/TiltCard'
import Button from './ui/Button'
import { useEffect, useState } from 'react'
import { apiFetch } from '../utils/api'

export default function BlogArticle({ blogId }) {
  const fallbackBlog = BLOGS.find((item) => item.id === blogId)
  const [blog, setBlog] = useState(fallbackBlog)

  useEffect(() => {
    if (fallbackBlog) {
      setBlog(fallbackBlog)
      return
    }
    apiFetch(`/api/public/blogs/${blogId}`).then((item) => {
      setBlog({
        ...item,
        id: item._id,
        topic: `Topic: ${item.category || 'JV EdTech'}`,
        date: `Date: ${new Date(item.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
        href: `/blogs/${item.slug}`,
      })
    }).catch(() => setBlog(null))
  }, [blogId])

  const related = BLOGS.filter((item) => item.id !== blogId).slice(0, 2)

  if (!blog) {
    return (
      <main className="resource-page relative min-h-screen overflow-hidden pt-28">
        <VisualBackground />
        <section className="section-padding relative">
          <div className="section-container">
            <TiltCard className="resource-card mx-auto max-w-2xl text-center">
              <h1 className="font-display text-4xl font-bold text-foreground">Blog not found</h1>
              <Button href="/blogs" className="mt-8">Back to Blogs</Button>
            </TiltCard>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="resource-page relative min-h-screen overflow-hidden pt-28">
      <VisualBackground />
      <article className="section-padding relative">
        <div className="section-container">
          <nav className="resource-breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <a href="/blogs">Our Blogs</a>
            <span>{blog.title}</span>
          </nav>

          <div className="mt-8 overflow-hidden rounded-[2rem] border border-white/75 bg-white/70 shadow-[0_36px_120px_-52px_rgba(14,165,233,0.62)] backdrop-blur-2xl">
            <div className="blog-featured-image">
              <div className="relative z-10 max-w-4xl p-8 sm:p-12 lg:p-16">
                <p className="inline-flex rounded-full border border-accent/15 bg-rose-50/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent-dark">
                  {blog.topic}
                </p>
                <h1 className="mt-6 font-display text-4xl font-bold leading-[1.06] text-foreground sm:text-5xl lg:text-6xl">
                  {blog.title}
                </h1>
                <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold text-foreground-muted">
                  <span>{blog.author}</span>
                  <span>{blog.date}</span>
                </div>
              </div>
            </div>

            <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:p-16">
              <div className="max-w-3xl">
                <p className="text-xl leading-relaxed text-foreground-muted">
                  {blog.excerpt}
                </p>
              </div>

              <aside className="rounded-2xl border border-white/75 bg-white/72 p-6 shadow-lg shadow-brand-300/10 backdrop-blur-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
                  Article Details
                </p>
                <dl className="mt-5 space-y-4 text-sm">
                  <div>
                    <dt className="font-semibold text-foreground">Author</dt>
                    <dd className="mt-1 text-foreground-muted">{blog.author}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-foreground">Published</dt>
                    <dd className="mt-1 text-foreground-muted">{blog.date.replace('Date: ', '')}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-foreground">Topic</dt>
                    <dd className="mt-1 text-foreground-muted">{blog.topic.replace('Topic: ', '')}</dd>
                  </div>
                </dl>
              </aside>
            </div>
          </div>

          {related.length > 0 && (
            <section className="mt-16">
              <div className="mb-8 flex items-end justify-between gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
                    Related Articles
                  </p>
                  <h2 className="mt-3 font-display text-3xl font-bold text-foreground">
                    Continue reading
                  </h2>
                </div>
                <Button href="/blogs" variant="secondary">All Blogs</Button>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {related.map((item) => (
                  <TiltCard key={item.id} className="resource-card">
                    <h3 className="font-display text-2xl font-bold leading-tight text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-foreground-muted">
                      {item.excerpt}
                    </p>
                    <a
                      href={item.href}
                      className="mt-6 inline-flex items-center justify-center rounded-full border border-brand-200 bg-white/78 px-5 py-3 text-sm font-semibold text-brand-700 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50"
                    >
                      Read More
                    </a>
                  </TiltCard>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </main>
  )
}
