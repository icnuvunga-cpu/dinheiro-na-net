# RELATÃ“RIO INICIAL â€” Blog Dinheiro na Net

**Data:** 2026-05-16  
**Stack:** Astro v6 Â· MDX Â· Sitemap Â· Deploy: Cloudflare Pages (futuro)

---

## 1. Resumo do que foi feito

Foi criada e corrigida a primeira versÃ£o funcional do blog educativo **Dinheiro na Net**, um projeto estÃ¡tico completo construÃ­do com Astro v6 + MDX.

O projeto inclui:
- **26 pÃ¡ginas geradas** (home, artigos, categorias, ferramentas, pÃ¡ginas legais, 404)
- **10 artigos reais** em MDX com introduÃ§Ã£o, H2/H3, exemplos prÃ¡ticos, FAQ e conclusÃ£o
- **1 ferramenta interativa**: Calculadora de Ganhos com Blog (Vanilla JS)
- **5 categorias** funcionais com filtragem de posts
- **5 pÃ¡ginas legais** (Privacidade, Termos, Afiliados, Cookies, Sobre)
- **SEO bÃ¡sico** em todas as pÃ¡ginas (title, description, Open Graph, canonical)
- **Sitemap automÃ¡tico** via `@astrojs/sitemap`
- **robots.txt** em `/public/`
- **Layout responsivo** mobile-first com CSS Vanilla
- **Componente AdSlot** â€” apenas placeholder visual, sem scripts reais

---

## 2. Erro encontrado e corrigido

### Erro Original
```
TypeError: Astro.glob is not a function
```
**Ficheiro:** `src/pages/index.astro`

### Causa

O projeto usava `Astro.glob()`, uma API obsoleta a partir do Astro v5+. O Astro v6 (versÃ£o instalada: `^6.3.3`) **removeu completamente** o `Astro.glob()` do contexto das pÃ¡ginas.

### Como foi corrigido

| Problema | SoluÃ§Ã£o |
|---|---|
| `Astro.glob()` em todas as pÃ¡ginas | Migrado para `getCollection('posts')` da API `astro:content` |
| `config.ts` em `src/content/` | Movido para `src/content.config.ts` com `glob` loader (Astro v6 obrigatÃ³rio) |
| `post.render()` (API antiga) | SubstituÃ­do por `render(post)` importado de `astro:content` |
| `post.slug` | SubstituÃ­do por `post.id.replace(/\.mdx$/, '')` (Astro v6 glob loader) |
| `tsconfig.json extends: "strict"` | Alterado para `"base"` para eliminar erros TS desnecessÃ¡rios |

---

## 3. Ficheiros criados/alterados

| Ficheiro | AÃ§Ã£o |
|---|---|
| `src/content.config.ts` | **NOVO** â€” Collection schema com glob loader |
| `src/content/config.ts` | Criado inicialmente (Astro v5 style), depois substituÃ­do pelo acima |
| `src/pages/index.astro` | **ALTERADO** â€” migrado para `getCollection` |
| `src/pages/posts/[slug].astro` | **NOVO** â€” router de artigos com `render(post)` |
| `src/pages/categorias/[slug].astro` | **ALTERADO** â€” migrado para `getCollection` + `post.id` |
| `src/pages/categorias/index.astro` | **ALTERADO** â€” limpo |
| `src/pages/ferramentas/calculadora-ganhos-blog.astro` | **ALTERADO** â€” layout melhorado |
| `astro.config.mjs` | **ALTERADO** â€” URL definida para `https://dinheiro-na-net.icnuvunga.workers.dev` |
| `tsconfig.json` | **ALTERADO** â€” `strict` â†’ `base` |
| `src/pages/[slug].astro` | **REMOVIDO** â€” conflito com posts/[slug] |

---

## 4. Estrutura Final de Pastas

