import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'reports');
const POSTS_DIR = path.join(ROOT, 'src', 'content', 'posts');
const PREFERRED_SITE = 'https://dinheironanet.pages.dev';
const GENERATED_AT = new Date().toISOString();

const reportFiles = {
  site: 'site-audit.md',
  content: 'content-audit.md',
  seo: 'seo-audit.md',
  deploy: 'deploy-readiness.md',
};

const dangerousPatterns = [
  { label: 'ganhos garantidos', pattern: /ganhos?\s+garantid[oa]s?/i },
  { label: 'clique no anuncio', pattern: /clique\s+(aqui\s+)?(no|na|em|num|neste|nesse|naquele)\s+an[uú]ncio/i },
  { label: 'dinheiro facil garantido', pattern: /dinheiro\s+f[aá]cil\s+garantido/i },
  { label: 'trafego falso', pattern: /tr[aá]fego\s+falso/i },
  { label: 'bots de clique', pattern: /bots?\s+de\s+clique/i },
];

const adManipulationPatterns = [
  { label: 'script AdSense', pattern: /adsbygoogle|googlesyndication|pagead2\.googlesyndication|ca-pub-/i },
  { label: 'incentivo a clique em anuncio', pattern: /clique\s+(aqui\s+)?(no|na|em|num|neste|nesse|naquele)\s+an[uú]ncio/i },
  { label: 'manipulacao de anuncios', pattern: /(incentiv|for[cç]a|obriga|pede).{0,60}clique.{0,60}an[uú]ncio/i },
  { label: 'trafego falso', pattern: /tr[aá]fego\s+falso/i },
  { label: 'bots de clique', pattern: /bots?\s+de\s+clique/i },
];

const textExtensions = new Set([
  '.astro',
  '.css',
  '.html',
  '.js',
  '.json',
  '.md',
  '.mdx',
  '.mjs',
  '.ts',
  '.txt',
  '.xml',
]);

function resolvePath(...parts) {
  return path.join(ROOT, ...parts);
}

function toRel(filePath) {
  return path.relative(ROOT, filePath).replaceAll(path.sep, '/');
}

function readIfExists(...parts) {
  const filePath = resolvePath(...parts);
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
}

function ensureReportsDir() {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

function writeReport(name, body) {
  ensureReportsDir();
  fs.writeFileSync(path.join(REPORTS_DIR, name), body, 'utf8');
}

function walkDir(dir, options = {}) {
  const excludeDirs = new Set(options.excludeDirs ?? []);
  if (!fs.existsSync(dir)) return [];

  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!excludeDirs.has(entry.name)) {
        files.push(...walkDir(fullPath, options));
      }
      continue;
    }
    files.push(fullPath);
  }
  return files;
}

function activeSourceFiles() {
  const files = [];
  for (const dir of ['src', 'public']) {
    files.push(...walkDir(resolvePath(dir), { excludeDirs: ['node_modules', 'dist', '.astro', 'reports'] }));
  }
  for (const file of ['astro.config.mjs', 'package.json']) {
    const fullPath = resolvePath(file);
    if (fs.existsSync(fullPath)) files.push(fullPath);
  }
  return files.filter((file) => textExtensions.has(path.extname(file)));
}

function commonProjectFilesForSecrets() {
  const roots = ['src', 'public', 'scripts'];
  const files = [];
  for (const dir of roots) {
    files.push(...walkDir(resolvePath(dir), { excludeDirs: ['node_modules', 'dist', '.astro', 'reports'] }));
  }
  for (const file of ['astro.config.mjs', 'package.json', 'README.md', 'RELATORIO_INICIAL.md']) {
    const fullPath = resolvePath(file);
    if (fs.existsSync(fullPath)) files.push(fullPath);
  }
  return files.filter((file) => textExtensions.has(path.extname(file)));
}

