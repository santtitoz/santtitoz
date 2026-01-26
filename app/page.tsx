import { Hero } from "@/components/hero"
import { BentoGrid } from "@/components/bento-grid"
import { Projects } from "@/components/projects"
import { Contact } from "@/components/contact"
import { Navigation } from "@/components/navigation"
import { LoadingScreen } from "@/components/loading-screen"

export default function Home() {
  return (
    <>
      <LoadingScreen />
      <main className="min-h-screen bg-background">
        {/* <Navigation /> */}
        <Hero />
        <BentoGrid />
        <Projects />
        <Contact />
      </main>
    </>
  )
}
