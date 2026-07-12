# Variáveis de ambiente e segurança

Este documento descreve como configurar as chaves do Supabase e outras variáveis sensíveis no projeto **Website Design with References**.

## Visão geral

| Arquivo | Commitar no Git? | Propósito |
|---------|------------------|-----------|
| `.env` | **Não** | Chaves reais do seu ambiente local |
| `.env.example` | **Sim** | Template sem segredos para a equipe |
| `.gitignore` | **Sim** | Impede vazamento de `.env` e artefatos locais |

## Configuração inicial

1. O arquivo `.env` já foi criado localmente com as chaves do projeto Supabase conectado via MCP.
2. Se você clonar o repositório em outra máquina, copie o template:

```bash
cp .env.example .env
```

3. Preencha os valores em [Supabase Dashboard](https://supabase.com/dashboard) → **Settings** → **API**.

4. Reinicie o servidor de desenvolvimento após alterar o `.env`:

```bash
pnpm run dev
```

## Variáveis disponíveis

### Supabase (frontend — prefixo `VITE_`)

No Vite, apenas variáveis com prefixo `VITE_` ficam disponíveis no código do cliente via `import.meta.env`.

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `VITE_SUPABASE_URL` | Sim | URL base do projeto Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Sim* | Chave publishable moderna (`sb_publishable_...`) |
| `VITE_SUPABASE_ANON_KEY` | Sim* | Chave anon legada (JWT) — use se a lib exigir |
| `VITE_APP_ENV` | Não | `development`, `staging` ou `production` |

\* Use a **publishable key** em projetos novos. A anon key permanece no `.env` por compatibilidade.

### Supabase (somente servidor / CLI)

| Variável | Commitar? | Descrição |
|----------|-----------|-----------|
| `SUPABASE_PROJECT_REF` | Não | ID de referência do projeto (ex.: `jsxcucrokynrazrsoqxy`) |

> **Nunca** coloque `service_role` ou chaves secretas em variáveis `VITE_*` — elas seriam expostas no bundle do navegador.

## Uso no código React

```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Variáveis Supabase não configuradas. Verifique o arquivo .env')
}
```

## Segurança em produção

### O que pode ir para o frontend

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY` ou `VITE_SUPABASE_ANON_KEY`

Essas chaves são **públicas por design**, desde que o **Row Level Security (RLS)** esteja habilitado em todas as tabelas expostas.

### O que NUNCA commitar

- `.env` com chaves reais
- `service_role` key
- Tokens de acesso pessoais
- Senhas de banco de dados
- JWT secrets

### Deploy (Vercel, Netlify, etc.)

Configure as mesmas variáveis `VITE_*` no painel de **Environment Variables** do provedor de hospedagem — **não** faça upload do `.env`.

### GitHub

- O `.gitignore` já exclui `.env` e `.env.*` (exceto `.env.example`).
- Antes do primeiro push, confira:

```bash
git status
# .env NÃO deve aparecer na lista de arquivos a commitar
```

## Projeto Supabase atual

| Campo | Valor |
|-------|-------|
| Project URL | `https://jsxcucrokynrazrsoqxy.supabase.co` |
| Project Ref | `jsxcucrokynrazrsoqxy` |
| Chave recomendada | Publishable (`sb_publishable_...`) |

As chaves completas estão apenas no `.env` local (não versionado).

## Checklist antes do commit

- [ ] `.env` está listado no `.gitignore`
- [ ] `.env.example` está atualizado (sem valores reais)
- [ ] `git status` não mostra `.env`
- [ ] RLS habilitado nas tabelas do Supabase
- [ ] Variáveis de produção configuradas no painel de deploy

## Referências

- [Supabase — API Keys](https://supabase.com/docs/guides/api/api-keys)
- [Vite — Env Variables](https://vite.dev/guide/env-and-mode.html)
- [Supabase — Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
