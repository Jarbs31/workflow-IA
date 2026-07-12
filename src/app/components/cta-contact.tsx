import { useState } from 'react'
import { motion } from 'motion/react'
import { Check } from 'lucide-react'

export function CtaContact() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setSent(true)
  }

  return (
    <section id="contato" className="bg-white py-24 md:py-32 lg:py-40">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <p className="mb-5 text-[13px] uppercase tracking-[0.24em] text-[var(--ds-warm-gray)]">
              Atendimento exclusivo
            </p>
            <h2 className="max-w-md text-[clamp(2rem,4vw,3rem)] font-light leading-[1.1] tracking-[-0.02em] text-[var(--ds-black)]">
              Converse com um especialista da coleção.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="flex flex-col justify-center"
          >
            {sent ? (
              <div className="flex items-center gap-4 border-t border-[var(--ds-border)] pt-8">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--ds-surface)] text-[var(--ds-gold)]">
                  <Check strokeWidth={1.5} className="h-5 w-5" />
                </span>
                <p className="text-[16px] text-[var(--ds-charcoal)]">
                  Recebemos seu contato. Um consultor retornará em breve.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <label
                    htmlFor="email"
                    className="text-[12px] uppercase tracking-[0.16em] text-[var(--ds-warm-gray)]"
                  >
                    Seu e-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nome@email.com"
                    className="h-14 border-b border-[var(--ds-border)] bg-transparent text-[18px] text-[var(--ds-black)] outline-none transition-colors duration-[150ms] placeholder:text-[var(--ds-warm-gray)] focus:border-[var(--ds-gold)]"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex h-14 w-full items-center justify-center bg-[var(--ds-black)] px-10 text-[13px] uppercase tracking-[0.16em] text-white transition-colors duration-[250ms] hover:bg-[var(--ds-gold)] sm:w-auto sm:self-start"
                >
                  Solicitar contato
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
