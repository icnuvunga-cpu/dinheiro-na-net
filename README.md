# Dinheiro na Net

Blog educativo sobre renda digital, blogs, IA, afiliados e pequenos negócios para lusófonos.

> **Stack:** Astro v6 · MDX · Vanilla CSS · Cloudflare Pages (futuro deploy)

---

## Sobre o Projeto

Portal prático para aprender a criar renda digital com blogs, IA, afiliados, ferramentas online e pequenos negócios digitais, com linguagem simples e foco na realidade de quem fala português.

## Requisitos

- Node.js >= 22
- npm

## Instalação

```sh
npm install
```

## Desenvolvimento Local

```sh
npm run dev
```

Abrir `http://localhost:4321` no browser.

## Fluxo ChatGPT + PowerShell

Este projeto inclui um **Operator Kit** local para trabalhar em ciclos curtos:

1. Rodar um comando curto no PowerShell.
2. Colar o resumo no ChatGPT.
3. Receber o próximo comando.
4. Repetir até o projeto estar validado.

Fluxo recomendado:

```sh
npm run operator:status
npm run operator:audit
npm run operator:chatgpt
```

Depois, colar no ChatGPT o conteúdo de `reports/operator/chatgpt-summary.txt`.

Comandos disponíveis:

- `npm run operator:status` — resumo rápido do estado local.
- `npm run operator:audit` — auditoria completa e relatório em `reports/operator/audit.md`.
- `npm run operator:content` — auditoria dos posts MDX.
- `npm run operator:seo` — auditoria SEO básica.
- `npm run operator:adsense` — verificação de segurança para AdSense e anúncios.
- `npm run operator:deploy-check` — build e prontidão para deploy gratuito.
- `npm run operator:mobile` — instruções e IPs para testar no telefone.
- `npm run operator:chatgpt` — resumo curto próprio para colar no ChatGPT.
- `npm run operator:snapshot` — documento de continuidade do projeto.
- `npm run new:post` — cria novo artigo MDX em modo rascunho.

## Build

```sh
npm run build
```

Gera a pasta `dist/` com 26+ páginas HTML estáticas, sitemap e robots.txt.

## Auditorias Locais

```sh
npm run audit
```

O comando gera relatórios Markdown em `reports/`:

- `reports/site-audit.md` — resumo geral, incluindo segurança e AdSense.
- `reports/content-audit.md` — frontmatter, categorias, estrutura editorial, FAQ e termos perigosos.
- `reports/seo-audit.md` — metadados, páginas principais, robots, sitemap e APIs antigas do Astro.
- `reports/deploy-readiness.md` — build, `dist/`, scripts npm, README e sinais óbvios de segredos.

Também é possível executar auditorias separadas:

```sh
npm run audit:content
npm run audit:seo
npm run audit:deploy
```

Estados nos relatórios:

- `OK`: verificação passou.
- `WARN`: ponto a rever, mas sem bloquear a ronda.
- `FAIL`: problema que deve ser corrigido antes de considerar o site pronto.

## Criar Novo Artigo

```sh
npm run new:post
```

O comando faz perguntas no terminal e cria um `.mdx` em `src/content/posts/` com frontmatter completo, introdução, seções H2, FAQ, conclusão e nota editorial. Por segurança, novos artigos entram como `draft: true` por padrão.

Também pode receber argumentos simples:

```sh
npm run new:post -- --title "Como escolher ferramenta de IA" --description "Guia educativo para comparar ferramentas de IA sem promessas exageradas." --category "IA e Produtividade" --tags "ia,ferramentas,produtividade"
```

## Preview do Build

```sh
npm run preview
```

## Deploy Gratuito no Cloudflare Pages

1. Fazer push do código para GitHub.
2. Em [dash.cloudflare.com](https://dash.cloudflare.com) → Workers & Pages → Create application → Pages.
3. Ligar ao repositório.
4. Configurar:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
   - **Node version:** `22`
5. Antes do primeiro deploy, correr localmente:
   ```sh
   npm run build
   npm run audit
   ```
6. Confirmar que `reports/deploy-readiness.md` não tem `FAIL`.
7. Deploy automático a cada push, apenas depois de confirmação manual.

## Estrutura

```
src/
  content.config.ts    ← Astro v6 Content Collections
  content/posts/       ← 10 artigos MDX
  components/          ← UI reutilizável
  layouts/             ← Wrappers de página
  pages/               ← Rotas (index, posts, categorias, ferramentas, legal)
  styles/global.css    ← CSS global com variáveis de cor
public/
  robots.txt
scripts/
  audit.mjs          ← auditorias locais e geração de relatórios
  new-post.mjs       ← criador de artigos MDX por terminal
  operator/          ← Operator Kit para fluxo ChatGPT + PowerShell
reports/
  README.md          ← explicação dos relatórios gerados
  operator/          ← relatórios do Operator Kit
```

## Categorias

1. Começar do Zero
2. IA e Produtividade
3. Afiliados e Ferramentas
4. Pagamentos Online
5. Ferramentas Gratuitas

## Ferramenta Incluída

**Calculadora de Ganhos com Blog** — simula ganhos com AdSense + afiliados com base em tráfego e RPM. Puro Vanilla JS, sem backend.

---

> Este projeto não inclui anúncios reais, login, base de dados ou backend. É um site 100% estático preparado para deploy gratuito.

## Link publico

Site online:

https://dinheiro-na-net.icnuvunga.workers.dev/
