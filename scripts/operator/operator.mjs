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
  ['clique no anuncio', /clique\s+(aqui\s+)?(no|na|em|num|neste|nesse|naquele)\s+an[uÃº]ncio/i],
  ['clicar no anuncio', /clicar\s+(no|na|em|num|neste|nesse|naquele)\s+an[uÃº]ncio/i],
  ['ganhos garantidos', /ganhos?\s+garantid[oa]s?/i],
  ['dinheiro facil garantido', /dinheiro\s+f[aÃ¡]cil\s+garantido/i],
  ['trafego falso', /tr[aÃ¡]fego\s+falso/i],
  ['bot de clique', /bot\s+de\s+clique/i],
  ['bots de clique', /bots\s+de\s+clique/i],
  ['cliques artificiais', /cliques?\s+artificiais/i],
  ['manipular AdSense', /manipular\s+adsense/i],
  ['bypass', /\bbypass\b/i],
  ['esquema garantido', /esquema\s+garantido/i],
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
  return /<FAQ\b/i.test(body) || /^##\s*(FAQ|Perguntas frequentes|Perguntas comuns|Duvidas|D[uÃº]vidas)/im.test(body);
}

function hasConclusion(body) {
  return /^##\s*(Conclus[aÃ£]o|Resumo final|Proximo passo|Pr[oÃ³]ximo passo)/im.test(body);
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
  if (command === 'audit') return auditCommand();
  if (command === 'content') return printSimpleResult(contentAudit(), 'CONTENT');
  if (command === 'seo') return printSimpleResult(seoAudit(), 'SEO');
  if (command === 'adsense') return printSimpleResult(adsenseAudit(), 'ADSENSE SAFETY');
  if (command === 'deploy-check') return printSimpleResult(deployCheck(), 'DEPLOY CHECK');
  if (command === 'mobile') return mobileCommand();
  if (command === 'chatgpt') return chatgptCommand();
  if (command === 'snapshot') return snapshotCommand();

  console.error(`Comando desconhecido: ${command}`);
  console.error('Use: status, audit, content, seo, adsense, deploy-check, mobile, chatgpt, snapshot');
  process.exitCode = 1;
}

main();

