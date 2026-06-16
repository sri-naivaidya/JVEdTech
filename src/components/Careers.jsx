import { useState } from 'react'
import { motion } from 'framer-motion'
import { OPEN_POSITIONS, COMPANY_VALUES, COMPANY_PERKS, CONTACT_INFO } from '../data/content'
import SectionHeader from './ui/SectionHeader'
import Reveal from './ui/Reveal'
import Button from './ui/Button'
import Input, { Textarea, Select } from './ui/Input'
import TiltCard from './ui/TiltCard'
import useCmsContent from '../hooks/useCmsContent'
import { apiFetch } from '../utils/api'

function ValueCard({ value, delay }) {
  return (
    <Reveal delay={delay}>
      <TiltCard className="h-full" depth={7} lift={5}>
        <div className="card-premium h-full p-8">
          <div className="mb-4 text-3xl">{value.icon}</div>
          <h3 className="mb-2 font-display text-lg font-semibold text-foreground">{value.title}</h3>
          <p className="text-sm leading-relaxed text-foreground-muted">{value.description}</p>
        </div>
      </TiltCard>
    </Reveal>
  )
}

function PerkCard({ perk }) {
  return (
    <div className="text-center">
      <div className="mb-3 text-3xl">{perk.icon}</div>
      <h4 className="mb-1 font-semibold text-foreground">{perk.title}</h4>
      <p className="text-sm text-foreground-muted">{perk.description}</p>
    </div>
  )
}

function JobCard({ job, index }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Reveal delay={index * 0.08}>
      <motion.div layout>
        <TiltCard className="overflow-hidden rounded-2xl border border-white/75 bg-white/78 shadow-[0_24px_70px_-36px_rgba(14,165,233,0.42)] backdrop-blur-2xl transition-all duration-300 hover:border-emerald-200">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-start justify-between gap-4 p-6 text-left transition-colors hover:bg-white/10"
        >
          <div className="flex-1">
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
                {job.department}
              </span>
              <span className="inline-block rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold uppercase tracking-wider text-foreground-muted">
                {job.type}
              </span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">{job.title}</h3>
            <p className="text-sm leading-relaxed text-foreground-muted">{job.summary}</p>
          </div>

          <motion.div
            animate={{ rotate: expanded ? 90 : 0 }}
            transition={{ duration: 0.25 }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-200 text-brand-600"
          >
            →
          </motion.div>
        </button>

        <motion.div
          initial={false}
          animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <div className="border-t border-emerald-200 bg-surface-elevated/50 px-6 py-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-600">
              Key Skills Required
            </p>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700"
                >
                  {skill}
                </span>
              ))}
            </div>

            <Button
              type="button"
              variant="primary"
              className="mt-5"
              onClick={() => document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Apply for this Role →
            </Button>
          </div>
        </motion.div>
        </TiltCard>
      </motion.div>
    </Reveal>
  )
}

