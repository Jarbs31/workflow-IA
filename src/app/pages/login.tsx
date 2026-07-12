import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { motion } from 'motion/react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useAuth } from '../auth-context'

export function Login() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('jarbsonsilva.22@gmail.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const { error: signInError } = await signIn(email.trim(), password)
    setSubmitting(false)

    if (signInError) {
      setError(signInError)
      return
    }

    navigate('/admin')
  }

  return (
    <div className="flex min-h-screen bg-white text-[var(--ds-black)]">
      <div className="hidden lg:block lg:w-1/2 bg-[var(--ds-black)]" />

      <div className="flex w-full flex-col px-6 py-8 md:px-12 lg:w-1/2 lg:px-24">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.16em] text-[var(--ds-warm-gray)] transition-colors duration-[150ms] hover:text-[var(--ds-black)]"
          >
            <ArrowLeft strokeWidth={1.5} className="h-4 w-4" />
            Voltar ao site
          </Link>
          <span className="tracking-[0.4em] uppercase text-[15px]">Meridian</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="my-auto max-w-md"
        >
          <p className="mb-5 text-[13px] uppercase tracking-[0.24em] text-[var(--ds-warm-gray)]">
            Área administrativa
          </p>
          <h1 className="text-[clamp(2rem,4vw,3rem)] font-light leading-[1.1] tracking-[-0.02em]">
            Acesse o painel de gestão.
          </h1>

          <form onSubmit={handleSubmit} className="mt-12 flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <label
                htmlFor="login-email"
                className="text-[12px] uppercase tracking-[0.16em] text-[var(--ds-warm-gray)]"
              >
                E-mail
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jarbsonsilva.22@gmail.com"
                required
                autoComplete="email"
                className="h-14 border-b border-[var(--ds-border)] bg-transparent text-[18px] outline-none transition-colors duration-[150ms] placeholder:text-[var(--ds-warm-gray)] focus:border-[var(--ds-gold)]"
              />
            </div>
            <div className="flex flex-col gap-3">
              <label
                htmlFor="login-password"
                className="text-[12px] uppercase tracking-[0.16em] text-[var(--ds-warm-gray)]"
              >
                Senha
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="h-14 border-b border-[var(--ds-border)] bg-transparent text-[18px] outline-none transition-colors duration-[150ms] placeholder:text-[var(--ds-warm-gray)] focus:border-[var(--ds-gold)]"
              />
            </div>

            {error && (
              <p className="text-[14px] leading-[1.5] text-[var(--destructive)]">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="group inline-flex h-14 items-center justify-center gap-3 bg-[var(--ds-black)] px-10 text-[13px] uppercase tracking-[0.16em] text-white transition-colors duration-[250ms] hover:bg-[var(--ds-gold)] disabled:opacity-60"
            >
              {submitting ? 'Entrando…' : 'Entrar'}
              <ArrowRight
                strokeWidth={1.5}
                className="h-4 w-4 transition-transform duration-[250ms] group-hover:translate-x-1"
              />
            </button>
          </form>

          <p className="mt-8 text-[13px] leading-[1.5] text-[var(--ds-warm-gray)]">
            Acesso restrito a administradores autenticados via Supabase Auth.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
