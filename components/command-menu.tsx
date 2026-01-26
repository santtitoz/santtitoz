"use client"

import * as React from "react"
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Home,
  Code2,
  Mail,
  Moon,
  Sun,
  Laptop
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { useTheme } from "next-themes"

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)
  const { setTheme } = useTheme()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = (command: () => void) => {
    setOpen(false)
    command()
  }

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50 md:hidden">
        <button
          onClick={() => setOpen(true)}
          className="bg-primary/90 text-primary-foreground p-3 rounded-full shadow-lg backdrop-blur-sm border border-border/20"
        >
          <Code2 className="h-5 w-5" />
        </button>
      </div>

      {/* Visual Indicator for Desktop */}
      <div className="fixed bottom-6 right-6 hidden md:flex items-center gap-2 p-2 px-3 rounded-lg bg-background/50 backdrop-blur-sm border border-border/40 text-xs text-muted-foreground shadow-sm pointer-events-none select-none z-50">
        <span className="font-mono text-xs border border-border p-1 rounded bg-muted/50">⌘</span>
        <span>+</span>
        <span className="font-mono text-xs border border-border p-1 rounded bg-muted/50">K</span>
        <span className="ml-1 opacity-75">to navigate</span>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => runCommand(() => scrollToSection('home'))}>
              <Home className="mr-2 h-4 w-4" />
              <span>Home</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => scrollToSection('about'))}>
              <User className="mr-2 h-4 w-4" />
              <span>About & Skills</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => scrollToSection('projects'))}>
              <Code2 className="mr-2 h-4 w-4" />
              <span>Projects</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => scrollToSection('contact'))}>
              <Mail className="mr-2 h-4 w-4" />
              <span>Contact</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <Sun className="mr-2 h-4 w-4" />
              <span>Light Mode</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark Mode</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
              <Laptop className="mr-2 h-4 w-4" />
              <span>System</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Links">
            <CommandItem onSelect={() => runCommand(() => window.open('https://github.com/santtitoz', '_blank'))}>
              <Code2 className="mr-2 h-4 w-4" />
              <span>GitHub</span>
              <CommandShortcut>GH</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => window.open('https://www.linkedin.com/in/santtitoz/', '_blank'))}>
              <User className="mr-2 h-4 w-4" />
              <span>LinkedIn</span>
              <CommandShortcut>LI</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
