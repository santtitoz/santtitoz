"use client"

import { useState, useEffect } from "react"

export function Navigation() {
  const [activeSection, setActiveSection] = useState("home")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "projects", "contact"]
      const scrollPosition = window.scrollY + 100

      setIsVisible(window.scrollY > 100)

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const navItems = [
    { id: "home", label: "Início" },
    { id: "about", label: "Sobre" },
    { id: "projects", label: "Projetos" },
    { id: "contact", label: "Contato" },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="mx-4 mt-4 bg-background/90 backdrop-blur-xl border border-border/50 rounded-2xl shadow-lg shadow-black/5">
        <div className="px-6 py-3">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative text-sm font-medium transition-all duration-300 hover:text-primary ${
                    activeSection === item.id ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
