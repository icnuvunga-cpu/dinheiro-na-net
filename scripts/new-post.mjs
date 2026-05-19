import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, 'src', 'content', 'posts');

function readIfExists(...parts) {
  const filePath = path.join(ROOT, ...parts);
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
}

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const current = argv[i];
    if (!current.startsWith('--')) {
      args._.push(current);
      continue;
    }

    const withoutPrefix = current.slice(2);
    if (withoutPrefix.includes('=')) {
      const [key, ...rest] = withoutPrefix.split('=');
      args[key] = rest.join('=');
      continue;
    }

    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      args[withoutPrefix] = 'true';
    } else {
      args[withoutPrefix] = next;
      i += 1;
    }
  }
  return args;
}

function defaultDescription(title) {
  return `Guia educativo sobre ${title}, com contexto, passos praticos, cuidados importantes e expectativas realistas para leitores lusofonos.`;
}

function getOfficialCategories() {
  const source = readIfExists('src', 'data', 'siteConfig.ts');
  const names = [...source.matchAll(/name:\s*["'`](.*?)["'`]/g)].map((match) => match[1]);
  return [...new Set(names)];
}

function slugify(value) {
  return String(value)
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function yamlQuote(value) {
  return JSON.stringify(String(value ?? ''));
}

function parseTags(value) {
  return String(value ?? '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function parseBoolean(value, fallback) {
  if (value === undefined || value === '') return fallback;
  return /^(true|1|yes|sim)$/i.test(String(value).trim());
}

async function askRequired(rl, label, fallback = '') {
  const suffix = fallback ? ` [${fallback}]` : '';
  while (true) {
    const answer = (await rl.question(`${label}${suffix}: `)).trim();
    const value = answer || fallback;
    if (value) return value;
  }
}

async function askOptional(rl, label, fallback = '') {
  const suffix = fallback ? ` [${fallback}]` : '';
  const answer = (await rl.question(`${label}${suffix}: `)).trim();
  return answer || fallback;
}

function resolveCategory(inputValue, categories) {
  const raw = String(inputValue ?? '').trim();
  if (!raw) return '';

  const numeric = Number(raw);
  if (Number.isInteger(numeric) && numeric >= 1 && numeric <= categories.length) {
    return categories[numeric - 1];
  }

  const match = categories.find((category) => category.toLowerCase() === raw.toLowerCase());
  return match ?? raw;
}

function buildTemplate({ title, description, date, category, tags, author, draft }) {
  return `---
title: ${yamlQuote(title)}
description: ${yamlQuote(description)}
date: ${yamlQuote(date)}
updated: ${yamlQuote(date)}
category: ${yamlQuote(category)}
tags: [${tags.map(yamlQuote).join(', ')}]
author: ${yamlQuote(author)}
draft: ${draft}
---
import FAQ from '../../components/FAQ.astro';

Escreve aqui a introducao do artigo: apresenta o problema, quem deve ler este guia e qual resultado pratico a pessoa pode esperar depois da leitura.

## Contexto principal

Explica o cenario com exemplos realistas para publico lusofono. Evita promessas absolutas e deixa claro que resultados dependem de contexto, consistencia e qualidade.

## Passos praticos

1. Define o primeiro passo.
2. Mostra como executar.
3. Indica como medir se a acao esta a funcionar.

## Cuidados importantes

Lista riscos, limites, custos escondidos ou decisoes que devem ser tomadas com calma antes de avancar.

## Perguntas frequentes

<FAQ faqs={[
  { question: "Esta estrategia funciona para iniciantes?", answer: "Pode funcionar, desde que seja aplicada com expectativas realistas, aprendizagem continua e validacao passo a passo." },
  { question: "Quanto tempo demora para ver resultados?", answer: "Depende do nicho, da qualidade do conteudo e da consistencia. Usa este artigo como guia educativo, nao como promessa de rendimento." }
]} />

## Conclusao

Resume a ideia principal e recomenda um proximo passo simples, seguro e mensuravel para o leitor.

> **Nota editorial:** Este conteudo e educativo. Nao promete ganhos, nao incentiva cliques em anuncios e deve ser revisto antes de sair de draft.
`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const categories = getOfficialCategories();
  const hasPositionalShortcut = args._.length >= 2;
  const rl = readline.createInterface({ input, output });

  try {
    const title = args.title ?? args._[0] ?? await askRequired(rl, 'Titulo');
    const description = args.description ?? (hasPositionalShortcut ? defaultDescription(title) : await askRequired(rl, 'Description'));
    const date = args.date ?? await askOptional(rl, 'Date', new Date().toISOString().slice(0, 10));
    const author = args.author ?? await askOptional(rl, 'Author', 'Dinheiro na Net');

    let category = args.category ?? args._[1];
    if (!category) {
      if (categories.length > 0) {
        console.log('\nCategorias oficiais:');
        categories.forEach((item, index) => console.log(`${index + 1}. ${item}`));
      }
      category = await askRequired(rl, 'Category');
    }
    category = resolveCategory(category, categories);

    if (categories.length > 0 && !categories.includes(category)) {
      throw new Error(`Categoria invalida: ${category}. Usa uma destas: ${categories.join(', ')}`);
    }

    const tags = parseTags(args.tags ?? (hasPositionalShortcut ? 'rascunho' : await askRequired(rl, 'Tags separadas por virgula', 'rascunho')));
    const slug = slugify(args.slug ?? (hasPositionalShortcut ? slugify(title) : await askRequired(rl, 'Slug', slugify(title))));
    const draft = parseBoolean(args.draft, true);

    if (!slug) throw new Error('Slug vazio depois da normalizacao.');
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      throw new Error(`Slug invalido: ${slug}`);
    }

    fs.mkdirSync(POSTS_DIR, { recursive: true });
    const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
    if (fs.existsSync(filePath)) {
      throw new Error(`Ja existe um post com este slug: ${path.relative(ROOT, filePath)}`);
    }

    const content = buildTemplate({ title, description, date, category, tags, author, draft });
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`\nPost criado: ${path.relative(ROOT, filePath)}`);
    console.log(`Draft: ${draft}`);
  } finally {
    rl.close();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
