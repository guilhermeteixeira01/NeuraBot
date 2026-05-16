# Neura Bot — Site de Bots Discord

Site futurista construído em React + Vite para apresentar a suíte de bots Neura Bot.

---

## Estrutura do Projeto

```
Neura Bot/
├── index.html                    # HTML raiz
├── vite.config.js                # Configuração do Vite
├── package.json
│
└── src/
    ├── main.jsx                  # Entry point React
    ├── App.jsx                   # Root: Scanline + Navbar + Pages + Footer
    │
    ├── styles/
    │   └── global.css            # CSS global, fontes, animações, botões
    │
    ├── data/
    │   ├── bots.js               # Array dos 4 bots (nome, cor, stats, comandos)
    │   ├── plans.js              # Array dos planos de preço
    │   └── site.js              # Stats gerais, features, nav links, footer cols
    │
    ├── hooks/
    │   ├── useScrollY.js         # Hook — scroll position para Navbar
    │   └── useCursorBlink.js     # Hook — cursor piscante no console
    │
    ├── components/
    │   ├── ui/                   # Componentes visuais reutilizáveis
    │   │   ├── Scanline.jsx      # Overlay de linhas de CRT
    │   │   ├── ParticleField.jsx # Canvas com partículas animadas
    │   │   ├── Console3D.jsx     # Terminal 3D perspectivado e interativo
    │   │   ├── BotCard.jsx       # Card individual de bot
    │   │   └── SectionLabel.jsx  # Eyebrow label das seções
    │   │
    │   ├── layout/               # Estrutura global da página
    │   │   ├── Navbar.jsx        # Barra de navegação fixa com scroll-aware
    │   │   └── Footer.jsx        # Rodapé com colunas de links
    │   │
    │   └── sections/             # Seções da landing page
    │       ├── HeroSection.jsx   # Hero com mascote, partículas e CTA
    │       ├── StatsBar.jsx      # Faixa de números gerais
    │       ├── BotsSection.jsx   # Cards dos bots + console 3D
    │       ├── FeaturesSection.jsx # Grid de features de infraestrutura
    │       ├── PlansSection.jsx  # Tabela de planos
    │       └── CTASection.jsx    # Call-to-action final
    │
    └── pages/
        └── HomePage.jsx          # Compõe todas as sections em ordem
```

---

## Como Rodar

```bash
# 1. Instalar dependências
npm install

# 2. Copiar imagens do bot para /public
cp bot.png public/
cp bot_sem_efeito.png public/

# 3. Iniciar servidor de desenvolvimento
npm run dev

# 4. Build para produção
npm run build
```

---

## Adicionando um Novo Bot

Edite `src/data/bots.js` e adicione um novo objeto ao array `BOTS`:

```js
{
  id: 5,
  name: "Neura Bot Stats",
  tag: "Analítica",
  color: "#ec4899",
  glow: "#ec489944",
  icon: "📈",
  desc: "Acompanhe o crescimento do seu servidor com dashboards detalhados.",
  stats: [
    { label: "Gráficos", value: "50+" },
    { label: "Métricas", value: "200+" },
    { label: "Precisão", value: "100%" },
  ],
  commands: ["/stats", "/graph", "/report", "/export"],
}
```

---

## Adicionando uma Nova Página

1. Crie `src/pages/NovaPagina.jsx`
2. Importe e renderize em `App.jsx` (ou configure um router como `react-router-dom`)

```bash
npm install react-router-dom
```

---

## Tecnologias

- **React 18** — UI
- **Vite 5** — Build tool
- **CSS puro** — Sem frameworks CSS externos
- **Canvas API** — Campo de partículas animadas
- **Orbitron + Sora** — Google Fonts
