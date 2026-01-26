"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowDown } from "lucide-react"
import dynamic from 'next/dynamic'

// Carregamento dinâmico para evitar problemas de SSR com Three.js
const RubiksCube3D = dynamic(
  () => import('./rubiks-cube-3d').then((mod) => mod.RubiksCube3D),
  { ssr: false }
)
import { TypedCode } from "./typed-code"

const HackerText = ({ text, className }: { text: string; className?: string }) => {
  const [displayText, setDisplayText] = useState(text)
  const [isHovering, setIsHovering] = useState(false)
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"

  const onMouseEnter = () => {
    if (isHovering) return
    setIsHovering(true)

    let iteration = 0
    const interval = setInterval(() => {
      setDisplayText(prev =>
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index]
            }
            return letters[Math.floor(Math.random() * letters.length)]
          })
          .join("")
      )

      if (iteration >= text.length) {
        clearInterval(interval)
        setIsHovering(false)
      }

      iteration += 1 / 3
    }, 30)
  }

  return (
    <span
      onMouseEnter={onMouseEnter}
      className={`cursor-default inline-block ${className}`}
    >
      {displayText}
    </span>
  )
}

// Componente Leme de Pontos (Interactive Dots)
const DotWheel = ({ rotation, onRotate }: { rotation: number; onRotate: (deg: number) => void }) => {
  const [isDragging, setIsDragging] = useState(false)
  const wheelRef = useRef<HTMLDivElement>(null)

  // Refs para capturar estado inicial do drag
  const startAngle = useRef(0)
  const startRotation = useRef(0)

  const getAngle = (clientX: number, clientY: number) => {
    if (!wheelRef.current) return 0
    const rect = wheelRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2

    return Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI)
  }

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    if (!wheelRef.current) return
    setIsDragging(true)

    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY

    startAngle.current = getAngle(clientX, clientY)
    startRotation.current = rotation
  }

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return

      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY

      const currentAngle = getAngle(clientX, clientY)
      const delta = currentAngle - startAngle.current

      onRotate(startRotation.current + delta)
    }

    const handleEnd = () => setIsDragging(false)

    if (isDragging) {
      window.addEventListener("mousemove", handleMove)
      window.addEventListener("mouseup", handleEnd)
      window.addEventListener("touchmove", handleMove, { passive: false })
      window.addEventListener("touchend", handleEnd)
    }

    return () => {
      window.removeEventListener("mousemove", handleMove)
      window.removeEventListener("mouseup", handleEnd)
      window.removeEventListener("touchmove", handleMove)
      window.removeEventListener("touchend", handleEnd)
    }
  }, [isDragging, onRotate])

  return (
    <div
      ref={wheelRef}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
      className={`absolute top-0 right-0 p-10 cursor-pointer z-50 text-foreground/20 hover:text-foreground/60 transition-colors duration-300 ${isDragging ? "text-foreground/80 cursor-grabbing" : ""}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Visual de Pontos (Cross Pattern) */}
      <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="2" />
        <circle cx="4" cy="12" r="2" />
        <circle cx="20" cy="12" r="2" />
        <circle cx="12" cy="4" r="2" />
        <circle cx="12" cy="20" r="2" />
      </svg>
    </div>
  )
}

export function Hero() {
  const [isVisible, setIsVisible] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [showCube, setShowCube] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="home" className="min-h-screen py-24 flex items-center justify-center relative overflow-hidden bg-background">

      {/* Background Glow Minimalista */}
      <div className="absolute inset-0 -z-10 pointer-events-none opacity-40">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-zinc-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="container max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">

        {/* Bento Card 1: Texto Minimalista (Ocupa 7 colunas) */}
        <div className={`col-span-1 lg:col-span-7 bg-muted/20 backdrop-blur-md border border-border/30 rounded-[2.5rem] p-8 sm:p-14 flex flex-col justify-center items-start text-left relative overflow-hidden transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}>

          {/* Leme de Pontos Interativo (Ocupa o lugar dos pontos estáticos) */}
          <DotWheel rotation={rotation} onRotate={setRotation} />

          {/* Badge Minimalista */}
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-background border border-border/40 shadow-sm text-foreground/80 text-[10px] font-mono font-medium tracking-widest uppercase selection:bg-primary/20">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
            </span>
            Design Engineer • 2026
          </div>

          {/* Título Monospace Interativo */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-mono tracking-tighter mb-8 leading-[0.9] text-foreground select-none z-10 uppercase flex flex-col items-start">
            <HackerText text="ELIABI" />
            <div className="flex items-baseline">
              <HackerText text="SANTOS" />
              <span className="text-primary animate-pulse ml-1">_</span>
            </div>
          </h1>

          {/* Descrição Refinada */}
          <p className="text-base sm:text-lg text-muted-foreground mb-12 max-w-lg leading-relaxed font-mono font-light tracking-tight z-10">
            Combinando a <span className="text-foreground font-medium border-b border-primary/30">precisão da engenharia</span> com a <span className="text-foreground font-medium border-b border-primary/30">alma do design</span>.
            Construo interfaces digitais imersivas que definem o futuro da web.
          </p>

          {/* Botões Bento Style */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto z-10">
            <Button
              size="lg"
              onClick={scrollToProjects}
              className="h-14 px-8 rounded-2xl text-sm font-bold font-mono uppercase tracking-wider bg-foreground text-background hover:bg-foreground/80 shadow-sm transition-all duration-300 hover:scale-[1.02]"
            >
              Explorar Trabalho
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
              className="h-14 px-8 rounded-2xl text-sm font-bold font-mono uppercase tracking-wider border-border/60 hover:bg-background/80 transition-all duration-300 hover:scale-[1.02]"
            >
              Conhecer Jornada
            </Button>
          </div>
        </div>

        {/* Bento Card 2: Cubo Mágico 3D (Ocupa 5 colunas) */}
        <div className={`col-span-1 lg:col-span-5 bg-muted/30 backdrop-blur-md border border-border/30 rounded-[2.5rem] relative overflow-hidden flex items-center justify-center min-h-[500px] lg:min-h-[auto] transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}>
          {/* Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50 pointer-events-none" />

          <div className="w-full h-full absolute inset-0 flex items-center justify-center">

            {/* Conditional Rendering: Code vs Cube */}
            {!showCube ? (
              <div className="w-full h-full animate-in fade-in zoom-in duration-500">
                <TypedCode onComplete={() => setShowCube(true)} />
              </div>
            ) : (
              <div className="w-full h-full animate-in fade-in zoom-in duration-1000">
                <RubiksCube3D />
                {/* Interactive Hint - Só aparece com o cubo */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-background/20 backdrop-blur-md border border-white/10 text-[10px] font-mono tracking-widest text-muted-foreground uppercase pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-700 delay-500 fill-mode-both">
                  Drag to Rotate
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Scroll Indicator Minimalista */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-30 hover:opacity-100 transition-opacity cursor-pointer text-xs uppercase tracking-widest flex flex-col items-center gap-2" onClick={scrollToProjects}>
        <span className="text-[10px]">Scroll</span>
        <ArrowDown size={14} className="animate-bounce" />
      </div>

    </section>
  )
}
