# Banco de dados — Meridian

Documentação do schema Supabase, políticas RLS, storage e credenciais de acesso.

## Projeto Supabase

| Campo | Valor |
|-------|-------|
| URL | `https://jsxcucrokynrazrsoqxy.supabase.co` |
| Project Ref | `jsxcucrokynrazrsoqxy` |

## Tabelas

### `public.vehicles`

Inventário de automóveis do catálogo.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | TEXT (PK) | Slug único (ex.: `gt-coupe`) |
| `name` | TEXT | Nome do modelo |
| `category` | TEXT | Categoria |
| `power` | TEXT | Potência |
| `price` | TEXT | Preço formatado |
| `image` | TEXT | URL da imagem |
| `image_path` | TEXT | Caminho no Storage (opcional) |
| `status` | TEXT | `active` ou `paused` |
| `sort_order` | INTEGER | Ordem de exibição |

**Seed:** os 6 automóveis mockados de `src/app/data.ts` foram inseridos como dados reais.

### `public.site_images`

Imagens institucionais (hero, editorial, menu, destaque).

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | TEXT (PK) | Chave (`heroCar`, `featured`, etc.) |
| `url` | TEXT | URL da imagem |
| `storage_path` | TEXT | Caminho no Storage (opcional) |
| `alt` | TEXT | Texto alternativo |

### `public.profiles`

Perfil vinculado ao Auth (`auth.users`). Criado automaticamente no registro.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID (FK) | ID do usuário Auth |
| `email` | TEXT | E-mail |
| `role` | TEXT | `admin` ou `viewer` |

## Storage

### Bucket `vehicle-images`

- **Público:** sim (leitura via URL)
- **Limite:** 10 MB por arquivo
- **Tipos:** JPEG, PNG, WebP, GIF, AVIF

**Políticas:**
- Leitura pública de objetos
- Upload / update / delete apenas para admins autenticados

## RLS (Row Level Security)

RLS habilitado em `profiles`, `vehicles` e `site_images`.

### Veículos

| Operação | Quem | Regra |
|----------|------|-------|
| SELECT | Público (`anon`) | Apenas `status = 'active'` |
| SELECT | Admin autenticado | Todos os registros |
| INSERT / UPDATE / DELETE | Admin autenticado | `is_admin() = true` |

### Site images

| Operação | Quem | Regra |
|----------|------|-------|
| SELECT | Público | Todos |
| INSERT / UPDATE / DELETE | Admin | `is_admin() = true` |

### Profiles

| Operação | Quem | Regra |
|----------|------|-------|
| SELECT / UPDATE | Próprio usuário | `auth.uid() = id` |

## Autenticação (login admin)

Usuário padrão criado no Supabase Auth:

| Campo | Valor |
|-------|-------|
| **E-mail** | `jarbsonsilva.22@gmail.com` |
| **Senha** | Configurada no Supabase Auth (fornecida pelo administrador) |

> Credenciais atualizadas em 12/07/2026. Para alterar a senha, use o [Supabase Dashboard → Authentication → Users](https://supabase.com/dashboard).

### Fluxo no app

1. `/login` → `signInWithPassword` via Supabase Auth
2. Sessão válida → redireciona para `/admin`
3. Sem sessão → `/admin` redireciona para `/login`
4. Botão **Sair** encerra a sessão

## Migrations aplicadas

1. `create_meridian_schema` — tabelas, triggers, RLS, storage
2. `seed_meridian_mock_data` — seed de veículos e imagens
3. `create_meridian_admin_user` — usuário admin padrão
4. `harden_meridian_security` — hardening de funções

## Integração frontend

- Cliente: `src/lib/supabase.ts`
- Auth: `src/app/auth-context.tsx`
- Veículos: `src/app/vehicles-context.tsx` (lê/escreve no Supabase)
- Fallback: se o Supabase falhar, usa `VEHICLES` de `data.ts`

## Checklist de segurança

- [x] RLS em todas as tabelas públicas
- [x] Admin-only para escrita
- [x] Leitura pública apenas de veículos ativos
- [x] Storage com upload restrito a admin
- [x] `.env` fora do Git
- [ ] Habilitar [Leaked Password Protection](https://supabase.com/docs/guides/auth/password-security) no Dashboard (recomendado)

## Referências

- [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
