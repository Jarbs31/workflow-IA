# Esquema Prisma — Meridian (Website Design with References)

Documento de referência para recriar o banco de dados no **Prisma** durante o curso.  
O schema reflete **todos os inputs e entidades** do sistema atual (login, painel admin, catálogo, imagens do site e contato).

---

## Visão geral

| Camada | Tecnologia |
|--------|------------|
| Banco | PostgreSQL (Supabase) |
| ORM | Prisma |
| Auth | Supabase Auth (e-mail + senha) |
| Storage | Supabase Storage (`vehicle-images`) |

---

## Mapeamento: inputs da UI → modelos Prisma

### 1. Login (`/login`)

| Input na tela | Campo | Modelo |
|---------------|-------|--------|
| E-mail | `email` | Supabase Auth + `Profile.email` |
| Senha | `password` | Supabase Auth (não persiste no Prisma) |

> A senha **não** fica em tabela Prisma. Ela é gerenciada pelo **Supabase Auth**.  
> O Prisma gerencia apenas o perfil em `Profile`, vinculado ao `id` do usuário autenticado.

---

### 2. Painel Admin — Cadastro/Edição de automóvel (`/admin`)

| Input na tela | Campo Prisma | Obrigatório | Exemplo |
|---------------|--------------|-------------|---------|
| Nome | `Vehicle.name` | Sim | GT Coupé |
| Categoria | `Vehicle.category` | Sim | Grand Tourer |
| Potência | `Vehicle.power` | Não | 620 cv |
| Preço | `Vehicle.price` | Não | R$ 1.480.000 |
| URL da imagem | `Vehicle.image` | Não | https://... |
| — (sistema) | `Vehicle.imagePath` | Não | vehicles/gt-coupe.jpg |
| — (sistema) | `Vehicle.status` | Sim | `active` / `paused` |
| — (sistema) | `Vehicle.sortOrder` | Sim | 1, 2, 3… |

**Ações sem input de formulário (tabela admin):**

| Ação | Campo afetado |
|------|---------------|
| Pausar / Reativar | `Vehicle.status` |
| Excluir | remove registro |
| Editar | atualiza campos do formulário |

---

### 3. Catálogo público (coleção na home)

| Dado exibido | Origem Prisma |
|--------------|---------------|
| Nome, categoria, potência, preço, imagem | `Vehicle` (apenas `status = active`) |

---

### 4. Imagens institucionais do site (`IMAGES` em `data.ts`)

| Chave | Campo Prisma | Uso na UI |
|-------|--------------|-----------|
| `heroCar` | `SiteImage.id` | Hero |
| `featured` | `SiteImage.id` | Modelo em destaque |
| `editorial` | `SiteImage.id` | Seção editorial |
| `menu` | `SiteImage.id` | Menu fullscreen |

| Campo | Descrição |
|-------|-----------|
| `url` | URL externa da imagem |
| `storagePath` | Caminho no bucket `vehicle-images` (opcional) |
| `alt` | Texto alternativo (acessibilidade) |

---

### 5. Modelo em destaque — especificações (`featured-model.tsx`)

| Dado exibido | Campo Prisma |
|--------------|--------------|
| Potência, 0–100, Vel. máx., Torque | `VehicleSpec.label`, `value`, `unit` |
| Nome do modelo | `Vehicle.name` (relação) |
| Descrição editorial | `Vehicle.featuredDescription` |

---

### 6. Contato / Newsletter (`cta-contact.tsx`)

| Input na tela | Campo Prisma |
|---------------|--------------|
| Seu e-mail | `ContactLead.email` |

> Modelo preparado para quando o formulário de contato for persistido no banco.

---

### 7. Navegação (`NAV_ITEMS` em `data.ts`)

| Dado | Campo Prisma |
|------|--------------|
| Rótulo | `NavItem.label` |
| Link | `NavItem.href` |
| Ordem | `NavItem.sortOrder` |

---

## Arquivo `schema.prisma`

Copie o conteúdo abaixo para `prisma/schema.prisma` no seu projeto do curso:

