import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, 'reports', 'operator');
const POSTS_DIR = path.join(ROOT, 'src', 'content', 'posts');
const PREFERRED_SITE = 'https://dinheiro-na-net.icnuvunga.workers.dev';
const DATE = new Date().toISOString();

const officialCategories = [
  'Comecar do Zero',
  'IA e Produtividade',
  'Afiliados e Ferramentas',
  'Pagamentos Online',
  'Ferramentas Gratuitas',
];

const officialCategoryLabels = [
  'Começar do Zero',
  'IA e Produtividade',
  'Afiliados e Ferramentas',
  'Pagamentos Online',
  'Ferramentas Gratuitas',
];

const dangerousTerms = [
  ['clique no anuncio', /clique\s+(aqui\s+)?(no|na|em|num|neste|nesse|naquele)\s+an[uú]ncio/i],
  ['clicar no anuncio', /clicar\s+(no|na|em|num|neste|nesse|naquele)\s+an[uú]ncio/i],
  ['ganhos garantidos', /ganhos?\s+garantid[oa]s?/i],
  ['dinheiro facil garantido', /dinheiro\s+f[aá]cil\s+garantido/i],
  ['trafego falso', /tr[aá]fego\s+falso/i],
  ['bot de clique', /bot\s+de\s+clique/i],
  ['bots de clique', /bots\s+de\s+clique/i],
  ['cliques artificiais', /cliques?\s+artificiais/i],
  ['manipular AdSense', /manipular\s+adsense/i],
  ['bypass', /\bbypass\b/i],
  ['esquema garantido', /esquema\s+garantido/i],
];

const encodingPatterns = [
  ['mojibake A-tilde', /\u00c3[\u0080-\u00bf]/],
  ['mojibake a-circumflex', /\u00e2(?:\u20ac|\u0153|\u201e|\u201d|\u201c|\u2122|\u2020)/],
  ['texto NAO corrompido', /N\u00c3\u0192O/],
  ['texto corrompido comum', /Come\u00c3\u00a7ar|Intelig\u00c3\u00aancia|An\u00c3\u00a1lise|neg\u00c3\u00b3cio|estrat\u00c3\u00a9gia|Mo\u00c3\u00a7ambique|conte\u00c3\u00bado|pol\u00c3\u00adtica/],
];

const encodingReplacements = [
  ['N\u00c3\u0192O', 'NÃO'],
  ['n\u00c3\u0192o', 'não'],
  ['\u00c3\u2021', 'Ç'],
  ['\u00c3\u20ac', 'À'],
  ['\u00c3\u0081', 'Á'],
  ['\u00c3\u201a', 'Â'],
  ['\u00c3\u0192', '\u00c3'],
  ['\u00c3\u2030', 'É'],
  ['\u00c3\u0160', 'Ê'],
  ['\u00c3\u008d', 'Í'],
  ['\u00c3\u201c', 'Ó'],
  ['\u00c3\u2022', 'Õ'],
  ['\u00c3\u0161', 'Ú'],
  ['\u00c3\u00a1', 'á'],
  ['\u00c3\u00a2', '\u00e2'],
  ['\u00c3\u00a3', 'ã'],
  ['\u00c3\u00a7', 'ç'],
  ['\u00c3\u00a9', 'é'],
  ['\u00c3\u00aa', 'ê'],
  ['\u00c3\u00ad', 'í'],
  ['\u00c3\u00b3', 'ó'],
  ['\u00c3\u00b4', 'ô'],
  ['\u00c3\u00b5', 'õ'],
  ['\u00c3\u00ba', 'ú'],
  ['\u00c3\u00bc', 'ü'],
  ['\u00e2\u20ac\u2122', "'"],
  ['\u00e2\u20ac\u0153', '"'],
  ['\u00e2\u20ac\u009d', '"'],
  ['\u00e2\u20ac\u02dc', "'"],
  ['\u00e2\u20ac\u201c', '-'],
  ['\u00e2\u20ac\u201d', '-'],
  ['\u00e2\u2020\u2019', '->'],
  ['\u00e2\u0153\u201c', 'OK'],
  ['\u00e2\u0153\u2026', 'OK'],
  ['\u00e2\u0161 \u00ef\u00b8\u008f', 'Aviso:'],
  ['\u00e2\u201a\u00ac', '€'],
  ['\u00c2\u00ba', 'º'],
  ['\u00c2\u00aa', 'ª'],
  ['\u00c2\u00b7', '·'],
];

const exaggeratedTerms = [
  ['ganhar rapidamente', /\bganhar rapidamente\b/i],
  ['muito superior', /\bmuito superior\b/i],
  ['garantido', /\bgarantid[oa]s?\b/i],
  ['formula', /\bf[oó]rmula\b/i],
  ['segredo', /\bsegredo\b/i],
  ['automatico', /\bautom[aá]tico\b/i],
  ['sem esforco', /\bsem esfor[cç]o\b/i],
];

const oldPagesDomainPattern = new RegExp(String.raw`(?:dinheironanet|dinheiro-na-net)\.${'pages'}\.${'dev'}`, 'i');

const copyRiskPatterns = [
  ['encoding quebrado', /Come\u00c3\u00a7ar|Intelig\u00c3\u00aancia|An\u00c3\u00a1lise|neg\u00c3\u00b3cio|estrat\u00c3\u00a9gia|Mo\u00c3\u00a7ambique|conte\u00c3\u00bado|pol\u00c3\u00adtica|quest\u00c3\u00b5es|sugest\u00c3\u00b5es|d\u00c3\u00bavidas|\u00c3[\u0080-\u00bf]|\u00e2\u0153|\u00e2\u20ac\u201d|\u00e2\u20ac\u201c/],
  ['clique no anuncio', /clique\s+(?:aqui\s+)?(?:no|em|num|neste)\s+an[uú]ncio/i],
  ['ganho garantido', /ganh[oa]s?\s+garantid[oa]s?/i],
  ['url antiga do dominio temporario', oldPagesDomainPattern],
  ['monetizacao ativa indevida', /recorremos\s+ao\s+modelo\s+de\s+afilia[cç][aã]o|temos\s+links\s+afiliados\s+ativos/i],
  ['dominio antigo', oldPagesDomainPattern],
];

const adsensePatterns = [
  ['pagead2.googlesyndication.com', /pagead2\.googlesyndication\.com/i],
  ['adsbygoogle', /adsbygoogle/i],
  ['googlesyndication', /googlesyndication/i],
  ['doubleclick.net', /doubleclick\.net/i],
  ['ca-pub', /ca-pub-\d+/i],
  ...dangerousTerms,
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

function rel(filePath) {
  return path.relative(ROOT, filePath).replaceAll(path.sep, '/');
}

function p(...parts) {
  return path.join(ROOT, ...parts);
}

function exists(...parts) {
  return fs.existsSync(p(...parts));
}

function read(...parts) {
  const filePath = p(...parts);
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
}

function ensureReports() {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
}

function writeReport(name, body) {
  ensureReports();
  fs.writeFileSync(path.join(REPORT_DIR, name), body, 'utf8');
}

function walk(dir, skip = new Set()) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!skip.has(entry.name)) out.push(...walk(full, skip));
    } else {
      out.push(full);
    }
  }
  return out;
}

