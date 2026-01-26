"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

export function About() {
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
    <section id="about" ref={sectionRef} className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className={`transition-all duration-1000 ${isVisible ? "animate-fade-in-up opacity-100" : "opacity-0"}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-balance">
            Sobre <span className="text-primary">Mim</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div
              className={`transition-all duration-1000 delay-200 ${isVisible ? "animate-slide-in-left opacity-100" : "opacity-0"}`}
            >
              <div className="relative">
                <div className="w-80 h-80 mx-auto bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl"></div>
                <div className="absolute inset-4 bg-card rounded-2xl flex items-center justify-center">
                  <div className="text-6xl">👨‍💻</div>
                </div>
              </div>
            </div>

            <div
              className={`space-y-6 transition-all duration-1000 delay-400 ${isVisible ? "animate-fade-in-up opacity-100" : "opacity-0"}`}
            >
              <p className="text-lg text-muted-foreground leading-relaxed">
                Sou um desenvolvedor frontend apaixonado por criar experiências digitais que combinam design elegante
                com funcionalidade excepcional. Com mais de 5 anos de experiência, especializo-me em transformar ideias
                em realidade digital.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Minha abordagem minimalista e foco na experiência do usuário me permitem criar soluções que não apenas
                impressionam visualmente, mas também entregam resultados excepcionais para os negócios dos meus
                clientes.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-6">
                <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-2">50+</div>
                    <div className="text-sm text-muted-foreground">Projetos Concluídos</div>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-2">5+</div>
                    <div className="text-sm text-muted-foreground">Anos de Experiência</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
