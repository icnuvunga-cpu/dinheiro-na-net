# Deploy Readiness

Gerado em: 2026-05-19T20:00:04.177Z

Resumo: 17 OK, 0 avisos, 0 falhas.

## Checklist

| Estado |Item |Detalhe |
| --- |--- |--- |
| OK |script npm: dev |astro dev |
| OK |script npm: build |astro build |
| OK |script npm: audit |node scripts/audit.mjs all |
| OK |script npm: audit:content |node scripts/audit.mjs content |
| OK |script npm: audit:seo |node scripts/audit.mjs seo |
| OK |script npm: audit:deploy |node scripts/audit.mjs deploy |
| OK |script npm: new:post |node scripts/new-post.mjs |
| OK |npm run build |Build passou. |
| OK |dist/ |Pasta dist gerada. |
| OK |dist/index.html |Existe no build. |
| OK |dist/robots.txt |Existe no build. |
| OK |sitemap em dist |Sitemap gerado em dist/. |
| OK |README deploy/auditoria |README inclui auditoria, novo artigo e deploy gratuito. |
| OK |RELATORIO_INICIAL.md |Arquivo existe. |
| OK |.env no projeto |Nenhum arquivo .env encontrado fora de pastas ignoradas. |
| OK |.env versionado |Nenhum .env versionado detectado ou projeto sem .git. |
| OK |segredos obvios |Nenhum segredo obvio encontrado em arquivos comuns. |

## Saida resumida do build

```text
[2m22:00:09[22m   [34m├─[39m [2m/categorias/comecar-do-zero/index.html[22m [2m(+8ms)[22m 
[2m22:00:09[22m   [34m├─[39m [2m/categorias/ia-e-produtividade/index.html[22m [2m(+4ms)[22m 
[2m22:00:09[22m   [34m├─[39m [2m/categorias/afiliados-e-ferramentas/index.html[22m [2m(+4ms)[22m 
[2m22:00:09[22m   [34m├─[39m [2m/categorias/pagamentos-online/index.html[22m [2m(+3ms)[22m 
[2m22:00:09[22m   [34m├─[39m [2m/categorias/ferramentas-gratuitas/index.html[22m [2m(+2ms)[22m 
[2m22:00:09[22m   [34m├─[39m [2m/categorias/index.html[22m [2m(+7ms)[22m 
[2m22:00:09[22m   [34m├─[39m [2m/contacto/index.html[22m [2m(+4ms)[22m 
[2m22:00:09[22m   [34m├─[39m [2m/ferramentas/calculadora-ganhos-blog/index.html[22m [2m(+7ms)[22m 
[2m22:00:09[22m   [34m├─[39m [2m/ferramentas/index.html[22m [2m(+5ms)[22m 
[2m22:00:09[22m   [34m├─[39m [2m/politica-de-cookies/index.html[22m [2m(+4ms)[22m 
[2m22:00:09[22m   [34m├─[39m [2m/politica-de-privacidade/index.html[22m [2m(+5ms)[22m 
[2m22:00:09[22m   [34m├─[39m [2m/posts/afiliados-ou-adsense/index.html[22m [2m(+12ms)[22m 
[2m22:00:09[22m   [34m├─[39m [2m/posts/como-criar-blog-do-zero/index.html[22m [2m(+5ms)[22m 
[2m22:00:09[22m   [34m├─[39m [2m/posts/como-escolher-nicho-blog/index.html[22m [2m(+7ms)[22m 
[2m22:00:09[22m   [34m├─[39m [2m/posts/como-ganhar-dinheiro-blog-2026/index.html[22m [2m(+6ms)[22m 
[2m22:00:09[22m   [34m├─[39m [2m/posts/como-receber-dinheiro-mocambique/index.html[22m [2m(+6ms)[22m 
[2m22:00:09[22m   [34m├─[39m [2m/posts/erros-impedem-ganhar-dinheiro/index.html[22m [2m(+6ms)[22m 
[2m22:00:09[22m   [34m├─[39m [2m/posts/marketing-afiliados-inicio/index.html[22m [2m(+6ms)[22m 
[2m22:00:09[22m   [34m├─[39m [2m/posts/o-que-e-adsense/index.html[22m [2m(+6ms)[22m 
[2m22:00:09[22m   [34m├─[39m [2m/posts/quanto-custa-criar-blog/index.html[22m [2m(+7ms)[22m 
[2m22:00:09[22m   [34m├─[39m [2m/posts/usar-ia-para-conteudo/index.html[22m [2m(+5ms)[22m 
[2m22:00:09[22m   [34m├─[39m [2m/sobre/index.html[22m [2m(+3ms)[22m 
[2m22:00:09[22m   [34m├─[39m [2m/termos-de-uso/index.html[22m [2m(+5ms)[22m 
[2m22:00:09[22m   [34m├─[39m [2m/index.html[22m [2m(+6ms)[22m 
[2m22:00:09[22m [32m✓ Completed in 195ms.
[39m
[2m22:00:09[22m [34m[build][39m [32m✓ Completed in 3.16s.[39m
[2m22:00:09[22m [34m[@astrojs/sitemap][39m `sitemap-index.xml` created at `dist`
[2m22:00:09[22m [34m[build][39m 26 page(s) built in [1m3.79s[22m
[2m22:00:09[22m [34m[build][39m [1mComplete![22m
```
