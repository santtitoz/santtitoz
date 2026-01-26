"use client"

import { useState, useEffect } from "react"
import { Copy, Check, Github, Linkedin, Mail, MapPin, Code2, Globe, Laptop } from "lucide-react"

export function BentoGrid() {
  const [copied, setCopied] = useState(false)
  const [time, setTime] = useState("")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const copyEmail = () => {
    navigator.clipboard.writeText("esanttitoz@gmail.com")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const techStack = [
    "React", "Next.js", "TypeScript", "Node.js", "Tailwind", "PostgreSQL", "Git"
  ]

  return (
    <section id="about" className="py-24 container max-w-6xl mx-auto px-6">
      <div className={`mb-12 text-center transition-all duration-1000 ${isVisible ? "animate-fade-in-up opacity-100" : "opacity-0 translate-y-10"}`}>
        <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
          Beyond the Code
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-light">
          Um olhar mais profundo sobre quem sou, o que uso e onde estou.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[180px]">

        {/* Card 1: Intro / Bio - Large */}
        <div
          className={`md:col-span-2 row-span-2 bg-muted/30 rounded-3xl p-8 border border-border/40 flex flex-col justify-between group hover:border-primary/20 transition-all duration-1000 delay-100 ${isVisible ? "animate-fade-in-up opacity-100" : "opacity-0 translate-y-10"}`}
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Status: Available</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">Designer & Developer Híbrido</h3>
            <p className="text-muted-foreground leading-relaxed font-light">
              Não sou apenas um programador, sou um criador de produtos.
              Combino a lógica da engenharia com a sensibilidade do design para construir interfaces que não apenas funcionam, mas encantam.
              Apaixonado por performance, micro-interações e código limpo.
            </p>
          </div>
          <div className="flex gap-4 mt-6">
            <div className="px-4 py-2 bg-background rounded-full border border-border/50 text-sm font-medium flex items-center gap-2">
              <Laptop size={14} /> Full Stack
            </div>
            <div className="px-4 py-2 bg-background rounded-full border border-border/50 text-sm font-medium flex items-center gap-2">
              <Globe size={14} /> Remote
            </div>
          </div>
        </div>

        {/* Card 2: Tech Stack - Tall */}
        <div
          className={`row-span-2 bg-foreground text-background rounded-3xl p-6 flex flex-col justify-between overflow-hidden relative transition-all duration-1000 delay-200 ${isVisible ? "animate-fade-in-up opacity-100" : "opacity-0 translate-y-10"}`}
        >
          <div className="z-10">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Code2 className="text-muted-foreground" size={20} /> Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {techStack.map(tech => (
                <span key={tech} className="px-3 py-1.5 bg-background/10 rounded-lg text-xs font-mono border border-white/10 hover:bg-white/20 transition-colors cursor-default">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Decorative Background */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-[80px] opacity-40"></div>
        </div>

        {/* Card 3: Location / Time */}
        <div
          className={`bg-muted/50 rounded-3xl p-6 flex flex-col justify-center items-center text-center border border-border/40 relative overflow-hidden group transition-all duration-1000 delay-300 ${isVisible ? "animate-fade-in-up opacity-100" : "opacity-0 translate-y-10"}`}
        >
          <div className="absolute inset-0 bg-dotted-pattern opacity-10"></div>
          <MapPin className="mb-2 text-primary" size={24} />
          <h3 className="text-2xl font-black font-mono">{time || "00:00"}</h3>
          <p className="text-sm text-muted-foreground mt-1">Brasília, Brasil (GMT-3)</p>
        </div>

        {/* Card 4: GitHub */}
        <a
          href="https://github.com/santtitoz"
          target="_blank"
          className={`bg-black text-white rounded-3xl p-6 flex flex-col justify-center items-center gap-3 cursor-pointer hover:scale-[1.02] transition-all duration-1000 delay-400 ${isVisible ? "animate-fade-in-up opacity-100" : "opacity-0 translate-y-10"}`}
        >
          <Github size={32} />
          <span className="font-bold">Github</span>
        </a>

        {/* Card 5: Email Copy */}
        <div
          className={`md:col-span-2 bg-gradient-to-r from-muted/50 to-muted/10 rounded-3xl p-6 flex items-center justify-between border border-border/40 group cursor-pointer transition-all duration-1000 delay-500 ${isVisible ? "animate-fade-in-up opacity-100" : "opacity-0 translate-y-10"}`}
          onClick={copyEmail}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center shadow-sm">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">Get in touch</p>
              <h3 className="text-lg md:text-xl font-bold">esanttitoz@gmail.com</h3>
            </div>
          </div>

          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${copied ? "bg-green-500 text-white" : "bg-background text-foreground group-hover:bg-primary group-hover:text-primary-foreground"}`}>
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </div>
        </div>

        {/* Card 6: LinkedIn */}
        <a
          href="https://www.linkedin.com/in/santtitoz/"
          target="_blank"
          className={`bg-[#0077b5] text-white rounded-3xl p-6 flex flex-col justify-center items-center gap-3 cursor-pointer hover:scale-[1.02] transition-all duration-1000 delay-600 ${isVisible ? "animate-fade-in-up opacity-100" : "opacity-0 translate-y-10"}`}
        >
          <Linkedin size={32} />
          <span className="font-bold">LinkedIn</span>
        </a>

        {/* Card 7: Discord */}
        <a
          href="https://discord.com/users/359873934371422209"
          target="_blank"
          className={`bg-[#5865F2] text-white rounded-3xl p-6 flex flex-col justify-center items-center gap-3 cursor-pointer hover:scale-[1.02] transition-all duration-1000 delay-700 ${isVisible ? "animate-fade-in-up opacity-100" : "opacity-0 translate-y-10"}`}
        >
          <DiscordIcon className="w-8 h-8" />
          <span className="font-bold">Discord</span>
        </a>

      </div>
    </section>
  )
}

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}
