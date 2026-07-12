/**
 * Faz upload das imagens dos veículos para o Supabase Storage.
 * Uso: node --env-file=.env scripts/upload-vehicle-images.mjs
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_ANON_KEY
const adminEmail = process.env.ADMIN_EMAIL ?? 'jarbsonsilva.22@gmail.com'
const adminPassword = process.env.ADMIN_PASSWORD ?? 'Rua99@'
const BUCKET = 'vehicle-images'

if (!supabaseUrl || !supabaseKey) {
  console.error('Defina VITE_SUPABASE_URL e chave no .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function downloadImage(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Falha ao baixar ${url}: ${res.status}`)
  const contentType = res.headers.get('content-type') ?? 'image/jpeg'
  const buffer = Buffer.from(await res.arrayBuffer())
  const ext = contentType.includes('webp')
    ? 'webp'
    : contentType.includes('png')
      ? 'png'
      : 'jpg'
  return { buffer, contentType, ext }
}

async function main() {
  console.log('Autenticando admin…')
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword,
  })
  if (authError) throw new Error(`Auth: ${authError.message}`)

  const { data: vehicles, error: fetchError } = await supabase
    .from('vehicles')
    .select('id, name, image')
    .order('sort_order', { ascending: true })

  if (fetchError) throw new Error(`Fetch vehicles: ${fetchError.message}`)

  let uploaded = 0
  let skipped = 0

  for (const vehicle of vehicles ?? []) {
    if (!vehicle.image?.startsWith('http')) {
      console.log(`⏭  ${vehicle.id} — sem URL de imagem, ignorado`)
      skipped++
      continue
    }

    try {
      console.log(`⬇  ${vehicle.id} — baixando…`)
      const { buffer, contentType, ext } = await downloadImage(vehicle.image)
      const storagePath = `vehicles/${vehicle.id}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, buffer, {
          contentType,
          upsert: true,
          cacheControl: '3600',
        })

      if (uploadError) throw uploadError

      const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)
      const publicUrl = publicData.publicUrl

      const { error: updateError } = await supabase
        .from('vehicles')
        .update({ image_path: storagePath, image: publicUrl })
        .eq('id', vehicle.id)

      if (updateError) throw updateError

      console.log(`✅ ${vehicle.id} → ${storagePath}`)
      uploaded++
    } catch (err) {
      console.error(`❌ ${vehicle.id}:`, err.message ?? err)
    }
  }

  console.log(`\nConcluído: ${uploaded} enviadas, ${skipped} ignoradas.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