function sourceFiles() {
  const files = [];
  for (const dir of ['src', 'public']) {
    files.push(...walk(p(dir), new Set(['node_modules', 'dist', '.astro', 'reports'])));
  }
  for (const file of ['astro.config.mjs', 'package.json', 'README.md']) {
    if (exists(file)) files.push(p(file));
  }
  return files.filter((file) => textExtensions.has(path.extname(file)));
}

function operatorTextFiles() {
  const files = [];
  for (const dir of ['src', 'scripts']) {
    files.push(...walk(p(dir), new Set(['node_modules', 'dist', '.astro', '.git'])));
  }
  if (exists('reports', 'operator')) {
    files.push(
      ...fs.readdirSync(p('reports', 'operator'), { withFileTypes: true })
        .filter((entry) => entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'fix-encoding.md')
        .map((entry) => p('reports', 'operator', entry.name))
    );
  }
  for (const file of ['README.md', 'RELATORIO_INICIAL.md']) {
    if (exists(file)) files.push(p(file));
  }
  return [...new Set(files)].filter((file) => textExtensions.has(path.extname(file)));
}

function visibleCopyFiles() {
  const files = [];
  for (const dir of ['src']) {
    files.push(...walk(p(dir), new Set(['node_modules', 'dist', '.astro', '.git'])));
  }
  return files.filter((file) => ['.astro', '.mdx', '.md', '.ts'].includes(path.extname(file)));
}

function applyEncodingFixes(text) {
  let next = text;
  for (const [from, to] of encodingReplacements) {
    next = next.split(from).join(to);
  }
  next = next
    .replace(new RegExp(String.raw`dinheironanet\.${'pages'}\.${'dev'}`, 'g'), 'dinheiro-na-net.icnuvunga.workers.dev')
    .replace(new RegExp(String.raw`dinheiro-na-net\.${'pages'}\.${'dev'}`, 'g'), 'dinheiro-na-net.icnuvunga.workers.dev');
  return next;
}

function findLineNumbers(text, pattern) {
  const lines = text.split(/\r?\n/);
  const hits = [];
  for (let index = 0; index < lines.length; index += 1) {
    if (pattern.test(lines[index])) hits.push(index + 1);
    pattern.lastIndex = 0;
  }
  return hits;
}

