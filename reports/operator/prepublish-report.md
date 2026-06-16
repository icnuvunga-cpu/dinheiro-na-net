# Operator Prepublish Report

Gerado em: 2026-06-16T21:08:15.137Z

OK: 8
Erros: 0

| Comando | Estado | Resumo |
| --- | --- | --- |
| build | OK | 23:08:21   ├─ /termos-de-uso/index.html (+3ms) <br>23:08:21   ├─ /index.html (+10ms) <br>23:08:21 ✓ Completed in 359ms.<br><br>23:08:21 [build] ✓ Completed in 4.24s.<br>23:08:21 [@astrojs/sitemap] `sitemap-index.xml` created at `dist`<br>23:08:21 [build] 36 page(s) built in 4.93s<br>23:08:21 [build] Complete! |
| operator:content | OK | > node scripts/operator/operator.mjs content<br><br>=== CONTENT ===<br>Posts: 20<br>OK: 20<br>Avisos: 0<br>Erros: 0<br>Relatorio: reports/operator/content-audit.md |
| operator:seo | OK | > dinheiro-na-net@0.0.1 operator:seo<br>> node scripts/operator/operator.mjs seo<br><br>=== SEO ===<br>OK: 36<br>Avisos: 0<br>Erros: 0<br>Relatorio: reports/operator/seo-audit.md |
| operator:deploy-check | OK | > node scripts/operator/operator.mjs deploy-check<br><br>=== DEPLOY CHECK ===<br>Deploy readiness: OK<br>OK: 11<br>Avisos: 0<br>Erros: 0<br>Relatorio: reports/operator/deploy-readiness.md |
| operator:editorial | OK | > dinheiro-na-net@0.0.1 operator:editorial<br>> node scripts/operator/operator.mjs editorial<br><br>=== EDITORIAL ===<br>OK: 14<br>Avisos: 6<br>Erros: 0<br>Relatorio: reports/operator/editorial-audit.md |
| operator:copy-scan | OK | > dinheiro-na-net@0.0.1 operator:copy-scan<br>> node scripts/operator/operator.mjs copy-scan<br><br>=== COPY SCAN ===<br>OK: 1<br>Avisos: 0<br>Erros: 0<br>Relatorio: reports/operator/copy-scan.md |
| operator:links | OK | > dinheiro-na-net@0.0.1 operator:links<br>> node scripts/operator/operator.mjs links<br><br>=== LINKS ===<br>OK: 20<br>Avisos: 0<br>Erros: 0<br>Relatorio: reports/operator/link-audit.md |
| operator:chatgpt | OK | Build/deploy-check: OK<br>Posts MDX: 20<br>Paginas principais: OK<br>Erros criticos: 0<br>Avisos: 0<br>Relatorios: reports/operator/audit.md; reports/operator/content-audit.md; reports/operator/seo-audit.md; reports/operator/adsense-safety.md; reports/operator/deploy-readiness.md<br>Ultimos resumos: content-audit.md: 20 OK, 0 avisos, 0 erros \| seo-audit.md: 36 OK, 0 avisos, 0 erros \| adsense-safety.md: 2 OK, 0 avisos, 0 erros \| deploy-readiness.md: OK, 11 OK, 0 avisos, 0 erros<br>Proximo passo recomendado: Fazer validacao visual/mobile antes de confirmar deploy. |

## Git status

```text
M reports/operator/chatgpt-summary.txt
 M reports/operator/content-audit.md
 M reports/operator/copy-scan.md
 M reports/operator/deploy-readiness.md
 M reports/operator/editorial-audit.md
 M reports/operator/link-audit.md
 M reports/operator/seo-audit.md
?? src/content/posts/blog-gratis-ou-blog-pago-qual-vale-a-pena.mdx
?? src/content/posts/como-criar-calendario-editorial-simples-blog.mdx
?? src/content/posts/como-criar-rotina-simples-trabalhar-online-todos-dias.mdx
?? src/content/posts/como-divulgar-blog-sem-spam-caminhos-seguros-iniciantes.mdx
?? src/content/posts/como-pesquisar-ideias-artigos-blog-sem-copiar-concorrentes.mdx
```
