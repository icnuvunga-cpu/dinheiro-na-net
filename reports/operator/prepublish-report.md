# Operator Prepublish Report

Gerado em: 2026-06-17T06:27:17.596Z

OK: 8
Erros: 0

| Comando | Estado | Resumo |
| --- | --- | --- |
| build | OK | 08:27:23   ├─ /termos-de-uso/index.html (+3ms) <br>08:27:23   ├─ /index.html (+4ms) <br>08:27:23 ✓ Completed in 314ms.<br><br>08:27:23 [build] ✓ Completed in 3.53s.<br>08:27:23 [@astrojs/sitemap] `sitemap-index.xml` created at `dist`<br>08:27:23 [build] 56 page(s) built in 4.19s<br>08:27:23 [build] Complete! |
| operator:content | OK | > node scripts/operator/operator.mjs content<br><br>=== CONTENT ===<br>Posts: 40<br>OK: 40<br>Avisos: 0<br>Erros: 0<br>Relatorio: reports/operator/content-audit.md |
| operator:seo | OK | > dinheiro-na-net@0.0.1 operator:seo<br>> node scripts/operator/operator.mjs seo<br><br>=== SEO ===<br>OK: 56<br>Avisos: 0<br>Erros: 0<br>Relatorio: reports/operator/seo-audit.md |
| operator:deploy-check | OK | > node scripts/operator/operator.mjs deploy-check<br><br>=== DEPLOY CHECK ===<br>Deploy readiness: OK<br>OK: 11<br>Avisos: 0<br>Erros: 0<br>Relatorio: reports/operator/deploy-readiness.md |
| operator:editorial | OK | > dinheiro-na-net@0.0.1 operator:editorial<br>> node scripts/operator/operator.mjs editorial<br><br>=== EDITORIAL ===<br>OK: 30<br>Avisos: 10<br>Erros: 0<br>Relatorio: reports/operator/editorial-audit.md |
| operator:copy-scan | OK | > dinheiro-na-net@0.0.1 operator:copy-scan<br>> node scripts/operator/operator.mjs copy-scan<br><br>=== COPY SCAN ===<br>OK: 1<br>Avisos: 0<br>Erros: 0<br>Relatorio: reports/operator/copy-scan.md |
| operator:links | OK | > dinheiro-na-net@0.0.1 operator:links<br>> node scripts/operator/operator.mjs links<br><br>=== LINKS ===<br>OK: 40<br>Avisos: 0<br>Erros: 0<br>Relatorio: reports/operator/link-audit.md |
| operator:chatgpt | OK | Build/deploy-check: OK<br>Posts MDX: 40<br>Paginas principais: OK<br>Erros criticos: 0<br>Avisos: 0<br>Relatorios: reports/operator/audit.md; reports/operator/content-audit.md; reports/operator/seo-audit.md; reports/operator/adsense-safety.md; reports/operator/deploy-readiness.md<br>Ultimos resumos: content-audit.md: 40 OK, 0 avisos, 0 erros \| seo-audit.md: 56 OK, 0 avisos, 0 erros \| adsense-safety.md: 2 OK, 0 avisos, 0 erros \| deploy-readiness.md: OK, 11 OK, 0 avisos, 0 erros<br>Proximo passo recomendado: Fazer validacao visual/mobile antes de confirmar deploy. |

## Git status

```text
M reports/operator/chatgpt-summary.txt
 M reports/operator/content-audit.md
 M reports/operator/copy-scan.md
 M reports/operator/deploy-readiness.md
 M reports/operator/editorial-audit.md
 M reports/operator/link-audit.md
 M reports/operator/seo-audit.md
?? src/content/posts/como-criar-checklist-gratuito-atrair-leitores-blog.mdx
?? src/content/posts/como-criar-ebook-simples-vender-blog.mdx
?? src/content/posts/como-criar-lista-contactos-blog-iniciantes.mdx
?? src/content/posts/como-criar-pagina-servicos-digitais-blog.mdx
?? src/content/posts/como-criar-produto-digital-simples-primeiro-blog.mdx
?? src/content/posts/como-criar-rotina-mensal-revisao-blog.mdx
?? src/content/posts/como-medir-trafego-blog-sem-complicar.mdx
?? src/content/posts/como-saber-se-nicho-blog-tem-potencial-dinheiro.mdx
?? src/content/posts/como-transformar-artigo-blog-posts-redes-sociais.mdx
?? src/content/posts/como-vender-servicos-com-blog-sem-ser-chato.mdx
```
