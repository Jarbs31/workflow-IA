import { motion } from 'motion/react'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { IMAGES } from '../data'

export function EditorialSection() {
  return (
    <section id="editorial" className="relative overflow-hidden bg-[var(--ds-black)]">
      <ImageWithFallback
        src={IMAGES.editorial}
        alt="Automóvel em iluminação cinematográfica"
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-[var(--ds-black)]/50" />

      <div className="relative mx-auto max-w-[1440px] px-6 py-32 md:px-12 lg:px-24 lg:py-40">
        <motion.blockquote
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-4xl"
        >
          <p className="text-[13px] uppercase tracking-[0.24em] text-[var(--ds-gold)]">
            Filosofia
          </p>
          <p className="mt-8 text-[clamp(1.75rem,4vw,3rem)] font-light leading-[1.15] tracking-[-0.02em] text-white">
            Não vendemos apenas automóveis. Curamos objetos de desejo que atravessam gerações — onde
            forma, matéria e movimento encontram propósito.
          </p>
          <footer className="mt-10 text-[14px] uppercase tracking-[0.16em] text-[var(--ds-stone)]">
            — Direção de curadoria, Meridian
          </footer>
        </motion.blockquote>
      </div>
    </section>
  )
}
