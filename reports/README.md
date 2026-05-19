# Reports

Esta pasta guarda relatorios Markdown gerados pelas auditorias locais do projeto.

## Comandos

- `npm run audit` gera todos os relatorios principais.
- `npm run audit:content` gera `content-audit.md`.
- `npm run audit:seo` gera `seo-audit.md`.
- `npm run audit:deploy` gera `deploy-readiness.md`.

## Relatorios

- `site-audit.md`: resumo geral, incluindo seguranca e verificacoes de AdSense.
- `content-audit.md`: frontmatter, categorias, estrutura editorial, FAQ e termos perigosos nos posts.
- `seo-audit.md`: metadados, paginas principais, robots, sitemap e APIs antigas do Astro.
- `deploy-readiness.md`: build, pasta `dist`, scripts npm, README, relatorio inicial e sinais obvios de segredos.

Os relatorios sao artefatos locais de validacao. Eles nao fazem deploy, nao configuram AdSense e nao publicam o site.
