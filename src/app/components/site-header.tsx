import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { IMAGES, NAV_ITEMS } from '../data'

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-[250ms] ${
          scrolled && !open
            ? 'bg-white/80 backdrop-blur-md border-b border-[var(--ds-border)]'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 md:px-12 lg:px-24">
          <a
            href="#inicio"
            className="tracking-[0.4em] uppercase text-[15px] text-[var(--ds-black)]"
          >
            Meridian
          </a>

          <nav className="hidden items-center gap-12 lg:flex">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[13px] uppercase tracking-[0.16em] text-[var(--ds-black)] transition-colors duration-[150ms] hover:text-[var(--ds-gold)]"
              >
                {item.label}
              </a>
            ))}
            <Link
              to="/login"
              className="text-[13px] uppercase tracking-[0.16em] text-[var(--ds-gold)] transition-colors duration-[150ms] hover:text-[var(--ds-gold-strong)]"
            >
              Login
            </Link>
          </nav>

          <button
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
            className="flex h-11 w-11 items-center justify-center text-[var(--ds-black)] transition-colors duration-[150ms] hover:text-[var(--ds-gold)]"
          >
            <Menu strokeWidth={1.5} className="h-6 w-6" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="fixed inset-0 z-[60] bg-[var(--ds-black)] text-white"
          >
            <div className="grid h-full grid-cols-1 md:grid-cols-2">
              <div className="flex flex-col px-6 py-8 md:px-12 lg:px-24">
                <div className="flex items-center justify-between">
                  <span className="tracking-[0.4em] uppercase text-[15px]">Meridian</span>
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Fechar menu"
                    className="flex h-11 w-11 items-center justify-center transition-colors duration-[150ms] hover:text-[var(--ds-gold)]"
                  >
                    <X strokeWidth={1.5} className="h-6 w-6" />
                  </button>
                </div>

                <nav className="mt-auto flex flex-col gap-2 pb-6">
                  {NAV_ITEMS.map((item, i) => (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 + i * 0.06, ease: 'easeOut' }}
                      className="text-[clamp(2rem,5vw,3.5rem)] font-light leading-[1.1] tracking-[-0.02em] text-[var(--ds-stone)] transition-colors duration-[150ms] hover:text-[var(--ds-gold)]"
                    >
                      {item.label}
                    </motion.a>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' }}
                  >
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="text-[clamp(2rem,5vw,3.5rem)] font-light leading-[1.1] tracking-[-0.02em] text-[var(--ds-gold)] transition-colors duration-[150ms] hover:text-white"
                    >
                      Login
                    </Link>
                  </motion.div>
                </nav>

                <p className="text-[13px] uppercase tracking-[0.16em] text-[var(--ds-warm-gray)]">
                  contato@meridian.auto · +55 11 4000-0000
                </p>
              </div>

              <div className="relative hidden md:block">
                <ImageWithFallback
                  src={IMAGES.menu}
                  alt="Automóvel premium"
                  className="h-full w-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[var(--ds-black)]" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
