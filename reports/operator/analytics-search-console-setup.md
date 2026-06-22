# Analytics e Search Console - Preparacao segura

Data: 2026-06-22

## Diagnostico local

- O site ja tinha uma tag Google Analytics hardcoded no layout base.
- A tag hardcoded foi removida para evitar tracking ativo sem decisao/configuracao explicita.
- O layout agora so carrega Google Analytics quando a variavel publica `PUBLIC_GA_MEASUREMENT_ID` existir no ambiente de build.
- Se a variavel estiver vazia ou ausente, nenhum script do Google Analytics e incluido no HTML final.
- Existe um ficheiro de verificacao do Search Console em `public/google4b64c5c3975c1fc5.html`.
- `robots.txt` aponta para `https://dinheiro-na-net.icnuvunga.workers.dev/sitemap-index.xml`.
- O build gera `sitemap-index.xml` em `dist`.
- As paginas usam canonical baseado em `Astro.site` ou `siteConfig.url`.

## Como criar a propriedade GA4

1. Entrar no Google Analytics com a conta do dono.
2. Criar ou escolher uma conta Analytics.
3. Criar uma propriedade GA4 para o site.
4. Criar um fluxo de dados Web para o dominio atual ou futuro dominio proprio.
5. Copiar o Measurement ID real do fluxo Web.
6. Guardar esse valor para configurar no Cloudflare.

Referencia oficial: https://support.google.com/analytics/answer/9304153

## Onde colocar `PUBLIC_GA_MEASUREMENT_ID`

O projeto usa a variavel:

```text
PUBLIC_GA_MEASUREMENT_ID
```

Regras:

- nao colocar o ID diretamente no codigo;
- nao criar `.env` com credenciais para commit;
- configurar a variavel no ambiente de deploy;
- deixar vazia/remover para desligar o Analytics.

## Como configurar no Cloudflare

Para Cloudflare Pages:

1. Abrir o dashboard Cloudflare.
2. Ir para Workers & Pages.
3. Selecionar o projeto do site.
4. Ir a Settings > Environment variables.
5. Adicionar `PUBLIC_GA_MEASUREMENT_ID`.
6. Colocar o Measurement ID real copiado do GA4.
7. Fazer novo deploy.

Para Worker/Pages com build estatico, a variavel precisa estar disponivel no momento do build.

Referencia oficial: https://developers.cloudflare.com/pages/configuration/build-configuration/

## Como verificar Search Console

Opcoes comuns:

- Ficheiro HTML de verificacao no `public/`;
- meta tag no `<head>`;
- DNS, quando existir dominio proprio.

Estado local:

- ja existe `public/google4b64c5c3975c1fc5.html`;
- se esse ficheiro pertence a propriedade correta, basta manter publicado;
- se o dono criar nova propriedade, deve substituir/adicionar o novo ficheiro ou token indicado pelo Google.

Referencia oficial: https://support.google.com/webmasters/answer/9008080

## Como enviar sitemap

1. Confirmar que o site publicado abre corretamente.
2. Confirmar que `https://dinheiro-na-net.icnuvunga.workers.dev/sitemap-index.xml` responde.
3. Entrar no Search Console.
4. Escolher a propriedade verificada.
5. Abrir Sitemaps.
6. Enviar `sitemap-index.xml`.
7. Aguardar processamento.

Referencia oficial: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap

## Metricas iniciais a acompanhar

- visitas;
- origem do trafego;
- paginas mais lidas;
- cliques em WhatsApp;
- cliques em Servicos;
- cliques em Pedido de Orcamento;
- cliques em Recursos;
- uso da calculadora.

## Eventos preparados

O layout base inclui um listener simples para elementos com `data-analytics-event`, mas ele so existe quando `PUBLIC_GA_MEASUREMENT_ID` esta configurado.

Eventos preparados:

- `whatsapp_click`;
- `services_click`;
- `quote_click`;
- `calculator_use`.

Isto nao recolhe dados sem configuracao explicita do Analytics.

## Como remover ou desativar Analytics

1. Remover `PUBLIC_GA_MEASUREMENT_ID` no Cloudflare.
2. Fazer novo deploy.
3. Confirmar no HTML publicado que nao existe `googletagmanager.com`.
4. Se necessario, remover tambem a propriedade no Google Analytics.

## Pendencias externas

- Criar ou confirmar propriedade GA4.
- Decidir se a propriedade sera para `workers.dev` ou para dominio proprio futuro.
- Confirmar se o ficheiro Search Console atual pertence a propriedade correta.
- Enviar o sitemap depois de confirmar a propriedade.
