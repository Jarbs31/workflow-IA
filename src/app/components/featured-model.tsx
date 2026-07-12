import { motion } from 'motion/react'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { IMAGES } from '../data'

const SPECS = [
  { label: 'Potência', value: '720', unit: 'cv' },
  { label: '0–100 km/h', value: '2.8', unit: 's' },
  { label: 'Velocidade máx.', value: '340', unit: 'km/h' },
  { label: 'Torque', value: '800', unit: 'Nm' },
]

export function FeaturedModel() {
  return (
    <section id="destaque" className="bg-[var(--ds-surface)] py-24 md:py-32 lg:py-40">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-4"
          >
            <p className="mb-5 text-[13px] uppercase tracking-[0.24em] text-[var(--ds-gold)]">
              Em destaque
            </p>
            <h2 className="text-[clamp(2.25rem,4vw,3.5rem)] font-light leading-[1.05] tracking-[-0.02em] text-[var(--ds-black)]">
              Track R
            </h2>
            <p className="mt-6 max-w-sm text-[16px] leading-[1.5] text-[var(--ds-charcoal)]">
              Concebido sem concessões. Cada grama removido, cada linha refinada em túnel de vento —
              a expressão máxima de performance da nossa engenharia.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-8">
              {SPECS.map((s) => (
                <div key={s.label} className="border-t border-[var(--ds-border)] pt-4">
                  <p className="text-[12px] uppercase tracking-[0.16em] text-[var(--ds-warm-gray)]">
                    {s.label}
                  </p>
                  <p className="mt-2 text-[32px] font-light leading-none tracking-[-0.02em] text-[var(--ds-black)]">
                    {s.value}
                    <span className="ml-1 text-[15px] text-[var(--ds-warm-gray)]">{s.unit}</span>
                  </p>
                </div>
              ))}
            </div>

            <a
              href="#contato"
              className="mt-12 inline-flex h-14 items-center bg-[var(--ds-black)] px-10 text-[13px] uppercase tracking-[0.16em] text-white transition-colors duration-[250ms] hover:bg-[var(--ds-gold)]"
            >
              Agendar test drive
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-8"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-[var(--ds-stone)]">
              <ImageWithFallback
                src={IMAGES.featured}
                alt="Track R em destaque"
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
