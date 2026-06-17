# Operator Prepublish Report

Gerado em: 2026-06-17T21:01:36.733Z

OK: 8
Erros: 0

| Comando | Estado | Resumo |
| --- | --- | --- |
| build | OK | 23:01:46   ├─ /termos-de-uso/index.html (+5ms) <br>23:01:46   ├─ /index.html (+10ms) <br>23:01:46 ✓ Completed in 584ms.<br><br>23:01:46 [build] ✓ Completed in 5.99s.<br>23:01:46 [@astrojs/sitemap] `sitemap-index.xml` created at `dist`<br>23:01:46 [build] 66 page(s) built in 6.95s<br>23:01:46 [build] Complete! |
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
 M reports/operator/seo-audit.md
?? src/content/posts/como-criar-chamada-acao-blog-sem-pressao.mdx
?? src/content/posts/como-criar-faq-artigos-blog-melhorar-seo.mdx
?? src/content/posts/como-criar-plano-90-dias-blog-do-zero.mdx
?? src/content/posts/como-criar-sitemap-mental-conteudo-blog.mdx
?? src/content/posts/como-escolher-titulo-artigo-blog-seo-iniciantes.mdx
?? src/content/posts/como-escrever-introducao-artigo-blog-clara.mdx
?? src/content/posts/como-fazer-backup-conteudo-blog-sem-complicar.mdx
?? src/content/posts/como-organizar-categorias-tags-blog-sem-confusao.mdx
?? src/content/posts/como-validar-artigo-blog-antes-publicar.mdx
?? src/content/posts/paginas-legais-blog-politica-termos-afiliados.mdx
```
