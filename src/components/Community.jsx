import { COMMUNITY_DATA, CONTACT_INFO } from '../data/content'
import Reveal from './ui/Reveal'
import Button from './ui/Button'
import TiltCard from './ui/TiltCard'

function BenefitItem({ benefit, index }) {
  return (
    <Reveal delay={index * 0.08}>
      <div className="flex gap-4">
        <div className="shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-brand-200 bg-gradient-to-br from-brand-50 to-green-50">
            <svg className="h-4 w-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <div>
          <h4 className="mb-1 text-sm font-semibold text-foreground">{benefit.title}</h4>
          <p className="text-sm text-foreground-muted">{benefit.description}</p>
        </div>
      </div>
    </Reveal>
  )
}

export default function Community() {
  return (
    <section id="community" className="section-padding section-surface-green relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="mesh-gradient absolute inset-0 opacity-45" />
      </div>

      <div className="section-container relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-block h-px w-12 bg-gradient-to-r from-brand-300 to-green-300" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
                Community
              </span>
            </div>

            <h2 className="mb-4 font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl">
              Where healthcare meets <em className="text-gradient-accent not-italic">innovation.</em>
            </h2>

            <p className="mb-8 max-w-md text-lg leading-relaxed text-foreground-muted">
              {COMMUNITY_DATA.description}
            </p>

            <div className="mb-10 flex flex-wrap gap-8 border-y border-brand-100 py-6">
              {COMMUNITY_DATA.stats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-display text-2xl font-bold text-foreground">{stat.number}</div>
                  <p className="mt-1 text-xs uppercase tracking-widest text-muted">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {[CONTACT_INFO.whatsapp, CONTACT_INFO.whatsappSecondary].map((href, index) => (
                <Button
                  key={href}
                  href={href}
                  variant="primary"
                  className="group gap-3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                  </svg>
                  {index === 0 ? COMMUNITY_DATA.cta : 'Join Community Group'}
                  <span className="transition-transform group-hover:translate-x-1">{'\u2192'}</span>
                </Button>
              ))}
            </div>

            <p className="mt-4 text-sm text-muted">{COMMUNITY_DATA.note}</p>
          </Reveal>

          <Reveal delay={0.2}>
            <TiltCard className="card-glass rounded-3xl p-8 sm:p-10">
              <div className="mb-8 flex items-center gap-4 border-b border-brand-100 pb-8">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-500 shadow-lg shadow-green-500/30">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                    Official Network
                  </p>
                  <p className="font-semibold text-foreground">JVedtech Community</p>
                </div>
              </div>

              <div className="space-y-6">
                {COMMUNITY_DATA.benefits.map((benefit, index) => (
                  <BenefitItem key={benefit.title} benefit={benefit} index={index} />
                ))}
              </div>

              <div className="mt-8 flex items-center gap-4 border-t border-brand-100 pt-8">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-brand-300 to-green-300 text-xs font-semibold text-foreground"
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-brand-50 text-xs font-semibold text-brand-700">
                    +
                  </div>
                </div>
                <p className="text-sm text-foreground-muted">
                  <span className="font-semibold text-foreground">Multiple groups integrated</span> {'\u2014'} one entry point
                </p>
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
