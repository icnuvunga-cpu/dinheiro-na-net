# Monetization launch readiness v1

Data: 2026-06-22

## Estado final

- Commit principal criado: sim.
- Hash do commit principal: `95849bc`.
- Mensagem: `feat: prepare WhatsApp commercial launch flow`.
- Push realizado: sim, `main -> origin/main`.
- Git status antes da criacao deste relatorio: limpo.
- Relatorio final: versionado em commit documental posterior.

## Build e validacoes

- `npm run build`: OK, 70 paginas geradas.
- `npm run operator:content`: OK, 50 posts, 0 avisos, 0 erros.
- `npm run operator:seo`: OK, 66 OK, 0 avisos, 0 erros.
- `npm run operator:editorial`: OK, 30 OK, 20 avisos, 0 erros.
- `npm run operator:copy-scan`: OK, 0 avisos, 0 erros.
- `npm run operator:links`: OK, 50 OK, 0 avisos, 0 erros.
- `npm run operator:prepublish`: OK.
- `npm run operator:chatgpt`: OK.
- `npm run operator:health`: OK, GA4 opcional condicional.
- `git diff --check`: OK, apenas avisos LF/CRLF do Windows.

## Alteracoes implementadas

### WhatsApp comercial

- Canal publico principal definido como WhatsApp.
- Nome publico: Equipa Dinheiro na Net.
- Numero publico: `+258 87 365 9275`.
- Link tecnico: `https://wa.me/258873659275`.
- Mensagens pre-preenchidas criadas para contacto geral, orcamento, servicos, parceria e duvida sobre conteudo.

### Contacto

- Removido o `mailto:` para e-mail inexistente.
- Pagina Contacto agora mostra WhatsApp como canal funcional.
- Modelos de parceria e duvida passaram a apontar para WhatsApp e continuam copiaveis.
- Textos deixam claro que ainda nao ha e-mail publico profissional.

### Pedido de Orcamento

- O formulario continua local e nao envia dados automaticamente.
- O passo final agora abre WhatsApp com pedido organizado.
- Botao de copiar continua disponivel com fallback.

### Servicos

- Pagina de Servicos recebeu caminho direto para WhatsApp.
- CTA de pedido de orcamento continua disponivel.
- Nenhum preco, pacote fechado ou promessa comercial foi criado.

### Recursos

- Pagina de Recursos agora aceita sugestao de recurso/parceria via WhatsApp com modelo proprio.
- Aviso de afiliados futuros preservado.

### Footer

- Footer passou a incluir WhatsApp publico como canal rapido.
- Links internos de Recursos, Servicos e Lista de contactos preservados.

### Analytics readiness

- Removida tag GA hardcoded.
- Criada integracao condicional por `PUBLIC_GA_MEASUREMENT_ID`.
- Nenhum script de analytics e carregado quando a variavel esta ausente.
- Eventos simples preparados para cliques em WhatsApp, Servicos, Pedido de Orcamento e uso da calculadora.
- Operator Health atualizado para reconhecer GA4 como opcional/condicional.

### Search Console readiness

- Ficheiro `public/google4b64c5c3975c1fc5.html` preservado.
- `robots.txt` e sitemap mantidos.
- Documentacao criada em `reports/operator/analytics-search-console-setup.md`.

### Open Graph e favicon

- Criada imagem `public/images/og-default.png` com 1200x630.
- `BaseLayout.astro` referencia a imagem social real.
- Metas Open Graph e Twitter Card completas.
- Favicon SVG/ICO existente preservado.

### Responsividade

- Auditoria automatizada local em 60 combinacoes de paginas/larguras:
  - 15 paginas;
  - 320px;
  - 375px;
  - 768px;
  - desktop 1280px.
- Resultado: sem overflow horizontal.
- Menu mobile: 7 links visiveis, sem duplicacao.
- Links WhatsApp: `target="_blank"`, `rel="noopener noreferrer"` e `aria-label` presentes.

### Politicas e coerencia

- Politica de Privacidade e Politica de Cookies ajustadas para Analytics opcional.
- Lista de contactos deixa claro que nao recolhe e-mails.
- Newsletter visual deixou de parecer formulario ativo.

## Fluxo comercial final

Artigo ou Ferramenta
-> Servico ou Recurso
-> WhatsApp
-> Pedido organizado
-> Conversa comercial
-> Orcamento
-> Pagamento futuro

## Pendencias do dono

- Comprar dominio.
- Configurar Email Routing no Cloudflare.
- Escolher e-mail de destino: `icnuvunga0@gmail.com`.
- Criar `contacto@dominio.com`.
- Configurar resposta como `contacto@dominio.com`, se desejado.
- Criar/verificar Google Search Console, se a propriedade atual nao for a final.
- Criar Google Analytics e obter Measurement ID.
- Configurar `PUBLIC_GA_MEASUREMENT_ID` no Cloudflare.
- Escolher servicos iniciais a vender.
- Definir preco ou modelo de orcamento.
- Definir prazo de entrega.
- Definir forma de pagamento.
- Definir politica de revisoes.
- Definir politica de cancelamento.
- Escolher afiliados reais.
- Decidir newsletter/lista de contactos.
- Testar WhatsApp publicamente.

## Testes manuais que o dono deve fazer

1. Clicar em cada botao de WhatsApp.
2. Conferir se a mensagem pre-preenchida esta correta.
3. Testar no telemovel.
4. Confirmar que o numero `+258 87 365 9275` abre WhatsApp.
5. Confirmar a imagem de partilha apos deploy.
6. Criar dominio e e-mail profissional no futuro.
7. Configurar Search Console e GA4 quando tiver credenciais.

## O que nao foi feito

- Nenhum artigo MDX foi criado ou alterado.
- Nenhum backend foi criado.
- Nenhuma conta externa foi ligada.
- Nenhuma credencial foi adicionada.
- Nenhuma recolha automatica de dados pessoais foi ativada.
- A moeda USD da calculadora nao foi alterada.
