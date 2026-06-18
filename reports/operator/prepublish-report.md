# Operator Prepublish Report

Gerado em: 2026-06-17T22:01:58.728Z

OK: 8
Erros: 0

| Comando | Estado | Resumo |
| --- | --- | --- |
| build | OK | 00:02:12   ├─ /termos-de-uso/index.html (+7ms) <br>00:02:12   ├─ /index.html (+13ms) <br>00:02:12 ✓ Completed in 797ms.<br><br>00:02:12 [build] ✓ Completed in 9.91s.<br>00:02:12 [@astrojs/sitemap] `sitemap-index.xml` created at `dist`<br>00:02:12 [build] 69 page(s) built in 10.83s<br>00:02:12 [build] Complete! |
| operator:content | OK | > node scripts/operator/operator.mjs content<br><br>=== CONTENT ===<br>Posts: 50<br>OK: 50<br>Avisos: 0<br>Erros: 0<br>Relatorio: reports/operator/content-audit.md |
| operator:seo | OK | > dinheiro-na-net@0.0.1 operator:seo<br>> node scripts/operator/operator.mjs seo<br><br>=== SEO ===<br>OK: 66<br>Avisos: 0<br>Erros: 0<br>Relatorio: reports/operator/seo-audit.md |
| operator:deploy-check | OK | > node scripts/operator/operator.mjs deploy-check<br><br>=== DEPLOY CHECK ===<br>Deploy readiness: OK<br>OK: 11<br>Avisos: 0<br>Erros: 0<br>Relatorio: reports/operator/deploy-readiness.md |
| operator:editorial | OK | > dinheiro-na-net@0.0.1 operator:editorial<br>> node scripts/operator/operator.mjs editorial<br><br>=== EDITORIAL ===<br>OK: 30<br>Avisos: 20<br>Erros: 0<br>Relatorio: reports/operator/editorial-audit.md |
| operator:copy-scan | OK | > dinheiro-na-net@0.0.1 operator:copy-scan<br>> node scripts/operator/operator.mjs copy-scan<br><br>=== COPY SCAN ===<br>OK: 1<br>Avisos: 0<br>Erros: 0<br>Relatorio: reports/operator/copy-scan.md |
| operator:links | OK | > dinheiro-na-net@0.0.1 operator:links<br>> node scripts/operator/operator.mjs links<br><br>=== LINKS ===<br>OK: 50<br>Avisos: 0<br>Erros: 0<br>Relatorio: reports/operator/link-audit.md |
| operator:chatgpt | OK | Build/deploy-check: OK<br>Posts MDX: 50<br>Paginas principais: OK<br>Erros criticos: 0<br>Avisos: 0<br>Relatorios: reports/operator/audit.md; reports/operator/content-audit.md; reports/operator/seo-audit.md; reports/operator/adsense-safety.md; reports/operator/deploy-readiness.md<br>Ultimos resumos: content-audit.md: 50 OK, 0 avisos, 0 erros \| seo-audit.md: 66 OK, 0 avisos, 0 erros \| adsense-safety.md: 2 OK, 0 avisos, 0 erros \| deploy-readiness.md: OK, 11 OK, 0 avisos, 0 erros<br>Proximo passo recomendado: Fazer validacao visual/mobile antes de confirmar deploy. |

## Git status

```text
M reports/operator/chatgpt-summary.txt
 M reports/operator/content-audit.md
 M reports/operator/copy-scan.md
 M reports/operator/deploy-readiness.md
 M reports/operator/editorial-audit.md
 M reports/operator/link-audit.md
 M reports/operator/prepublish-report.md
 M reports/operator/seo-audit.md
 M scripts/operator/operator.mjs
 M src/components/Footer.astro
 M src/components/Header.astro
 M src/layouts/BlogPostLayout.astro
 M src/pages/ferramentas/index.astro
?? reports/operator/monetization-structure-v1.md
?? scripts/operator/operator.mjs.bak-monetizacao-v1
?? src/components/MonetizationCTA.astro
?? src/components/NewsletterCTA.astro
?? src/pages/lista-de-contactos.astro
?? src/pages/recursos-recomendados.astro
?? src/pages/servicos.astro
```