```prisma
// prisma/schema.prisma
// Meridian — catálogo automotivo premium
// PostgreSQL (Supabase)

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ─────────────────────────────────────────────
// Enums
// ─────────────────────────────────────────────

/// Status de exibição no catálogo (painel admin: Pausar/Reativar)
enum VehicleStatus {
  active
  paused
}

/// Papel do usuário administrativo
enum UserRole {
  admin
  viewer
}

/// Chaves fixas das imagens institucionais do site
enum SiteImageKey {
  heroCar
  featured
  editorial
  menu
}

// ─────────────────────────────────────────────
// Auth / Perfil
// Login: email + senha → Supabase Auth
// Prisma persiste apenas o perfil vinculado ao UUID do Auth
// ─────────────────────────────────────────────

model Profile {
  /// UUID igual ao auth.users.id (Supabase Auth)
  id        String   @id @db.Uuid
  /// Input: login-email
  email     String   @unique
  fullName  String?  @map("full_name")
  role      UserRole @default(admin)
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt DateTime @updatedAt @map("updated_at") @db.Timestamptz(6)

  @@map("profiles")
}

// ─────────────────────────────────────────────
// Automóveis — formulário admin + catálogo público
// ─────────────────────────────────────────────

model Vehicle {
  /// Slug único (ex: gt-coupe, roadster-s)
  id                  String        @id
  /// Input: f-name
  name                String
  /// Input: f-category
  category            String
  /// Input: f-power
  power               String
  /// Input: f-price
  price               String
  /// Input: f-image (URL)
  image               String
  /// Caminho no Supabase Storage (bucket vehicle-images)
  imagePath           String?       @map("image_path")
  /// Toggle Pausar/Reativar no painel
  status              VehicleStatus @default(active)
  sortOrder           Int           @default(0) @map("sort_order")
  /// Texto da seção "Em destaque" (featured-model)
  featuredDescription String?       @map("featured_description")
  createdAt           DateTime      @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt           DateTime      @updatedAt @map("updated_at") @db.Timestamptz(6)

  specs VehicleSpec[]

  @@index([status], map: "vehicles_status_idx")
  @@index([sortOrder], map: "vehicles_sort_order_idx")
  @@map("vehicles")
}

// ─────────────────────────────────────────────
// Especificações técnicas — seção "Em destaque"
// ─────────────────────────────────────────────

model VehicleSpec {
  id        String  @id @default(cuid())
  vehicleId String  @map("vehicle_id")
  /// Ex: Potência, 0–100 km/h, Velocidade máx., Torque
  label     String
  /// Ex: 720, 2.8, 340, 800
  value     String
  /// Ex: cv, s, km/h, Nm
  unit      String?
  sortOrder Int     @default(0) @map("sort_order")

  vehicle Vehicle @relation(fields: [vehicleId], references: [id], onDelete: Cascade)

  @@index([vehicleId])
  @@map("vehicle_specs")
}

// ─────────────────────────────────────────────
// Imagens institucionais — hero, editorial, menu
// ─────────────────────────────────────────────

model SiteImage {
  id          SiteImageKey @id
  url         String
  storagePath String?      @map("storage_path")
  alt         String?
  updatedAt   DateTime     @updatedAt @map("updated_at") @db.Timestamptz(6)

  @@map("site_images")
}

// ─────────────────────────────────────────────
// Contato — input "Seu e-mail" (cta-contact)
// ─────────────────────────────────────────────

model ContactLead {
  id        String   @id @default(cuid())
  /// Input: email (seção contato)
  email     String
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz(6)

  @@index([email])
  @@map("contact_leads")
}

// ─────────────────────────────────────────────
// Navegação — itens do menu/header
// ─────────────────────────────────────────────

model NavItem {
  id        String @id @default(cuid())
  /// Ex: Início, Coleção, Destaque
  label     String
  /// Ex: #inicio, #colecao, #destaque
  href      String
  sortOrder Int    @default(0) @map("sort_order")

  @@index([sortOrder])
  @@map("nav_items")
}
```

---

## Variáveis de ambiente (`.env`)

```env
# Prisma → Supabase PostgreSQL
# Connection pooling (Transaction mode)
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Conexão direta (migrations)
DIRECT_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Supabase (frontend — já configurado no projeto)
VITE_SUPABASE_URL=https://jsxcucrokynrazrsoqxy.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
VITE_SUPABASE_ANON_KEY=eyJ...
```

> Obtenha `DATABASE_URL` e `DIRECT_URL` em:  
> **Supabase Dashboard → Settings → Database → Connection string**

---

## Comandos Prisma (curso)

```bash
# Instalar Prisma
pnpm add -D prisma
pnpm add @prisma/client

# Inicializar (se ainda não existir)
npx prisma init

# Aplicar schema ao banco
npx prisma db push

# Ou via migrations
npx prisma migrate dev --name init_meridian

# Gerar client
npx prisma generate

# Abrir visualizador
npx prisma studio
```

---

## Seed sugerido (dados reais do sistema)

Exemplo de `prisma/seed.ts` com os 6 automóveis já existentes no Supabase:

