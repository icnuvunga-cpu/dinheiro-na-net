# Auditoria Técnica de Pré-Lançamento - Dinheiro na Net

Data: 2026-06-19

## 1. Estado inicial

Commit atual no início da auditoria:

```text
1483339 feat: add commercial contact flow v1
```

Git status inicial observado:

```text
 M reports/operator/chatgpt-summary.txt
 M reports/operator/content-audit.md
 M reports/operator/copy-scan.md
 M reports/operator/deploy-readiness.md
 M reports/operator/editorial-audit.md
 M reports/operator/link-audit.md
 M reports/operator/prepublish-report.md
 M reports/operator/seo-audit.md
 M src/components/Header.astro
```

Últimos commits observados:

```text
1483339 feat: add commercial contact flow v1
d0a4c00 fix: improve resources CTA contrast
7b09884 fix: complete monetization v2 integrations
8b25d54 feat: add monetization v2 quote request flow
0839cc0 fix: improve monetization pages visual contrast
fd13b4b feat: add monetization structure v1
d06d20c docs: refresh operator summary after lote 5
7e46d18 content: add lote 5 editorial optimization articles
267c8fa refactor: rename calculator currency formatter to dollar
a579ccf fix: use dollar currency in blog earnings calculator
b6d54e4 content: add lote 4 audience and product articles
1e58b32 content: add lote 3 monetization and SEO articles
```

Alterações locais não commitadas já existiam antes desta auditoria: relatórios operator atualizados e `src/components/Header.astro`.

Backup local criado antes das correções estruturais:

```text
.operator-backups/pre-launch-technical-audit-20260619/
```

## 2. Correção do Header

### Causa real

O Header tinha links `Recursos` e `Serviços` inseridos manualmente fora da mesma renderização dos links principais. Também havia CSS global com seletor específico para estes dois links, usando compensações e `!important`.

### O que foi removido

- Links manuais fora da lista principal.
- Bloco `<style is:global>` específico para `/recursos-recomendados/` e `/servicos/`.
- Regras de compensação como `margin-left`, `font-weight` especial e seletor amplo de header.

### O que foi reorganizado

- Criada lista única `headerNavigation`, composta por `navigation` + `Recursos` + `Serviços`.
- Menu desktop e menu mobile usam a mesma lista.
- Ambos renderizam todos os itens por `.map(...)`.
- Desktop e mobile aplicam `aria-current` com a mesma lógica de rota ativa.
- Normalização de trailing slash adicionada para estado ativo consistente.
- Margens globais de `li` foram neutralizadas dentro do Header.
- Links do menu receberam `display: inline-flex/flex`, `align-items: center` e `line-height` consistente.

### Verificação do Header

Browser local em `http://127.0.0.1:4321/`:

- Desktop 1280 px: 7 links, todos com mesma altura, topo, padding, font-size e line-height. Apenas o link ativo usa peso 700.
- Mobile 375 px: menu abre, 7 links, sem duplicação, sem overflow.
- Mobile 320 px: menu abre, 7 links, sem duplicação, sem overflow.

Ainda falta aprovação visual humana antes de commit.

## 3. Correções técnicas adicionais aplicadas

### Links de categoria em posts

Problema: o layout de posts gerava slugs manualmente. Para `Começar do Zero`, o link ficava como `/categorias/começar-do-zero`, mas a rota real é `/categorias/comecar-do-zero/`.

Correção: `BlogPostLayout.astro` agora usa a lista oficial `categories` de `siteConfig.ts` para obter o slug correto.

Resultado: verificação do HTML gerado encontrou 0 links internos quebrados e badges de categoria com os cinco slugs oficiais.

### Robots

Problema: `public/robots.txt` apontava para sitemap do domínio antigo `dinheironanet.pages.dev`.

Correção: sitemap atualizado para:

```text
https://dinheiro-na-net.icnuvunga.workers.dev/sitemap-index.xml
```

### Responsividade

Problema: grids com `minmax(300px, 1fr)` dentro de containers com padding geravam overflow em 320 px.

Correção:

- Home: grids de categorias e artigos usam `minmax(min(100%, ...), 1fr)`.
- Categorias: grids usam `minmax(min(100%, 300px), 1fr)`.
- Contacto: botão de e-mail pode quebrar linha em telas estreitas.
- Ferramenta/calculadora: padding mobile reduzido e grid dos campos ajustado.
- Calculadora: variável inválida `--color-alert` trocada por `--color-alert-bg`.

