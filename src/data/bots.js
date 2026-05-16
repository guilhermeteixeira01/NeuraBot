export const BOTS = [
  {
    id: 1,
    name: "Neura Bot",
    tag: "Multifuncional",
    color: "#00d4ff",
    glow: "#00d4ff44",
    icon: "🤖",
    desc: "O bot completo e totalmente configurável para o seu servidor Discord. Personalize cada detalhe do sistema de tickets, anúncios com embed e boas-vindas do jeito que você quiser.",
    stats: [
      { label: "Servidores", value: "1.2K+" },
      { label: "Usuários Atendidos", value: "800K+" },
      { label: "Uptime", value: "99.9%" },
    ],
    features: [
      {
        icon: "🎫",
        label: "Sistema de Tickets",
        desc: "Suporte organizado com abertura, gerenciamento e fechamento de tickets. Configure canais, cargos de suporte, mensagens e categorias do jeito que precisar.",
      },
      {
        icon: "📢",
        label: "Anúncios com Embed",
        desc: "Crie anúncios profissionais com embeds totalmente personalizáveis — cor, título, descrição, imagem, rodapé e muito mais.",
      },
      {
        icon: "👋",
        label: "Boas-Vindas",
        desc: "Receba novos membros com mensagens automáticas e personalizadas. Configure canal, imagem, texto e mencione o membro como quiser.",
      },
    ],
    configurable: true,
    commands: ["/painel-config", "/anuncio", "/editaranuncio"],
  },
];