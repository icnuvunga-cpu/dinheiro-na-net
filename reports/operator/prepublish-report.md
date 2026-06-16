# Operator Prepublish Report

Gerado em: 2026-06-16T19:17:18.257Z

OK: 7
Erros: 1

| Comando | Estado | Resumo |
| --- | --- | --- |
| build | OK | 21:17:23   ├─ /termos-de-uso/index.html (+3ms) <br>21:17:23   ├─ /index.html (+6ms) <br>21:17:23 ✓ Completed in 230ms.<br><br>21:17:23 [build] ✓ Completed in 3.00s.<br>21:17:23 [@astrojs/sitemap] `sitemap-index.xml` created at `dist`<br>21:17:23 [build] 27 page(s) built in 3.71s<br>21:17:23 [build] Complete! |
| operator:content | ERROR | > node scripts/operator/operator.mjs content<br><br>=== CONTENT ===<br>Posts: 11<br>OK: 10<br>Avisos: 0<br>Erros: 1<br>Relatorio: reports/operator/content-audit.md |
| operator:seo | OK | > dinheiro-na-net@0.0.1 operator:seo<br>> node scripts/operator/operator.mjs seo<br><br>=== SEO ===<br>OK: 27<br>Avisos: 0<br>Erros: 0<br>Relatorio: reports/operator/seo-audit.md |
| operator:deploy-check | OK | > node scripts/operator/operator.mjs deploy-check<br><br>=== DEPLOY CHECK ===<br>Deploy readiness: OK<br>OK: 11<br>Avisos: 0<br>Erros: 0<br>Relatorio: reports/operator/deploy-readiness.md |
| operator:editorial | OK | > dinheiro-na-net@0.0.1 operator:editorial<br>> node scripts/operator/operator.mjs editorial<br><br>=== EDITORIAL ===<br>OK: 10<br>Avisos: 1<br>Erros: 0<br>Relatorio: reports/operator/editorial-audit.md |
| operator:copy-scan | OK | > dinheiro-na-net@0.0.1 operator:copy-scan<br>> node scripts/operator/operator.mjs copy-scan<br><br>=== COPY SCAN ===<br>OK: 1<br>Avisos: 0<br>Erros: 0<br>Relatorio: reports/operator/copy-scan.md |
| operator:links | OK | > dinheiro-na-net@0.0.1 operator:links<br>> node scripts/operator/operator.mjs links<br><br>=== LINKS ===<br>OK: 11<br>Avisos: 0<br>Erros: 0<br>Relatorio: reports/operator/link-audit.md |
| operator:chatgpt | OK | Build/deploy-check: OK<br>Posts MDX: 11<br>Paginas principais: OK<br>Erros criticos: src/content/posts/como-comecar-ganhar-dinheiro-internet-zero.mdx (tags ausente; author ausente; draft ausente)<br>Avisos: 0<br>Relatorios: reports/operator/audit.md; reports/operator/content-audit.md; reports/operator/seo-audit.md; reports/operator/adsense-safety.md; reports/operator/deploy-readiness.md<br>Ultimos resumos: content-audit.md: 10 OK, 0 avisos, 1 erros \| seo-audit.md: 27 OK, 0 avisos, 0 erros \| adsense-safety.md: 2 OK, 0 avisos, 0 erros \| deploy-readiness.md: OK, 11 OK, 0 avisos, 0 erros<br>Proximo passo recomendado: Corrigir erros criticos reportados antes de deploy. |

## Git status

```text
M reports/operator/chatgpt-summary.txt
 M reports/operator/content-audit.md
 M reports/operator/copy-scan.md
 M reports/operator/deploy-readiness.md
 M reports/operator/editorial-audit.md
 M reports/operator/fix-encoding.md
 M reports/operator/link-audit.md
 M reports/operator/seo-audit.md
```
