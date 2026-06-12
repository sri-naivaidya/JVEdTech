import { motion } from 'framer-motion'
import SectionHeader from './ui/SectionHeader'
import AnimatedIconBox from './ui/AnimatedIconBox'
import Reveal from './ui/Reveal'
import {
  IconEducation,
  IconAI,
  IconChart,
  IconMegaphone,
  IconGlobe,
  IconBulb,
} from './icons/ServiceIcons'

const SERVICES = [
  {
    icon: IconEducation,
    animation: 'education',
    title: 'EduGlobe',
    description:
      'Our Educational Services are designed to empower healthcare professionals with the knowledge and skills they need to excel in a constantly evolving industry.',
    highlights: [
      'Customized Training Programs tailored to meet the specific needs of healthcare providers, institutions, and organizations.',
      'Workshops, Seminars & Webinars focused on the latest trends and advancements in healthcare.',
      'E-Learning Modules that provide interactive, online learning tools for flexible and accessible education.',
      'Skill Development in areas such as patient care, technology integration, and regulatory compliance.',
    ],
  },
  {
    icon: IconMegaphone,
    animation: 'megaphone',
    title: 'Digital Ad Pro Expertise',
    description:
      'Our Digital Ad Pro Expertise focuses on revolutionizing healthcare marketing by implementing innovative digital strategies.',
    highlights: [
      'Targeted Campaigns that reach the right audience with personalized healthcare messaging.',
      'Social Media Management that engages patients and stakeholders through impactful campaigns.',
      'Pay-Per-Click (PPC) Advertising to drive traffic and conversions with effective ad placements.',
      'Content Marketing that creates informative, high-quality content tailored to the healthcare industry.',
    ],
  },
  {
    icon: IconAI,
    animation: 'ai',
    title: 'Medi AI Informatics',
    description:
      'Our Medi AI Informatics services harness artificial intelligence to transform healthcare workflows and patient decision-making.',
    highlights: [
      'AI-Powered Diagnostics that enable faster and more accurate disease detection.',
      'Natural Language Processing (NLP) to streamline patient communication and record-keeping.',
      'Remote Patient Monitoring using AI tools to track health metrics and alert caregivers.',
      'Decision Support Systems that empower providers with data-driven insights for better decisions.',
    ],
  },
  {
    icon: IconGlobe,
    animation: 'globe',
    title: 'In-Home Wellness',
    description:
      "Our In-Home Wellness services redefine patient care by bringing top-notch medical services into the comfort of patients' homes.",
    highlights: [
      'Home Health Monitoring for continuous tracking of health metrics with advanced technology.',
      'Nursing and Caregiver Services delivered by skilled professionals for personalized support.',
      'Rehabilitation Therapy including physical, occupational, and speech therapy at home.',
      'Medication Management that ensures patients adhere to prescribed treatments with guidance and support.',
    ],
  },
  {
    icon: IconBulb,
    animation: 'bulb',
    title: 'Holistic Wellbeing',
    description:
      'Holistic Wellbeing is dedicated to enhancing mental, physical, and emotional health through a comprehensive wellness approach.',
    highlights: [
      'Mental Health Support with counseling, stress management programs, and mindfulness techniques.',
      'Physical Fitness Programs, nutrition guidance, and lifestyle coaching for optimal health.',
      'Emotional Wellness training for resilience, balance, and stronger emotional intelligence.',
      'Integrative Health Solutions that combine traditional and alternative approaches for overall wellbeing.',
    ],
  },
  {
    icon: IconChart,
    animation: 'chart',
    title: 'Leadership & Entrepreneurship',
    description:
      'Our Leadership & Entrepreneurship programs cultivate healthcare innovators and leaders for the next generation.',
    highlights: [
      'Strategic Leadership training to develop visionary leadership skills and drive transformation.',
      'Innovation Management that fosters entrepreneurial thinking and breakthrough healthcare solutions.',
      'Business Development coaching in market analysis, planning, and building sustainable enterprises.',
      'Change Management support to help leaders navigate complex healthcare transformations effectively.',
    ],
  },
]

export default function Services() {
  return (
    <section id="services" className="section-padding relative overflow-hidden bg-gradient-to-br from-green-50 via-cyan-50 to-emerald-100">
      <div className="pointer-events-none absolute inset-0 mesh-gradient opacity-40" />
      <div className="section-container relative">
        <div className="mb-14 max-w-3xl">
          <SectionHeader
            label="Our Services"
            title="We Are at the Forefront of Healthcare"
            description="We deliver exceptional services in education, patient care, digital advertising, and medical innovation to empower growth, accessibility, and transformation."
          />
          <Reveal delay={0.1}>
            <p className="mt-6 text-base leading-relaxed text-emerald-900-muted">
              JVEDTECH Medovation is at the forefront of the healthcare sector, delivering exceptional services in education, patient care, digital advertising, and medical product import-export. We empower growth and transformation for healthcare organizations, professionals, and patients.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => {
            const Icon = service.icon
            return (
              <Reveal key={service.title} delay={(i % 3) * 0.1}>
                <motion.article
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-green-200 bg-gradient-to-br from-white via-green-50 to-cyan-50 p-7 shadow-sm transition-shadow duration-300 hover:border-green-300 hover:shadow-xl hover:shadow-green-200/40"
                >
                  <div className="card-shine pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100" />

                  <div className="relative flex flex-1 flex-col">
                    <AnimatedIconBox animation={service.animation}>
                      <Icon />
                    </AnimatedIconBox>

                    <h3 className="mt-5 text-xl font-semibold text-emerald-900">{service.title}</h3>

                    <p className="mt-3 text-sm leading-relaxed text-emerald-900-muted">
                      {service.description}
                    </p>

                    <ul className="mt-5 flex-1 space-y-3 text-sm text-emerald-900-muted">
                      {service.highlights.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="mt-1.5 inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
