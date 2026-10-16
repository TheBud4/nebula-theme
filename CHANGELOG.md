# Changelog

## Não lançado

- Documentação atualizada para a 2.0: o README agora descreve os quatro
  temas, com paleta de interface e de sintaxe de cada um.
- Previews novos em `docs/` (um por tema + `paletas.png`), no lugar do
  `preview.png` antigo, que ainda mostrava o fundo roxo da 1.x. São
  gerados por `scripts/gen-previews.mjs` a partir dos JSONs dos temas, então
  não saem de sincronia com as cores reais. O mockup ficou mais completo:
  explorador com decorações git, abas, breadcrumb, seleção, diagnóstico,
  painel de terminal com ANSI e barra de status.
- `docs/` e `scripts/` ficam fora do `.vsix` (`.vscodeignore`).

## 2.0.0 — 2026-10-16

- **Fim do roxo.** Todos os fundos passam a ser cinzas neutros (grafite
  `#0E0E10` no tema principal). A hierarquia de camadas segue a mesma:
  fundo → painel → cromo → borda.
- **Fim do branco puro.** `#FFFFFF` (parâmetros, propriedades, aba ativa,
  arquivo selecionado, negrito, "branco brilhante" do terminal) virou
  `#CFCFD6`.
- Três temas novos, além do principal (renomeado **Nebula Neon**):
  **Nebula Âmbar** (cinza médio), **Nebula Cobre** (cinza claro) e
  **Nebula OLED** (preto absoluto). Os arquivos agora são
  `themes/nebula-<nome>-color-theme.json`.
- Os valores deixam de bater com o Konsole/GRUB até esses dois serem
  atualizados para o novo grafite.

## 1.3.0 — 2026-08-21

- Separação maior entre a lateral (sidebar, rail de ícones, cabeçalho da
  sidebar, painel inferior, sticky scroll, peek view) e o fundo do editor:
  `#16121F` → `#1B1730`. As sete chaves que compartilhavam esse valor
  seguem compartilhando — continuam a mesma cor entre si, só sobem juntas
  em relação ao `editor.background` (`#0D0B14`, inalterado).
- **Instalação corrigida.** O README recomendava `cp -r` a pasta do repo
  pra dentro de `~/.vscode/extensions/` — isso funciona no primeiro
  momento, mas o VS Code marca a pasta como obsoleta sozinho a cada
  abertura (não está registrada em `extensions.json` com os metadados que
  ele espera de uma instalação real) e o tema some do seletor em silêncio
  depois de qualquer reinício. Passou a distribuir `.vsix` via
  [Releases](https://github.com/TheBud4/nebula-theme/releases) — instale
  com `code --install-extension`, nunca copiando a pasta à mão.

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
