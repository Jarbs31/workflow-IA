import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowLeft, LogOut, Pause, Pencil, Play, Plus, Trash2, X } from 'lucide-react'
import { ImageWithFallback } from '../components/figma/ImageWithFallback'
import { useAuth } from '../auth-context'
import { useVehicles } from '../vehicles-context'
import type { Vehicle } from '../data'

type FormState = Omit<Vehicle, 'id' | 'status'>

const EMPTY: FormState = { name: '', category: '', power: '', price: '', image: '' }

export function Admin() {
  const { signOut } = useAuth()
  const { vehicles, addVehicle, updateVehicle, removeVehicle, toggleStatus, loading } = useVehicles()
  const [form, setForm] = useState<FormState>(EMPTY)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const set = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const resetForm = () => {
    setForm(EMPTY)
    setEditingId(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.category.trim()) return
    setError(null)
    setSaving(true)
    try {
      if (editingId) await updateVehicle(editingId, form)
      else await addVehicle(form)
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar automóvel.')
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (v: Vehicle) => {
    setEditingId(v.id)
    setForm({ name: v.name, category: v.category, power: v.power, price: v.price, image: v.image })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const inputClass =
    'h-12 border-b border-[var(--ds-border)] bg-transparent text-[16px] outline-none transition-colors duration-[150ms] placeholder:text-[var(--ds-warm-gray)] focus:border-[var(--ds-gold)]'
  const labelClass = 'text-[12px] uppercase tracking-[0.16em] text-[var(--ds-warm-gray)]'

  return (
    <div className="min-h-screen bg-[var(--ds-surface)] text-[var(--ds-black)]">
      <header className="border-b border-[var(--ds-border)] bg-white">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 md:px-12">
          <div className="flex items-center gap-6">
            <span className="tracking-[0.4em] uppercase text-[15px]">Meridian</span>
            <span className="text-[12px] uppercase tracking-[0.16em] text-[var(--ds-warm-gray)]">
              Painel
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.16em] text-[var(--ds-warm-gray)] transition-colors duration-[150ms] hover:text-[var(--ds-black)]"
            >
              <ArrowLeft strokeWidth={1.5} className="h-4 w-4" />
              Ver site
            </Link>
            <button
              type="button"
              onClick={() => signOut()}
              className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.16em] text-[var(--ds-warm-gray)] transition-colors duration-[150ms] hover:text-[var(--ds-black)]"
            >
              <LogOut strokeWidth={1.5} className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-6 py-16 md:px-12">
        {/* Formulário */}
        <section className="mb-20 bg-white p-8 md:p-12">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-[24px] font-normal tracking-[-0.01em]">
              {editingId ? 'Editar automóvel' : 'Cadastrar automóvel'}
            </h1>
            {editingId && (
              <button
                onClick={resetForm}
                className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.16em] text-[var(--ds-warm-gray)] transition-colors duration-[150ms] hover:text-[var(--ds-black)]"
              >
                <X strokeWidth={1.5} className="h-4 w-4" />
                Cancelar
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex flex-col gap-3">
              <label htmlFor="f-name" className={labelClass}>
                Nome
              </label>
              <input
                id="f-name"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="GT Coupé"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-3">
              <label htmlFor="f-category" className={labelClass}>
                Categoria
              </label>
              <input
                id="f-category"
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                placeholder="Grand Tourer"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-3">
              <label htmlFor="f-power" className={labelClass}>
                Potência
              </label>
              <input
                id="f-power"
                value={form.power}
                onChange={(e) => set('power', e.target.value)}
                placeholder="620 cv"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-3">
              <label htmlFor="f-price" className={labelClass}>
                Preço
              </label>
              <input
                id="f-price"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
                placeholder="R$ 1.480.000"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-3 md:col-span-2">
              <label htmlFor="f-image" className={labelClass}>
                URL da imagem
              </label>
              <input
                id="f-image"
                value={form.image}
                onChange={(e) => set('image', e.target.value)}
                placeholder="https://..."
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              {error && (
                <p className="mb-4 text-[14px] text-[var(--destructive)]">{error}</p>
              )}
              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-14 items-center gap-3 bg-[var(--ds-black)] px-10 text-[13px] uppercase tracking-[0.16em] text-white transition-colors duration-[250ms] hover:bg-[var(--ds-gold)] disabled:opacity-60"
              >
                {editingId ? (
                  saving ? 'Salvando…' : 'Salvar alterações'
                ) : (
                  <>
                    <Plus strokeWidth={1.5} className="h-4 w-4" />
                    {saving ? 'Adicionando…' : 'Adicionar automóvel'}
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Tabela */}
        <section>
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-[24px] font-normal tracking-[-0.01em]">Inventário</h2>
            <span className="text-[13px] uppercase tracking-[0.16em] text-[var(--ds-warm-gray)]">
              {loading ? '…' : `${vehicles.length} automóveis`}
            </span>
          </div>

          <div className="overflow-x-auto bg-white">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[var(--ds-border)]">
                  {['Automóvel', 'Categoria', 'Potência', 'Preço', 'Status', 'Ações'].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-5 text-[12px] uppercase tracking-[0.16em] text-[var(--ds-warm-gray)]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => (
                  <tr
                    key={v.id}
                    className="border-b border-[var(--ds-border)] last:border-0 transition-colors duration-[150ms] hover:bg-[var(--ds-surface)]"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-16 shrink-0 overflow-hidden bg-[var(--ds-surface)]">
                          <ImageWithFallback
                            src={v.image}
                            alt={v.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="text-[16px]">{v.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-[14px] text-[var(--ds-charcoal)]">{v.category}</td>
                    <td className="px-6 py-5 text-[14px] text-[var(--ds-charcoal)]">{v.power}</td>
                    <td className="px-6 py-5 text-[14px] text-[var(--ds-charcoal)]">{v.price}</td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] ${
                          v.status === 'paused'
                            ? 'text-[var(--ds-warm-gray)]'
                            : 'text-[var(--ds-gold-strong)]'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            v.status === 'paused' ? 'bg-[var(--ds-warm-gray)]' : 'bg-[var(--ds-gold)]'
                          }`}
                        />
                        {v.status === 'paused' ? 'Pausado' : 'Ativo'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => startEdit(v)}
                          aria-label="Editar"
                          title="Editar"
                          className="flex h-11 w-11 items-center justify-center text-[var(--ds-charcoal)] transition-colors duration-[150ms] hover:text-[var(--ds-gold)]"
                        >
                          <Pencil strokeWidth={1.5} className="h-4 w-4" />
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              await toggleStatus(v.id)
                            } catch (err) {
                              setError(err instanceof Error ? err.message : 'Erro ao alterar status.')
                            }
                          }}
                          aria-label={v.status === 'paused' ? 'Reativar' : 'Pausar'}
                          title={v.status === 'paused' ? 'Reativar' : 'Pausar'}
                          className="flex h-11 w-11 items-center justify-center text-[var(--ds-charcoal)] transition-colors duration-[150ms] hover:text-[var(--ds-gold)]"
                        >
                          {v.status === 'paused' ? (
                            <Play strokeWidth={1.5} className="h-4 w-4" />
                          ) : (
                            <Pause strokeWidth={1.5} className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              if (editingId === v.id) resetForm()
                              await removeVehicle(v.id)
                            } catch (err) {
                              setError(err instanceof Error ? err.message : 'Erro ao excluir automóvel.')
                            }
                          }}
                          aria-label="Excluir"
                          title="Excluir"
                          className="flex h-11 w-11 items-center justify-center text-[var(--ds-charcoal)] transition-colors duration-[150ms] hover:text-[var(--destructive)]"
                        >
                          <Trash2 strokeWidth={1.5} className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {vehicles.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-16 text-center text-[15px] text-[var(--ds-warm-gray)]"
                    >
                      Nenhum automóvel cadastrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}
