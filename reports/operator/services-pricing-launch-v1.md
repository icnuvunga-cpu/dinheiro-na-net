# Services Pricing Launch V1

Data: 2026-06-22
Projeto: Dinheiro na Net
Escopo: publicacao das ofertas iniciais na pagina publica de servicos, sem criar backend, pagamentos, credenciais ou novas funcionalidades.

## Commit

- Mensagem: `feat: publish initial service offers and pricing`
- Hash: confirmado apos a criacao do commit, porque este relatorio faz parte do proprio commit.

## Ficheiros alterados

- `src/pages/servicos.astro`
- `src/pages/pedido-de-orcamento.astro`
- `src/pages/recursos-recomendados.astro`
- `reports/operator/chatgpt-summary.txt`
- `reports/operator/content-audit.md`
- `reports/operator/copy-scan.md`
- `reports/operator/deploy-readiness.md`
- `reports/operator/editorial-audit.md`
- `reports/operator/link-audit.md`
- `reports/operator/mobile-test.md`
- `reports/operator/prepublish-report.md`
- `reports/operator/seo-audit.md`
- `reports/operator/services-pricing-launch-v1.md`

## Ofertas e precos publicados

| Oferta | Preco de referencia | Estado |
| --- | --- | --- |
| Mini Diagnostico de Site | desde US$25 | Publicado em `/servicos/` |
| Pagina Comercial Essencial | desde US$75 | Publicado em `/servicos/` |
| Blog ou Site Inicial Organizado | desde US$150 | Publicado em `/servicos/` |

## CTAs de WhatsApp

Foram adicionados tres botoes principais em `/servicos/`, cada um com link `wa.me`, `target="_blank"`, `rel="noopener noreferrer"`, `aria-label` e mensagem pre-preenchida especifica:

- Mini Diagnostico de Site: inclui campos para link do site, objetivo e principal dificuldade.
- Pagina Comercial Essencial: inclui campos para objetivo da pagina, tipo de negocio/projeto, secoes necessarias e prazo desejado.
- Blog ou Site Inicial Organizado: inclui campos para objetivo, tipo de projeto, paginas desejadas, textos/imagens e prazo desejado.

Tambem foi atualizada a selecao de tipo de apoio em `/pedido-de-orcamento/` para refletir as tres ofertas iniciais.

## Notas comerciais publicadas

A pagina `/servicos/` inclui area visivel informando que:

- os valores sao de referencia;
- o valor final depende de objetivo, numero de paginas, conteudo disponivel e funcionalidades;
- clientes em Mocambique podem pagar no equivalente em meticais conforme taxa combinada antes do inicio;
- cada pedido e confirmado por WhatsApp com objetivo, escopo, prazo e valor final.

Nao foram publicados meios de pagamento especificos, percentagens de adiantamento, politicas de cancelamento ou promessas comerciais.

## Validacoes executadas

- `npm run build`: OK
- `npm run operator:content`: OK, 50 posts, 0 avisos, 0 erros
- `npm run operator:seo`: OK, 66 OK, 0 avisos, 0 erros
- `npm run operator:editorial`: OK, 30 OK, 20 avisos editoriais, 0 erros
- `npm run operator:copy-scan`: OK
- `npm run operator:links`: OK, 50 OK, 0 avisos, 0 erros
- `npm run operator:mobile`: OK, relatorio atualizado
- `npm run operator:prepublish`: OK
- `npm run operator:chatgpt`: OK
- `git diff --check`: OK apos limpeza de trailing whitespace em `reports/operator/deploy-readiness.md`

## Validacao responsiva local

Foi feita verificacao local em browser para `/servicos/`, `/pedido-de-orcamento/`, `/contacto/` e `/recursos-recomendados/` nos tamanhos:

- 320px
- 375px
- 768px
- 1280px

Resultado:

- sem overflow horizontal;
- menu mobile abre em 320px, 375px e 768px;
- menu mobile apresenta 7 links unicos;
- `/servicos/` apresenta 3 cartoes de servico;
- os precos aparecem como `desde US$25`, `desde US$75` e `desde US$150`;
- nota sobre meticais aparece em `/servicos/`;
- links WhatsApp mantem mensagens pre-preenchidas;
- nao foram encontrados `mailto:`, Gmail ou `contacto@` nas paginas verificadas.

## Confirmacoes de escopo

- Nenhum artigo MDX foi alterado.
- Nenhum backend foi criado.
- Nenhum pagamento online foi criado.
- Nenhuma credencial, token ou segredo foi adicionado.
- A moeda USD da calculadora nao foi alterada.
- Nao foram criadas novas funcionalidades fora do escopo.

## Testes manuais recomendados

1. Abrir `/servicos/`.
2. Clicar em cada botao WhatsApp.
3. Confirmar a mensagem pre-preenchida de cada oferta.
4. Testar a pagina num telemovel real.
5. Confirmar conversao de USD para meticais apenas no momento da negociacao.
