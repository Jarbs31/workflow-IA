import { NAV_ITEMS } from '../data'

const COLUMNS = [
  {
    title: 'Coleção',
    links: ['Grand Tourer', 'Conversíveis', 'Vintage', 'SUV Premium', 'Edição Pista'],
  },
  {
    title: 'Serviços',
    links: ['Test drive', 'Consultoria', 'Financiamento', 'Manutenção', 'Garantia'],
  },
  {
    title: 'Institucional',
    links: ['Sobre', 'Showrooms', 'Imprensa', 'Carreiras', 'Contato'],
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-[var(--ds-black)] text-white">
      <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="tracking-[0.4em] uppercase text-[15px]">Meridian</span>
            <p className="mt-6 max-w-xs text-[14px] leading-[1.5] text-[var(--ds-warm-gray)]">
              Curadoria de automóveis excepcionais. São Paulo · desde 1998.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-[12px] uppercase tracking-[0.16em] text-[var(--ds-warm-gray)]">
                {col.title}
              </p>
              <ul className="mt-6 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#colecao"
                      className="text-[14px] text-[var(--ds-stone)] transition-colors duration-[150ms] hover:text-[var(--ds-gold)]"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20 flex flex-col gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-[var(--ds-warm-gray)]">
            © 2026 Meridian Automóveis. Todos os direitos reservados.
          </p>
          <nav className="flex flex-wrap gap-8">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[12px] uppercase tracking-[0.16em] text-[var(--ds-stone)] transition-colors duration-[150ms] hover:text-[var(--ds-gold)]"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
