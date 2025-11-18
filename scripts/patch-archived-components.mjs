import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('docs');

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      yield* walk(full);
    } else if (e.isFile()) {
      yield full;
    }
  }
}

function rewriteHeader(html) {
  const homeURL = 'https://web.archive.org/web/20220326164249/https://designsystem.gov.au/components/';
  const minimalHeader = [
    '<div class="header">',
    '  <div class="au-header au-header--dark" role="banner" style="background:#000">',
    '    <div class="container-fluid">',
    '      <div class="row">',
    '        <div class="col-md-12">',
    `          <a class="au-header__brand" href="${homeURL}" style="color:#fff;text-decoration:none;padding:12px 0;display:inline-block">Components Home</a>`,
    '        </div>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</div>'
  ].join('\n');

  // Replace everything from header-wrapper up to page-wrapper with minimal header
  const pattern = /<div class="header-wrapper">[\s\S]*?<div class="page-wrapper">/i;
  if (pattern.test(html)) {
    html = html.replace(pattern, minimalHeader + '\n<div class="page-wrapper">');
  }
  // Remove any remaining au-main-nav if present outside header-wrapper
  html = html.replace(/<nav class="au-main-nav[\s\S]*?<\/nav>/gi, '');
  return html;
}

function rewriteFooter(html) {
  // Replace any footer with a minimal dark footer bar
  const footerRe = /<footer[\s\S]*?<\/footer>/gi;
  return html.replace(
    footerRe,
    '<footer class="au-footer footer au-body au-body--dark au-footer--dark" role="contentinfo" style="background:#000;min-height:24px"></footer>'
  );
}

function removeSearch(html) {
  // Remove forms that look like site search (type=search or role=search or placeholder/aria-label contains "search")
  html = html.replace(/<form[^>]*role=["']search["'][\s\S]*?<\/form>/gi, '');
  html = html.replace(/<form[\s\S]*?<input[^>]*type=["']search["'][\s\S]*?<\/form>/gi, '');
  html = html.replace(/<form[\s\S]*?(placeholder|aria-label)=["'][^"']*search[^"']*["'][\s\S]*?<\/form>/gi, '');
  return html;
}

function removeDiscussionTab(html) {
  // Remove the Discussion tab from component navigation
  return html.replace(/<li[^>]*>\s*<a[^>]*>\s*Discussion\s*<\/a>\s*<\/li>/gi, '');
}

function rewriteLiveDemo(html, slug) {
  if (!slug || slug === 'index') return html;
  const newURL = `https://design-system-components.truecms.com.au/packages/${slug}/tests/site/`;
  // Update anchors whose text is "Live demo"
  return html.replace(/(<a\b[^>]*href=")[^"]*("[^>]*>\s*Live\s*demo\s*<\/a>)/gi, `$1${newURL}$2`);
}

async function processFile(file) {
  if (!file.endsWith('.html')) return;
  if (!file.includes('/components/')) return;
  const slug = path.basename(file, '.html');
  let html = await fs.readFile(file, 'utf8');
  const original = html;
  html = rewriteHeader(html);
  html = rewriteFooter(html);
  html = removeSearch(html);
  html = removeDiscussionTab(html);
  html = rewriteLiveDemo(html, slug);

  if (html !== original) {
    await fs.writeFile(file, html, 'utf8');
    return true;
  }
  return false;
}

async function main() {
  let changed = 0;
  for await (const f of walk(ROOT)) {
    const did = await processFile(f);
    if (did) changed++;
  }
  console.log(`Patched ${changed} files.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

