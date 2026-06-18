# Contacto Comercial V1 - Dinheiro na Net

## Objetivo

Transformar a página de Contacto em um ponto comercial mais claro, sem criar envio automático de dados e sem depender de serviços externos.

## Componentes adicionados

- `ContactCommercialPaths.astro`
  - três caminhos: pedido de orçamento, parceria/recomendação e dúvida geral;
  - modelos de mensagem que podem ser copiados localmente;
  - ligação para `/pedido-de-orcamento/` e `/servicos/`.

- `ContactExpectations.astro`
  - orientações sobre objetivo, contexto e clareza da mensagem;
  - princípio de transparência sobre preço, prazo e resultado.

## Integração

O instalador coloca os componentes no fim da página `src/pages/contacto.astro`, sem substituir o formulário existente.

## Validação visual

Confirmar:
- formulário de contacto existente continua funcional;
- cartões ficam abaixo do conteúdo original;
- botões de copiar funcionam;
- `/pedido-de-orcamento/` abre corretamente;
- página funciona em mobile.