## 4. Auditoria técnica

### A. Bloqueadores de lançamento

- Nenhum bloqueador técnico automatizado ficou aberto após as correções.
- Bloqueador operacional pendente: o dono do projeto precisa confirmar visualmente o Header em desktop e mobile antes de commit.
- Bloqueador comercial possível: confirmar se `contacto@dinheiro-na-net.icnuvunga.workers.dev` recebe e-mails reais. O site usa `mailto`, não endpoint próprio.

### B. Problemas importantes

- `BaseLayout.astro` aponta `og:image` para `/images/og-default.jpg`, mas esse ficheiro não existe em `public/`.
- Não foram encontradas meta tags de Twitter Card.
- Contacto tem link `mailto`, mas não existe formulário real com backend ou serviço externo.
- `pedido-de-orcamento.astro` prepara e copia texto; não envia dados automaticamente.
- `ContactCommercialPaths.astro` menciona "formulário desta página", mas a página Contacto atualmente não tem formulário, apenas e-mail e modelos de mensagem.
- A página Contacto ainda diz "Não vendemos cursos ou serviços pagos na fase atual", mas já existe página pública de Serviços. Isto exige decisão editorial/comercial antes do lançamento.
- `operator:editorial` passou sem erros, mas gerou 20 avisos editoriais existentes em posts. Não foram alterados MDX nesta auditoria.

### C. Melhorias recomendadas

- Criar imagem social real em `public/images/og-default.jpg` ou ajustar o default de Open Graph.
- Adicionar Twitter Card no layout base.
- Decidir se Contacto deve continuar com `mailto` ou usar Formspree, Cloudflare Worker, outro endpoint, ou WhatsApp Business.
- Rever texto comercial da página Contacto para alinhar com Serviços, Pedido de Orçamento e Lista de Contactos.
- Melhorar Footer: os links de monetização estão fora do grid principal e usam estilo inline.
- Avaliar componentes aparentemente não usados: `MonetizationCTA.astro` e `NewsletterCTA.astro`.

### D. Melhorias opcionais futuras

- RSS, se fizer parte da estratégia editorial.
- Manifest/PWA, apenas se houver necessidade real.
- Structured data para artigos, organização e breadcrumbs.
- Melhorar 404 com links para categorias, ferramentas e contacto.
- Consolidar CTAs comerciais em componentes reutilizáveis sem estilos inline.

## 5. Rotas e links

Rotas principais confirmadas no build:

```text
/
/sobre/
/contacto/
/ferramentas/
/ferramentas/calculadora-ganhos-blog/
/recursos-recomendados/
/servicos/
/pedido-de-orcamento/
/lista-de-contactos/
/categorias/
/politica-de-privacidade/
/politica-de-cookies/
/termos-de-uso/
/aviso-de-afiliados/
```

Também foram confirmadas:

- 5 categorias.
- 50 posts.
- Página 404.
- 70 páginas geradas no build.

Verificação adicional do HTML gerado:

```text
HTML files: 71
Internal href/src checked: 2680
Broken internal href/src: 0
```

## 6. Formulários e contacto

### O que envia realmente

- A página Contacto usa `mailto:contacto@dinheiro-na-net.icnuvunga.workers.dev`.
- O envio depende do cliente de e-mail do visitante e da existência/configuração real da caixa de e-mail.
- Não há endpoint próprio, backend, Formspree, Netlify Forms ou Cloudflare Worker para receber mensagens.

### O que apenas prepara/copia mensagem

- `pedido-de-orcamento.astro` gera um resumo no navegador e permite copiar.
- `ContactCommercialPaths.astro` tem botões para copiar modelos de parceria e dúvida geral.
- Os botões usam `navigator.clipboard.writeText` com fallback para `document.execCommand('copy')`.

### O que precisa de decisão comercial

- Qual e-mail recebe mensagens reais?
- Haverá WhatsApp Business?
- Haverá formulário com backend/serviço externo?
- Haverá newsletter ativa?
- A lista de contactos vai recolher e-mails ou continua como página futura?
- Haverá links afiliados reais?
- Como as políticas legais serão atualizadas quando houver coleta de dados real?

## 7. SEO técnico

### Sitemap

Sitemap gerado por `@astrojs/sitemap`:

```text
https://dinheiro-na-net.icnuvunga.workers.dev/sitemap-index.xml
```

O sitemap inclui páginas principais, categorias, posts, recursos, serviços, contacto, orçamento, lista de contactos e páginas legais.

