# Operator Reports

Relatorios locais para o fluxo ChatGPT + PowerShell.

## O que rodar

- `npm run operator:status`: resumo rapido para saber se o projeto esta reconhecivel.
- `npm run operator:audit`: auditoria completa; gera `audit.md` e os relatorios por area.
- `npm run operator:content`: verifica artigos MDX e gera `content-audit.md`.
- `npm run operator:seo`: verifica SEO tecnico basico e gera `seo-audit.md`.
- `npm run operator:adsense`: verifica ausencia de anuncios reais e textos perigosos; gera `adsense-safety.md`.
- `npm run operator:deploy-check`: roda build e verifica prontidao para Cloudflare Pages; gera `deploy-readiness.md`.
- `npm run operator:mobile`: gera instrucoes para testar no telefone; gera `mobile-test.md`.
- `npm run operator:chatgpt`: gera `chatgpt-summary.txt`, o melhor arquivo para colar no ChatGPT.
- `npm run operator:snapshot`: atualiza `project-snapshot.md`, um documento de continuidade do projeto.

## Qual colar no ChatGPT

Na rotina normal, cola o conteudo de `reports/operator/chatgpt-summary.txt`.

Quando houver problema especifico, cola tambem o relatorio correspondente:

- Conteudo: `reports/operator/content-audit.md`
- SEO: `reports/operator/seo-audit.md`
- AdSense/safety: `reports/operator/adsense-safety.md`
- Deploy gratuito: `reports/operator/deploy-readiness.md`
