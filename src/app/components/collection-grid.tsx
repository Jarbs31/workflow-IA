import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { useVehicles } from '../vehicles-context'

export function CollectionGrid() {
  const { activeVehicles } = useVehicles()
  return (
    <section id="colecao" className="bg-white py-24 md:py-32 lg:py-40">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-24">
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-5 text-[13px] uppercase tracking-[0.24em] text-[var(--ds-warm-gray)]">
              A coleção
            </p>
            <h2 className="max-w-2xl text-[clamp(2rem,5vw,3.5rem)] font-light leading-[1.1] tracking-[-0.02em] text-[var(--ds-black)]">
              Seis expressões de excelência automotiva.
            </h2>
          </div>
          <a
            href="#contato"
            className="text-[13px] uppercase tracking-[0.16em] text-[var(--ds-black)] transition-colors duration-[150ms] hover:text-[var(--ds-gold)]"
          >
            Ver inventário completo
          </a>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {activeVehicles.map((v, i) => (
            <motion.article
              key={v.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: 'easeOut' }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--ds-surface)]">
                <ImageWithFallback
                  src={v.image}
                  alt={v.name}
                  className="h-full w-full object-cover transition-transform duration-[450ms] ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="mt-6 flex items-start justify-between">
                <div>
                  <p className="mb-2 text-[12px] uppercase tracking-[0.16em] text-[var(--ds-warm-gray)]">
                    {v.category}
                  </p>
                  <h3 className="text-[24px] font-normal tracking-[-0.01em] text-[var(--ds-black)]">
                    {v.name}
                  </h3>
                </div>
                <ArrowUpRight
                  strokeWidth={1.5}
                  className="mt-1 h-5 w-5 text-[var(--ds-black)] transition-all duration-[250ms] group-hover:text-[var(--ds-gold)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-[var(--ds-border)] pt-4">
                <span className="text-[14px] text-[var(--ds-charcoal)]">{v.power}</span>
                <span className="text-[14px] text-[var(--ds-black)]">{v.price}</span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