### Robots

`robots.txt` agora aponta para o sitemap do domínio oficial.

### Canonical

Canonical é gerado em `BaseLayout.astro` com `Astro.url.pathname` e `Astro.site/siteConfig.url`.

### Favicon

Existem:

```text
public/favicon.svg
public/favicon.ico
```

### Open Graph

Tags Open Graph existem em `BaseLayout.astro`, mas a imagem padrão configurada não existe fisicamente:

```text
/images/og-default.jpg
```

### Twitter Card

Não encontrado.

### RSS

Não encontrado.

### Manifest

Não encontrado.

### Noindex

Não encontrado em páginas ativas.

### 404

Página 404 existe e tem navegação para Home. Pode ser melhorada futuramente com links para categorias/ferramentas.

## 8. Mobile e UX

### Verificado por código e Browser local

Viewports verificados:

```text
320 x 720
375 x 812
768 x 900
1280 x 720
```

Páginas verificadas:

```text
/
/recursos-recomendados/
/servicos/
/contacto/
/pedido-de-orcamento/
/ferramentas/calculadora-ganhos-blog/
/posts/afiliados-ou-adsense/
```

Resultados:

- Header desktop: 7 links, alinhamento e estilos uniformes.
- Header mobile: 7 links, sem duplicação.
- Menu mobile abre e altera `aria-hidden`.
- 320/375/768 px: sem overflow horizontal após correções.
- Recursos, Serviços, Contacto, Pedido de Orçamento, Calculadora e artigo longo foram verificados por métricas DOM.

### Precisa de validação visual manual

- Aprovação visual final do Header em desktop.
- Aprovação visual final do Header em mobile.
- Teste manual do fluxo de copiar mensagem.
- Teste real do `mailto` no dispositivo do dono.
- Verificação subjetiva de espaçamento, contraste e leitura em telemóvel real.

## 9. Validações executadas

```text
npm run build
Resultado: OK, 70 páginas geradas

npm run operator:content
Resultado: OK, 50 posts, 0 avisos, 0 erros

npm run operator:seo
Resultado: OK, 66 OK, 0 avisos, 0 erros

npm run operator:deploy-check
Resultado: OK, 11 OK, 0 avisos, 0 erros

npm run operator:editorial
Resultado: OK, 30 OK, 20 avisos, 0 erros

npm run operator:copy-scan
Resultado: OK, 1 OK, 0 avisos, 0 erros

npm run operator:links
Resultado: OK, 50 OK, 0 avisos, 0 erros

npm run operator:prepublish
Resultado: OK em build, content, seo, deploy-check, editorial, copy-scan, links e chatgpt

npm run operator:chatgpt
Resultado: OK, erros críticos 0, avisos 0
```

## 10. Ficheiros alterados

Código e público:

```text
public/robots.txt
src/components/BlogEarningsCalculator.astro
src/components/Header.astro
src/layouts/BlogPostLayout.astro
src/layouts/ToolLayout.astro
src/pages/categorias/[slug].astro
src/pages/categorias/index.astro
src/pages/contacto.astro
src/pages/ferramentas/calculadora-ganhos-blog.astro
src/pages/index.astro
```

Relatórios operator atualizados pelas validações:

```text
reports/operator/chatgpt-summary.txt
reports/operator/content-audit.md
reports/operator/copy-scan.md
reports/operator/deploy-readiness.md
reports/operator/editorial-audit.md
reports/operator/link-audit.md
reports/operator/prepublish-report.md
reports/operator/seo-audit.md
```

Relatório criado:

```text
reports/operator/pre-launch-technical-audit.md
```

## 11. Checklist final

```text
[ ] Header visualmente aprovado em desktop
[ ] Header visualmente aprovado em mobile
[ ] Contacto recebe mensagem real
[ ] Pedido de orçamento testado
[ ] Botões de copiar testados
[x] Links internos validados
[ ] Formulários validados
[x] Sitemap e robots confirmados
[x] Search Console configurado
[x] Analytics configurado
[ ] Políticas atualizadas conforme funcionalidades reais
[ ] Backup/tag de lançamento criado
[ ] Domínio próprio decidido
```

## 12. Estado para commit

Tecnicamente, as validações passaram e o projeto está pronto para revisão visual.

Não foi feito commit, push, reset ou rebase.

Recomendação: só commitar depois de validação visual do Header e decisão sobre o contacto real.
