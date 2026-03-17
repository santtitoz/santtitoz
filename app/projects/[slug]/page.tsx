"use client"

import { projects } from "@/data/projects"
import { notFound } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft, ExternalLink, Github, Smartphone,
  Download, ArrowUpRight, Monitor, ChevronLeft, ChevronRight,
} from "lucide-react"
import { useState, use } from "react"

/* ─── Phone Frame ─── */
function PhoneFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative bg-zinc-900 rounded-[0.75rem] p-[3px] shadow-xl shadow-black/50 ring-1 ring-white/10 w-full">
      <div className="bg-black rounded-[0.6rem] overflow-hidden relative">
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 z-10 w-10 h-2.5 bg-zinc-800 rounded-full" />
        <img src={src} alt={alt} className="w-full h-auto block" loading="lazy" />
      </div>
      <div className="absolute left-[-3px] top-[90px] w-[3px] h-8 bg-zinc-700 rounded-l-sm" />
      <div className="absolute left-[-3px] top-[132px] w-[3px] h-8 bg-zinc-700 rounded-l-sm" />
      <div className="absolute right-[-3px] top-[112px] w-[3px] h-14 bg-zinc-700 rounded-r-sm" />
    </div>
  )
}

/* ─── Dot Indicators ─── */
function Dots({ total, current, onChange }: { total: number; current: number; onChange: (i: number) => void }) {
  return (
    <div className="flex justify-center gap-2 mt-3">
      {Array.from({ length: total }).map((_, i) => (
        <button key={i} onClick={() => onChange(i)} aria-label={`Imagem ${i + 1}`}
          className={`rounded-full transition-all duration-300 ${i === current ? "w-5 h-2 bg-foreground" : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground"}`}
        />
      ))}
    </div>
  )
}

