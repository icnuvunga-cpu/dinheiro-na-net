# Monetização V2 — Pedido de orçamento e recursos por objetivo

## Objetivo

Evoluir a Monetização Estrutural V1 sem ativar plataformas externas ou prometer resultados.

## Adicionado

- Página `/pedido-de-orcamento/`: prepara e copia uma mensagem; não envia dados automaticamente.
- `ServiceRequestCTA.astro`: CTA na página de serviços.
- `CategoryRecommendationGrid.astro`: recursos organizados por objetivo.

## Alterações controladas

- Injeta o CTA em `/servicos/` apenas uma vez.
- Injeta recursos por objetivo em `/recursos-recomendados/` apenas uma vez.
- Atualiza o auditor de links para reconhecer `/pedido-de-orcamento/`.

## Validação visual

- `/pedido-de-orcamento/`
- `/servicos/`
- `/recursos-recomendados/`
- botão “Copiar pedido”
- mobile
