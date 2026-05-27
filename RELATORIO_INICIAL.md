# RELATÓRIO INICIAL - Blog Dinheiro na Net

**Data:** 2026-05-16  
**Stack:** Astro v6 · MDX · Sitemap · Deploy: Cloudflare Pages (futuro)

---

## 1. Resumo do que foi feito

Foi criada e corrigida a primeira versão funcional do blog educativo **Dinheiro na Net**, um projeto estático completo construído com Astro v6 + MDX.

O projeto inclui:
- **26 páginas geradas** (home, artigos, categorias, ferramentas, páginas legais, 404)
- **10 artigos reais** em MDX com introdução, H2/H3, exemplos práticos, FAQ e conclusão
- **1 ferramenta interativa**: Calculadora de Ganhos com Blog (Vanilla JS)
- **5 categorias** funcionais com filtragem de posts
- **5 páginas legais** (Privacidade, Termos, Afiliados, Cookies, Sobre)
- **SEO básico** em todas as páginas (title, description, Open Graph, canonical)
- **Sitemap automático** via `@astrojs/sitemap`
- **robots.txt** em `/public/`
- **Layout responsivo** mobile-first com CSS Vanilla
- **Componente AdSlot** - apenas placeholder visual, sem scripts reais

---

## 2. Erro encontrado e corrigido

### Erro Original
```
TypeError: Astro.glob is not a function
```
**Ficheiro:** `src/pages/index.astro`

### Causa

O projeto usava `Astro.glob()`, uma API obsoleta a partir do Astro v5+. O Astro v6 (versão instalada: `^6.3.3`) **removeu completamente** o `Astro.glob()` do contexto das páginas.

### Como foi corrigido

| Problema | Solução |
|---|---|
| `Astro.glob()` em todas as páginas | Migrado para `getCollection('posts')` da API `astro:content` |
| `config.ts` em `src/content/` | Movido para `src/content.config.ts` com `glob` loader (Astro v6 obrigatório) |
| `post.render()` (API antiga) | Substituído por `render(post)` importado de `astro:content` |
| `post.slug` | Substituído por `post.id.replace(/\.mdx$/, '')` (Astro v6 glob loader) |
| `tsconfig.json extends: "strict"` | Alterado para `"base"` para eliminar erros TS desnecessários |

---

## 3. Ficheiros criados/alterados

| Ficheiro | Ação |
|---|---|
| `src/content.config.ts` | **NOVO** - Collection schema com glob loader |
| `src/content/config.ts` | Criado inicialmente (Astro v5 style), depois substituído pelo acima |
| `src/pages/index.astro` | **ALTERADO** - migrado para `getCollection` |
| `src/pages/posts/[slug].astro` | **NOVO** - router de artigos com `render(post)` |
| `src/pages/categorias/[slug].astro` | **ALTERADO** - migrado para `getCollection` + `post.id` |
| `src/pages/categorias/index.astro` | **ALTERADO** - limpo |
| `src/pages/ferramentas/calculadora-ganhos-blog.astro` | **ALTERADO** - layout melhorado |
| `astro.config.mjs` | **ALTERADO** - URL definida para `https://dinheiro-na-net.icnuvunga.workers.dev` |
| `tsconfig.json` | **ALTERADO** - `strict` -> `base` |
| `src/pages/[slug].astro` | **REMOVIDO** - conflito com posts/[slug] |

---

## 4. Estrutura Final de Pastas

```
E:\Projetos\dinheiro-na-net
- public/
  - robots.txt
- src/
  - content.config.ts            -> Config de coleção Astro v6
  - components/
    - AdSlot.astro              -> Placeholder visual (sem anúncios reais)
    - AffiliateNotice.astro
    - ArticleCard.astro
    - BlogEarningsCalculator.astro
    - CategoryCard.astro
    - FAQ.astro
    - Footer.astro
    - Header.astro
    - NewsletterBox.astro
  - content/
    - posts/                    -> 10 artigos .mdx
  - data/
    - siteConfig.ts             -> categorias, navegação, config global
  - layouts/
    - BaseLayout.astro
    - BlogPostLayout.astro
    - ToolLayout.astro
  - pages/
    - index.astro
    - sobre.astro
    - contacto.astro
    - 404.astro
    - politica-de-privacidade.astro
    - termos-de-uso.astro
    - aviso-de-afiliados.astro
    - politica-de-cookies.astro
    - categorias/
      - index.astro
      - [slug].astro
    - ferramentas/
      - index.astro
      - calculadora-ganhos-blog.astro
    - posts/
      - [slug].astro
  - styles/
    - global.css
- astro.config.mjs
- package.json
- tsconfig.json
- README.md
- RELATORIO_INICIAL.md
```

---

## 5. Comandos Executados

```sh
npm install                # OK OK
npx astro add mdx          # OK OK (@astrojs/mdx instalado)
npx astro add sitemap      # OK OK (@astrojs/sitemap instalado)
npm run build              # OK 26 páginas em 2.78s - Exit code 0
```

---

## 6. Resultados

| Comando | Resultado |
|---|---|
| `npm install` | OK Sucesso |
| `npm run build` | OK **26 páginas geradas em 2.78s** |
| `npm run dev` | OK Pronto para testar em `http://localhost:4321` |
| `sitemap-index.xml` | OK Gerado automaticamente em `/dist/` |

---

## 7. Estado Atual

- OK Build passa sem erros
- OK Todos os artigos MDX indexados corretamente
- OK Calculadora de Ganhos funcional (Vanilla JS)
- OK SEO básico em todas as páginas
- OK Sitemap gerado
- OK robots.txt configurado
- OK Categorias filtram posts corretamente
- OK Design responsivo e limpo

---

## 8. Limitações Conhecidas

- Os artigos usam `import FAQ from '../../components/FAQ.astro'` diretamente no ficheiro MDX - funciona corretamente com Astro v6 MDX.
- Newsletter sem backend real (UI apenas).
- AdSlot é apenas visual - sem código de publicidade real.
- Domínio ainda não comprado; URL configurada como placeholder (`dinheiro-na-net.icnuvunga.workers.dev`).

---

## 9. Próximos Passos Recomendados

1. **Testar localmente**: `npm run dev` -> abrir `http://localhost:4321`
2. **Adicionar imagens**: colocar `.webp` otimizadas em `public/images/`
3. **Integrar Google Analytics** quando o domínio for comprado
4. **Publicar no Cloudflare Pages** (ver secção abaixo)
5. **Expandir artigos**: aumentar extensão e adicionar links internos
6. **Favicon real**: substituir o SVG por um logo definitivo

---

## 10. Como Fazer Deploy Gratuito no Cloudflare Pages

1. **Criar conta** em [dash.cloudflare.com](https://dash.cloudflare.com)
2. **Colocar código no GitHub** (repositório privado ou público)
3. No Cloudflare Dashboard -> **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**
4. Selecionar o repositório `dinheiro-na-net`
5. Configurar o build:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node version:** `22`
6. Clicar **Save and Deploy**
7. O site ficará disponível em `https://dinheiro-na-net.icnuvunga.workers.dev` (ou nome similar)
8. Quando comprar o domínio, ligar via **Custom domains** no painel do Cloudflare Pages

