export const IMAGES = {
  heroCar:
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80',
  featured:
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1600&q=80',
  editorial:
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1600&q=80',
  menu:
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1600&q=80',
}

export type VehicleStatus = 'active' | 'paused'

export interface Vehicle {
  id: string
  name: string
  category: string
  power: string
  price: string
  image: string
  status: VehicleStatus
}

// Dados seed / fallback — espelham os registros persistidos em public.vehicles no Supabase
export const VEHICLES: Vehicle[] = [
  {
    id: 'gt-coupe',
    name: 'GT Coupé',
    category: 'Grand Tourer',
    power: '620 cv',
    price: 'R$ 1.480.000',
    image:
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80',
    status: 'active',
  },
  {
    id: 'roadster-s',
    name: 'Roadster S',
    category: 'Conversível',
    power: '510 cv',
    price: 'R$ 1.120.000',
    image:
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1200&q=80',
    status: 'active',
  },
  {
    id: 'vintage-classic',
    name: 'Classic 1962',
    category: 'Coleção Vintage',
    power: '180 cv',
    price: 'R$ 2.350.000',
    image:
      'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80',
    status: 'active',
  },
  {
    id: 'suv-black',
    name: 'Range Black Edition',
    category: 'SUV Premium',
    power: '460 cv',
    price: 'R$ 890.000',
    image:
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
    status: 'active',
  },
  {
    id: 'sedan-lux',
    name: 'Continental Lux',
    category: 'Sedan Executivo',
    power: '400 cv',
    price: 'R$ 760.000',
    image:
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80',
    status: 'active',
  },
  {
    id: 'track-r',
    name: 'Track R',
    category: 'Edição Pista',
    power: '720 cv',
    price: 'R$ 2.980.000',
    image:
      'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?auto=format&fit=crop&w=1200&q=80',
    status: 'active',
  },
]

export const NAV_ITEMS = [
  { label: 'Início', href: '#inicio' },
  { label: 'Coleção', href: '#colecao' },
  { label: 'Destaque', href: '#destaque' },
  { label: 'Editorial', href: '#editorial' },
  { label: 'Contato', href: '#contato' },
]
