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
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 z-10 w-[30%] max-w-[40px] h-[10px] bg-zinc-800 rounded-full" />
        <img src={src} alt={alt} className="w-full h-auto block" loading="lazy" />
      </div>
      <div className="absolute left-[-3px] top-[20%] w-[3px] h-[8%] bg-zinc-700 rounded-l-sm hidden sm:block" />
      <div className="absolute left-[-3px] top-[30%] w-[3px] h-[8%] bg-zinc-700 rounded-l-sm hidden sm:block" />
      <div className="absolute right-[-3px] top-[25%] w-[3px] h-[12%] bg-zinc-700 rounded-r-sm hidden sm:block" />
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
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX)

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const dist = touchStart - touchEnd
    if (images.length > 1) {
      if (dist > 50) setIdx((i) => (i + 1) % images.length) // swipe left
      if (dist < -50) setIdx((i) => (i - 1 + images.length) % images.length) // swipe right
    }
  }

  return (
    <div>
      <div 
        className="relative group rounded-2xl overflow-hidden border border-border/30 bg-muted/10 flex items-center justify-center bg-zinc-900/40 touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img key={idx} src={images[idx]} alt={`screenshot ${idx + 1}`} className="w-full max-h-[70vh] object-contain block select-none pointer-events-none" draggable={false} />
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
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX)

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const dist = touchStart - touchEnd
    if (images.length > 1) {
      if (dist > 50) setIdx((i) => (i + 1) % images.length)
      if (dist < -50) setIdx((i) => (i - 1 + images.length) % images.length)
    }
  }

  return (
    <div>
      <div className="flex justify-center">
        <div 
          className="relative group touch-pan-y" 
          style={{ width }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="select-none pointer-events-none" draggable={false}>
            <PhoneFrame src={images[idx]} alt={`mobile ${idx + 1}`} />
          </div>
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
            <Download size={16} /> 
            Baixar APK 
            {project.version && <span className="opacity-80 font-normal">v{project.version}</span>}
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

      {/* ════════ MOBILE: two-column hero ════════ */}
      {mode === "mobile" && (
        <section className="container max-w-6xl mx-auto px-6 pt-36 pb-16">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            {/* LEFT: preview */}
            <div className="w-full lg:w-auto lg:shrink-0 flex justify-center">
              {project.mobileImages && (
                <MobileCarousel images={project.mobileImages} width="260px" />
              )}
            </div>

            {/* RIGHT: title + info */}
            <div className="flex-1 min-w-0 space-y-8">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-medium">
                  <Smartphone size={13} />
                  <span>Mobile</span>
                </div>
                {project.wip && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-blue-500 dark:bg-blue-400" />
                    Em Desenvolvimento
                  </div>
                )}
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-tight mb-4 break-words">{project.title}</h1>
                <p className="text-lg text-muted-foreground font-light leading-relaxed">{project.description}</p>
              </div>

              {project.wip && (
                <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0 bg-blue-500 dark:bg-blue-400" />
                  <span>Projeto em andamento — as telas são protótipos do design.</span>
                </div>
              )}

              <InfoBlock project={project} />
            </div>
          </div>
        </section>
      )}

      {/* ════════ MULTIPLATFORM: title -> visuals -> info ════════ */}
      {mode === "multiplatform" && (
        <section className="pt-36 pb-16">
          <div className="container max-w-4xl mx-auto px-6 text-center mb-16">
            {/* Badges */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-medium">
                <Smartphone size={13} />
                <span>Multiplataforma</span>
              </div>
              {project.wip && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-blue-500 dark:bg-blue-400" />
                  Em Desenvolvimento
                </div>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-tight mb-6 break-words">{project.title}</h1>
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-6">{project.description}</p>
            
            {project.wip && (
              <div className="inline-flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm mx-auto bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0 bg-blue-500 dark:bg-blue-400" />
                <span>Projeto em andamento — as telas são protótipos do design.</span>
              </div>
            )}
          </div>

          <div className="container max-w-6xl mx-auto px-6 mb-16">
            <div className="grid grid-cols-[70px_1fr] sm:grid-cols-[90px_1fr] md:grid-cols-[130px_1fr] lg:grid-cols-[180px_1fr] gap-4 sm:gap-6 lg:gap-12 items-start justify-center max-w-5xl mx-auto">
              {project.mobileImages && (
                <div className="min-w-0 flex flex-col items-center">
                  <div className="flex flex-col xl:flex-row items-center gap-1 xl:gap-2 mb-3 lg:mb-4 text-xs lg:text-sm text-muted-foreground w-full justify-center">
                    <div className="flex items-center gap-1.5"><Smartphone size={14} /> <span className="font-medium">Mobile</span></div>
                    <span className="text-[10px] lg:text-xs opacity-60 text-center xl:text-left hidden md:block">— Dia a dia</span>
                  </div>
                  <div className="w-full max-w-[220px]">
                    <MobileCarousel images={project.mobileImages} width="100%" />
                  </div>
                </div>
              )}
              {project.desktopImages && (
                <div className="min-w-0">
                  <div className="flex flex-col xl:flex-row items-start xl:items-center gap-1 xl:gap-2 mb-3 lg:mb-4 text-xs lg:text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5"><Monitor size={14} /> <span className="font-medium">Desktop</span></div>
                    <span className="text-[10px] lg:text-xs opacity-60 hidden md:block">— Ferramenta avançada</span>
                  </div>
                  <DesktopCarousel images={project.desktopImages} />
                </div>
              )}
            </div>
          </div>

          <div className="container max-w-4xl mx-auto px-6">
            <div className="pt-10 border-t border-border/30">
              <InfoBlock project={project} />
            </div>
          </div>
        </section>
      )}

      {/* ════════ DESKTOP: Side-by-side layout (Visuals Left, Info Right) ════════ */}
      {mode === "desktop" && (
        <section className="container max-w-[90rem] mx-auto px-6 pt-36 pb-16">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
            {/* LEFT: preview */}
            <div className="w-full lg:flex-[1.5] min-w-0">
              <DesktopCarousel images={project.images} />
            </div>

            {/* RIGHT: title + info */}
            <div className="w-full lg:flex-1 min-w-0 space-y-8">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-medium">
                  <Monitor size={13} />
                  <span>Desktop</span>
                </div>
                {project.wip && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-blue-500 dark:bg-blue-400" />
                    Em Desenvolvimento
                  </div>
                )}
              </div>
              
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-4 break-words">{project.title}</h1>
                <p className="text-lg text-muted-foreground font-light leading-relaxed">{project.description}</p>
              </div>

              {project.wip && (
                <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0 bg-blue-500 dark:bg-blue-400" />
                  <span>Projeto em andamento — as telas são protótipos do design.</span>
                </div>
              )}

              <InfoBlock project={project} />
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