function normalizeText(value) {
  return String(value)
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

function escapeCell(value) {
  return String(value ?? '')
    .replace(/\r?\n/g, '<br>')
    .replace(/\|/g, '\\|')
    .trim();
}

function makeTable(headers, rows) {
  const head = `| ${headers.map(escapeCell).join(' |')} |`;
  const sep = `| ${headers.map(() => '---').join(' |')} |`;
  const body = rows.map((row) => `| ${row.map(escapeCell).join(' |')} |`).join('\n');
  return [head, sep, body].filter(Boolean).join('\n');
}

function statusIcon(status) {
  if (status === 'FAIL') return 'FAIL';
  if (status === 'WARN') return 'WARN';
  return 'OK';
}

function summarize(results) {
  const checks = results.flatMap((result) => result.checks ?? []);
  return {
    ok: checks.filter((check) => check.status === 'OK').length,
    warn: checks.filter((check) => check.status === 'WARN').length,
    fail: checks.filter((check) => check.status === 'FAIL').length,
  };
}

function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) {
    return { frontmatter: {}, body: text, rawFrontmatter: '', hasFrontmatter: false };
  }
  return {
    frontmatter: parseSimpleYaml(match[1]),
    body: text.slice(match[0].length),
    rawFrontmatter: match[1],
    hasFrontmatter: true,
  };
}

function parseSimpleYaml(raw) {
  const data = {};
  const lines = raw.split(/\r?\n/);

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith('#')) continue;

    const pair = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!pair) continue;

    const key = pair[1];
    let value = pair[2].trim();

    if (!value) {
      const items = [];
      let j = i + 1;
      while (j < lines.length && /^\s*-\s+/.test(lines[j])) {
        items.push(parseYamlValue(lines[j].replace(/^\s*-\s+/, '').trim()));
        j += 1;
      }
      if (items.length > 0) {
        data[key] = items;
        i = j - 1;
      } else {
        data[key] = '';
      }
      continue;
    }

    data[key] = parseYamlValue(value);
  }

  return data;
}

