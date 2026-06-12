import { useState } from 'react'
import SectionHeader from './ui/SectionHeader'
import Button from './ui/Button'
import { CONTACT_INFO } from '../data/content'

export default function Contact() {
  const [sent, setSent] = useState(false)

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 mesh-gradient opacity-30" />
      <div className="section-container relative">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="reveal">
            <SectionHeader
              dark
              label="Get In Touch"
              title="Let's Have a Talk"
              description="Reach out for partnerships, training programs, technology solutions, or to learn how JVEDTECH Medovation can support your healthcare goals."
            />

            <ul className="mt-12 space-y-6 text-white/80">
              <li>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-dim">Email</span>
                <a href={`mailto:${CONTACT_INFO.email}`} className="mt-1.5 block text-base text-white/90">{CONTACT_INFO.email}</a>
              </li>
              <li>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-dim">Phone</span>
                <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g,'')}`} className="mt-1.5 block text-base text-white/90">{CONTACT_INFO.phone}</a>
              </li>
              <li>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-dim">Location</span>
                <p className="mt-1.5 text-base text-white/90">{CONTACT_INFO.address}</p>
              </li>
              <li>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-dim">Social</span>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/80">
                  <a href={CONTACT_INFO.linkedin} target="_blank" rel="noreferrer" className="underline decoration-brand-500/20 hover:text-brand-200">LinkedIn</a>
                  <a href={CONTACT_INFO.whatsapp} target="_blank" rel="noreferrer" className="underline decoration-brand-500/20 hover:text-brand-200">WhatsApp</a>
                </div>
              </li>
            </ul>
          </div>

          <div className="reveal reveal-delay-2">
            <form
              className="glass-strong rounded-2xl p-8 sm:p-10 text-foreground"
              onSubmit={async (e) => {
                  e.preventDefault()
                  const form = e.target
                  const payload = {
                    name: (form.name && form.name.value) || '',
                    email: (form.email && form.email.value) || '',
                    subject: (form.subject && form.subject.value) || '',
                    message: (form.message && form.message.value) || ''
                  }
                  try {
                    const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
                    if (!res.ok) throw new Error('send failed')
                    setSent(true)
                  } catch (err) {
                    // fallback to localStorage
                    try {
                      const key = 'jvedtech_contacts'
                      const cur = JSON.parse(localStorage.getItem(key) || '[]')
                      cur.push({ ...payload, date: new Date().toISOString() })
                      localStorage.setItem(key, JSON.stringify(cur))
                      setSent(true)
                    } catch (e) { alert('Could not send message') }
                  }
                }}
            >
              {sent ? (
                <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-brand-400/50 bg-brand-50 text-brand-600">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <h3 className="mt-6 font-display text-xl font-semibold text-brand-800">Message sent</h3>
                  <p className="mt-2 max-w-xs text-sm text-muted">
                    Thank you for reaching out. Our team will get back to you shortly.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="font-display text-xl font-semibold text-brand-800">Send a message</h3>
                  <p className="mt-2 text-sm text-muted">We typically respond within 24–48 hours.</p>

                  <div className="mt-8 grid gap-5 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-muted-dim">Name</span>
                        <input required type="text" name="name" className="w-full rounded-xl border border-brand-600/15 bg-brand-50/50 px-4 py-3.5 text-sm text-brand-900 outline-none transition placeholder:text-brand-700/35 focus:border-brand-400 focus:ring-2 focus:ring-brand-300/40" placeholder="Your name" />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-muted-dim">Email</span>
                        <input required type="email" name="email" className="w-full rounded-xl border border-brand-600/15 bg-brand-50/50 px-4 py-3.5 text-sm text-brand-900 outline-none transition placeholder:text-brand-700/35 focus:border-brand-400 focus:ring-2 focus:ring-brand-300/40" placeholder="you@email.com" />
                      </label>
                  </div>

                    <label className="mt-5 block">
                      <span className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-muted-dim">Subject</span>
                      <input required type="text" name="subject" className="w-full rounded-xl border border-brand-600/15 bg-brand-50/50 px-4 py-3.5 text-sm text-brand-900 outline-none transition placeholder:text-brand-700/35 focus:border-brand-400 focus:ring-2 focus:ring-brand-300/40" placeholder="Subject" />
                    </label>

                    <label className="mt-5 block">
                      <span className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-muted-dim">Message</span>
                      <textarea required name="message" rows={4} className="w-full resize-none rounded-xl border border-brand-600/15 bg-brand-50/50 px-4 py-3.5 text-sm text-brand-900 outline-none transition placeholder:text-brand-700/35 focus:border-brand-400 focus:ring-2 focus:ring-brand-300/40" placeholder="How can we help?" />
                    </label>

                    <Button type="submit" className="mt-8 w-full">Send Message</Button>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
