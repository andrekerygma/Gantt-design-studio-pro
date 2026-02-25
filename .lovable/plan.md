

## Mapa Cronológico Interativo — Editor e Exportador

### Visão Geral
Um editor visual de mapas cronológicos no estilo Gantt, onde o usuário monta um gráfico de barras horizontais (períodos críticos e revisões) ao longo dos 12 meses do ano, podendo personalizar tudo e exportar como imagem.

---

### Página Principal — Editor + Visualização

**Área de Visualização (Preview)**
- Renderização SVG do mapa cronológico, fiel ao estilo do exemplo (fundo verde claro, barras coloridas, eixo de meses Jan–Dez)
- Cada categoria é uma linha horizontal com dois tipos de segmento: "Período Crítico" (barra com traços/hachurado) e "Revisão do PlaCon" (barra sólida)
- Legenda automática gerada abaixo do gráfico
- Título editável diretamente no topo (clique para editar inline)

**Painel de Edição (Sidebar/Painel lateral)**
- **Título do gráfico**: campo de texto editável
- **Gerenciamento de categorias**: lista de categorias com botões para adicionar nova e remover existente
- Para cada categoria:
  - Nome editável (ex: "Hidrológico")
  - Seletor de cor da barra
  - Lista de períodos (cada um com data início, data fim e tipo: "Período Crítico" ou "Revisão")
  - Botão para adicionar/remover períodos dentro da categoria

**Interação**
- Todas as alterações refletem em tempo real na visualização SVG
- Dados salvos automaticamente no localStorage do navegador

---

### Exportação
- Botões de exportação no topo: **SVG**, **PNG** e **JPEG**
- Ao exportar PNG/JPEG, o SVG é convertido para canvas e depois para imagem com boa resolução
- Download automático do arquivo

---

### Design
- Estilo visual verde claro inspirado no exemplo original (fundo #E8F5E9, textos em verde escuro)
- Layout responsivo com painel de edição colapsável em telas menores
- Interface limpa e intuitiva, sem necessidade de backend

