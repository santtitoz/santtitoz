"use client"

import { useEffect, useRef, useState } from "react"

export function AboutSkills() {
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

  const skills = [
    { name: "JavaScript", level: 95 },
    { name: "TypeScript", level: 90 },
    { name: "React", level: 95 },
    { name: "React Redux", level: 85 },
    { name: "Next.js", level: 90 },
    { name: "Node.js", level: 85 },
    { name: "Express", level: 88 },
  ]

  return (
    <section id="about" ref={sectionRef} className="min-h-screen bg-gradient-to-br from-muted/20 to-muted/40 flex items-center justify-center">
      <div className="container max-w-6xl mx-auto px-6">
        <div className={`transition-all duration-1000 ${isVisible ? "animate-fade-in-up opacity-100" : "opacity-0"}`}>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-16 text-balance">
            Sobre Mim & <span className="text-primary">Habilidades</span>
          </h2>

          <div className="grid lg:grid-cols-2 gap-16 md:gap-24 max-w-5xl mx-auto items-start">
            <div
              className={`space-y-5 transition-all duration-1000 delay-200 ${isVisible ? "animate-slide-in-left opacity-100" : "opacity-0"}`}
            >
              <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3">Tecnologias</h3>
              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <div key={skill.name} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm md:text-base font-medium text-foreground font-mono font-black">{skill.name}</span>
                      <span className="text-xs md:text-sm text-muted-foreground font-mono">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-secondary/30 rounded-full h-2.5 shadow-inner backdrop-blur-sm">
                      <div
                        className="bg-gradient-to-r from-primary to-primary/80 h-2.5 rounded-full transition-all duration-1500 ease-out shadow-sm"
                        style={{
                          width: isVisible ? `${skill.level}%` : "0%",
                          transitionDelay: `${index * 100}ms`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`space-y-5 transition-all duration-1000 delay-400 ${isVisible ? "animate-slide-in-right opacity-100" : "opacity-0"}`}
            >
              <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3">Sobre Mim</h3>

              <div className="space-y-3">
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Web Designer & Web Developer Junior apaixonado por criar experiências digitais elegantes, funcionais e memoráveis.
                </p>

                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Especializo-me em JavaScript, TypeScript e React. Tenho experiência sólida em Node.js, Express e Next.js, sempre buscando novas tecnologias.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center p-4 bg-background/50 backdrop-blur-sm rounded-2xl shadow-sm border border-border/40 hover:scale-105 transition-transform duration-300">
                    <div className="text-2xl md:text-3xl font-bold font-mono text-primary mb-1">50+</div>
                    <div className="text-xs md:text-sm text-muted-foreground font-medium">Projetos</div>
                  </div>
                  <div className="text-center p-4 bg-background/50 backdrop-blur-sm rounded-2xl shadow-sm border border-border/40 hover:scale-105 transition-transform duration-300">
                    <div className="text-2xl md:text-3xl font-bold font-mono text-primary mb-1">5+</div>
                    <div className="text-xs md:text-sm text-muted-foreground font-medium">Anos Exp.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
