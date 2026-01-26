"use client"

import { useState, useEffect, useRef } from "react"
import { ExternalLink, Github, ArrowUpRight } from "lucide-react"

type Project = {
  title: string
  description: string
  tech: string[]
  github: string
  live: string
  images: string[]
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={cardRef}
      className={`group flex flex-col bg-muted/20 backdrop-blur-md border border-border/30 rounded-[2.5rem] p-6 lg:p-8 overflow-hidden hover:border-primary/20 hover:bg-muted/30 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Header with Title and Links */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-bold text-foreground leading-tight tracking-tight mb-2">{project.title}</h3>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 text-[10px] font-medium font-mono text-muted-foreground bg-background/50 rounded-lg border border-border/40 uppercase tracking-wider"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          {project.github !== "#" && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-background border border-border/40 text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:bg-background/80 transition-all duration-300"
              title="View Code"
            >
              <Github size={18} />
            </a>
          )}
          {project.live !== "#" && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 group-hover:rotate-45"
              title="Visit Site"
            >
              <ArrowUpRight size={18} />
            </a>
          )}
        </div>
      </div>

      {/* Project Image Area */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border/30 bg-background/50 transition-all duration-500">
        <img
          src={project.images[0]}
          alt={project.title}
          className="w-full h-full object-cover object-top transition-transform duration-700"
        />
      </div>

      {/* Description */}
      <div className="mt-6">
        <p className="text-muted-foreground text-sm leading-relaxed font-normal line-clamp-3 group-hover:text-foreground/80 transition-colors">
          {project.description}
        </p>
      </div>

    </div>
  )
}

export function Projects() {
  const projects = [
    {
      title: "Costanza",
      description:
        "O Costanza foi criado com o intuito de dominar linguagens de programação através de desafios, conquistar ranks, ganhar XP e compartilhar seus projetos com uma comunidade de desenvolvedores.",
      tech: ["Next.js", "TypeScript", "React", "Tailwind CSS"],
      github: "https://github.com/santtitoz/costanza",
      live: "https://costanza-taupe.vercel.app",
      images: [
        "/costanza/image-1.png",
        "/costanza/image-2.png",
        "/costanza/image-3.png",
        "/costanza/image-4.png",
        "/costanza/image-5.png",
      ],
    },
    {
      title: "E-commerce Moderno",
      description:
        "Plataforma completa de e-commerce com carrinho de compras, pagamentos integrados e painel administrativo.",
      tech: ["Next.js", "TypeScript", "React", "Redux"],
      github: "#",
      live: "#",
      images: [
        "/modern-ecommerce-interface.png",
        "/productivity-app-interface.png",
        "/analytics-dashboard.png",
      ],
    },
    {
      title: "Dashboard Analytics",
      description:
        "Dashboard interativo para análise de dados em tempo real com gráficos dinâmicos e métricas de performance.",
      tech: ["React", "Node.js", "Express", "JavaScript"],
      github: "#",
      live: "#",
      images: [
        "/analytics-dashboard.png",
        "/modern-ecommerce-interface.png",
        "/productivity-app-interface.png",
      ],
    },
    {
      title: "App de Produtividade",
      description: "Aplicativo completo para gerenciamento de tarefas, projetos e equipes com sistema de notificações.",
      tech: ["React", "Redux", "JavaScript", "Node.js"],
      github: "#",
      live: "#",
      images: [
        "/productivity-app-interface.png",
        "/analytics-dashboard.png",
        "/modern-ecommerce-interface.png",
      ],
    },
  ]

  return (
    <section id="projects" className="bg-background relative py-20">
      <div className="container max-w-6xl mx-auto px-6 mb-16 text-center">
        <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
          Selected Works
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-light">
          Projetos que definem minha jornada e evolução técnica.
        </p>
      </div>

      <div className="container max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