function extractInternalLinks(text) {
  const links = new Set();
  for (const match of text.matchAll(/\[[^\]]+\]\((\/[^)\s#]+)(?:#[^)]+)?\)/g)) links.add(match[1].replace(/\/$/, '') || '/');
  for (const match of text.matchAll(/href=["'](\/[^"'#]+)(?:#[^"']*)?["']/g)) links.add(match[1].replace(/\/$/, '') || '/');
  return [...links];
}

function knownInternalRoutes() {
  const routes = new Set([
    '/',
    '/sobre',
    '/contacto',
    '/categorias',
    '/ferramentas',
    '/termos-de-uso',
    '/politica-de-privacidade',
    '/politica-de-cookies',
    '/aviso-de-afiliados',
    '/favicon.svg',
    '/favicon.ico',
    '/robots.txt',
    '/google4b64c5c3975c1fc5.html',
  ]);
  routes.add('/ferramentas/calculadora-ganhos-blog');
  routes.add('/categorias');
  for (const category of categoriesFromConfig()) routes.add(`/categorias/${category.slug}`);
  for (const file of postFiles()) routes.add(`/posts/${path.basename(file, '.mdx')}`);
  return routes;
}

function categoriesFromConfig() {
  const source = read('src', 'data', 'siteConfig.ts');
  return [...source.matchAll(/name:\s*["'`](.*?)["'`],\s*slug:\s*["'`](.*?)["'`]/g)]
    .map((match) => ({ name: match[1], slug: match[2] }));
}

function runNpmScript(scriptName) {
  const command = process.platform === 'win32'
    ? ['cmd.exe', ['/d', '/s', '/c', `npm run ${scriptName}`]]
    : ['npm', ['run', scriptName]];
  const result = spawnSync(command[0], command[1], {
    cwd: ROOT,
    encoding: 'utf8',
    timeout: 240000,
  });
  return {
    scriptName,
    ok: result.status === 0,
    status: result.status,
    output: stripAnsi(`${result.stdout ?? ''}${result.stderr ?? ''}`).trim(),
  };
}

function gitStatusShort() {
  const result = spawnSync('git', ['status', '--short'], { cwd: ROOT, encoding: 'utf8', timeout: 30000 });
  return result.status === 0 ? result.stdout.trim() : `(git status falhou: ${result.stderr || result.status})`;
}

function markdownTable(headers, rows) {
  const clean = (value) => String(value ?? '').replace(/\r?\n/g, '<br>').replace(/\|/g, '\\|');
  return [
    `| ${headers.map(clean).join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${row.map(clean).join(' | ')} |`),
  ].join('\n');
}

function stripAnsi(text) {
  return String(text ?? '').replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '');
}

function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { data: {}, body: text, hasFrontmatter: false };
  return {
    data: parseYaml(match[1]),
    body: text.slice(match[0].length),
    hasFrontmatter: true,
  };
}

function parseYaml(raw) {
  const data = {};
  const lines = raw.split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    const match = lines[i].match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    const key = match[1];
    const rawValue = match[2].trim();

    if (!rawValue) {
      const items = [];
      let j = i + 1;
      while (j < lines.length && /^\s*-\s+/.test(lines[j])) {
        items.push(parseValue(lines[j].replace(/^\s*-\s+/, '').trim()));
        j += 1;
      }
      data[key] = items.length > 0 ? items : '';
      i = Math.max(i, j - 1);
      continue;
    }

    data[key] = parseValue(rawValue);
  }
  return data;
}

function parseValue(value) {
  if (/^\[.*\]$/.test(value)) {
    const inner = value.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(',').map((item) => parseValue(item.trim()));
  }
  if (/^(true|false)$/i.test(value)) return value.toLowerCase() === 'true';
  const quoted = value.match(/^['"](.*)['"]$/);
  return quoted ? quoted[1] : value;
}

function postFiles() {
  return walk(POSTS_DIR).filter((file) => file.endsWith('.mdx')).sort();
}

function posts() {
  return postFiles().map((file) => {
    const text = fs.readFileSync(file, 'utf8');
    const parsed = parseFrontmatter(text);
    return { file, text, ...parsed };
  });
}

function normalize(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

function present(value) {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'boolean') return true;
  return value !== undefined && value !== null && String(value).trim() !== '';
}

function cleanSlug(value) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function wordCount(body) {
  const clean = body
    .replace(/^import\s+.+$/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<FAQ[\s\S]*?\/>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/[#*_>`[\](){}.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return clean ? clean.split(/\s+/).length : 0;
}

function hasFaq(body) {
  return /<FAQ\b/i.test(body) || /^##\s*(FAQ|Perguntas frequentes|Perguntas comuns|Duvidas|D[uú]vidas)/im.test(body);
}

function hasConclusion(body) {
  return /^##\s*(Conclus[aã]o|Resumo final|Proximo passo|Pr[oó]ximo passo)/im.test(body);
}

function findPatterns(text, patterns) {
  return patterns.filter(([, pattern]) => pattern.test(text)).map(([name]) => name);
}

function scan(files, patterns) {
  const hits = [];
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    for (const [name, pattern] of patterns) {
      if (pattern.test(text)) hits.push(`${rel(file)}: ${name}`);
    }
  }
  return hits;
}

function countAstroPages() {
  return walk(p('src', 'pages')).filter((file) => file.endsWith('.astro')).length;
}

function countComponents() {
  return walk(p('src', 'components')).filter((file) => file.endsWith('.astro')).length;
}

function mainPages() {
  return [
    ['index', 'src/pages/index.astro'],
    ['sobre', 'src/pages/sobre.astro'],
    ['contacto', 'src/pages/contacto.astro'],
    ['categorias', 'src/pages/categorias/index.astro'],
    ['ferramentas', 'src/pages/ferramentas/index.astro'],
    ['politica de privacidade', 'src/pages/politica-de-privacidade.astro'],
    ['termos', 'src/pages/termos-de-uso.astro'],
    ['aviso de afiliados', 'src/pages/aviso-de-afiliados.astro'],
    ['politica de cookies', 'src/pages/politica-de-cookies.astro'],
  ];
}

function summarize(checks) {
  return {
    ok: checks.filter((check) => check.level === 'OK').length,
    warn: checks.filter((check) => check.level === 'WARN').length,
    error: checks.filter((check) => check.level === 'ERROR').length,
  };
}

function levelFrom(postResult) {
  if (postResult.errors.length > 0) return 'ERROR';
  if (postResult.warnings.length > 0) return 'WARN';
  return 'OK';
}

function runBuild() {
  const command = process.platform === 'win32'
    ? ['cmd.exe', ['/d', '/s', '/c', 'npm run build']]
    : ['npm', ['run', 'build']];

  const result = spawnSync(command[0], command[1], {
    cwd: ROOT,
    encoding: 'utf8',
    timeout: 180000,
  });

  return {
    ok: result.status === 0,
    status: result.status,
    error: result.error?.message ?? '',
    output: stripAnsi(`${result.stdout ?? ''}${result.stderr ?? ''}`).trim(),
  };
}

function statusCommand() {
  const activeFiles = sourceFiles();
  const astroGlobHits = scan(activeFiles, [['Astro.glob', /Astro\.glob/i]]);
  const adsenseHits = scan(activeFiles, adsensePatterns.slice(0, 5));
  const legalMissing = mainPages().slice(5).filter(([, file]) => !exists(file));

  const lines = [
    '=== DINHEIRO NA NET - STATUS ===',
    `Projeto: ${exists('package.json') && exists('astro.config.mjs') ? 'OK' : 'FALTA'} (${ROOT})`,
    `package.json: ${exists('package.json') ? 'OK' : 'FALTA'}`,
    `Astro config: ${exists('astro.config.mjs') ? 'OK' : 'FALTA'}`,
    `Posts MDX: ${postFiles().length}`,
    `Paginas Astro: ${countAstroPages()}`,
    `Componentes: ${countComponents()}`,
    `README.md: ${exists('README.md') ? 'OK' : 'FALTA'}`,
    `RELATORIO_INICIAL.md: ${exists('RELATORIO_INICIAL.md') ? 'OK' : 'FALTA'}`,
    `robots.txt: ${exists('public', 'robots.txt') ? 'OK' : 'FALTA'}`,
    `content.config.ts: ${exists('src', 'content.config.ts') ? 'OK' : 'FALTA'}`,
    `Build anterior/dist: ${exists('dist') ? 'OK' : 'FALTA'}`,
    `Astro.glob: ${astroGlobHits.length === 0 ? 'OK nao encontrado em codigo ativo' : `ALERTA ${astroGlobHits.join('; ')}`}`,
    `AdSense real: ${adsenseHits.length === 0 ? 'OK nao encontrado' : `ALERTA ${adsenseHits.join('; ')}`}`,
    `Paginas legais: ${legalMissing.length === 0 ? 'OK' : `FALTAM ${legalMissing.map(([name]) => name).join(', ')}`}`,
    'Proximo passo sugerido: npm run operator:audit',
  ];

  console.log(lines.join('\n'));
}

function contentAudit({ write = true } = {}) {
  const allPosts = posts();
  const projectUsesUpdated = allPosts.some((post) => present(post.data.updated));
  const rows = [];
  const checks = [];

  for (const post of allPosts) {
    const slug = path.basename(post.file, '.mdx');
    const data = post.data;
    const errors = [];
    const warnings = [];
    const text = normalize(post.text);

    if (!post.hasFrontmatter) errors.push('frontmatter ausente');
    for (const field of ['title', 'description', 'date', 'category', 'tags', 'author', 'draft']) {
      if (!present(data[field])) errors.push(`${field} ausente`);
    }
    if (projectUsesUpdated && !present(data.updated)) warnings.push('updated ausente em projeto que ja usa updated');
    if (present(data.category) && !officialCategoryLabels.includes(data.category)) errors.push(`categoria invalida: ${data.category}`);
    if (!cleanSlug(slug)) errors.push('slug nao limpo');
    if (wordCount(post.body) < 80) warnings.push('conteudo real curto');
    if (!/^##\s+\S/m.test(post.body)) warnings.push('sem H2');
    if (!hasFaq(post.body)) warnings.push('sem FAQ ou perguntas frequentes');
    if (!hasConclusion(post.body)) warnings.push('sem conclusao explicita');

    const dangerous = findPatterns(text, dangerousTerms);
    if (dangerous.length > 0) errors.push(`termos perigosos: ${dangerous.join(', ')}`);

    const level = errors.length > 0 ? 'ERROR' : warnings.length > 0 ? 'WARN' : 'OK';
    checks.push({ level, item: rel(post.file), detail: [...errors, ...warnings].join('; ') || 'OK' });
    rows.push([rel(post.file), level, data.title || '', data.category || '', wordCount(post.body), errors.join('; ') || '-', warnings.join('; ') || '-']);
  }

  if (allPosts.length === 0) checks.push({ level: 'ERROR', item: 'posts', detail: 'Nenhum post MDX encontrado.' });

  const summary = summarize(checks);
  const body = [
    '# Operator Content Audit',
    '',
    `Gerado em: ${DATE}`,
    '',
    `Posts: ${allPosts.length}`,
    `OK: ${summary.ok}`,
    `Avisos: ${summary.warn}`,
    `Erros: ${summary.error}`,
    '',
    '## Categorias oficiais',
    '',
    officialCategoryLabels.map((item) => `- ${item}`).join('\n'),
    '',
    '## Resultado por post',
    '',
    markdownTable(['Arquivo', 'Estado', 'Title', 'Categoria', 'Palavras', 'Erros', 'Avisos'], rows),
    '',
  ].join('\n');

  if (write) writeReport('content-audit.md', body);
  return { name: 'content', checks, summary, report: 'reports/operator/content-audit.md' };
}

function seoAudit({ write = true } = {}) {
  const checks = [];
  const rows = [];
  const astroConfig = read('astro.config.mjs');
  const packageJson = JSON.parse(read('package.json') || '{}');
  const baseLayout = read('src', 'layouts', 'BaseLayout.astro');
  const robots = read('public', 'robots.txt');

  checks.push({
    level: astroConfig.includes(PREFERRED_SITE) || /site:\s*['"`]https?:\/\//.test(astroConfig) ? 'OK' : 'ERROR',
    item: 'astro.config.mjs site',
    detail: astroConfig.includes(PREFERRED_SITE) ? PREFERRED_SITE : 'site ausente ou invalido',
  });
  checks.push({
    level: /sitemap\s*\(/.test(astroConfig) && Boolean(packageJson.dependencies?.['@astrojs/sitemap']) ? 'OK' : 'ERROR',
    item: 'sitemap integration',
    detail: /sitemap\s*\(/.test(astroConfig) ? 'Configurado' : 'Nao encontrado',
  });
  checks.push({ level: robots ? 'OK' : 'ERROR', item: 'robots.txt', detail: robots ? 'Existe' : 'Ausente' });

  const baseChecks = [
    ['title', /<title\b/i],
    ['description', /name=["']description["']/i],
    ['lang', /<html[^>]+lang=/i],
    ['viewport', /name=["']viewport["']/i],
  ];
  for (const [name, pattern] of baseChecks) {
    checks.push({
      level: pattern.test(baseLayout) ? 'OK' : 'ERROR',
      item: `BaseLayout ${name}`,
      detail: pattern.test(baseLayout) ? 'OK' : 'Nao encontrado',
    });
  }

  for (const [name, file] of mainPages()) {
    checks.push({ level: exists(file) ? 'OK' : 'ERROR', item: `pagina ${name}`, detail: file });
  }

  for (const post of posts()) {
    const slug = path.basename(post.file, '.mdx');
    const errors = [];
    const warnings = [];
    if (!present(post.data.title)) errors.push('title vazio');
    if (!present(post.data.description)) errors.push('description vazia');
    if (!cleanSlug(slug)) errors.push('slug nao limpo');
    if (present(post.data.description)) {
      const len = String(post.data.description).length;
      if (len < 70 || len > 170) warnings.push(`description com ${len} caracteres`);
    }
    const level = errors.length > 0 ? 'ERROR' : warnings.length > 0 ? 'WARN' : 'OK';
    rows.push([rel(post.file), level, post.data.title || '', post.data.description || '', [...errors, ...warnings].join('; ') || 'OK']);
    checks.push({ level, item: rel(post.file), detail: [...errors, ...warnings].join('; ') || 'OK' });
  }

  const summary = summarize(checks);
  const body = [
    '# Operator SEO Audit',
    '',
    `Gerado em: ${DATE}`,
    '',
    `OK: ${summary.ok}`,
    `Avisos: ${summary.warn}`,
    `Erros: ${summary.error}`,
    '',
    '## Checklist tecnico',
    '',
    markdownTable(['Estado', 'Item', 'Detalhe'], checks.filter((check) => !check.item.startsWith('src/content/posts/')).map((check) => [check.level, check.item, check.detail])),
    '',
    '## Posts',
    '',
    markdownTable(['Arquivo', 'Estado', 'Title', 'Description', 'Observacoes'], rows),
    '',
  ].join('\n');

  if (write) writeReport('seo-audit.md', body);
  return { name: 'seo', checks, summary, report: 'reports/operator/seo-audit.md' };
}

function adsenseAudit({ write = true } = {}) {
  const files = sourceFiles();
  const hits = scan(files, adsensePatterns);
  const adSlot = read('src', 'components', 'AdSlot.astro');
  const checks = [
    {
      level: hits.length === 0 ? 'OK' : 'ERROR',
      item: 'scripts/textos perigosos',
      detail: hits.length === 0 ? 'Nada encontrado em codigo ativo.' : hits.join('; '),
    },
    {
      level: adSlot && !/<script\b/i.test(adSlot) && !/adsbygoogle|googlesyndication|doubleclick|ca-pub-/i.test(adSlot) ? 'OK' : 'ERROR',
      item: 'AdSlot placeholder',
      detail: adSlot ? 'AdSlot existe sem script real de anuncios.' : 'AdSlot nao encontrado.',
    },
  ];
  const summary = summarize(checks);
  const body = [
    '# Operator AdSense Safety',
    '',
    `Gerado em: ${DATE}`,
    '',
    `OK: ${summary.ok}`,
    `Avisos: ${summary.warn}`,
    `Erros: ${summary.error}`,
    '',
    markdownTable(['Estado', 'Item', 'Detalhe'], checks.map((check) => [check.level, check.item, check.detail])),
    '',
    'Escopo: codigo ativo em src/, public/, astro.config.mjs, package.json e README.md. Scripts e relatorios sao ignorados para evitar falsos positivos.',
    '',
  ].join('\n');

  if (write) writeReport('adsense-safety.md', body);
  return { name: 'adsense', checks, summary, report: 'reports/operator/adsense-safety.md' };
}

function envFindings() {
  const envFiles = walk(ROOT, new Set(['node_modules', 'dist', '.astro', 'reports', '.git']))
    .filter((file) => /^\.env(\..*)?$/.test(path.basename(file)));
  const tracked = [];
  if (exists('.git')) {
    const git = spawnSync('git', ['ls-files', '.env*'], { cwd: ROOT, encoding: 'utf8', timeout: 30000 });
    if (git.status === 0) tracked.push(...git.stdout.split(/\r?\n/).filter(Boolean));
  }
  return { envFiles, tracked };
}

function largeFiles() {
  return walk(ROOT, new Set(['node_modules', 'dist', '.astro', '.git']))
    .filter((file) => fs.statSync(file).size > 5 * 1024 * 1024)
    .map((file) => `${rel(file)} (${Math.round(fs.statSync(file).size / 1024 / 1024)} MB)`);
}

function deployCheck({ write = true } = {}) {
  const packageJson = JSON.parse(read('package.json') || '{}');
  const build = runBuild();
  const env = envFindings();
  const checks = [];

  checks.push({ level: build.ok ? 'OK' : 'ERROR', item: 'npm run build', detail: build.ok ? 'Build passou.' : `Build falhou: ${build.error || `codigo ${build.status}`}` });
  checks.push({ level: exists('dist') ? 'OK' : 'ERROR', item: 'dist', detail: exists('dist') ? 'Gerada.' : 'Ausente.' });
  checks.push({ level: packageJson.scripts?.build ? 'OK' : 'ERROR', item: 'script build', detail: packageJson.scripts?.build || 'Ausente.' });
  checks.push({ level: /Cloudflare Pages|deploy/i.test(read('README.md')) ? 'OK' : 'WARN', item: 'README deploy', detail: 'README menciona Cloudflare Pages ou deploy.' });
  checks.push({ level: exists('public', 'robots.txt') ? 'OK' : 'ERROR', item: 'robots.txt', detail: 'public/robots.txt' });
  checks.push({ level: exists('dist', 'sitemap-index.xml') || exists('dist', 'sitemap-0.xml') ? 'OK' : 'ERROR', item: 'sitemap gerado', detail: 'dist/sitemap-index.xml ou dist/sitemap-0.xml' });
  checks.push({ level: env.envFiles.length === 0 ? 'OK' : 'ERROR', item: '.env local', detail: env.envFiles.length ? env.envFiles.map(rel).join(', ') : 'Nenhum .env encontrado.' });
  checks.push({ level: env.tracked.length === 0 ? 'OK' : 'ERROR', item: '.env versionado', detail: env.tracked.length ? env.tracked.join(', ') : 'Nenhum .env versionado detectado.' });
  const big = largeFiles();
  checks.push({ level: big.length === 0 ? 'OK' : 'WARN', item: 'arquivos grandes', detail: big.length ? big.join(', ') : 'Nenhum arquivo comum acima de 5 MB fora de dist/node_modules.' });
  checks.push({ level: walk(p('dist')).some((file) => rel(file).includes('node_modules/')) ? 'ERROR' : 'OK', item: 'node_modules em dist', detail: 'Nao encontrado.' });
  checks.push({ level: walk(p('reports')).some((file) => rel(file).includes('node_modules/')) ? 'ERROR' : 'OK', item: 'node_modules em reports', detail: 'Nao encontrado.' });

  const summary = summarize(checks);
  const readiness = summary.error > 0 ? 'BLOQUEADO' : summary.warn > 0 ? 'COM AVISOS' : 'OK';
  const buildTail = build.output ? build.output.split(/\r?\n/).slice(-25).join('\n') : '(sem saida capturada)';
  const body = [
    '# Operator Deploy Readiness',
    '',
    `Gerado em: ${DATE}`,
    '',
    `Deploy readiness: ${readiness}`,
    `OK: ${summary.ok}`,
    `Avisos: ${summary.warn}`,
    `Erros: ${summary.error}`,
    '',
    markdownTable(['Estado', 'Item', 'Detalhe'], checks.map((check) => [check.level, check.item, check.detail])),
    '',
    '## Saida resumida do build',
    '',
    '```text',
    buildTail,
    '```',
    '',
  ].join('\n');

  if (write) writeReport('deploy-readiness.md', body);
  return { name: 'deploy', checks, summary, readiness, report: 'reports/operator/deploy-readiness.md' };
}

function auditCommand() {
  const content = contentAudit();
  const seo = seoAudit();
  const adsense = adsenseAudit();
  const deploy = deployCheck();
  const allChecks = [...content.checks, ...seo.checks, ...adsense.checks, ...deploy.checks];
  const summary = summarize(allChecks);
  const status = summary.error > 0 ? 'BLOQUEADO' : summary.warn > 0 ? 'COM AVISOS' : 'OK';
  const body = [
    '# Operator Audit',
    '',
    `Gerado em: ${DATE}`,
    '',
    `Estado geral: ${status}`,
    `OK: ${summary.ok}`,
    `Avisos: ${summary.warn}`,
    `Erros: ${summary.error}`,
    '',
    markdownTable(
      ['Area', 'OK', 'Avisos', 'Erros', 'Relatorio'],
      [content, seo, adsense, deploy].map((area) => [area.name, area.summary.ok, area.summary.warn, area.summary.error, area.report])
    ),
    '',
    'Nenhum deploy, backend, login, banco de dados, AdSense real ou anuncio real foi configurado por este comando.',
    '',
  ].join('\n');
  writeReport('audit.md', body);

  console.log('=== OPERATOR AUDIT ===');
  console.log(`Estado geral: ${status}`);
  console.log(`OK: ${summary.ok}`);
  console.log(`Avisos: ${summary.warn}`);
  console.log(`Erros: ${summary.error}`);
  console.log('Relatorio: reports/operator/audit.md');

  if (summary.error > 0) process.exitCode = 1;
}

function mobileCommand() {
  const nets = os.networkInterfaces();
  const ips = Object.values(nets)
    .flat()
    .filter(Boolean)
    .filter((item) => item.family === 'IPv4' && !item.internal)
    .map((item) => item.address);

  const urls = ips.map((ip) => `http://${ip}:4321`);
  const body = [
    '# Operator Mobile Test',
    '',
    `Gerado em: ${DATE}`,
    '',
    '## Passos',
    '',
    '1. No PowerShell, dentro do projeto, roda:',
    '',
    '```sh',
    'npm run dev -- --host 0.0.0.0',
    '```',
    '',
    '2. Se precisares confirmar o IP local no Windows:',
    '',
    '```powershell',
    'ipconfig',
    '```',
    '',
    '3. No telefone, abre uma destas URLs na mesma rede Wi-Fi:',
    '',
    urls.length ? urls.map((url) => `- ${url}`).join('\n') : '- Nenhum IPv4 local detectado automaticamente.',
    '',
  ].join('\n');
  writeReport('mobile-test.md', body);

  console.log('=== MOBILE TEST ===');
  console.log('1. Roda: npm run dev -- --host 0.0.0.0');
  console.log('2. Se necessario, roda: ipconfig');
  console.log(urls.length ? `3. Abre no telefone: ${urls.join(' ou ')}` : '3. Nenhum IPv4 local detectado automaticamente.');
  console.log('Relatorio: reports/operator/mobile-test.md');
}

function reportSummaryLine(file) {
  const text = read('reports', 'operator', file);
  const status = text.match(/^(Estado geral|Deploy readiness):\s*(.+)$/m)?.[2];
  const ok = text.match(/^OK:\s*(\d+)/m)?.[1] ?? '0';
  const warn = text.match(/^Avisos:\s*(\d+)/m)?.[1] ?? '0';
  const errors = text.match(/^Erros:\s*(\d+)/m)?.[1] ?? '0';
  return text ? `${file}: ${status ? `${status}, ` : ''}${ok} OK, ${warn} avisos, ${errors} erros` : `${file}: ainda nao gerado`;
}

function chatgptCommand() {
  const seo = seoAudit({ write: false });
  const content = contentAudit({ write: false });
  const adsense = adsenseAudit({ write: false });
  const missingPages = mainPages().filter(([, file]) => !exists(file)).map(([name]) => name);
  const critical = [...content.checks, ...seo.checks, ...adsense.checks].filter((check) => check.level === 'ERROR');
  const warnings = [...content.checks, ...seo.checks, ...adsense.checks].filter((check) => check.level === 'WARN');
  const deployReport = read('reports', 'operator', 'deploy-readiness.md');
  const buildState = deployReport.match(/^Deploy readiness:\s*(.+)$/m)?.[1] ?? (exists('dist') ? 'dist existe; deploy-check ainda recomendado' : 'dist ausente');
  const next = critical.length > 0
    ? 'Corrigir erros criticos reportados antes de deploy.'
    : !deployReport
      ? 'Rodar npm run operator:deploy-check.'
      : 'Fazer validacao visual/mobile antes de confirmar deploy.';

  const lines = [
    'DINHEIRO NA NET - RESUMO PARA CHATGPT',
    `Data: ${DATE}`,
    `Pasta: ${ROOT}`,
    `Build/deploy-check: ${buildState}`,
    `Posts MDX: ${postFiles().length}`,
    `Paginas principais: ${missingPages.length === 0 ? 'OK' : `faltam ${missingPages.join(', ')}`}`,
    `Erros criticos: ${critical.length === 0 ? '0' : critical.slice(0, 5).map((check) => `${check.item} (${check.detail})`).join(' | ')}`,
    `Avisos: ${warnings.length}`,
    `Relatorios: reports/operator/audit.md; reports/operator/content-audit.md; reports/operator/seo-audit.md; reports/operator/adsense-safety.md; reports/operator/deploy-readiness.md`,
    `Ultimos resumos: ${reportSummaryLine('content-audit.md')} | ${reportSummaryLine('seo-audit.md')} | ${reportSummaryLine('adsense-safety.md')} | ${reportSummaryLine('deploy-readiness.md')}`,
    `Proximo passo recomendado: ${next}`,
  ];

  const summary = lines.join('\n');
  writeReport('chatgpt-summary.txt', `${summary}\n`);
  console.log(summary);
}

function snapshotCommand() {
  const content = contentAudit({ write: false });
  const seo = seoAudit({ write: false });
  const adsense = adsenseAudit({ write: false });
  const contentSummary = summarize(content.checks);
  const seoSummary = summarize(seo.checks);
  const adsenseSummary = summarize(adsense.checks);

  const body = [
    '# Dinheiro na Net - Project Snapshot',
    '',
    `Atualizado em: ${DATE}`,
    '',
    '## Estado atual',
    '',
    `- Pasta local: ${ROOT}`,
    '- Stack: Astro + MDX + @astrojs/sitemap',
    `- Posts MDX: ${postFiles().length}`,
    `- Paginas Astro: ${countAstroPages()}`,
    `- Componentes Astro: ${countComponents()}`,
    `- Dist/build anterior: ${exists('dist') ? 'existe' : 'nao existe'}`,
    '- Backend/login/banco de dados: nao existem',
    '- Anuncios reais/AdSense configurado: nao',
    '',
    '## Decisoes atuais',
    '',
    '- Nao comprar dominio agora.',
    '- Usar hospedagem gratuita primeiro, preferencialmente Cloudflare Pages.',
    '- Nao publicar/deployar sem confirmacao manual.',
    '- Usar ChatGPT como piloto estrategico e este Operator Kit como automacao local.',
    '',
    '## Ultimas auditorias leves',
    '',
    `- Conteudo: ${contentSummary.ok} OK, ${contentSummary.warn} avisos, ${contentSummary.error} erros`,
    `- SEO: ${seoSummary.ok} OK, ${seoSummary.warn} avisos, ${seoSummary.error} erros`,
    `- AdSense safety: ${adsenseSummary.ok} OK, ${adsenseSummary.warn} avisos, ${adsenseSummary.error} erros`,
    '',
    '## Comandos uteis',
    '',
    '- npm run operator:status',
    '- npm run operator:audit',
    '- npm run operator:chatgpt',
    '- npm run operator:mobile',
    '- npm run operator:deploy-check',
    '- npm run new:post -- "Titulo" "Categoria"',
    '',
    '## Proximos passos',
    '',
    '1. Rodar npm run operator:audit.',
    '2. Colar reports/operator/chatgpt-summary.txt no ChatGPT.',
    '3. Fazer validacao visual e mobile antes de qualquer deploy gratuito.',
    '',
  ].join('\n');

  writeReport('project-snapshot.md', body);
  console.log('Snapshot atualizado: reports/operator/project-snapshot.md');
}

function healthCommand() {
  const config = read('src', 'data', 'siteConfig.ts');
  const baseLayout = read('src', 'layouts', 'BaseLayout.astro');
  const astroConfig = read('astro.config.mjs');
  const checks = [
    ['Posts existentes', String(postFiles().length)],
    ['Paginas principais', mainPages().filter(([, file]) => exists(file)).length === mainPages().length ? 'OK' : 'FALTAM'],
    ['URL oficial', config.includes(PREFERRED_SITE) && astroConfig.includes(PREFERRED_SITE) ? PREFERRED_SITE : 'VERIFICAR'],
    ['GA4 G-X44LDYSG1', baseLayout.includes('G-X44LDYSG1') ? 'OK' : 'FALTA'],
    ['Search Console verification', exists('public', 'google4b64c5c3975c1fc5.html') ? 'OK' : 'FALTA'],
    ['robots.txt', exists('public', 'robots.txt') ? 'OK' : 'FALTA'],
    ['Sitemap Astro', /sitemap\s*\(/.test(astroConfig) ? 'OK' : 'FALTA'],
    ['dist', exists('dist') ? 'OK' : 'FALTA'],
    ['Git status', gitStatusShort() || 'limpo'],
  ];
  const body = [
    '# Operator Health',
    '',
    `Gerado em: ${DATE}`,
    '',
    markdownTable(['Item', 'Estado'], checks),
    '',
  ].join('\n');
  writeReport('health.md', body);
  console.log('=== OPERATOR HEALTH ===');
  for (const [item, state] of checks) console.log(`${item}: ${state}`);
  console.log('Relatorio: reports/operator/health.md');
}

function fixEncodingCommand() {
  const write = process.argv.includes('--write');
  const rows = [];
  let changed = 0;
  let suspicious = 0;

  for (const file of operatorTextFiles()) {
    const text = fs.readFileSync(file, 'utf8');
    const fixed = applyEncodingFixes(text);
    const hits = [];
    for (const [name, pattern] of encodingPatterns) {
      const lines = findLineNumbers(text, pattern);
      if (lines.length > 0) hits.push(`${name} (linhas ${lines.slice(0, 8).join(', ')})`);
    }
    if (oldPagesDomainPattern.test(text)) hits.push('url antiga do dominio temporario');
    if (hits.length > 0 || fixed !== text) {
      suspicious += 1;
      if (fixed !== text) changed += 1;
      rows.push([rel(file), fixed !== text ? 'corrigivel' : 'verificar', hits.join('; ') || 'substituicoes aplicaveis']);
      if (write && fixed !== text) fs.writeFileSync(file, fixed, 'utf8');
    }
  }

  const body = [
    '# Operator Fix Encoding',
    '',
    `Gerado em: ${DATE}`,
    `Modo: ${write ? 'write' : 'relatorio'}`,
    '',
    `Ficheiros suspeitos: ${suspicious}`,
    `Ficheiros ${write ? 'alterados' : 'corrigiveis'}: ${changed}`,
    '',
    rows.length ? markdownTable(['Arquivo', 'Estado', 'Detalhes'], rows) : 'Nenhum texto corrompido conhecido encontrado.',
    '',
    'Use `npm run operator:fix-encoding -- --write` para aplicar correcoes automaticamente.',
    '',
  ].join('\n');
  writeReport('fix-encoding.md', body);

  console.log('=== FIX ENCODING ===');
  console.log(`Modo: ${write ? 'write' : 'relatorio'}`);
  console.log(`Ficheiros suspeitos: ${suspicious}`);
  console.log(`Ficheiros ${write ? 'alterados' : 'corrigiveis'}: ${changed}`);
  console.log('Relatorio: reports/operator/fix-encoding.md');
}

function editorialAudit({ write = true } = {}) {
  const rows = [];
  const checks = [];

  for (const post of posts()) {
    const slug = path.basename(post.file, '.mdx');
    const errors = [];
    const warnings = [];
    const body = post.body;
    const links = extractInternalLinks(body);
    const words = wordCount(body);
    const h2Count = (body.match(/^##\s+\S/gm) ?? []).length;
    const hasPractical = /pr[aá]tic[ao]s?|checklist|passos?|exemplo/i.test(body);
    const hasLocal = /Mo[cç]ambique|lus[oó]fon|Portugal|Brasil|Angola|meticais|pa[ií]s/i.test(body);
    const exaggerated = findPatterns(body, exaggeratedTerms);
    const brokenEncoding = findPatterns(post.text, encodingPatterns);

    if (!post.hasFrontmatter) errors.push('frontmatter ausente');
    for (const field of ['title', 'description', 'date', 'updated', 'category']) {
      if (!present(post.data[field])) errors.push(`${field} ausente`);
    }
    if (present(post.data.category) && !officialCategoryLabels.includes(post.data.category)) errors.push('categoria fora da lista oficial');
    if (h2Count < 3) warnings.push('poucos H2');
    if (!hasFaq(body)) warnings.push('FAQ ausente');
    if (!hasConclusion(body)) warnings.push('conclusao ausente');
    if (links.length < 2) warnings.push('poucos links internos');
    if (words < 350) warnings.push('texto curto');
    if (!hasPractical) warnings.push('sem secao pratica ou exemplo claro');
    if (/mocambique|pagamento|afiliado|adsense|blog/i.test(normalize(`${slug} ${post.data.title}`)) && !hasLocal) warnings.push('pouco contexto local/lusofono');
    if (exaggerated.length > 0) warnings.push(`termos exagerados: ${exaggerated.join(', ')}`);
    if (brokenEncoding.length > 0) errors.push(`encoding quebrado: ${brokenEncoding.join(', ')}`);

    const level = errors.length > 0 ? 'ERROR' : warnings.length > 0 ? 'WARN' : 'OK';
    checks.push({ level, item: rel(post.file), detail: [...errors, ...warnings].join('; ') || 'OK' });
    rows.push([rel(post.file), level, post.data.title || '', words, h2Count, links.length, [...errors, ...warnings].join('; ') || 'OK']);
  }

  const summary = summarize(checks);
  const body = [
    '# Operator Editorial Audit',
    '',
    `Gerado em: ${DATE}`,
    '',
    `Posts: ${postFiles().length}`,
    `OK: ${summary.ok}`,
    `Avisos: ${summary.warn}`,
    `Erros: ${summary.error}`,
    '',
    markdownTable(['Arquivo', 'Estado', 'Titulo', 'Palavras', 'H2', 'Links internos', 'Observacoes'], rows),
    '',
  ].join('\n');
  if (write) writeReport('editorial-audit.md', body);
  return { name: 'editorial', checks, summary, report: 'reports/operator/editorial-audit.md' };
}

function copyScan({ write = true } = {}) {
  const rows = [];
  const checks = [];
  for (const file of visibleCopyFiles()) {
    const text = fs.readFileSync(file, 'utf8');
    const hits = [];
    for (const [name, pattern] of copyRiskPatterns) {
      const lines = findLineNumbers(text, pattern);
      if (lines.length > 0) hits.push(`${name} (linhas ${lines.slice(0, 10).join(', ')})`);
    }
    if (hits.length > 0) {
      checks.push({ level: 'ERROR', item: rel(file), detail: hits.join('; ') });
      rows.push([rel(file), hits.join('; ')]);
    }
  }
  if (checks.length === 0) checks.push({ level: 'OK', item: 'copy visivel', detail: 'Nenhum problema conhecido encontrado.' });
  const summary = summarize(checks);
  const body = [
    '# Operator Copy Scan',
    '',
    `Gerado em: ${DATE}`,
    '',
    `OK: ${summary.ok}`,
    `Avisos: ${summary.warn}`,
    `Erros: ${summary.error}`,
    '',
    rows.length ? markdownTable(['Arquivo', 'Problemas'], rows) : 'Nenhum problema conhecido encontrado em textos visiveis.',
    '',
  ].join('\n');
  if (write) writeReport('copy-scan.md', body);
  return { name: 'copy-scan', checks, summary, report: 'reports/operator/copy-scan.md' };
}

function linkAudit({ write = true } = {}) {
  const known = knownInternalRoutes();
  const rows = [];
  const checks = [];
  const calculatorExpected = new Set([
    'afiliados-ou-adsense',
    'como-ganhar-dinheiro-blog-2026',
    'marketing-afiliados-inicio',
    'o-que-e-adsense',
    'quanto-custa-criar-blog',
  ]);

  for (const post of posts()) {
    const slug = path.basename(post.file, '.mdx');
    const links = extractInternalLinks(post.body);
    const issues = [];
    if (links.length === 0) issues.push('sem links internos');
    for (const link of links) {
      if (!known.has(link)) issues.push(`link interno quebrado: ${link}`);
      if (oldPagesDomainPattern.test(link)) issues.push(`url antiga: ${link}`);
    }
    if (calculatorExpected.has(slug) && !links.includes('/ferramentas/calculadora-ganhos-blog')) {
      issues.push('deveria linkar para calculadora');
    }
    const level = issues.length > 0 ? 'ERROR' : 'OK';
    checks.push({ level, item: rel(post.file), detail: issues.join('; ') || 'OK' });
    rows.push([rel(post.file), level, links.join(', ') || '-', issues.join('; ') || 'OK']);
  }

  for (const file of visibleCopyFiles().filter((item) => item.endsWith('.astro'))) {
    const text = fs.readFileSync(file, 'utf8');
    for (const link of extractInternalLinks(text)) {
      if (!known.has(link)) {
        checks.push({ level: 'ERROR', item: rel(file), detail: `link interno quebrado: ${link}` });
        rows.push([rel(file), 'ERROR', link, `link interno quebrado: ${link}`]);
      }
    }
  }

  const summary = summarize(checks);
  const body = [
    '# Operator Link Audit',
    '',
    `Gerado em: ${DATE}`,
    '',
    `OK: ${summary.ok}`,
    `Avisos: ${summary.warn}`,
    `Erros: ${summary.error}`,
    '',
    markdownTable(['Arquivo', 'Estado', 'Links internos', 'Observacoes'], rows),
    '',
  ].join('\n');
  if (write) writeReport('link-audit.md', body);
  return { name: 'links', checks, summary, report: 'reports/operator/link-audit.md' };
}

function guideCommand() {
  const body = [
    '# Guia de Operacao por PowerShell',
    '',
    '## Comandos principais',
    '',
    '- `npm run dev` - abre o site local para escrever e testar.',
    '- `npm run build` - gera a versao estatica em `dist/`.',
    '- `npm run operator:health` - mostra estado geral do projeto.',
    '- `npm run operator:fix-encoding` - procura texto corrompido sem alterar ficheiros.',
    '- `npm run operator:fix-encoding -- --write` - aplica correcoes conhecidas de encoding.',
    '- `npm run operator:editorial` - audita qualidade editorial dos posts.',
    '- `npm run operator:copy-scan` - procura problemas em textos visiveis.',
    '- `npm run operator:links` - audita links internos.',
    '- `npm run operator:prepublish` - roda a validacao completa antes de push.',
    '- `npm run operator:chatgpt` - gera resumo curto do estado do projeto.',
    '',
    '## Criar novo post',
    '',
    '`npm run new:post -- "Titulo do artigo" "Começar do Zero"`',
    '',
    'Depois edita o MDX criado em `src/content/posts/`, remove o draft quando estiver pronto e roda `npm run operator:prepublish`.',
    '',
    '## Validar antes de push',
    '',
    '1. `npm run operator:fix-encoding`',
    '2. `npm run operator:prepublish`',
    '3. `git status`',
    '4. `git add ...`',
    '5. `git commit -m "mensagem"`',
    '6. `git push`',
    '',
    '## Memoria local',
    '',
    'Usa `npm run operator:snapshot` e guarda notas novas em `reports/operator/LOCAL_MEMORY_UPDATE_YYYYMMDD.md` quando houver uma decisao importante.',
    '',
  ].join('\n');
  writeReport('POWERSHELL_OPERATOR_GUIDE.md', body);
  console.log(body);
  console.log('Relatorio: reports/operator/POWERSHELL_OPERATOR_GUIDE.md');
}

function workflowCommand() {
  const body = [
    '# Workflows do Operador',
    '',
    '## Melhorar artigo existente',
    '',
    '1. Editar o ficheiro MDX em `src/content/posts/`.',
    '2. Rodar `npm run operator:editorial`.',
    '3. Rodar `npm run operator:links`.',
    '4. Rodar `npm run operator:prepublish`.',
    '5. Rever `git status` e commitar.',
    '',
    '## Criar novo artigo',
    '',
    '1. `npm run new:post -- "Titulo" "Categoria"`.',
    '2. Editar o rascunho.',
    '3. Confirmar frontmatter, FAQ, conclusao e links internos.',
    '4. Rodar `npm run operator:prepublish`.',
    '',
    '## Corrigir texto quebrado',
    '',
    '1. `npm run operator:fix-encoding`.',
    '2. Se o relatorio estiver correto: `npm run operator:fix-encoding -- --write`.',
    '3. Rodar `npm run operator:copy-scan`.',
    '',
    '## Validar SEO',
    '',
    '1. `npm run operator:seo`.',
    '2. Corrigir title, description, canonical ou paginas principais.',
    '3. Rodar `npm run build`.',
    '',
    '## Validar Analytics e Search Console sem mexer neles',
    '',
    '1. `npm run operator:health`.',
    '2. Confirmar `GA4 G-X44LDYSG1: OK`.',
    '3. Confirmar `Search Console verification: OK`.',
    '4. Nao remover `public/google4b64c5c3975c1fc5.html`.',
    '',
    '## Preparar commit',
    '',
    '1. `npm run operator:prepublish`.',
    '2. `git status`.',
    '3. `git diff --stat`.',
    '4. `git add ...`.',
    '5. `git commit -m "mensagem"`.',
    '',
    '## Publicar alteracao',
    '',
    '1. Confirmar que o branch esta certo.',
    '2. Rodar `git push`.',
    '3. Aguardar o deploy conectado ao GitHub/Cloudflare.',
    '4. Abrir o site oficial e verificar paginas principais.',
    '',
  ].join('\n');
  writeReport('WORKFLOWS.md', body);
  console.log(body);
  console.log('Relatorio: reports/operator/WORKFLOWS.md');
}

function prepublishCommand() {
  const scripts = [
    'build',
    'operator:content',
    'operator:seo',
    'operator:deploy-check',
    'operator:editorial',
    'operator:copy-scan',
    'operator:links',
    'operator:chatgpt',
  ];
  const results = scripts.map(runNpmScript);
  const rows = results.map((result) => [
    result.scriptName,
    result.ok ? 'OK' : 'ERROR',
    result.output.split(/\r?\n/).slice(-8).join('<br>') || '(sem saida)',
  ]);
  const ok = results.filter((result) => result.ok).length;
  const errors = results.length - ok;
  const body = [
    '# Operator Prepublish Report',
    '',
    `Gerado em: ${DATE}`,
    '',
    `OK: ${ok}`,
    `Erros: ${errors}`,
    '',
    markdownTable(['Comando', 'Estado', 'Resumo'], rows),
    '',
    '## Git status',
    '',
    '```text',
    gitStatusShort() || 'limpo',
    '```',
    '',
  ].join('\n');
  writeReport('prepublish-report.md', body);
  console.log('=== PREPUBLISH ===');
  for (const result of results) console.log(`${result.scriptName}: ${result.ok ? 'OK' : 'ERROR'}`);
  console.log('Relatorio: reports/operator/prepublish-report.md');
  if (errors > 0) process.exitCode = 1;
}

function printSimpleResult(result, label) {
  console.log(`=== ${label} ===`);
  if (label === 'CONTENT') console.log(`Posts: ${postFiles().length}`);
  if (result.readiness) console.log(`Deploy readiness: ${result.readiness}`);
  console.log(`OK: ${result.summary.ok}`);
  console.log(`Avisos: ${result.summary.warn}`);
  console.log(`Erros: ${result.summary.error}`);
  console.log(`Relatorio: ${result.report}`);
  if (result.summary.error > 0) process.exitCode = 1;
}

function main() {
  const command = process.argv[2] ?? 'status';
  ensureReports();

  if (command === 'status') return statusCommand();
  if (command === 'health') return healthCommand();
  if (command === 'audit') return auditCommand();
  if (command === 'content') return printSimpleResult(contentAudit(), 'CONTENT');
  if (command === 'seo') return printSimpleResult(seoAudit(), 'SEO');
  if (command === 'adsense') return printSimpleResult(adsenseAudit(), 'ADSENSE SAFETY');
  if (command === 'deploy-check') return printSimpleResult(deployCheck(), 'DEPLOY CHECK');
  if (command === 'fix-encoding') return fixEncodingCommand();
  if (command === 'editorial') return printSimpleResult(editorialAudit(), 'EDITORIAL');
  if (command === 'copy-scan') return printSimpleResult(copyScan(), 'COPY SCAN');
  if (command === 'links') return printSimpleResult(linkAudit(), 'LINKS');
  if (command === 'prepublish') return prepublishCommand();
  if (command === 'guide') return guideCommand();
  if (command === 'workflow') return workflowCommand();
  if (command === 'mobile') return mobileCommand();
  if (command === 'chatgpt') return chatgptCommand();
  if (command === 'snapshot') return snapshotCommand();

  console.error(`Comando desconhecido: ${command}`);
  console.error('Use: status, health, audit, content, seo, adsense, deploy-check, fix-encoding, editorial, copy-scan, links, prepublish, guide, workflow, mobile, chatgpt, snapshot');
  process.exitCode = 1;
}

main();

