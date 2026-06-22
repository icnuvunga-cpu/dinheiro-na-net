# Social sharing readiness

Data: 2026-06-22

## Objetivo

Preparar a identidade de partilha do Dinheiro na Net para WhatsApp, Facebook, LinkedIn e outras redes, sem promessas de rendimento e sem depender de servicos externos.

## Estado antes

- `BaseLayout.astro` ja tinha metadados Open Graph basicos.
- O layout apontava para `/images/og-default.jpg`, mas nao havia imagem correspondente em `public/`.
- Havia favicon SVG e ICO em `public/`.
- Nao havia Twitter Card completo.

## Alteracoes implementadas

- Criada imagem Open Graph em `public/images/og-default.png`.
- Tamanho: 1200x630.
- Texto principal: `Dinheiro na Net`.
- Mensagem segura: `Conteudo util para comecar e crescer online com clareza.`
- Sem promessas de rendimento.
- Sem nomes de ferramentas, afiliados ou plataformas pagas.
- `BaseLayout.astro` agora usa `/images/og-default.png`.
- Adicionados metadados:
  - `og:image`;
  - `og:image:width`;
  - `og:image:height`;
  - `twitter:card`;
  - `twitter:title`;
  - `twitter:description`;
  - `twitter:image`.

## Favicon

Ficheiros existentes:

- `public/favicon.svg`;
- `public/favicon.ico`.

Nao foi necessario criar novo favicon.

## Validacao local

Build local confirmou:

- `dist/images/og-default.png` existe;
- pagina inicial inclui `og:image` com URL absoluto;
- pagina inicial inclui `twitter:card` como `summary_large_image`;
- canonical continua a apontar para `https://dinheiro-na-net.icnuvunga.workers.dev/`.

## Cuidados editoriais

- A imagem nao promete dinheiro rapido.
- A imagem nao menciona ganhos especificos.
- A imagem nao cria urgencia artificial.
- A identidade visual segue a paleta atual: azul escuro, azul e verde.

## Testes manuais pendentes

- Confirmar preview apos deploy no WhatsApp.
- Confirmar preview no Facebook Sharing Debugger.
- Confirmar preview no LinkedIn Post Inspector.
- Confirmar se o dominio futuro deve usar imagem propria ou a mesma imagem.
