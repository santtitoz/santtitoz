"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

export function Skills() {
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
    { name: "React", level: 95, icon: "⚛️" },
    { name: "Next.js", level: 90, icon: "▲" },
    { name: "TypeScript", level: 88, icon: "📘" },
    { name: "Tailwind CSS", level: 92, icon: "🎨" },
    { name: "Node.js", level: 85, icon: "🟢" },
    { name: "Figma", level: 90, icon: "🎯" },
    { name: "Git", level: 88, icon: "📚" },
    { name: "MongoDB", level: 80, icon: "🍃" },
  ]

  const frameworks = ["React", "Next.js", "Vue.js", "Angular", "Svelte", "Nuxt.js"]

  const tools = ["Figma", "Adobe XD", "Photoshop", "Illustrator", "Framer", "Webflow"]

  return (
    <section id="skills" ref={sectionRef} className="py-20">
      <div className="container mx-auto px-6">
        <div className={`transition-all duration-1000 ${isVisible ? "animate-fade-in-up opacity-100" : "opacity-0"}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-balance">
            Minhas <span className="text-primary">Habilidades</span>
          </h2>

          <div className="max-w-6xl mx-auto space-y-16">
            {/* Technical Skills */}
            <div
              className={`transition-all duration-1000 delay-200 ${isVisible ? "animate-fade-in-up opacity-100" : "opacity-0"}`}
            >
              <h3 className="text-2xl font-semibold mb-8 text-center">Habilidades Técnicas</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {skills.map((skill, index) => (
                  <Card key={skill.name} className="group hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{skill.icon}</span>
                          <span className="font-semibold">{skill.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: isVisible ? `${skill.level}%` : "0%",
                            transitionDelay: `${index * 100}ms`,
                          }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Frameworks */}
            <div
              className={`transition-all duration-1000 delay-400 ${isVisible ? "animate-fade-in-up opacity-100" : "opacity-0"}`}
            >
              <h3 className="text-2xl font-semibold mb-8 text-center">Frameworks & Bibliotecas</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {frameworks.map((framework, index) => (
                  <div
                    key={framework}
                    className={`px-6 py-3 bg-card border border-border rounded-full hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {framework}
                  </div>
                ))}
              </div>
            </div>

            {/* Design Tools */}
            <div
              className={`transition-all duration-1000 delay-600 ${isVisible ? "animate-fade-in-up opacity-100" : "opacity-0"}`}
            >
              <h3 className="text-2xl font-semibold mb-8 text-center">Ferramentas de Design</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {tools.map((tool, index) => (
                  <div
                    key={tool}
                    className={`px-6 py-3 bg-secondary border border-border rounded-full hover:border-accent/50 hover:bg-accent/5 transition-all duration-300 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {tool}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