```typescript
import { PrismaClient, VehicleStatus, SiteImageKey } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const vehicles = [
    {
      id: 'gt-coupe',
      name: 'GT Coupé',
      category: 'Grand Tourer',
      power: '620 cv',
      price: 'R$ 1.480.000',
      image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80',
      status: VehicleStatus.active,
      sortOrder: 1,
    },
    {
      id: 'roadster-s',
      name: 'Roadster S',
      category: 'Conversível',
      power: '510 cv',
      price: 'R$ 1.120.000',
      image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1200&q=80',
      status: VehicleStatus.active,
      sortOrder: 2,
    },
    {
      id: 'vintage-classic',
      name: 'Classic 1962',
      category: 'Coleção Vintage',
      power: '180 cv',
      price: 'R$ 2.350.000',
      image: 'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80',
      status: VehicleStatus.active,
      sortOrder: 3,
    },
    {
      id: 'suv-black',
      name: 'Range Black Edition',
      category: 'SUV Premium',
      power: '460 cv',
      price: 'R$ 890.000',
      image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
      status: VehicleStatus.active,
      sortOrder: 4,
    },
    {
      id: 'sedan-lux',
      name: 'Continental Lux',
      category: 'Sedan Executivo',
      power: '400 cv',
      price: 'R$ 760.000',
      image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80',
      status: VehicleStatus.active,
      sortOrder: 5,
    },
    {
      id: 'track-r',
      name: 'Track R',
      category: 'Edição Pista',
      power: '720 cv',
      price: 'R$ 2.980.000',
      image: 'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?auto=format&fit=crop&w=1200&q=80',
      status: VehicleStatus.active,
      sortOrder: 6,
      featuredDescription:
        'Concebido sem concessões. Cada grama removido, cada linha refinada em túnel de vento — a expressão máxima de performance da nossa engenharia.',
    },
  ]

  for (const vehicle of vehicles) {
    await prisma.vehicle.upsert({
      where: { id: vehicle.id },
      update: vehicle,
      create: vehicle,
    })
  }

  await prisma.vehicleSpec.createMany({
    data: [
      { vehicleId: 'track-r', label: 'Potência', value: '720', unit: 'cv', sortOrder: 1 },
      { vehicleId: 'track-r', label: '0–100 km/h', value: '2.8', unit: 's', sortOrder: 2 },
      { vehicleId: 'track-r', label: 'Velocidade máx.', value: '340', unit: 'km/h', sortOrder: 3 },
      { vehicleId: 'track-r', label: 'Torque', value: '800', unit: 'Nm', sortOrder: 4 },
    ],
    skipDuplicates: true,
  })

  const siteImages = [
    {
      id: SiteImageKey.heroCar,
      url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80',
      alt: 'Automóvel esportivo em destaque na hero',
    },
    {
      id: SiteImageKey.featured,
      url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1600&q=80',
      alt: 'Modelo em destaque Meridian',
    },
    {
      id: SiteImageKey.editorial,
      url: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1600&q=80',
      alt: 'Editorial automotivo premium',
    },
    {
      id: SiteImageKey.menu,
      url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1600&q=80',
      alt: 'Menu fullscreen automotivo',
    },
  ]

  for (const image of siteImages) {
    await prisma.siteImage.upsert({
      where: { id: image.id },
      update: image,
      create: image,
    })
  }

  const navItems = [
    { label: 'Início', href: '#inicio', sortOrder: 1 },
    { label: 'Coleção', href: '#colecao', sortOrder: 2 },
    { label: 'Destaque', href: '#destaque', sortOrder: 3 },
    { label: 'Editorial', href: '#editorial', sortOrder: 4 },
    { label: 'Contato', href: '#contato', sortOrder: 5 },
  ]

  for (const item of navItems) {
    await prisma.navItem.upsert({
      where: { id: item.href },
      update: item,
      create: { id: item.href, ...item },
    })
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
```

---

## Diagrama ER (relacionamentos)

```mermaid
erDiagram
  Profile {
    uuid id PK
    string email UK
    string full_name
    enum role
    datetime created_at
    datetime updated_at
  }

  Vehicle {
    string id PK
    string name
    string category
    string power
    string price
    string image
    string image_path
    enum status
    int sort_order
    string featured_description
    datetime created_at
    datetime updated_at
  }

  VehicleSpec {
    string id PK
    string vehicle_id FK
    string label
    string value
    string unit
    int sort_order
  }

  SiteImage {
    enum id PK
    string url
    string storage_path
    string alt
    datetime updated_at
  }

  ContactLead {
    string id PK
    string email
    datetime created_at
  }

  NavItem {
    string id PK
    string label
    string href
    int sort_order
  }

  Vehicle ||--o{ VehicleSpec : "possui"
```

---

## Storage (Supabase — fora do Prisma)

O Prisma **não gerencia** arquivos. Imagens enviadas pelo admin ficam no bucket:

| Bucket | Uso |
|--------|-----|
| `vehicle-images` | Fotos de automóveis (`Vehicle.imagePath`) |

Campo `imagePath` em `Vehicle` e `storagePath` em `SiteImage` armazenam apenas o **caminho** do arquivo no bucket.

---

## Compatibilidade com o banco Supabase atual

| Modelo Prisma | Tabela Supabase existente | Status |
|---------------|---------------------------|--------|
| `Profile` | `public.profiles` | ✅ Já existe |
| `Vehicle` | `public.vehicles` | ✅ Já existe |
| `SiteImage` | `public.site_images` | ✅ Já existe |
| `VehicleSpec` | — | 🆕 Criar no curso |
| `ContactLead` | — | 🆕 Criar no curso |
| `NavItem` | — | 🆕 Criar no curso |

Campos extras sugeridos no Prisma (`featuredDescription`, `VehicleSpec`, `ContactLead`, `NavItem`) preparam o sistema para evoluir sem perder os inputs já mapeados na UI.

---

## Referências

- [Prisma + Supabase](https://supabase.com/docs/guides/database/prisma)
- [Prisma Schema Reference](https://www.prisma.io/docs/orm/reference/prisma-schema-reference)
- Documentação interna: [DATABASE.md](./DATABASE.md) · [ENVIRONMENT.md](./ENVIRONMENT.md)
