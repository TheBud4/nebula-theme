# Nebula Theme

Tema escuro para VS Code derivado de um menu do GRUB (tema *Space Isolation*)
e do esquema de cores irmão usado no Konsole — a ideia é uma identidade
visual só, do boot ao terminal ao editor.

![preview](preview.png)

*(mockup ilustrativo das cores, não é um screenshot real do editor — se você
usa o tema, sinta-se à vontade a mandar um screenshot de verdade num PR.)*

## Instalar

**Do Marketplace:** ainda não publicado lá — por enquanto, instale a partir
do código-fonte:

```bash
git clone https://github.com/TheBud4/nebula-theme.git
cp -r nebula-theme ~/.vscode/extensions/nebula-theme
```

Reabra o VS Code, `Ctrl+Shift+P` → **Preferences: Color Theme** → **Nebula
Theme**.

## Paleta

| Papel | Cor |
|---|---|
| Fundo | `#121019` |
| Painéis / sidebar | `#151321` |
| Cromo (title bar, tabs inativas) | `#1D1A28` |
| Borda | `#232032` |
| Texto | `#ACA8A5` |
| Texto forte | `#F2EFEC` |
| Metadado (line numbers, breadcrumb) | `#6A6280` |
| Inativo | `#3A3548` |
| Destaque (cursor, strings, git added) | `#5AEB71` |
| Vermelho (erro, deletado) | `#FF5C7A` |
| Amarelo (aviso, números) | `#FFC857` |
| Azul (tipos, info) | `#5B8CFF` |
| Violeta (keywords) | `#B45AFF` |
| Ciano (funções) | `#22E0D0` |

131 chaves de cor cobertas (editor, sidebar, tabs, terminal com as 16 cores
ANSI completas, git decorations, botões, notificações, peek view, diff
editor, merge conflicts, scrollbar, gutter), 17 `tokenColors` e 18
`semanticTokenColors` — cobertura pensada pra não cair no azul padrão do
Dark+ em nenhum canto comum da UI.

## Por que existe

Nasceu de uma restauração de sistema (Fedora, pós-formatação) onde o
objetivo era ter a mesma identidade visual entre o menu de boot, o
terminal e o editor, em vez de três temas escolhidos sem relação entre
si. O verde de destaque (`#5AEB71`) e o texto cinza-quente (`#ACA8A5`)
vêm direto do tema do GRUB; o fundo é mais claro que o preto puro do GRUB
(`#121019` em vez de `#000000`) porque, com o fundo levantado, o cinza dos
metadados sobe junto e a hierarquia entre texto e metadado fica mais nítida
numa tela de editor, onde se olha por muito mais tempo que numa tela de
boot.

## Changelog

Ver [CHANGELOG.md](CHANGELOG.md).

## Licença

MIT — ver [LICENSE](LICENSE).
