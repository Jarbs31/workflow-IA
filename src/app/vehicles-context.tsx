import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { VEHICLES, type Vehicle } from './data'
import { supabase } from '../lib/supabase'
import { useAuth } from './auth-context'

interface VehiclesContextValue {
  vehicles: Vehicle[]
  activeVehicles: Vehicle[]
  loading: boolean
  addVehicle: (v: Omit<Vehicle, 'id' | 'status'>) => Promise<void>
  updateVehicle: (id: string, v: Omit<Vehicle, 'id' | 'status'>) => Promise<void>
  removeVehicle: (id: string) => Promise<void>
  toggleStatus: (id: string) => Promise<void>
  refresh: () => Promise<void>
}

const VehiclesContext = createContext<VehiclesContextValue | null>(null)

type DbVehicle = {
  id: string
  name: string
  category: string
  power: string
  price: string
  image: string
  status: Vehicle['status']
  sort_order: number
}

function mapRow(row: DbVehicle): Vehicle {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    power: row.power,
    price: row.price,
    image: row.image,
    status: row.status,
  }
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function VehiclesProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth()
  const [vehicles, setVehicles] = useState<Vehicle[]>(VEHICLES)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('vehicles')
        .select('id, name, category, power, price, image, status, sort_order')
        .order('sort_order', { ascending: true })

      if (!session) {
        query = query.eq('status', 'active')
      }

      const { data, error } = await query

      if (error) throw error
      if (data && data.length > 0) {
        setVehicles(data.map(mapRow))
      } else {
        setVehicles(VEHICLES)
      }
    } catch {
      setVehicles(VEHICLES)
    } finally {
      setLoading(false)
    }
  }, [session])

  useEffect(() => {
    refresh()
  }, [refresh])

  const value = useMemo<VehiclesContextValue>(
    () => ({
      vehicles,
      activeVehicles: vehicles.filter((v) => v.status !== 'paused'),
      loading,
      refresh,
      addVehicle: async (v) => {
        const id = slugify(v.name) || `veh-${Date.now()}`
        const sortOrder = vehicles.length + 1
        const { error } = await supabase.from('vehicles').insert({
          id,
          name: v.name,
          category: v.category,
          power: v.power,
          price: v.price,
          image: v.image,
          status: 'active',
          sort_order: sortOrder,
        })
        if (error) throw error
        await refresh()
      },
      updateVehicle: async (id, v) => {
        const { error } = await supabase
          .from('vehicles')
          .update({
            name: v.name,
            category: v.category,
            power: v.power,
            price: v.price,
            image: v.image,
          })
          .eq('id', id)
        if (error) throw error
        await refresh()
      },
      removeVehicle: async (id) => {
        const { error } = await supabase.from('vehicles').delete().eq('id', id)
        if (error) throw error
        await refresh()
      },
      toggleStatus: async (id) => {
        const current = vehicles.find((item) => item.id === id)
        if (!current) return
        const nextStatus = current.status === 'paused' ? 'active' : 'paused'
        const { error } = await supabase
          .from('vehicles')
          .update({ status: nextStatus })
          .eq('id', id)
        if (error) throw error
        await refresh()
      },
    }),
    [vehicles, loading, refresh],
  )

  return <VehiclesContext.Provider value={value}>{children}</VehiclesContext.Provider>
}

export function useVehicles() {
  const ctx = useContext(VehiclesContext)
  if (!ctx) throw new Error('useVehicles must be used within VehiclesProvider')
  return ctx
}
