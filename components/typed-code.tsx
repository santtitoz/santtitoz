"use client"

import { useEffect, useState } from "react"

// Helper para syntax highlighting simples
const HighlightCode = ({ line }: { line: string }) => {
  if (!line) return <span className="inline-block h-4" />

  const parts = line.split(/(\b|\W)/)

  return (
    <>
      {parts.map((part, i) => {
        if (["import", "from", "function", "return", "const", "export", "default", "useState", "useRef", "useFrame"].includes(part)) {
          return <span key={i} className="text-primary/90 font-bold">{part}</span>
        }
        if (["Canvas", "Float", "ContactShadows", "Chest", "Latch", "MinecraftChest", "EnderChest", "group", "RubiksCube", "PlanetCube"].includes(part)) {
          return <span key={i} className="text-yellow-500/90">{part}</span>
        }
        if (part.startsWith("'") || part.startsWith('"')) {
          return <span key={i} className="text-green-400/80">{part}</span>
        }
        if (["<", ">", "/", "{", "}", "(", ")", ";"].includes(part)) {
          return <span key={i} className="text-foreground/40">{part}</span>
        }
        return <span key={i} className="text-foreground/80">{part}</span>
      })}
    </>
  )
}

interface TypedCodeProps {
  lines: string[]
  filename: string
  directory: string
  onComplete?: () => void
}

export function TypedCode({ lines, filename, directory, onComplete }: TypedCodeProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([])
  const [currentLine, setCurrentLine] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)

  // Reset state when lines change
  useEffect(() => {
    setDisplayedLines([])
    setCurrentLine(0)
    setCurrentChar(0)
  }, [lines, filename, directory])

  useEffect(() => {
    if (currentLine >= lines.length) {
      if (onComplete) {
        const t = setTimeout(onComplete, 200)
        return () => clearTimeout(t)
      }
      return
    }

    if (currentChar < lines[currentLine].length) {
      const randomDelay = Math.random() * 13 + 5
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => {
          const newLines = [...prev]
          newLines[currentLine] = lines[currentLine].slice(0, currentChar + 1)
          return newLines
        })
        setCurrentChar(currentChar + 1)
      }, randomDelay)
      return () => clearTimeout(timeout)
    } else {
      const timeout = setTimeout(() => {
        setCurrentLine(currentLine + 1)
        setCurrentChar(0)
      }, 20)
      return () => clearTimeout(timeout)
    }
  }, [currentChar, currentLine, onComplete, lines])

  return (
    <div className="w-full h-full p-8 md:p-12 flex flex-col font-mono text-xs sm:text-sm z-20">

      {/* Header Minimalista */}
      <div className="flex items-center gap-3 mb-6 opacity-40 select-none border-b border-foreground/10 pb-4 w-full">
        <div className="w-2 h-2 rounded-full bg-foreground/50" />
        <span className="uppercase tracking-widest text-[10px] font-bold">src/components/templates/{directory}/{filename}</span>
      </div>

      {/* Code Editor Area */}
      <div className="flex-1 overflow-hidden relative leading-relaxed">
        {displayedLines.map((line, index) => (
          <div key={index} className="flex items-baseline">
            {/* Line Numbers */}
            <span className="text-foreground/10 mr-4 select-none w-6 text-right text-[10px] pt-[2px]">
              {index + 1}
            </span>

            {/* Code Line */}
            <div className="flex-1 whitespace-pre-wrap break-all">
              <HighlightCode line={line} />

              {/* Cursor piscante na linha ativa */}
              {index === currentLine && (
                <span className="inline-block w-1.5 h-3.5 bg-primary ml-1 animate-pulse align-middle" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

