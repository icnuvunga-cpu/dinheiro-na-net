# Operator Prepublish Report

Gerado em: 2026-05-27T10:38:35.521Z

OK: 8
Erros: 0

| Comando | Estado | Resumo |
| --- | --- | --- |
| build | OK | 12:38:41   ├─ /termos-de-uso/index.html (+4ms) <br>12:38:41   ├─ /index.html (+9ms) <br>12:38:41 ✓ Completed in 246ms.<br><br>12:38:41 [build] ✓ Completed in 3.49s.<br>12:38:41 [@astrojs/sitemap] `sitemap-index.xml` created at `dist`<br>12:38:41 [build] 26 page(s) built in 4.29s<br>12:38:41 [build] Complete! |
| operator:content | OK | > node scripts/operator/operator.mjs content<br><br>=== CONTENT ===<br>Posts: 10<br>OK: 10<br>Avisos: 0<br>Erros: 0<br>Relatorio: reports/operator/content-audit.md |
| operator:seo | OK | > dinheiro-na-net@0.0.1 operator:seo<br>> node scripts/operator/operator.mjs seo<br><br>=== SEO ===<br>OK: 26<br>Avisos: 0<br>Erros: 0<br>Relatorio: reports/operator/seo-audit.md |
| operator:deploy-check | OK | > node scripts/operator/operator.mjs deploy-check<br><br>=== DEPLOY CHECK ===<br>Deploy readiness: OK<br>OK: 11<br>Avisos: 0<br>Erros: 0<br>Relatorio: reports/operator/deploy-readiness.md |
| operator:editorial | OK | > dinheiro-na-net@0.0.1 operator:editorial<br>> node scripts/operator/operator.mjs editorial<br><br>=== EDITORIAL ===<br>OK: 10<br>Avisos: 0<br>Erros: 0<br>Relatorio: reports/operator/editorial-audit.md |
| operator:copy-scan | OK | > dinheiro-na-net@0.0.1 operator:copy-scan<br>> node scripts/operator/operator.mjs copy-scan<br><br>=== COPY SCAN ===<br>OK: 1<br>Avisos: 0<br>Erros: 0<br>Relatorio: reports/operator/copy-scan.md |
| operator:links | OK | > dinheiro-na-net@0.0.1 operator:links<br>> node scripts/operator/operator.mjs links<br><br>=== LINKS ===<br>OK: 10<br>Avisos: 0<br>Erros: 0<br>Relatorio: reports/operator/link-audit.md |
| operator:chatgpt | OK | Build/deploy-check: OK<br>Posts MDX: 10<br>Paginas principais: OK<br>Erros criticos: 0<br>Avisos: 0<br>Relatorios: reports/operator/audit.md; reports/operator/content-audit.md; reports/operator/seo-audit.md; reports/operator/adsense-safety.md; reports/operator/deploy-readiness.md<br>Ultimos resumos: content-audit.md: 10 OK, 0 avisos, 0 erros \| seo-audit.md: 26 OK, 0 avisos, 0 erros \| adsense-safety.md: 2 OK, 0 avisos, 0 erros \| deploy-readiness.md: OK, 11 OK, 0 avisos, 0 erros<br>Proximo passo recomendado: Fazer validacao visual/mobile antes de confirmar deploy. |

## Git status

```text
M README.md
 M RELATORIO_INICIAL.md
 M package.json
 M reports/operator/chatgpt-summary.txt
 M reports/operator/content-audit.md
 M reports/operator/deploy-readiness.md
 M reports/operator/seo-audit.md
 M scripts/audit.mjs
 M scripts/operator/operator.mjs
 M src/components/AffiliateNotice.astro
 M src/content/posts/afiliados-ou-adsense.mdx
 M src/content/posts/como-criar-blog-do-zero.mdx
 M src/content/posts/como-escolher-nicho-blog.mdx
 M src/content/posts/como-ganhar-dinheiro-blog-2026.mdx
 M src/content/posts/como-receber-dinheiro-mocambique.mdx
 M src/content/posts/erros-impedem-ganhar-dinheiro.mdx
 M src/content/posts/marketing-afiliados-inicio.mdx
 M src/content/posts/o-que-e-adsense.mdx
 M src/content/posts/quanto-custa-criar-blog.mdx
 M src/content/posts/usar-ia-para-conteudo.mdx
 M src/data/siteConfig.ts
 M src/layouts/BaseLayout.astro
 M src/pages/aviso-de-afiliados.astro
 M src/pages/contacto.astro
 M src/pages/index.astro
 M src/pages/politica-de-cookies.astro
 M src/pages/politica-de-privacidade.astro
 M src/pages/sobre.astro
 M src/pages/termos-de-uso.astro
?? reports/operator/POWERSHELL_OPERATOR_GUIDE.md
?? reports/operator/WORKFLOWS.md
?? reports/operator/copy-scan.md
?? reports/operator/editorial-audit.md
?? reports/operator/fix-encoding.md
?? reports/operator/health.md
?? reports/operator/link-audit.md
```