export default function Careers() {
  const [applicationSent, setApplicationSent] = useState(false)
  const cmsJobs = useCmsContent('/api/public/careers', OPEN_POSITIONS)
  const jobs = cmsJobs.map((job, index) => ({
    ...job,
    id: job.id || job._id || index,
    title: job.title || job.role,
    summary: job.summary || job.description,
    skills: job.skills || String(job.requirements || '').split('\n').filter(Boolean),
  }))

  const handleApplicationSubmit = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData(e.currentTarget)
      formData.set('name', `${formData.get('firstName')} ${formData.get('lastName')}`.trim())
      formData.set('appliedRole', formData.get('role'))
      await apiFetch('/api/applications', { method: 'POST', body: formData, headers: {} })
      setApplicationSent(true)
      e.currentTarget.reset()
    } catch (error) {
      alert('Unable to submit application. Please try again.')
    }
  }

  return (
    <section id="careers" className="relative overflow-hidden">
      <div className="section-padding section-surface-blue relative">
        <div className="pointer-events-none absolute inset-0 mesh-gradient opacity-30" />
        <div className="section-container relative">
          <Reveal>
            <div className="max-w-3xl">
              <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
                We're Hiring
              </span>
              <h2 className="mb-4 font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl">
                Shape the Future of{' '}
                <span className="text-gradient">Healthcare Education</span>
              </h2>
              <p className="mb-8 max-w-2xl text-lg leading-relaxed text-foreground-muted">
                At JVEDTECH Medovation, we advance healthcare standards through tailored education and cutting-edge solutions. Join a team where learning, growth, and impact converge.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  onClick={() => document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View Open Roles
                </Button>
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Apply Now
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="section-padding section-surface-green border-y border-white/70">
        <div className="section-container">
          <SectionHeader
            label="Why JVedtech"
            title="Where expertise meets purpose"
            description="We believe the best healthcare outcomes start with the best-trained people."
          />

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {COMPANY_VALUES.map((value, i) => (
              <ValueCard key={value.title} value={value} delay={i * 0.1} />
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="glass-strong mt-12 overflow-hidden rounded-3xl p-8 sm:p-12">
              <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
                {COMPANY_PERKS.map((perk) => (
                  <PerkCard key={perk.title} perk={perk} />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <div id="open-positions" className="section-padding section-surface-coral">
        <div className="section-container">
          <SectionHeader
            label="Open Positions"
            title="Find your role at JVedtech"
            description="We're growing our team with professionals passionate about advancing healthcare through education and innovation."
          />

          <div className="mt-10 space-y-4">
            {jobs.map((job, index) => (
              <JobCard key={job.id} job={job} index={index} />
            ))}
          </div>
        </div>
      </div>

      <div className="section-padding section-surface-blue">
        <div className="section-container">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <h2 className="mb-8 font-display text-2xl font-bold text-foreground">Get in Touch</h2>

              <div className="space-y-6 text-foreground-muted">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-600">Email</p>
                  <a
                    href={`mailto:${CONTACT_INFO.email}`}
                    className="text-foreground transition-colors hover:text-brand-600"
                  >
                    {CONTACT_INFO.email}
                  </a>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-600">Phone</p>
                  <a
                    href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`}
                    className="text-foreground transition-colors hover:text-brand-600"
                  >
                    {CONTACT_INFO.phone}
                  </a>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-600">Address</p>
                  <p className="text-foreground">{CONTACT_INFO.address}</p>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-600">
                    Response Time
                  </p>
                  <p className="text-foreground-muted">We aim to respond within 3–5 business days</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div id="apply-form" className="glass-strong rounded-3xl p-8">
                <h3 className="mb-2 text-xl font-semibold text-foreground">Submit Your Application</h3>
                <p className="mb-6 text-sm text-foreground-muted">
                  Complete the form and our team will be in touch shortly.
                </p>

                {applicationSent && (
                  <div className="mb-5 rounded-2xl border border-green-200 bg-green-50/80 px-4 py-3 text-sm font-medium text-green-700">
                    Application submitted successfully.
                  </div>
                )}

                <form className="space-y-4" onSubmit={handleApplicationSubmit}>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input required name="firstName" type="text" placeholder="First Name" />
                    <Input required name="lastName" type="text" placeholder="Last Name" />
                  </div>

                  <Input required name="email" type="email" placeholder="Email Address" />
                  <Input required name="phone" type="tel" placeholder="Phone Number" />

                  <Select required name="role" defaultValue="">
                    <option value="">Select a role</option>
                    {jobs.map((job) => (
                      <option key={job.id} value={job.title}>
                        {job.title}
                      </option>
                    ))}
                  </Select>

                  <Textarea required name="message" placeholder="Tell us why you're a great fit..." rows={3} />
                  <Input name="resume" type="file" accept=".pdf,.doc,.docx" />

                  <Button type="submit" variant="primary" className="w-full">
                    Submit Application
                  </Button>
                </form>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
