#!/usr/bin/env node
// Gera os mockups de docs/ a partir das cores reais de themes/*.json.
// Uso: node scripts/gen-previews.mjs   (CHROME=/caminho/do/chrome para trocar o navegador)
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'docs');
const chrome = process.env.CHROME || 'google-chrome';
const FONT = "'JetBrainsMono Nerd Font Mono','JetBrains Mono','Fira Code','DejaVu Sans Mono',monospace";
const UI = "'Inter','Noto Sans','Cantarell',sans-serif";

const THEMES = [
  { id: 'neon', label: 'Nebula Neon' },
  { id: 'ambar', label: 'Nebula Âmbar' },
  { id: 'cobre', label: 'Nebula Cobre' },
  { id: 'oled', label: 'Nebula OLED' },
];

const load = (id) => JSON.parse(readFileSync(join(root, 'themes', `nebula-${id}-color-theme.json`), 'utf8'));

// primeira regra de tokenColors que cita o escopo
function tokenColor(theme, scope) {
  const rule = theme.tokenColors.find((r) => [].concat(r.scope).includes(scope));
  if (!rule) throw new Error(`escopo sem regra: ${scope}`);
  return rule.settings.foreground;
}

function palette(theme) {
  const c = theme.colors;
  const t = (s) => tokenColor(theme, s);
  return {
    bg: c['editor.background'], panel: c['sideBar.background'], chrome: c['titleBar.activeBackground'],
    border: c['panel.border'], text: c['editor.foreground'], strong: t('variable.parameter'),
    meta: t('comment'), dim: c['editorLineNumber.foreground'], accent: c['tab.activeBorderTop'],
    red: c['terminal.ansiRed'], green: c['terminal.ansiGreen'], yellow: c['terminal.ansiYellow'],
    blue: c['terminal.ansiBlue'], magenta: c['terminal.ansiMagenta'], cyan: c['terminal.ansiCyan'],
    kw: t('keyword'), str: t('string'), fn: t('entity.name.function'), num: t('constant.numeric'),
    ty: t('entity.name.type'), sel: c['list.activeSelectionBackground'],
    selection: c['editor.selectionBackground'], line: c['editor.lineHighlightBackground'],
    badgeFg: c['badge.foreground'], guide: c['editorIndentGuide.background1'],
    untracked: c['gitDecoration.untrackedResourceForeground'],
  };
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// [classe, texto] por linha; classes: kw ty fn str num cm par pr (propriedade) v (texto padrão)
function code(accent) {
  const k = (s) => ['kw', s], ty = (s) => ['ty', s], fn = (s) => ['fn', s], v = (s) => ['v', s];
  const par = (s) => ['par', s], str = (s) => ['str', s], num = (s) => ['num', s], cm = (s) => ['cm', s];
  return [
    [k('use'), v(' iced::{'), ty('Element'), v(', '), ty('Task'), v('};')],
    [],
    [cm('// atualiza o estado a cada mensagem')],
    [k('pub fn '), fn('update'), v('('), par('estado'), v(': &'), k('mut '), ty('Estado'), v(', '), par('msg'), v(': '), ty('Mensagem'), v(') -> '), ty('Task'), v('<'), ty('Mensagem'), v('> {')],
    [v('    '), k('match '), par('msg'), v(' {')],
    [v('        '), ty('Mensagem'), v('::ArquivoMudou('), par('caminho'), v(') => {')],
    [v('            '), par('estado'), v('.'), ['pr', 'conteudo'], v(' = '), fn('ler_arquivo'), v('(&'), par('caminho'), v(');')],
    [v('            '), ty('Task'), v('::'), fn('none'), v('()')],
    [v('        }')],
    [v('        '), ty('Mensagem'), v('::Salvar => {')],
    [v('            '), k('let '), ['warn', 'cor'], v(' = '), str(`"${accent}"`), v(';')],
    [v('            '), fn('salvar'), v('('), par('estado'), v(', '), num('42'), v(')')],
    [v('        }')],
    [v('    }')],
    [v('}')],
  ];
}

function html(id, label, theme) {
  const p = palette(theme);
  const accentHex = p.accent.toUpperCase();
  const cls = { kw: p.kw, ty: p.ty, fn: p.fn, str: p.str, num: p.num, cm: p.meta, par: p.strong, pr: p.strong, v: p.text, warn: p.text };
  const lines = code(accentHex).map((toks, i) => {
    const n = i + 1;
    const body = toks.map(([c, s]) => {
      const style = `color:${cls[c]}${c === 'cm' ? ';font-style:italic' : ''}`;
      const extra = c === 'warn' ? `;text-decoration:underline wavy ${p.yellow};text-underline-offset:4px` : '';
      return `<span style="${style}${extra}">${esc(s)}</span>`;
    }).join('');
    const cur = n === 7;
    const gutter = n === 11 ? p.green : n === 7 ? p.yellow : 'transparent';
    const sel = n === 7 ? `<span class="selbox" style="left:12ch;width:${'estado.conteudo'.length}ch;background:${p.selection}"></span>` : '';
    return `<div class="ln${cur ? ' cur' : ''}"><i style="background:${gutter}"></i><b style="color:${cur ? p.meta : p.dim}">${n}</b><div class="g"></div><span class="code">${sel}${body}</span></div>`;
  }).join('');

  const tree = [
    ['▾', 'src', p.text, '', 0],
    ['', 'app.rs', p.yellow, 'M', 1, true],
    ['▸', 'render', p.text, '', 1],
    ['', 'theme.rs', p.untracked, 'U', 1],
    ['▾', 'themes', p.text, '', 0],
    ['', `nebula-${id}-color-theme.json`, p.yellow, 'M', 1],
    ['', 'Cargo.toml', p.meta, '', 0],
    ['', 'README.md', p.meta, '', 0],
  ].map(([arrow, name, color, badge, depth, active]) =>
    `<div class="row${active ? ' act' : ''}" style="padding-left:${14 + depth * 16}px;${active ? `background:${p.sel};` : ''}"><u>${arrow}</u><span style="color:${active ? p.strong : color}">${esc(name)}</span><em style="color:${color}">${badge}</em></div>`).join('');

  const A = (extra = '') => `fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" ${extra}`;
  const icons = [
    `<svg viewBox="0 0 24 24" ${A()}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>`,
    `<svg viewBox="0 0 24 24" ${A()}><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/></svg>`,
    `<svg viewBox="0 0 24 24" ${A()}><circle cx="6" cy="6" r="2.2"/><circle cx="6" cy="18" r="2.2"/><circle cx="18" cy="9" r="2.2"/><path d="M6 8.2v7.6M18 11.2c0 4-6 2-11.5 5"/></svg>`,
    `<svg viewBox="0 0 24 24" ${A()}><path d="m8 5 11 7-11 7z"/></svg>`,
    `<svg viewBox="0 0 24 24" ${A()}><rect x="3.5" y="3.5" width="7" height="7" rx="1"/><rect x="13.5" y="3.5" width="7" height="7" rx="1"/><rect x="3.5" y="13.5" width="7" height="7" rx="1"/><rect x="13.5" y="13.5" width="7" height="7" rx="1"/></svg>`,
  ].map((s, i) => `<div class="ai${i === 0 ? ' on' : ''}" style="${i === 0 ? `color:${p.accent};box-shadow:inset 2px 0 0 ${p.accent}` : `color:${p.meta}`}">${s}</div>`).join('');

  const ansi = ['Black', 'Red', 'Green', 'Yellow', 'Blue', 'Magenta', 'Cyan', 'White'];
  const dots = ansi.map((n) => `<span class="dot" style="background:${theme.colors['terminal.ansi' + n]};box-shadow:0 0 0 1px ${p.border}"></span>`).join('')
    + ansi.map((n) => `<span class="dot" style="background:${theme.colors['terminal.ansiBright' + n]}"></span>`).join('');

  return `<!doctype html><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0;padding:0}
body{width:1280px;height:800px;overflow:hidden;background:${p.bg};color:${p.text};font:13px ${UI}}
.win{display:flex;flex-direction:column;height:800px}
.title{height:38px;background:${p.chrome};display:flex;align-items:center;padding:0 16px;position:relative;color:${p.meta}}
.tl{display:flex;gap:8px}.tl i{width:12px;height:12px;border-radius:50%}
.title .t{position:absolute;left:0;right:0;text-align:center;font-size:13px}
.main{flex:1;display:flex;min-height:0}
.ab{width:52px;background:${p.panel};display:flex;flex-direction:column;padding-top:4px}
.ai{height:50px;display:flex;align-items:center;justify-content:center}.ai svg{width:24px;height:24px}
.side{width:272px;background:${p.panel};border-left:0;padding-top:0}
.sh{height:36px;display:flex;align-items:center;padding:0 16px;font-size:11px;letter-spacing:.8px;color:${p.text}}
.sec{height:26px;display:flex;align-items:center;padding:0 12px;font-size:11px;font-weight:700;letter-spacing:.6px;color:${p.strong}}
.row{height:26px;display:flex;align-items:center;font-size:13px;gap:6px;padding-right:14px}
.row u{width:12px;text-decoration:none;font-size:10px;color:${p.meta}}.row span{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.row em{font-style:normal;font-size:11px;font-weight:700}
.ed{flex:1;display:flex;flex-direction:column;min-width:0}
.tabs{height:38px;background:${p.panel};display:flex}
.tab{padding:0 22px;display:flex;align-items:center;gap:8px;font-size:13px;color:${p.meta};background:${p.panel}}
.tab.on{background:${p.bg};color:${p.strong};box-shadow:inset 0 2px 0 ${p.accent}}
.tab .d{width:7px;height:7px;border-radius:50%;background:${p.yellow}}
.bc{height:28px;display:flex;align-items:center;padding:0 20px;font-size:12px;color:${p.meta};gap:8px}
.ed .code-area{flex:1;padding-top:6px;font:15px/25px ${FONT};min-height:0}
.ln{display:flex;height:25px;position:relative;white-space:pre}
.ln i{width:4px;margin-left:6px}
.ln b{width:46px;text-align:right;font-weight:400;padding-right:2px;font-size:14px}
.ln .g{width:22px}
.ln.cur{background:${p.line}}
.code{position:relative}
.code span{position:relative}
.code .selbox{position:absolute;top:2px;bottom:2px}
.panelwrap{height:216px;background:${p.panel};border-top:1px solid ${p.border}}
.ptabs{height:34px;display:flex;gap:22px;padding:0 20px;align-items:center;font-size:11px;letter-spacing:.6px}
.ptabs span{color:${p.meta};height:34px;display:flex;align-items:center}
.ptabs span.on{color:${p.strong};box-shadow:inset 0 -1px 0 ${p.accent}}
.ptabs .bd{height:auto;background:${p.accent};color:${p.badgeFg};border-radius:9px;padding:1px 6px;font-weight:700;margin-left:-14px}
.term{background:${p.bg};height:182px;padding:12px 20px;font:14px/22px ${FONT};white-space:pre}
.status{height:26px;background:${p.chrome};display:flex;align-items:center;justify-content:space-between;padding:0 14px;color:${p.meta};font-size:12px}
.status .l,.status .r{display:flex;gap:18px;align-items:center}
.status .br{color:${p.accent};font-weight:700}
.dot{display:inline-block;width:10px;height:10px;border-radius:50%;margin-left:3px}
.name{position:absolute;right:16px;top:10px;font-size:12px;color:${p.meta}}
</style>
<div class="win">
  <div class="title"><div class="tl"><i style="background:${p.red}"></i><i style="background:${p.yellow}"></i><i style="background:${p.green}"></i></div><div class="t">app.rs — nebula — ${label}</div></div>
  <div class="main">
    <div class="ab">${icons}</div>
    <div class="side"><div class="sh">EXPLORADOR</div><div class="sec">▾ NEBULA</div>${tree}</div>
    <div class="ed">
      <div class="tabs"><div class="tab on">app.rs <span class="d"></span></div><div class="tab">theme.rs</div><div class="tab">Cargo.toml</div></div>
      <div class="bc">nebula <span>›</span> src <span>›</span> <span style="color:${p.text}">app.rs</span> <span>›</span> <span style="color:${p.text}">update</span></div>
      <div class="code-area">${lines}</div>
      <div class="panelwrap">
        <div class="ptabs"><span>PROBLEMAS</span><span class="bd">1</span><span>SAÍDA</span><span class="on">TERMINAL</span><span>CONSOLE DE DEPURAÇÃO</span></div>
        <div class="term"><span style="color:${p.cyan}">~/nebula</span> <span style="color:${p.magenta}">main</span> <span style="color:${p.green}">❯</span> cargo build
<span style="color:${p.green};font-weight:700">   Compiling</span> nebula v2.0.0
<span style="color:${p.yellow};font-weight:700">warning</span><b style="font-weight:700">: unused variable: <span style="color:${p.yellow}">\`cor\`</span></b>
<span style="color:${p.blue};font-weight:700">  --&gt;</span> src/app.rs:11:17
<span style="color:${p.green};font-weight:700">    Finished</span> dev profile in 1.24s
<span style="color:${p.cyan}">~/nebula</span> <span style="color:${p.magenta}">main</span> <span style="color:${p.green}">❯</span> <span style="background:${p.accent};color:${p.bg}"> </span></div>
      </div>
    </div>
  </div>
  <div class="status"><div class="l"><span class="br">⎇ main</span><span>⊘ 0  ⚠ 1</span></div><div class="r">${dots}<span>Ln 7, Col 14</span><span>Rust</span></div></div>
</div>`;
}

function swatches(themes) {
  const roles = [
    ['Fundo', 'bg'], ['Painel', 'panel'], ['Cromo', 'chrome'], ['Borda', 'border'], ['Texto', 'text'], ['Forte', 'strong'],
    ['Metadado', 'meta'], ['Destaque', 'accent'], ['Vermelho', 'red'], ['Amarelo', 'yellow'], ['Verde', 'green'], ['Azul', 'blue'], ['Violeta', 'magenta'], ['Ciano', 'cyan'],
  ];
  const rows = themes.map(({ label, theme }) => {
    const p = palette(theme);
    // tokens de sintaxe por tema: keyword/função/número/tipo/string
    const syn = { ...p, red: theme.colors['terminal.ansiRed'] };
    const cells = roles.map(([n, k]) => {
      const col = syn[k];
      return `<div class="c"><div class="sw" style="background:${col}"></div><div class="n">${n}</div><div class="h">${col.toUpperCase()}</div></div>`;
    }).join('');
    return `<div class="r" style="background:${p.bg}"><div class="tn" style="color:${p.accent}">${label}</div><div class="cs">${cells}</div></div>`;
  }).join('');
  return `<!doctype html><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0;padding:0}
body{width:1280px;background:#0E0E10;font:12px ${UI};color:#BDBDC2;padding:16px}
.r{border-radius:12px;padding:16px 20px 14px;margin-bottom:12px;border:1px solid #ffffff14}
.tn{font:700 15px ${UI};margin-bottom:12px}
.cs{display:grid;grid-template-columns:repeat(14,1fr);gap:8px}
.sw{height:44px;border-radius:8px;box-shadow:inset 0 0 0 1px #ffffff22}
.n{margin-top:6px;color:#9a9aa6;font-size:11px}.h{font:11px ${FONT};color:#c8c8d0;margin-top:1px}
</style><div>${rows}</div>`;
}

function shot(htmlFile, png, w, h, scale = 2) {
  execFileSync(chrome, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars', `--force-device-scale-factor=${scale}`,
    `--window-size=${w},${h}`, `--screenshot=${png}`, `file://${htmlFile}`,
  ], { stdio: 'ignore' });
}

mkdirSync(out, { recursive: true });
const tmp = join(tmpdir(), `nebula-previews-${process.pid}`);
mkdirSync(tmp, { recursive: true });
const loaded = THEMES.map((t) => ({ ...t, theme: load(t.id) }));

for (const { id, label, theme } of loaded) {
  const f = join(tmp, `${id}.html`);
  writeFileSync(f, html(id, label, theme));
  shot(f, join(out, `preview-${id}.png`), 1280, 800);
  console.log(`docs/preview-${id}.png`);
}
const f = join(tmp, 'paletas.html');
writeFileSync(f, swatches(loaded));
shot(f, join(out, 'paletas.png'), 1280, 4 * 158 + 8);
console.log('docs/paletas.png');
rmSync(tmp, { recursive: true, force: true });
