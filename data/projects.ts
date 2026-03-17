export type Project = {
  slug: string
  title: string
  description: string
  longDescription?: string
  tech: string[]
  github: string
  live: string
  download?: string
  version?: string
  isMobile?: boolean
  wip?: boolean
  /** Controls how the detail page renders the gallery */
  displayMode?: "desktop" | "mobile" | "multiplatform"
  images: string[]
  desktopImages?: string[]
  mobileImages?: string[]
  combinedImage?: string
}

export const projects: Project[] = [
  {
    slug: "costanza",
    title: "Costanza",
    description:
      "O Costanza foi criado com o intuito de dominar linguagens de programação através de desafios, conquistar ranks, ganhar XP e compartilhar seus projetos com uma comunidade de desenvolvedores.",
    longDescription: "Uma plataforma de gamificação para aprendizagem de programação. Os usuários podem participar de desafios de código em diversas linguagens, subir em um ranking global, ganhar pontos de experiência (XP) e interagir em uma comunidade amigável para desenvolvedores. O frontend conta com interfaces ricas e interativas, enquanto o backend garante que cada execução de código ocorra em um ambiente seguro.",
    tech: ["Next.js", "TypeScript", "React", "Tailwind CSS"],
    github: "https://github.com/santtitoz/costanza",
    live: "https://costanza-taupe.vercel.app",
    displayMode: "desktop",
    images: [
      "/costanza/image-2.png",
      "/costanza/image-1.png",
      "/costanza/image-3.png",
      "/costanza/image-4.png",
      "/costanza/image-5.png",
    ],
  },
  {
    slug: "barbearia-pontes",
    title: "Barbearia Pontes",
    description:
      "Landing page moderna para barbearia com informações sobre serviços, agendamentos e exibição de portfólio. Desenvolvida para transmitir a experiência de um ambiente premium.",
    longDescription: "Uma landing page completamente customizada e desenhada para reter clientes e aumentar o número de agendamentos. A página possui detalhes completos sobre os serviços prestados, horários de funcionamento, uma galeria de fotos do ambiente e integração simples para agendamentos via WhatsApp. A interface é fluida e responsiva, oferecendo a melhor experiência tanto no desktop quanto no celular.",
    tech: ["React", "Next.js", "Tailwind CSS"],
    github: "https://github.com/santtitoz/barbeariav2",
    live: "https://barbeariapontes.vercel.app/",
    displayMode: "desktop",
    images: [
      "/barbearia-pontes.png",
      "/barbearia/image-1.png",
      "/barbearia/image-2.png",
      "/barbearia/image-3.png",
    ],
  },
  {
    slug: "vitaly",
    title: "Vitaly",
    description:
      "Aplicação multiplataforma para conciliar e reordenar a rotina com estudos, alimentação e sono para melhores resultados, com dicas e insights de IA.",
    longDescription:
      "O Vitaly é uma plataforma multiplataforma em desenvolvimento que une ciência e tecnologia para ajudar o usuário a alcançar sua melhor versão. No desktop, a versão completa oferece dashboards detalhados para monitorar sono, hidratação, nutrição, treinos e estudos, com correlações entre as métricas e análises semanais. No mobile, a versão resumida foca no acompanhamento do dia a dia de forma rápida e prática. Com o auxílio de IA integrada, o app oferece dicas personalizadas e reordenação inteligente da rotina para maximizar foco, energia e resultados.",
    tech: ["React", "Next.js", "TypeScript", "Capacitor", "Tailwind CSS", "IA"],
    github: "#",
    live: "#",
    isMobile: true,
    wip: true,
    displayMode: "multiplatform",
    images: ["/vitaly/vitaly-summary.png"],
    desktopImages: [
      "/vitaly/image-5.png",
      "/vitaly/image-1.png",
      "/vitaly/image-2.png",
      "/vitaly/image-3.png",
      "/vitaly/image-4.png",
    ],
    mobileImages: [
      "/vitaly/mobile-1.png",
      "/vitaly/mobile-2.png",
      "/vitaly/mobile-3.png",
      "/vitaly/mobile-4.png",
      "/vitaly/mobile-5.png",
    ],
    combinedImage: "/vitaly/showcase.png",
  },
  {
    slug: "lift",
    title: "Lift",
    description:
      "Aplicativo mobile focado em melhorar o desempenho e a progressão de treinos. Registre séries, acompanhe evolução e mantenha sua consistência na academia.",
    longDescription:
      "O Lift é um aplicativo mobile construído com React Native e Capacitor, voltado para atletas e entusiastas da musculação que querem levar seus treinos a sério. O app permite criar tabelas de treino personalizadas (Push, Pull, Legs e muito mais), registrar séries e cargas em tempo real, e visualizar análises detalhadas de progressão muscular com gráficos interativos. O sistema de gamificação com níveis, ofensivas e ranking mantém a motivação em alta. Disponível para download diretamente no Android.",
    tech: ["React Native", "Capacitor", "TypeScript", "Tailwind CSS"],
    github: "#",
    live: "#",
    download: "/lift/app-debug.apk",
    version: "0.1.367",
    isMobile: true,
    displayMode: "mobile",
    images: ["/lift/lift-summary.png"],
    mobileImages: [
      "/lift/mobile-1.jpg",
      "/lift/mobile-2.jpg",
      "/lift/mobile-3.jpg",
      "/lift/mobile-4.jpg",
      "/lift/mobile-5.jpg",
    ],
  },
]