function parseYamlValue(value) {
  if (/^\[.*\]$/.test(value)) {
    const inner = value.slice(1, -1).trim();
    if (!inner) return [];
    return inner
      .split(',')
      .map((item) => parseYamlValue(item.trim()))
      .filter((item) => item !== '');
  }

  if (/^(true|false)$/i.test(value)) return value.toLowerCase() === 'true';
  if (/^null$/i.test(value)) return null;

  const quoted = value.match(/^['"](.*)['"]$/);
  if (quoted) return quoted[1];

  return value;
}

function getPostFiles() {
  return walkDir(POSTS_DIR).filter((file) => file.endsWith('.mdx')).sort();
}

function parsePost(file) {
  const text = fs.readFileSync(file, 'utf8');
  const parsed = parseFrontmatter(text);
  return {
    file,
    text,
    ...parsed,
  };
}

function cleanBodyText(body) {
  return body
    .replace(/^import\s+.+$/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<FAQ[\s\S]*?\/>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/[#*_>`[\](){}.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function wordCount(body) {
  const clean = cleanBodyText(body);
  return clean ? clean.split(/\s+/).filter(Boolean).length : 0;
}

function hasFaq(body) {
  return /<FAQ\b/i.test(body) || /^##\s*(FAQ|Perguntas frequentes|Perguntas comuns|Duvidas|D[uú]vidas)/im.test(body);
}

function isCleanSlug(slug) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function isPresent(value) {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'boolean') return true;
  return value !== undefined && value !== null && String(value).trim() !== '';
}

function getOfficialCategories() {
  const source = readIfExists('src', 'data', 'siteConfig.ts');
  const names = [...source.matchAll(/name:\s*["'`](.*?)["'`]/g)].map((match) => match[1]);
  return [...new Set(names)];
}

function getSchemaInfo() {
  const schemaSource = readIfExists('src', 'content.config.ts') || readIfExists('src', 'content', 'config.ts');
  const fields = {};
  for (const field of ['title', 'description', 'date', 'updated', 'category', 'tags', 'author', 'draft']) {
    const line = schemaSource.split(/\r?\n/).find((item) => item.includes(`${field}:`)) ?? '';
    fields[field] = {
      exists: line.length > 0,
      required: line.length > 0 && !line.includes('.optional()') && !line.includes('.default('),
    };
  }
  return fields;
}

function findMatchesInText(text, patterns) {
  return patterns.filter(({ pattern }) => pattern.test(text)).map(({ label }) => label);
}

function auditContent({ write = true } = {}) {
  const officialCategories = getOfficialCategories();
  const schemaInfo = getSchemaInfo();
  const posts = getPostFiles().map(parsePost);
  const rows = [];
  const checks = [];

  if (!fs.existsSync(POSTS_DIR)) {
    checks.push({ status: 'FAIL', item: 'Pasta de posts', detail: 'src/content/posts nao existe.' });
  } else if (posts.length === 0) {
    checks.push({ status: 'FAIL', item: 'Posts MDX', detail: 'Nenhum post MDX encontrado.' });
  } else {
    checks.push({ status: 'OK', item: 'Posts MDX', detail: `${posts.length} posts encontrados em src/content/posts.` });
  }

  for (const post of posts) {
    const issues = [];
    const warnings = [];
    const fm = post.frontmatter;
    const slug = path.basename(post.file, '.mdx');
    const wc = wordCount(post.body);
    const normalizedText = normalizeText(post.text);

    if (!post.hasFrontmatter) issues.push('frontmatter ausente');
    for (const field of ['title', 'description', 'date', 'category', 'tags', 'author', 'draft']) {
      if (!isPresent(fm[field])) issues.push(`${field} ausente`);
    }

    if (schemaInfo.updated?.required && !isPresent(fm.updated)) {
      issues.push('updated ausente, mas exigido pelo schema');
    }

    if (isPresent(fm.date) && Number.isNaN(Date.parse(fm.date))) {
      issues.push('date invalida');
    }

    if (isPresent(fm.updated) && Number.isNaN(Date.parse(fm.updated))) {
      issues.push('updated invalido');
    }

    if (isPresent(fm.category) && officialCategories.length > 0 && !officialCategories.includes(fm.category)) {
      issues.push(`categoria fora da lista oficial: ${fm.category}`);
    }

    if (!isCleanSlug(slug)) {
      issues.push('slug/ID nao e limpo');
    }

    if (wc < 80) {
      issues.push(`conteudo real insuficiente (${wc} palavras)`);
    }

    if (!/^##\s+\S/m.test(post.body)) {
      issues.push('sem headings H2');
    }

    if (!hasFaq(post.body)) {
      issues.push('sem FAQ ou secao equivalente');
    }

    const dangerous = findMatchesInText(normalizedText, dangerousPatterns);
    if (dangerous.length > 0) {
      issues.push(`promessas/termos perigosos: ${dangerous.join(', ')}`);
    }

    if (isPresent(fm.description)) {
      const descriptionLength = String(fm.description).trim().length;
      if (descriptionLength < 70 || descriptionLength > 170) {
        warnings.push(`description com ${descriptionLength} caracteres`);
      }
    }

    const status = issues.length > 0 ? 'FAIL' : warnings.length > 0 ? 'WARN' : 'OK';
    checks.push({
      status,
      item: toRel(post.file),
      detail: [...issues, ...warnings].join('; ') || 'Post passa nas regras de conteudo.',
    });

    rows.push([
      toRel(post.file),
      statusIcon(status),
      fm.title || '(sem title)',
      fm.category || '(sem category)',
      `${wc}`,
      [...issues, ...warnings].join('; ') || 'OK',
    ]);
  }

  const totals = summarize([{ checks }]);
  const body = [
    '# Auditoria de Conteudo',
    '',
    `Gerado em: ${GENERATED_AT}`,
    '',
    `Resumo: ${totals.ok} OK, ${totals.warn} avisos, ${totals.fail} falhas.`,
    '',
    '## Categorias oficiais',
    '',
    officialCategories.length > 0 ? officialCategories.map((category) => `- ${category}`).join('\n') : '- Nenhuma categoria oficial encontrada em src/data/siteConfig.ts.',
    '',
    '## Schema observado',
    '',
    makeTable(
      ['Campo', 'Existe no schema', 'Obrigatorio no schema'],
      Object.entries(schemaInfo).map(([field, info]) => [field, info.exists ? 'sim' : 'nao', info.required ? 'sim' : 'nao'])
    ),
    '',
    '## Resultado por artigo',
    '',
    makeTable(['Arquivo', 'Estado', 'Title', 'Categoria', 'Palavras', 'Observacoes'], rows),
    '',
    '## Regras aplicadas',
    '',
    [
      '- frontmatter com title, description, date, category, tags, author e draft',
      '- updated apenas obrigatorio quando o schema exigir',
      '- slug em minusculas, sem acentos, espacos ou caracteres especiais',
      '- categoria presente na lista oficial',
      '- conteudo real minimo de 80 palavras',
      '- pelo menos um heading H2',
      '- FAQ via componente <FAQ> ou secao equivalente',
      '- bloqueio de promessas perigosas e termos de manipulacao',
    ].join('\n'),
    '',
  ].join('\n');

  if (write) writeReport(reportFiles.content, body);
  return { name: 'content', checks, report: reportFiles.content };
}

function auditSeo({ write = true } = {}) {
  const checks = [];
  const rows = [];
  const posts = getPostFiles().map(parsePost);
  const astroConfig = readIfExists('astro.config.mjs');
  const packageJson = JSON.parse(readIfExists('package.json') || '{}');
  const robots = readIfExists('public', 'robots.txt');

  for (const post of posts) {
    const fm = post.frontmatter;
    const issues = [];
    const warnings = [];
    if (!isPresent(fm.title)) issues.push('title ausente');
    if (!isPresent(fm.description)) issues.push('description ausente ou vazia');

    if (isPresent(fm.title)) {
      const titleLength = String(fm.title).trim().length;
      if (titleLength < 25 || titleLength > 70) warnings.push(`title com ${titleLength} caracteres`);
    }

    if (isPresent(fm.description)) {
      const descriptionLength = String(fm.description).trim().length;
      if (descriptionLength < 70 || descriptionLength > 170) warnings.push(`description com ${descriptionLength} caracteres`);
    }

    const status = issues.length > 0 ? 'FAIL' : warnings.length > 0 ? 'WARN' : 'OK';
    rows.push([toRel(post.file), statusIcon(status), fm.title || '(sem title)', fm.description || '(sem description)', [...issues, ...warnings].join('; ') || 'OK']);
    checks.push({ status, item: toRel(post.file), detail: [...issues, ...warnings].join('; ') || 'Metadados SEO basicos presentes.' });
  }

  const mainPages = [
    ['Home', 'src/pages/index.astro'],
    ['Sobre', 'src/pages/sobre.astro'],
    ['Contacto', 'src/pages/contacto.astro'],
    ['Categorias', 'src/pages/categorias/index.astro'],
    ['Ferramentas', 'src/pages/ferramentas/index.astro'],
  ];

  for (const [name, relPath] of mainPages) {
    checks.push({
      status: fs.existsSync(resolvePath(relPath)) ? 'OK' : 'FAIL',
      item: `Pagina principal: ${name}`,
      detail: fs.existsSync(resolvePath(relPath)) ? `${relPath} existe.` : `${relPath} nao existe.`,
    });
  }

  checks.push({
    status: robots ? 'OK' : 'FAIL',
    item: 'robots.txt',
    detail: robots ? 'public/robots.txt existe.' : 'public/robots.txt nao existe.',
  });

  checks.push({
    status: robots.includes(`${PREFERRED_SITE}/sitemap-index.xml`) ? 'OK' : 'FAIL',
    item: 'robots sitemap',
    detail: robots.includes(`${PREFERRED_SITE}/sitemap-index.xml`)
      ? `robots.txt aponta para ${PREFERRED_SITE}/sitemap-index.xml.`
      : `robots.txt deve apontar para ${PREFERRED_SITE}/sitemap-index.xml.`,
  });

  const hasSitemapDependency = Boolean(packageJson.dependencies?.['@astrojs/sitemap'] || packageJson.devDependencies?.['@astrojs/sitemap']);
  const hasSitemapIntegration = /sitemap\s*\(/.test(astroConfig);
  checks.push({
    status: hasSitemapDependency && hasSitemapIntegration ? 'OK' : 'FAIL',
    item: 'sitemap Astro',
    detail: hasSitemapDependency && hasSitemapIntegration ? '@astrojs/sitemap esta instalado e configurado.' : 'Sitemap nao esta totalmente configurado.',
  });

  checks.push({
    status: astroConfig.includes(`site: '${PREFERRED_SITE}'`) || astroConfig.includes(`site: "${PREFERRED_SITE}"`) ? 'OK' : 'FAIL',
    item: 'site em astro.config.mjs',
    detail: astroConfig.includes(PREFERRED_SITE) ? `site configurado para ${PREFERRED_SITE}.` : `site deve ser ${PREFERRED_SITE}.`,
  });

  const oldApiMatches = scanFiles(activeSourceFiles(), [
    { label: 'Astro.glob', pattern: /Astro\.glob/i },
    { label: 'post.render()', pattern: /post\.render\s*\(/i },
  ]);
  checks.push({
    status: oldApiMatches.length === 0 ? 'OK' : 'FAIL',
    item: 'APIs antigas Astro',
    detail: oldApiMatches.length === 0
      ? 'Nenhum Astro.glob ou post.render() em codigo ativo.'
      : oldApiMatches.map((match) => `${match.label} em ${match.file}`).join('; '),
  });

  const totals = summarize([{ checks }]);
  const body = [
    '# Auditoria SEO',
    '',
    `Gerado em: ${GENERATED_AT}`,
    '',
    `Resumo: ${totals.ok} OK, ${totals.warn} avisos, ${totals.fail} falhas.`,
    '',
    '## Posts',
    '',
    makeTable(['Arquivo', 'Estado', 'Title', 'Description', 'Observacoes'], rows),
    '',
    '## Checklist SEO Tecnico',
    '',
    makeTable(['Estado', 'Item', 'Detalhe'], checks.filter((check) => !check.item.startsWith('src/content/posts/')).map((check) => [statusIcon(check.status), check.item, check.detail])),
    '',
    'Observacao: a verificacao de Astro.glob e post.render() considera apenas codigo ativo em src/, public/, astro.config.mjs e package.json. Logs historicos e relatorios antigos nao sao tratados como codigo ativo.',
    '',
  ].join('\n');

  if (write) writeReport(reportFiles.seo, body);
  return { name: 'seo', checks, report: reportFiles.seo };
}

function scanFiles(files, patterns) {
  const matches = [];
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    for (const { label, pattern } of patterns) {
      if (pattern.test(text)) {
        matches.push({ file: toRel(file), label });
      }
    }
  }
  return matches;
}

function auditSecurity() {
  const checks = [];
  const activeFiles = activeSourceFiles();
  const adMatches = scanFiles(activeFiles, adManipulationPatterns);

  checks.push({
    status: adMatches.length === 0 ? 'OK' : 'FAIL',
    item: 'Scripts e manipulacao de anuncios',
    detail: adMatches.length === 0
      ? 'Nenhum script AdSense, incentivo a clique ou padrao de manipulacao encontrado em codigo ativo.'
      : adMatches.map((match) => `${match.label} em ${match.file}`).join('; '),
  });

  const adSlotPath = resolvePath('src', 'components', 'AdSlot.astro');
  const adSlot = fs.existsSync(adSlotPath) ? fs.readFileSync(adSlotPath, 'utf8') : '';
  const adSlotSafe = adSlot && !/<script\b/i.test(adSlot) && !/adsbygoogle|googlesyndication|ca-pub-/i.test(adSlot);
  checks.push({
    status: adSlotSafe ? 'OK' : 'FAIL',
    item: 'AdSlot placeholder',
    detail: adSlotSafe
      ? 'AdSlot.astro existe e nao contem script real de anuncios.'
      : 'AdSlot.astro esta ausente ou contem sinais de anuncio real.',
  });

  return { name: 'security', checks };
}

function auditDeploy({ write = true } = {}) {
  const checks = [];
  const packageJson = JSON.parse(readIfExists('package.json') || '{}');
  const scripts = packageJson.scripts ?? {};
  const requiredScripts = ['dev', 'build', 'audit', 'audit:content', 'audit:seo', 'audit:deploy', 'new:post'];

  for (const script of requiredScripts) {
    checks.push({
      status: scripts[script] ? 'OK' : 'FAIL',
      item: `script npm: ${script}`,
      detail: scripts[script] ? scripts[script] : 'Ausente em package.json.',
    });
  }

  const buildCommand = process.platform === 'win32'
    ? ['cmd.exe', ['/d', '/s', '/c', 'npm run build']]
    : ['npm', ['run', 'build']];
  const build = spawnSync(buildCommand[0], buildCommand[1], {
    cwd: ROOT,
    encoding: 'utf8',
    timeout: 180000,
  });
  const buildOutput = `${build.stdout ?? ''}${build.stderr ?? ''}`.trim();
  checks.push({
    status: build.status === 0 ? 'OK' : 'FAIL',
    item: 'npm run build',
    detail: build.status === 0 ? 'Build passou.' : `Build falhou com codigo ${build.status ?? 'desconhecido'}${build.error ? ` (${build.error.message})` : ''}.`,
  });

  const distPath = resolvePath('dist');
  checks.push({
    status: fs.existsSync(distPath) ? 'OK' : 'FAIL',
    item: 'dist/',
    detail: fs.existsSync(distPath) ? 'Pasta dist gerada.' : 'Pasta dist nao encontrada.',
  });

  for (const file of ['dist/index.html', 'dist/robots.txt']) {
    checks.push({
      status: fs.existsSync(resolvePath(file)) ? 'OK' : 'FAIL',
      item: file,
      detail: fs.existsSync(resolvePath(file)) ? 'Existe no build.' : 'Nao existe no build.',
    });
  }

  const sitemapBuilt = fs.existsSync(resolvePath('dist', 'sitemap-index.xml')) || fs.existsSync(resolvePath('dist', 'sitemap-0.xml'));
  checks.push({
    status: sitemapBuilt ? 'OK' : 'FAIL',
    item: 'sitemap em dist',
    detail: sitemapBuilt ? 'Sitemap gerado em dist/.' : 'Sitemap nao foi encontrado em dist/. ',
  });

  const readme = readIfExists('README.md');
  checks.push({
    status: /Cloudflare Pages/i.test(readme) && /npm run audit/i.test(readme) && /new:post/i.test(readme) ? 'OK' : 'FAIL',
    item: 'README deploy/auditoria',
    detail: /Cloudflare Pages/i.test(readme) && /npm run audit/i.test(readme) && /new:post/i.test(readme)
      ? 'README inclui auditoria, novo artigo e deploy gratuito.'
      : 'README precisa documentar auditoria, novo artigo e deploy gratuito.',
  });

  checks.push({
    status: fs.existsSync(resolvePath('RELATORIO_INICIAL.md')) ? 'OK' : 'FAIL',
    item: 'RELATORIO_INICIAL.md',
    detail: fs.existsSync(resolvePath('RELATORIO_INICIAL.md')) ? 'Arquivo existe.' : 'Arquivo ausente.',
  });

  const envFiles = walkDir(ROOT, { excludeDirs: ['node_modules', 'dist', '.astro', 'reports', '.git'] })
    .filter((file) => /^\.env(\..*)?$/.test(path.basename(file)));
  checks.push({
    status: envFiles.length === 0 ? 'OK' : 'FAIL',
    item: '.env no projeto',
    detail: envFiles.length === 0 ? 'Nenhum arquivo .env encontrado fora de pastas ignoradas.' : envFiles.map(toRel).join(', '),
  });

  const trackedEnv = getTrackedEnvFiles();
  checks.push({
    status: trackedEnv.length === 0 ? 'OK' : 'FAIL',
    item: '.env versionado',
    detail: trackedEnv.length === 0 ? 'Nenhum .env versionado detectado ou projeto sem .git.' : trackedEnv.join(', '),
  });

  const secretMatches = scanForSecrets(commonProjectFilesForSecrets());
  checks.push({
    status: secretMatches.length === 0 ? 'OK' : 'FAIL',
    item: 'segredos obvios',
    detail: secretMatches.length === 0 ? 'Nenhum segredo obvio encontrado em arquivos comuns.' : secretMatches.join('; '),
  });

  const totals = summarize([{ checks }]);
  const buildExcerpt = buildOutput
    ? buildOutput.split(/\r?\n/).slice(-30).join('\n')
    : '(sem saida de build)';

  const body = [
    '# Deploy Readiness',
    '',
    `Gerado em: ${GENERATED_AT}`,
    '',
    `Resumo: ${totals.ok} OK, ${totals.warn} avisos, ${totals.fail} falhas.`,
    '',
    '## Checklist',
    '',
    makeTable(['Estado', 'Item', 'Detalhe'], checks.map((check) => [statusIcon(check.status), check.item, check.detail])),
    '',
    '## Saida resumida do build',
    '',
    '```text',
    buildExcerpt,
    '```',
    '',
  ].join('\n');

  if (write) writeReport(reportFiles.deploy, body);
  return { name: 'deploy', checks, report: reportFiles.deploy, buildOutput };
}

function getTrackedEnvFiles() {
  if (!fs.existsSync(resolvePath('.git'))) return [];
  const git = spawnSync('git', ['ls-files', '.env*'], {
    cwd: ROOT,
    encoding: 'utf8',
    timeout: 30000,
  });
  if (git.status !== 0) return [];
  return git.stdout.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function scanForSecrets(files) {
  const matches = [];
  const patterns = [
    /sk-[A-Za-z0-9_-]{20,}/,
    /AKIA[0-9A-Z]{16}/,
    /(api[_-]?key|secret|token|password|private[_-]?key|client[_-]?secret)\s*[:=]\s*["']?[^"'\s]{16,}/i,
  ];

  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    const lines = text.split(/\r?\n/);
    lines.forEach((line, index) => {
      if (patterns.some((pattern) => pattern.test(line))) {
        matches.push(`${toRel(file)}:${index + 1}`);
      }
    });
  }
  return matches;
}

function writeSiteAudit(contentResult, seoResult, deployResult, securityResult) {
  const allResults = [contentResult, seoResult, deployResult, securityResult];
  const totals = summarize(allResults);
  const body = [
    '# Site Audit',
    '',
    `Gerado em: ${GENERATED_AT}`,
    '',
    `Resumo geral: ${totals.ok} OK, ${totals.warn} avisos, ${totals.fail} falhas.`,
    '',
    '## Relatorios gerados',
    '',
    makeTable(
      ['Relatorio', 'Arquivo'],
      [
        ['Conteudo', `reports/${reportFiles.content}`],
        ['SEO', `reports/${reportFiles.seo}`],
        ['Deploy readiness', `reports/${reportFiles.deploy}`],
        ['Site e seguranca/AdSense', `reports/${reportFiles.site}`],
      ]
    ),
    '',
    '## Seguranca e AdSense',
    '',
    makeTable(['Estado', 'Item', 'Detalhe'], securityResult.checks.map((check) => [statusIcon(check.status), check.item, check.detail])),
    '',
    '## Resumo por area',
    '',
    makeTable(
      ['Area', 'OK', 'Avisos', 'Falhas'],
      allResults.map((result) => {
        const summary = summarize([result]);
        return [result.name, summary.ok, summary.warn, summary.fail];
      })
    ),
    '',
    '## Escopo',
    '',
    [
      '- Auditoria local, sem deploy e sem publicacao.',
      '- Nenhum backend, login, banco de dados, anuncio real ou AdSense foi configurado.',
      '- Verificacoes de APIs antigas consideram codigo ativo; logs historicos podem citar problemas ja corrigidos.',
    ].join('\n'),
    '',
  ].join('\n');

  writeReport(reportFiles.site, body);
  return { name: 'site', checks: allResults.flatMap((result) => result.checks), report: reportFiles.site };
}

function printSummary(results) {
  for (const result of results) {
    const summary = summarize([result]);
    if (result.report) {
      console.log(`${result.name}: ${summary.ok} OK, ${summary.warn} WARN, ${summary.fail} FAIL -> reports/${result.report}`);
    } else {
      console.log(`${result.name}: ${summary.ok} OK, ${summary.warn} WARN, ${summary.fail} FAIL`);
    }
  }
}

function hasFailures(results) {
  return results.some((result) => result.checks?.some((check) => check.status === 'FAIL'));
}

function run(mode) {
  ensureReportsDir();

  if (mode === 'content') {
    const result = auditContent();
    printSummary([result]);
    return hasFailures([result]) ? 1 : 0;
  }

  if (mode === 'seo') {
    const result = auditSeo();
    printSummary([result]);
    return hasFailures([result]) ? 1 : 0;
  }

  if (mode === 'deploy') {
    const result = auditDeploy();
    printSummary([result]);
    return hasFailures([result]) ? 1 : 0;
  }

  if (mode === 'all' || mode === 'site') {
    const content = auditContent();
    const seo = auditSeo();
    const deploy = auditDeploy();
    const security = auditSecurity();
    const site = writeSiteAudit(content, seo, deploy, security);
    const results = [content, seo, deploy, security, site];
    printSummary(results);
    return hasFailures(results) ? 1 : 0;
  }

  console.error(`Modo desconhecido: ${mode}`);
  console.error('Use: all, content, seo, deploy ou site.');
  return 1;
}

const mode = process.argv[2] ?? 'all';
process.exitCode = run(mode);
