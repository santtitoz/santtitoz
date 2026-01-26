"use client"
import { useEffect, useRef, useState } from "react"
import { Mail, Github, Linkedin, Download } from "lucide-react"

const DiscordIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.2 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09 0 .11a11.24 11.24 0 0 1-1.64.79c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.22-1.33 5.03-2.65c.01-.01.02-.02.02-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z" />
  </svg>
)

export function Contact() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="contact" ref={sectionRef} className="min-h-screen flex flex-col justify-center">
      {/* <div className="container max-w-6xl mx-auto px-6">
        <div className={`transition-all duration-1000 ${isVisible ? "animate-fade-in-up opacity-100" : "opacity-0"}`}>
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-10 p-8 rounded-2xl bg-background/50 border border-border/30 backdrop-blur-sm shadow-md">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">Conheça meu trabalho</h2>

              <p className="text-base text-muted-foreground mb-6">Acompanhe minhas animações e métodos de desenvolvimento</p>

              <a
                href="https://www.linkedin.com/in/santtitoz/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 font-medium shadow-sm hover:shadow-md hover:translate-y-[-1px]"
              >
                <Linkedin className="h-4 w-4" />
                Ver no LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div> */}

      <footer className="mt-auto py-8 border-t border-border/30">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="text-center space-y-8">
            <div className="flex justify-center items-center gap-4">
              <a
                href="mailto:esanttitoz@gmail.com"
                className="p-4 rounded-2xl bg-background/50 border border-border/20 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/30 hover:scale-105 transition-all duration-300 group shadow-sm hover:shadow-lg"
              >
                <Mail className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
              <a
                href="https://github.com/santtitoz"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-background/50 border border-border/20 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/30 hover:scale-105 transition-all duration-300 group shadow-sm hover:shadow-lg"
              >
                <Github className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
              <a
                href="https://www.linkedin.com/in/santtitoz/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-background/50 border border-border/20 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/30 hover:scale-105 transition-all duration-300 group shadow-sm hover:shadow-lg"
              >
                <Linkedin className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-background/50 border border-border/20 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/30 hover:scale-105 transition-all duration-300 group shadow-sm hover:shadow-lg"
              >
                <DiscordIcon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
              <a
                href="/curriculo.pdf"
                download="Eliabi_Santos_Curriculo.pdf"
                className="p-4 rounded-2xl bg-background/50 border border-border/20 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/30 hover:scale-105 transition-all duration-300 group shadow-sm hover:shadow-lg"
              >
                <Download className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors group-hover:scale-110" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">&copy; 2024 Eliabi Santos.</p>
          </div>
        </div>
      </footer>
    </section>
  )
}
