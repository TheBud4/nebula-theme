# Changelog

## 1.2.0 — 2026-08-21

- Paleta inteira remapeada pra mais contraste e saturação, mantendo a mesma
  identidade (mesmos matizes, mesma hierarquia de camadas fundo → painel →
  cromo → borda). A partir desta versão os valores **não batem mais 1:1**
  com o esquema do Konsole/GRUB — ver seção "Por que existe" no README.
  Fundo `#121019` → `#0D0B14`, destaque `#5AEB71` → `#4AFF6B`, e as demais
  12 cores nomeadas seguiram o mesmo remapeamento (ver tabela no README).
- Adicionado `"window.titleBarStyle": "custom"` na config recomendada — sem
  isso o compositor do sistema pode desenhar a barra de título por fora do
  tema, quebrando a identidade visual bem no topo da janela.
- Corrigida a contagem de chaves de cor no README (131 → 136 — já estava
  desatualizada desde a 1.1.0, que adicionou 7 e removeu 2).

## 1.1.0 — 2026-08-21

- Renomeado de `nebulosa-theme` (uso pessoal) para `nebula-theme` / **Nebula Theme** — primeiro release público.
- Adicionadas as famílias de cor que faltavam: `button.border`, `notificationToast.border`, `peekViewResult.fileForeground`, `peekViewResult.lineForeground`, `peekViewResult.matchHighlightForeground`, `peekViewResult.selectionForeground`, `peekViewEditor.matchHighlightBorder`.
- Removidas duas chaves que não existem no VS Code (`merge.currentContentForeground`, `merge.incomingContentForeground`) — não tinham efeito, mas induziam quem lesse o arquivo a erro.

## 1.0.0 — 2026-08-20

Primeira versão, de uso pessoal — derivada do tema Space Isolation do GRUB e do esquema Nebulosa do Konsole, para dar identidade visual única entre boot, terminal e editor.
