"use client"

import { useState, useEffect, useRef } from "react"
import { Github, ArrowUpRight, Smartphone, Monitor, Layers } from "lucide-react"
import Link from "next/link"
import { projects, Project } from "@/data/projects"

const PLATFORM_BADGE: Record<string, { label: string; icon: React.ReactNode }> = {
  mobile:        { label: "Mobile",          icon: <Smartphone size={10} /> },
  desktop:       { label: "Desktop",         icon: <Monitor size={10} /> },
  multiplatform: { label: "Multiplataforma", icon: <Layers size={10} /> },
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )
    if (cardRef.current) observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [])

  const platform = project.displayMode ? PLATFORM_BADGE[project.displayMode] : null

  return (
    <div
      ref={cardRef}
      className={`group relative flex flex-col bg-muted/20 border border-border/30 rounded-[2.5rem] p-6 lg:p-8 overflow-hidden hover:border-primary/20 hover:bg-muted/30 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Link href={`/projects/${project.slug}`} className="absolute inset-0 z-10" aria-label={`Ver detalhes de ${project.title}`} />

      {/* Header with Title and Links */}
      <div className="flex justify-between items-start mb-6">
        <div>
          {/* Title row + badges */}
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-2xl font-bold text-foreground leading-tight tracking-tight">{project.title}</h3>

            {/* Platform badge – black */}
            {platform && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-foreground text-background">
                {platform.icon}
                {platform.label}
              </span>
            )}

            {/* WIP badge */}
            {project.wip && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-blue-500 dark:bg-blue-400" />
                Em Dev
              </span>
            )}
          </div>

          {/* Tech badges */}
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => {
              const isAI = tech.toLowerCase() === "ia"
              return (
                <span
                  key={tech}
                  className={
                    isAI
                      ? "px-2.5 py-1 text-[10px] font-bold font-mono uppercase tracking-wider rounded-lg bg-foreground text-background"
                      : "px-2.5 py-1 text-[10px] font-medium font-mono text-muted-foreground bg-background/50 rounded-lg border border-border/40 uppercase tracking-wider"
                  }
                >
                  {tech}
                </span>
              )
            })}
          </div>
        </div>

        <div className="flex gap-2 relative z-20">
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
      <div className="relative w-full rounded-2xl overflow-hidden border border-border/30 bg-background/50 transition-all duration-500">
        <img
          src={project.images[0]}
          alt={project.title}
          className="w-full h-auto object-contain"
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
