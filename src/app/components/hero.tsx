import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { IMAGES } from '../data'

export function Hero() {
  return (
    <section id="inicio" className="relative min-h-screen overflow-hidden bg-[var(--ds-black)]">
      <ImageWithFallback
        src={IMAGES.heroCar}
        alt="Automóvel esportivo premium"
        className="absolute inset-0 h-full w-full object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--ds-black)] via-[var(--ds-black)]/30 to-[var(--ds-black)]/60" />

      <div className="relative mx-auto flex min-h-screen max-w-[1440px] flex-col justify-end px-6 pb-24 pt-40 md:px-12 lg:px-24">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-6 text-[13px] uppercase tracking-[0.24em] text-[var(--ds-gold)]"
        >
          Coleção 2026 · Edição limitada
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          className="max-w-4xl text-[clamp(2.75rem,8vw,5.5rem)] font-light leading-[0.95] tracking-[-0.03em] text-white"
        >
          A engenharia do desejo, em cada detalhe.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
          className="mt-10 flex flex-col items-start gap-8 sm:flex-row sm:items-center"
        >
          <a
            href="#colecao"
            className="group inline-flex h-14 items-center gap-3 bg-white px-10 text-[13px] uppercase tracking-[0.16em] text-[var(--ds-black)] transition-colors duration-[250ms] hover:bg-[var(--ds-gold)]"
          >
            Explorar coleção
            <ArrowRight
              strokeWidth={1.5}
              className="h-4 w-4 transition-transform duration-[250ms] group-hover:translate-x-1"
            />
          </a>
          <p className="max-w-xs text-[15px] leading-[1.5] text-[var(--ds-stone)]">
            Uma curadoria de automóveis excepcionais, do clássico atemporal ao desempenho absoluto.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
