import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EVENTS } from '../data/content'
import SectionHeader from './ui/SectionHeader'
import Reveal from './ui/Reveal'
import Button from './ui/Button'
import Input from './ui/Input'

const SAMPLE_EVENTS = EVENTS || []

function EventCard({ event, delay, onRegister }) {
  const eventDate = new Date(event.date)
  const day = eventDate.getDate()
  const month = eventDate.toLocaleString('en-US', { month: 'short' }).toUpperCase()

  const statusStyles = {
    upcoming: 'bg-brand-50 text-brand-700 border-brand-200',
    live: 'bg-green-50 text-sky-800 border-green-200 animate-pulse',
    past: 'bg-surface-muted text-muted border-sky-200',
  }

  return (
    <Reveal delay={delay}>
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3 }}
        className="group h-full"
      >
        <div className="card-premium flex h-full flex-col overflow-hidden rounded-2xl">
          <div className="relative border-b border-sky-200 p-6">
            <div className="absolute top-4 right-4 flex h-16 w-16 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-green-100">
              <div className="text-[10px] font-semibold uppercase text-brand-500">{month}</div>
              <div className="font-display text-2xl font-bold text-foreground">{day}</div>
            </div>

            <div className="mb-3 flex flex-wrap gap-2 pr-20">
              <span
                className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${statusStyles[event.status]}`}
              >
                {event.status === 'upcoming' ? 'Upcoming' : event.status === 'live' ? 'LIVE' : 'Past'}
              </span>
              <span className="inline-block rounded-full border border-sky-200 bg-surface-elevated px-3 py-1 text-xs font-semibold uppercase tracking-wider text-foreground-muted">
                {event.time.split('–')[0].trim()}
              </span>
            </div>

            <h3 className="pr-20 text-xl font-semibold text-foreground">{event.title}</h3>
          </div>

          <div className="flex flex-1 flex-col p-6">
            <p className="mb-5 flex-1 text-sm leading-relaxed text-foreground-muted">
              {event.description}
            </p>

            <div className="mb-6 space-y-3 border-t border-sky-200 pt-4">
              <div className="flex items-center gap-2 text-sm">
                <svg className="h-4 w-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium text-foreground">{event.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <svg className="h-4 w-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium text-foreground">{event.attendees} interested</span>
              </div>
            </div>

            <Button
              type="button"
              variant={event.status === 'past' ? 'secondary' : 'primary'}
              className="w-full"
              onClick={onRegister}
            >
              {event.status === 'past' ? 'Closed' : 'Register Now'}
            </Button>
          </div>
        </div>
      </motion.div>
    </Reveal>
  )
}

function RegistrationModal({ event, onClose, onSubmit }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) {
      alert('Please enter your name and email.')
      return
    }

    setSubmitting(true)
    const payload = {
      id: Date.now(),
      eventId: event.id,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      date: new Date().toISOString(),
    }

    const success = await onSubmit(payload)
    setSubmitting(false)
    if (success) {
      setName('')
      setEmail('')
      setPhone('')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-2xl rounded-3xl border border-sky-200 bg-gradient-to-br from-white via-sky-50 to-blue-50 border border-sky-200 p-8 shadow-2xl shadow-brand-900/10"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h3 className="mb-2 font-display text-2xl font-semibold text-foreground">
              Register: {event.title}
            </h3>
            <p className="text-sm text-foreground-muted">
              Complete the form below and we'll confirm your seat.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-brand-200 px-4 py-2 text-sm text-foreground-muted transition hover:bg-brand-50 hover:text-foreground"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            name="name"
            placeholder="Full name"
            required
          />
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            type="email"
            placeholder="Email"
            required
          />
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            name="phone"
            placeholder="Phone (optional)"
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Registering…' : 'Submit Registration'}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default function Events() {
  const [filter, setFilter] = useState('all')
  const [events, setEvents] = useState(SAMPLE_EVENTS)
  const [modalOpen, setModalOpen] = useState(false)
  const [activeEvent, setActiveEvent] = useState(null)

  useEffect(() => {
    setEvents(SAMPLE_EVENTS)
  }, [])

  async function submitRegistration(payload) {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Registration request failed')
      }
      return true
    } catch (error) {
      try {
        const key = 'jvedtech_event_regs'
        const stored = JSON.parse(localStorage.getItem(key) || '[]')
        stored.push(payload)
        localStorage.setItem(key, JSON.stringify(stored))
        return true
      } catch (storageError) {
        return false
      }
    }
  }

  const openRegister = (event) => {
    setActiveEvent(event)
    setModalOpen(true)
  }

  const handleModalSubmit = async (payload) => {
    const success = await submitRegistration(payload)
    if (success) {
      alert('Registered successfully.')
      setModalOpen(false)
    } else {
      alert('Unable to register. Please try again.')
    }
  }

  const filteredEvents = filter === 'all' ? events : events.filter((item) => item.status === filter)

  return (
    <section id="events" className="section-padding relative overflow-hidden bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-100">
      <div className="pointer-events-none absolute inset-0 mesh-gradient opacity-30" />
      <div className="section-container relative">
        <SectionHeader
          label="Learning & Networking"
          title="Upcoming Events"
          description="Join our webinars, workshops, and summits to stay updated on the latest trends in healthcare education and AI-driven innovation."
        />

        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-wrap gap-2">
            {['all', 'upcoming', 'past'].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                  filter === option
                    ? 'btn-gradient text-foreground shadow-md shadow-brand-300/20'
                    : 'border border-brand-200 bg-gradient-to-br from-white via-sky-50 to-blue-50 border border-sky-200 text-foreground-muted hover:border-brand-300 hover:bg-brand-50'
                }`}
              >
                {option === 'all' ? 'All Events' : option === 'upcoming' ? 'Upcoming' : 'Past Events'}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                delay={index * 0.08}
                onRegister={() => openRegister(event)}
              />
            ))
          ) : (
            <div className="col-span-2 py-16 text-center">
              <p className="text-foreground-muted">No events matched that filter.</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && activeEvent && (
          <RegistrationModal
            event={activeEvent}
            onClose={() => setModalOpen(false)}
            onSubmit={handleModalSubmit}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
