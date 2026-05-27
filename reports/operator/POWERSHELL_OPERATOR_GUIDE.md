# Guia de Operacao por PowerShell

## Comandos principais

- `npm run dev` - abre o site local para escrever e testar.
- `npm run build` - gera a versao estatica em `dist/`.
- `npm run operator:health` - mostra estado geral do projeto.
- `npm run operator:fix-encoding` - procura texto corrompido sem alterar ficheiros.
- `npm run operator:fix-encoding -- --write` - aplica correcoes conhecidas de encoding.
- `npm run operator:editorial` - audita qualidade editorial dos posts.
- `npm run operator:copy-scan` - procura problemas em textos visiveis.
- `npm run operator:links` - audita links internos.
- `npm run operator:prepublish` - roda a validacao completa antes de push.
- `npm run operator:chatgpt` - gera resumo curto do estado do projeto.

## Criar novo post

`npm run new:post -- "Titulo do artigo" "Começar do Zero"`

Depois edita o MDX criado em `src/content/posts/`, remove o draft quando estiver pronto e roda `npm run operator:prepublish`.

## Validar antes de push

1. `npm run operator:fix-encoding`
2. `npm run operator:prepublish`
3. `git status`
4. `git add ...`
5. `git commit -m "mensagem"`
6. `git push`

## Memoria local

Usa `npm run operator:snapshot` e guarda notas novas em `reports/operator/LOCAL_MEMORY_UPDATE_YYYYMMDD.md` quando houver uma decisao importante.