/* ─── Desktop Carousel ─── */
function DesktopCarousel({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0)
  return (
    <div>
      <div className="relative group rounded-2xl overflow-hidden border border-border/30 bg-muted/10">
        <img key={idx} src={images[idx]} alt={`screenshot ${idx + 1}`} className="w-full h-auto block" />
        {images.length > 1 && (
          <>
            <button onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-background/80 border border-border/40 hover:bg-background transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-sm shadow">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => setIdx((i) => (i + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-background/80 border border-border/40 hover:bg-background transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-sm shadow">
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>
      {images.length > 1 && <Dots total={images.length} current={idx} onChange={setIdx} />}
    </div>
  )
}

/* ─── Mobile Carousel (phone frame) ─── */
function MobileCarousel({ images, width = "240px" }: { images: string[]; width?: string }) {
  const [idx, setIdx] = useState(0)
  return (
    <div>
      <div className="flex justify-center">
        <div className="relative group" style={{ width }}>
          <PhoneFrame src={images[idx]} alt={`mobile ${idx + 1}`} />
          {images.length > 1 && (
            <>
              <button onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}
                className="absolute left-[-16px] top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/80 border border-border/40 hover:bg-background transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-sm shadow z-10">
                <ChevronLeft size={13} />
              </button>
              <button onClick={() => setIdx((i) => (i + 1) % images.length)}
                className="absolute right-[-16px] top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/80 border border-border/40 hover:bg-background transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-sm shadow z-10">
                <ChevronRight size={13} />
              </button>
            </>
          )}
        </div>
      </div>
      {images.length > 1 && <Dots total={images.length} current={idx} onChange={setIdx} />}
    </div>
  )
}

/* ─── Info block (about + tech) ─── */
function InfoBlock({ project }: { project: ReturnType<typeof projects.find> }) {
  if (!project) return null
  return (
    <div className="space-y-10">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Sobre o Projeto</h3>
        <p className="text-foreground/80 leading-relaxed font-light text-base">
          {project.longDescription || project.description}
        </p>
      </div>
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Tecnologias</h3>
        <div className="flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <span key={tech} className="px-3 py-1.5 text-xs font-semibold font-mono text-foreground bg-muted/50 rounded-lg border border-border/50 uppercase tracking-wider">
              {tech}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-3 pt-2">
        {project.live !== "#" && (
          <a href={project.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-full text-sm font-medium hover:bg-foreground/90 transition-colors">
            Acessar <ArrowUpRight size={16} />
          </a>
        )}
        {project.download && project.download !== "#" && (
          <a href={project.download} download className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 shadow-lg shadow-primary/20">
            <Download size={16} /> Baixar APK
          </a>
        )}
      </div>
    </div>
  )
}

/* ──────────────────── Main Page ──────────────────── */
export default function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const project = projects.find((p) => p.slug === slug)
  if (!project) notFound()

  const mode = project.displayMode ?? "desktop"

  return (
    <div className="min-h-screen bg-background pb-24">

      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40">
        <div className="container max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/#projects" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Voltar para Projetos</span>
          </Link>
          <div className="flex items-center gap-2">
            {project.github !== "#" && (
              <a href={project.github} target="_blank" rel="noreferrer" className="p-2 text-muted-foreground hover:text-foreground transition-colors"><Github size={20} /></a>
            )}
            {project.live !== "#" && (
              <a href={project.live} target="_blank" rel="noreferrer" className="p-2 text-muted-foreground hover:text-foreground transition-colors"><ExternalLink size={20} /></a>
            )}
          </div>
        </div>
      </nav>

      {/* ════════ MOBILE / MULTIPLATFORM: two-column hero ════════ */}
      {(mode === "mobile" || mode === "multiplatform") && (
        <section className="container max-w-6xl mx-auto px-6 pt-36 pb-16">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">

            {/* LEFT: preview */}
            <div className="w-full lg:w-auto lg:shrink-0">

              {/* Mobile-only: single phone carousel */}
              {mode === "mobile" && project.mobileImages && (
                <MobileCarousel images={project.mobileImages} width="260px" />
              )}

              {/* Multiplatform: showcase image wide */}
              {mode === "multiplatform" && project.combinedImage && (
                <div className="rounded-2xl overflow-hidden border border-border/20 bg-muted/5 max-w-[540px] w-full">
                  <img src={project.combinedImage} alt={`${project.title} showcase`} className="w-full h-auto block" />
                </div>
              )}

            </div>

            {/* RIGHT: title + info */}
            <div className="flex-1 min-w-0 space-y-8">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {project.isMobile && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-medium">
                    <Smartphone size={13} />
                    <span>{mode === "multiplatform" ? "Multiplataforma" : "Mobile"}</span>
                  </div>
                )}
                {project.wip && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    Em Desenvolvimento
                  </div>
                )}
              </div>

              <div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-4">{project.title}</h1>
                <p className="text-lg text-muted-foreground font-light leading-relaxed">{project.description}</p>
              </div>

              {project.wip && (
                <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400/80 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
                  <span>Projeto em andamento — as telas são protótipos do design.</span>
                </div>
              )}

              <InfoBlock project={project} />
            </div>
          </div>

          {/* Multiplatform: desktop carousel below the hero + mobile individual carousel */}
          {mode === "multiplatform" && project.desktopImages && project.mobileImages && (
            <div className="mt-16 space-y-10">
              <div>
                <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                  <Monitor size={15} /> <span className="font-medium">Desktop</span>
                  <span className="text-xs opacity-60">— Ferramenta avançada</span>
                </div>
                <DesktopCarousel images={project.desktopImages} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                  <Smartphone size={15} /> <span className="font-medium">Mobile</span>
                  <span className="text-xs opacity-60">— Dia a dia</span>
                </div>
                <MobileCarousel images={project.mobileImages} width="200px" />
              </div>
            </div>
          )}
        </section>
      )}

      {/* ════════ DESKTOP: full-width gallery + info below ════════ */}
      {mode === "desktop" && (
        <>
          {/* Title section */}
          <section className="pt-40 pb-10 px-6 text-center">
            <div className="container max-w-3xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-6">{project.title}</h1>
              <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-10">{project.description}</p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                {project.live !== "#" && (
                  <a href={project.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full font-medium hover:bg-foreground/90 transition-colors">
                    Acessar Projeto <ArrowUpRight size={18} />
                  </a>
                )}
              </div>
            </div>
          </section>

          {/* Gallery */}
          <section className="container max-w-5xl mx-auto px-6">
            <DesktopCarousel images={project.images} />
          </section>

          {/* Info below */}
          <section className="container max-w-5xl mx-auto px-6 mt-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-border/30 pt-12">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Sobre o Projeto</h3>
                <p className="text-foreground/80 leading-relaxed font-light text-lg">{project.longDescription || project.description}</p>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Tecnologias Utilizadas</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span key={tech} className="px-3 py-1.5 text-xs font-semibold font-mono text-foreground bg-muted/50 rounded-lg border border-border/50 uppercase tracking-wider">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
      )}

    </div>
  )
}
