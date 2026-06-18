import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'

type Role = 'assistant' | 'user'
type Message = {
  id: number
  role: Role
  text: string
}

const API_KEY = '' // Insert AI API Key here to enable provider-based answers.
// For production, replace the fetch block below with your preferred LLM provider integration.

const FALLBACK_RESPONSES: Record<string, string[]> = {
  appointment: [
    'You can book an appointment by contacting Naivaidya support or visiting the contact page for the nearest care team.',
    'If this is urgent, call the emergency line listed on the site and mention that you need immediate assistance.',
  ],
  ambulance: [
    'For ambulance dispatch guidance, please contact the emergency support line on the website and share your location and medical urgency.',
    'Our team can help direct the nearest ambulance response workflow and next steps for care coordination.',
  ],
  contact: [
    'You can find all Naivaidya contact details on the contact page, including emergency and general support channels.',
    'If you need immediate help, use the emergency contact information listed on the site right away.',
  ],
  services: [
    'Naivaidya provides healthcare navigation, emergency support guidance, and care coordination solutions for patients and families.',
    'You can review the services section to understand the available healthcare pathways and support options.',
  ],
}

const fallbackAnswer = (input: string) => {
  const text = input.toLowerCase()

  if (text.includes('ambulance') || text.includes('dispatch') || text.includes('emergency')) {
    return FALLBACK_RESPONSES.ambulance[0]
  }

  if (text.includes('appointment') || text.includes('book') || text.includes('schedule')) {
    return FALLBACK_RESPONSES.appointment[0]
  }

  if (text.includes('contact') || text.includes('phone') || text.includes('call')) {
    return FALLBACK_RESPONSES.contact[0]
  }

  if (text.includes('service') || text.includes('solution') || text.includes('healthcare')) {
    return FALLBACK_RESPONSES.services[0]
  }

  return 'I am currently in fallback mode. I can help with appointment guidance, ambulance dispatch support, emergency contacts, and healthcare navigation. Please tell me what you need right now.'
}

const buildPrompt = (history: Message[]) => [
  {
    role: 'system' as const,
    content:
      'You are JVedtech Assistant, a premium healthcare support assistant for a medical-tech website. Reply clearly, empathetically, and concisely. If asked about appointments, emergency contact, ambulance workflow, or services, provide practical guidance without replacing professional medical care. If a request cannot be answered reliably, switch to fallback guidance.',
  },
  ...history.map((entry) => ({ role: entry.role, content: entry.text })),
]

const askProvider = async (history: Message[]) => {
  if (!API_KEY.trim()) {
    return { ok: false, reason: 'missing-api-key' as const }
  }

  try {
    // Replace this fetch block with your preferred provider (OpenAI, Azure OpenAI, Anthropic, etc.).
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.4,
        max_tokens: 220,
        messages: buildPrompt(history),
      }),
    })

    if (!response.ok) {
      throw new Error(`Provider request failed with status ${response.status}`)
    }

    const data = await response.json()
    const content = data?.choices?.[0]?.message?.content?.trim()

    if (!content) {
      throw new Error('Provider returned an empty response')
    }

    return { ok: true, content }
  } catch (error) {
    console.warn('Naivaidya AI provider unavailable, using fallback mode.', error)
    return { ok: false, reason: 'provider-unavailable' as const }
  }
}

interface NaivaidyaAssistantProps {
  onClose: () => void
}

export default function NaivaidyaAssistant({ onClose }: NaivaidyaAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      text: "Hello! I'm JVedtech Assistant. How can I help you today?",
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const endRef = useRef<HTMLDivElement | null>(null)

  const isApiConfigured = useMemo(() => Boolean(API_KEY.trim()), [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, isTyping])

  const handleSend = async () => {
    const value = input.trim()
    if (!value) return

    const userMessage: Message = { id: Date.now(), role: 'user', text: value }
    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setInput('')
    setIsTyping(true)

    const providerResult = await askProvider(nextMessages)

    if (providerResult.ok && providerResult.content) {
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'assistant', text: providerResult.content }])
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          text: fallbackAnswer(value),
        },
      ])
    }

    setIsTyping(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.98 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="fixed bottom-6 right-6 z-[100] w-[min(92vw,420px)]"
    >
      <div className="rounded-[28px] border border-white/60 bg-white/80 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.45)] shadow-cyan-200/60 backdrop-blur-2xl">
        <div className="rounded-[28px] bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(240,253,250,0.9))] p-[1px]">
          <div className="rounded-[27px] bg-[linear-gradient(145deg,rgba(255,255,255,0.94),rgba(240,253,250,0.9))]">
            <header className="flex items-center justify-between rounded-t-[27px] border-b border-slate-200/70 bg-white/70 px-4 py-4 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 via-cyan-200 to-emerald-200 shadow-lg shadow-cyan-200/60">
                  <div className="absolute inset-0 rounded-2xl border border-white/30" />
                  <img
                    src="/chaat-icon.png"
                    alt="JVedtech assistant"
                    className="relative h-6 w-6 object-contain"
                  />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-cyan-700">JVedtech AI</p>
                  <h3 className="text-base font-semibold text-slate-900">JVedtech Healthcare Assistant</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 hover:text-slate-900"
                aria-label="Close chatbot"
              >
                ×
              </button>
            </header>

            <div className="max-h-[60vh] overflow-y-auto px-4 py-4 sm:max-h-[66vh]">
              <div className="mb-3 rounded-2xl border border-cyan-100/80 bg-cyan-50/70 px-3 py-2 text-xs text-slate-700 shadow-sm">
                {isApiConfigured ? 'AI provider mode is enabled.' : 'AI provider not configured. Using trusted fallback guidance.'}
              </div>

              <div className="space-y-3">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-3xl px-4 py-3 text-sm shadow-sm ${
                        message.role === 'user'
                          ? 'rounded-br-md bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-300 text-white'
                          : 'rounded-bl-md border border-slate-200/80 bg-white/90 text-slate-700'
                      }`}
                    >
                      {message.text}
                    </div>
                  </motion.div>
                ))}

                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="flex justify-start"
                    >
                      <div className="rounded-3xl rounded-bl-md border border-slate-200/80 bg-white/90 px-4 py-3 text-sm text-slate-600 shadow-sm">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 [animation-delay:120ms]" />
                          <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300 [animation-delay:240ms]" />
                          <span className="ml-1 text-xs text-slate-500">Thinking…</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div ref={endRef} />
            </div>

            <footer className="rounded-b-[27px] border-t border-slate-200/70 bg-white/70 p-3 backdrop-blur-xl">
              <div className="flex items-end gap-2 rounded-2xl border border-slate-200/80 bg-white/95 p-2 shadow-inner shadow-cyan-100/60">
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault()
                      void handleSend()
                    }
                  }}
                  rows={1}
                  placeholder="Ask about appointments, urgency, or services…"
                  className="min-h-[44px] flex-1 resize-none border-0 bg-transparent px-2 py-1 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => void handleSend()}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-300 text-white shadow-md shadow-cyan-200/60 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-200/70"
                  aria-label="Send message"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
