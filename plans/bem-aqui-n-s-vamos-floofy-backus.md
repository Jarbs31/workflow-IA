# Plano — Landing de Loja/Catálogo Automotivo Premium

## Context
O usuário quer uma landing page única (com seções) para uma **loja/catálogo automotivo premium**, construída em React + Tailwind. As imagens anexadas são apenas **referências visuais** (sites premium de carros: coleção vintage, configurador Turbo S, menu fullscreen de SUV Black Edition, layout editorial "MONOLOG"). O conteúdo textual não foi fornecido, então será criado copy fictício coerente com o tema. O visual deve seguir estritamente o **Design System** fornecido: premium, minimal, editorial, muito espaço negativo, tipografia grotesca forte, fotografia como protagonista, um único acento cromático (Gold `#C5A15C`) usado com parcimônia (<5%).

Não há pacote `@make-kits` instalado — o "Design System" é uma **especificação de tokens**, não um pacote NPM. O projeto já traz componentes shadcn/ui em `src/app/components/ui/` (button, card, sheet, accordion, separator, etc.) e a base do Tailwind v4 com tokens em `src/styles/theme.css`.

## Design tokens (a adicionar/ajustar)
Em `src/styles/theme.css`, adicionar variáveis do design system dentro de `:root` e mapeá-las em `@theme inline` para virarem utilitárias Tailwind:
- Neutros: `--ds-black:#111111`, `--ds-charcoal:#1E1E1E`, `--ds-warm-gray:#8C8A84`, `--ds-stone:#DAD6CF`, `--ds-surface:#F4F4F2`.
- Acento: `--ds-gold:#C5A15C` (único acento por tela; usar em hover/CTA/indicadores).
- Radius discreto (usar `radius.sm/md`), sombras suaves conforme níveis (Level 1/2).
- Manter o site em tema claro editorial por padrão; seção hero/menu pode usar fundo escuro (`#111111`) como nas referências.

Em `src/styles/fonts.css`: importar uma grotesca contemporânea via `@import` do Google Fonts no topo (ex.: **Archivo** ou **Inter Tight**) e aplicar como família base. Letter-spacing negativo em headings, tracking largo em nav/botões conforme spec.

## Estrutura (arquivos)
Editar entrypoint `src/app/App.tsx` para compor as seções. Criar componentes em `src/app/components/`:

1. `site-header.tsx` — header minimal fixo (logo, poucos itens, ícone de menu). Botão de menu abre **overlay fullscreen** (`ui/sheet.tsx` ou overlay custom com `motion/react`) listando: Início, Coleção, Modelos, Editorial, Contato — inspirado na ref. do menu fullscreen.
2. `hero.tsx` — hero editorial com tipografia display grande, fotografia dominante de carro, CTA discreto (acento gold no hover). Muito espaço negativo.
3. `collection-grid.tsx` — grid de catálogo (cards com foto dominante, título curto, spec mínima, ação discreta). Usa `ui/card.tsx`. 3–6 veículos com dados mock.
4. `featured-model.tsx` — destaque de um modelo estilo configurador (specs em colunas: potência, 0–100, autonomia), foto grande, layout assimétrico (ref. Turbo S).
5. `editorial-section.tsx` — bloco editorial/storytelling com tipografia forte e imagem cinematográfica (ref. MONOLOG).
6. `cta-newsletter.tsx` — CTA final / captura de contato usando `ui/input.tsx` + `ui/button.tsx` (label externa, borda fina — conforme spec de inputs).
7. `site-footer.tsx` — footer minimal com colunas de navegação e tipografia pequena.

Reutilizar: `ui/button.tsx`, `ui/card.tsx`, `ui/input.tsx`, `ui/separator.tsx`, `ui/sheet.tsx`, `ui/accordion.tsx` (para eventual FAQ), `components/figma/ImageWithFallback.tsx` para todas as fotos.

## Imagens
Buscar fotos automotivas premium via ferramenta Unsplash (fundo limpo, alto contraste, cinematográfico). Importar cada imagem como binding ES e passar em `<ImageWithFallback src={...} />` (nunca string de caminho literal). `object-cover` para heros/cards, `object-contain` para logos.

## Motion
Usar `motion/react` com transições sutis (fade/reveal/slide, 150–450ms, ease-out). Sem bounce/overshoot. Reveal on-scroll leve nas seções.

## Grid & espaçamento
Container máx. `1440px`, margens generosas (`px-6 md:px-12 lg:px-24`), seções com espaçamento grande (hero ~160px, blocos ~96px). Responsivo mobile-first (4/8/12 colunas conforme spec).

## Verificação
- App já roda no dev server do Figma Make (não iniciar manualmente). Abrir o preview e conferir:
  - Header + overlay de menu fullscreen abre/fecha com animação suave.
  - Hero, grid de coleção, modelo em destaque, editorial, CTA e footer renderizam com fotos reais do Unsplash.
  - Acento gold aparece apenas em hovers/CTAs (<5% da tela).
  - Layout responsivo (mobile/tablet/desktop) sem quebra.
  - Nenhum erro no console; tipografia grotesca carregada.
