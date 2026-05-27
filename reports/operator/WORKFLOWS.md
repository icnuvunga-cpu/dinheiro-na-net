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
2. Confirmar `GA4 G-X44LDYSG1: OK`.
3. Confirmar `Search Console verification: OK`.
4. Nao remover `public/google4b64c5c3975c1fc5.html`.

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