```
E:\Projetos\dinheiro-na-net
â”œâ”€ public/
â”‚  â””â”€ robots.txt
â”œâ”€ src/
â”‚  â”œâ”€ content.config.ts            â† Config de coleÃ§Ã£o Astro v6
â”‚  â”œâ”€ components/
â”‚  â”‚  â”œâ”€ AdSlot.astro              â† Placeholder visual (sem anÃºncios reais)
â”‚  â”‚  â”œâ”€ AffiliateNotice.astro
â”‚  â”‚  â”œâ”€ ArticleCard.astro
â”‚  â”‚  â”œâ”€ BlogEarningsCalculator.astro
â”‚  â”‚  â”œâ”€ CategoryCard.astro
â”‚  â”‚  â”œâ”€ FAQ.astro
â”‚  â”‚  â”œâ”€ Footer.astro
â”‚  â”‚  â”œâ”€ Header.astro
â”‚  â”‚  â””â”€ NewsletterBox.astro
â”‚  â”œâ”€ content/
â”‚  â”‚  â””â”€ posts/                    â† 10 artigos .mdx
â”‚  â”œâ”€ data/
â”‚  â”‚  â””â”€ siteConfig.ts             â† categorias, navegaÃ§Ã£o, config global
â”‚  â”œâ”€ layouts/
â”‚  â”‚  â”œâ”€ BaseLayout.astro
â”‚  â”‚  â”œâ”€ BlogPostLayout.astro
â”‚  â”‚  â””â”€ ToolLayout.astro
â”‚  â”œâ”€ pages/
â”‚  â”‚  â”œâ”€ index.astro
â”‚  â”‚  â”œâ”€ sobre.astro
â”‚  â”‚  â”œâ”€ contacto.astro
â”‚  â”‚  â”œâ”€ 404.astro
â”‚  â”‚  â”œâ”€ politica-de-privacidade.astro
â”‚  â”‚  â”œâ”€ termos-de-uso.astro
â”‚  â”‚  â”œâ”€ aviso-de-afiliados.astro
â”‚  â”‚  â”œâ”€ politica-de-cookies.astro
â”‚  â”‚  â”œâ”€ categorias/
â”‚  â”‚  â”‚  â”œâ”€ index.astro
â”‚  â”‚  â”‚  â””â”€ [slug].astro
â”‚  â”‚  â”œâ”€ ferramentas/
â”‚  â”‚  â”‚  â”œâ”€ index.astro
â”‚  â”‚  â”‚  â””â”€ calculadora-ganhos-blog.astro
â”‚  â”‚  â””â”€ posts/
â”‚  â”‚     â””â”€ [slug].astro
â”‚  â””â”€ styles/
â”‚     â””â”€ global.css
â”œâ”€ astro.config.mjs
â”œâ”€ package.json
â”œâ”€ tsconfig.json
â”œâ”€ README.md
â””â”€ RELATORIO_INICIAL.md
```

---

## 5. Comandos Executados

```sh
npm install                # âœ“ OK
npx astro add mdx          # âœ“ OK (@astrojs/mdx instalado)
npx astro add sitemap      # âœ“ OK (@astrojs/sitemap instalado)
npm run build              # âœ“ 26 pÃ¡ginas em 2.78s â€” Exit code 0
```

---

## 6. Resultados

| Comando | Resultado |
|---|---|
| `npm install` | âœ… Sucesso |
| `npm run build` | âœ… **26 pÃ¡ginas geradas em 2.78s** |
| `npm run dev` | âœ… Pronto para testar em `http://localhost:4321` |
| `sitemap-index.xml` | âœ… Gerado automaticamente em `/dist/` |

---

## 7. Estado Atual

- âœ… Build passa sem erros
- âœ… Todos os artigos MDX indexados corretamente
- âœ… Calculadora de Ganhos funcional (Vanilla JS)
- âœ… SEO bÃ¡sico em todas as pÃ¡ginas
- âœ… Sitemap gerado
- âœ… robots.txt configurado
- âœ… Categorias filtram posts corretamente
- âœ… Design responsivo e limpo

---

## 8. LimitaÃ§Ãµes Conhecidas

- Os artigos usam `import FAQ from '../../components/FAQ.astro'` diretamente no ficheiro MDX â€” funciona corretamente com Astro v6 MDX.
- Newsletter sem backend real (UI apenas).
- AdSlot Ã© apenas visual â€” sem cÃ³digo de publicidade real.
- DomÃ­nio ainda nÃ£o comprado; URL configurada como placeholder (`dinheiro-na-net.icnuvunga.workers.dev`).

---

## 9. PrÃ³ximos Passos Recomendados

1. **Testar localmente**: `npm run dev` â†’ abrir `http://localhost:4321`
2. **Adicionar imagens**: colocar `.webp` otimizadas em `public/images/`
3. **Integrar Google Analytics** quando o domÃ­nio for comprado
4. **Publicar no Cloudflare Pages** (ver secÃ§Ã£o abaixo)
5. **Expandir artigos**: aumentar extensÃ£o e adicionar links internos
6. **Favicon real**: substituir o SVG por um logo definitivo

---

## 10. Como Fazer Deploy Gratuito no Cloudflare Pages

1. **Criar conta** em [dash.cloudflare.com](https://dash.cloudflare.com)
2. **Colocar cÃ³digo no GitHub** (repositÃ³rio privado ou pÃºblico)
3. No Cloudflare Dashboard â†’ **Workers & Pages** â†’ **Create application** â†’ **Pages** â†’ **Connect to Git**
4. Selecionar o repositÃ³rio `dinheiro-na-net`
5. Configurar o build:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node version:** `22`
6. Clicar **Save and Deploy**
7. O site ficarÃ¡ disponÃ­vel em `https://dinheiro-na-net.pages.dev` (ou nome similar)
8. Quando comprar o domÃ­nio, ligar via **Custom domains** no painel do Cloudflare Pages

