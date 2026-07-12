import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Variáveis Supabase não configuradas. Verifique o arquivo .env')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

export const VEHICLE_IMAGES_BUCKET = 'vehicle-images'

export function getVehicleImagePublicUrl(path: string) {
  const { data } = supabase.storage.from(VEHICLE_IMAGES_BUCKET).getPublicUrl(path)
  return data.publicUrl
}
