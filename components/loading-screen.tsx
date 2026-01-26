"use client"

import { useEffect, useState } from "react"

export function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setTimeout(() => setIsVisible(false), 1200)
          return 100
        }
        return prev + Math.random() * 10 + 3
      })
    }, 200)

    return () => clearInterval(progressInterval)
  }, [])

  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-1000 ${!isVisible ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      <div className="text-center">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-mono font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            santtitoz
          </h1>
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto animate-pulse" />
        </div>
      </div>
    </div>
  )
}
