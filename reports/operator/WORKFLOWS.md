# Workflows do Operador

## Melhorar artigo existente

1. Editar o ficheiro MDX em `src/content/posts/`.
2. Rodar `npm run operator:editorial`.
3. Rodar `npm run operator:links`.
4. Rodar `npm run operator:prepublish`.
5. Rever `git status` e commitar.

## Criar novo artigo

1. `npm run new:post -- "Titulo" "Categoria"`.
2. Editar o rascunho.
3. Confirmar frontmatter, FAQ, conclusao e links internos.
4. Rodar `npm run operator:prepublish`.

## Como escolher o proximo artigo a publicar

1. Abrir `reports/operator/CONTENT_BACKLOG.md`.
2. Escolher primeiro um artigo com status `Planeado`, prioridade `Alta` e o menor lote ainda nao validado.
3. Se houver empate, preferir a categoria mais fraca no site: `Ferramentas Gratuitas`, `IA e Produtividade`, `Afiliados e Ferramentas` ou `Pagamentos Online`.
4. Confirmar que o artigo tera pelo menos dois links internos naturais para posts atuais ou para a calculadora.
5. Evitar temas sensiveis de pagamentos, afiliados ou AdSense sem verificar regras atuais antes de escrever.
6. Criar e publicar apenas um artigo por vez; depois validar dados, links e qualidade antes de avancar para o proximo.
7. Atualizar o status no backlog quando o artigo passar para `Rascunho`, `Publicado` ou `Revisar`.

## Corrigir texto quebrado

1. `npm run operator:fix-encoding`.
2. Se o relatorio estiver correto: `npm run operator:fix-encoding -- --write`.
3. Rodar `npm run operator:copy-scan`.

## Validar SEO

1. `npm run operator:seo`.
2. Corrigir title, description, canonical ou paginas principais.
3. Rodar `npm run build`.

## Validar Analytics e Search Console sem mexer neles

1. `npm run operator:health`.
2. Confirmar `GA4 opcional: OK (condicional)`.
3. Confirmar `Search Console verification: OK`.
4. Nao remover `public/google4b64c5c3975c1fc5.html`.
5. Confirmar que `PUBLIC_GA_MEASUREMENT_ID` so existe no ambiente quando o dono decidir ativar Analytics.

## Preparar commit

1. `npm run operator:prepublish`.
2. `git status`.
3. `git diff --stat`.
4. `git add ...`.
5. `git commit -m "mensagem"`.

## Publicar alteracao

1. Confirmar que o branch esta certo.
2. Rodar `git push`.
3. Aguardar o deploy conectado ao GitHub/Cloudflare.
4. Abrir o site oficial e verificar paginas principais.
