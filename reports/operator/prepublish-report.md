# Operator Prepublish Report

Gerado em: 2026-06-16T21:27:39.522Z

OK: 8
Erros: 0

| Comando | Estado | Resumo |
| --- | --- | --- |
| build | OK | 23:27:44   ├─ /termos-de-uso/index.html (+3ms) <br>23:27:44   ├─ /index.html (+5ms) <br>23:27:44 ✓ Completed in 269ms.<br><br>23:27:44 [build] ✓ Completed in 3.04s.<br>23:27:44 [@astrojs/sitemap] `sitemap-index.xml` created at `dist`<br>23:27:44 [build] 46 page(s) built in 3.61s<br>23:27:44 [build] Complete! |
| operator:content | OK | > node scripts/operator/operator.mjs content<br><br>=== CONTENT ===<br>Posts: 30<br>OK: 30<br>Avisos: 0<br>Erros: 0<br>Relatorio: reports/operator/content-audit.md |
| operator:seo | OK | > dinheiro-na-net@0.0.1 operator:seo<br>> node scripts/operator/operator.mjs seo<br><br>=== SEO ===<br>OK: 46<br>Avisos: 0<br>Erros: 0<br>Relatorio: reports/operator/seo-audit.md |
| operator:deploy-check | OK | > node scripts/operator/operator.mjs deploy-check<br><br>=== DEPLOY CHECK ===<br>Deploy readiness: OK<br>OK: 11<br>Avisos: 0<br>Erros: 0<br>Relatorio: reports/operator/deploy-readiness.md |
| operator:editorial | OK | > dinheiro-na-net@0.0.1 operator:editorial<br>> node scripts/operator/operator.mjs editorial<br><br>=== EDITORIAL ===<br>OK: 20<br>Avisos: 10<br>Erros: 0<br>Relatorio: reports/operator/editorial-audit.md |
| operator:copy-scan | OK | > dinheiro-na-net@0.0.1 operator:copy-scan<br>> node scripts/operator/operator.mjs copy-scan<br><br>=== COPY SCAN ===<br>OK: 1<br>Avisos: 0<br>Erros: 0<br>Relatorio: reports/operator/copy-scan.md |
| operator:links | OK | > dinheiro-na-net@0.0.1 operator:links<br>> node scripts/operator/operator.mjs links<br><br>=== LINKS ===<br>OK: 30<br>Avisos: 0<br>Erros: 0<br>Relatorio: reports/operator/link-audit.md |
| operator:chatgpt | OK | Build/deploy-check: OK<br>Posts MDX: 30<br>Paginas principais: OK<br>Erros criticos: 0<br>Avisos: 0<br>Relatorios: reports/operator/audit.md; reports/operator/content-audit.md; reports/operator/seo-audit.md; reports/operator/adsense-safety.md; reports/operator/deploy-readiness.md<br>Ultimos resumos: content-audit.md: 30 OK, 0 avisos, 0 erros \| seo-audit.md: 46 OK, 0 avisos, 0 erros \| adsense-safety.md: 2 OK, 0 avisos, 0 erros \| deploy-readiness.md: OK, 11 OK, 0 avisos, 0 erros<br>Proximo passo recomendado: Fazer validacao visual/mobile antes de confirmar deploy. |

## Git status

```text
M reports/operator/chatgpt-summary.txt
 M reports/operator/content-audit.md
 M reports/operator/copy-scan.md
 M reports/operator/deploy-readiness.md
 M reports/operator/editorial-audit.md
 M reports/operator/link-audit.md
 M reports/operator/seo-audit.md
?? src/content/posts/como-atualizar-artigos-antigos-blog-melhorar-resultados.mdx
?? src/content/posts/como-calcular-lucro-afiliados-sem-se-enganar.mdx
?? src/content/posts/como-criar-pagina-recursos-recomendados-blog.mdx
?? src/content/posts/como-criar-servico-digital-simples-vender-online.mdx
?? src/content/posts/como-escolher-programas-afiliados-confiaveis-blog.mdx
?? src/content/posts/como-escrever-review-honesto-ferramenta-digital.mdx
?? src/content/posts/como-organizar-pagamentos-servicos-digitais-mocambique.mdx
?? src/content/posts/como-preparar-blog-para-adsense-sem-pressa.mdx
?? src/content/posts/como-usar-links-internos-melhorar-seo-blog.mdx
?? src/content/posts/o-que-e-rpm-cpc-ctr-adsense-blog.mdx
```
