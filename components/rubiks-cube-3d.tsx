"use client"

import React, { useRef, useState, useEffect, useMemo } from "react"
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber"
import { OrbitControls, RoundedBox, Environment, ContactShadows, Float } from "@react-three/drei"
import * as THREE from "three"

// Cores Oficiais
const COLORS = {
  base: "#111111",
  faces: {
    R: "#C41E3A", // Right - Red
    L: "#FF5800", // Left - Orange
    U: "#FFFFFF", // Up - White
    D: "#FFD500", // Down - Yellow
    F: "#009E60", // Front - Green
    B: "#0051BA", // Back - Blue
  }
}

// Helper para criar a geometria com materiais nos lugares certos
function CubeGeometry() {
  // Materiais na ordem do ThreeJS BoxGeometry: Right, Left, Up, Down, Front, Back
  const materials = [
    new THREE.MeshStandardMaterial({ color: COLORS.faces.R, roughness: 0.1, metalness: 0 }),
    new THREE.MeshStandardMaterial({ color: COLORS.faces.L, roughness: 0.1, metalness: 0 }),
    new THREE.MeshStandardMaterial({ color: COLORS.faces.U, roughness: 0.1, metalness: 0 }),
    new THREE.MeshStandardMaterial({ color: COLORS.faces.D, roughness: 0.1, metalness: 0 }),
    new THREE.MeshStandardMaterial({ color: COLORS.faces.F, roughness: 0.1, metalness: 0 }),
    new THREE.MeshStandardMaterial({ color: COLORS.faces.B, roughness: 0.1, metalness: 0 }),
  ]
  const baseMat = new THREE.MeshStandardMaterial({ color: COLORS.base, roughness: 0.2, metalness: 0.1 })

  // Criar um BoxGeometry com padding preto (inset) é complexo.
  // Vamos simplificar: Um cubo preto levemente arredondado, com "Plates" coloridos levemente afastados.
  return null // Lógica movida para o componente Cubie
}

function Cubie({ position, name, ...props }: any) {
  const [hover, setHover] = useState(false)

  return (
    <group position={position} name={name} {...props}>
      {/* Base Preta Arredondada */}
      <RoundedBox args={[0.96, 0.96, 0.96]} radius={0.05} smoothness={4}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true) }}
        onPointerOut={(e) => { e.stopPropagation(); setHover(false) }}
      >
        <meshStandardMaterial color="#1a1a1a" roughness={0.2} />
      </RoundedBox>

      {/* Faces Coloridas (Planes) */}
      <Face dir={[1, 0, 0]} color={COLORS.faces.R} />
      <Face dir={[-1, 0, 0]} color={COLORS.faces.L} />
      <Face dir={[0, 1, 0]} color={COLORS.faces.U} />
      <Face dir={[0, -1, 0]} color={COLORS.faces.D} />
      <Face dir={[0, 0, 1]} color={COLORS.faces.F} />
      <Face dir={[0, 0, -1]} color={COLORS.faces.B} />
    </group>
  )
}

function Face({ dir, color }: { dir: [number, number, number], color: string }) {
  const pos = new THREE.Vector3(...dir).multiplyScalar(0.495) // Levemente para fora
  // Rotação para alinhar o plano com a face
  const rot = new THREE.Euler()
  if (dir[0] === 1) rot.set(0, Math.PI / 2, 0)
  else if (dir[0] === -1) rot.set(0, -Math.PI / 2, 0)
  else if (dir[1] === 1) rot.set(-Math.PI / 2, 0, 0)
  else if (dir[1] === -1) rot.set(Math.PI / 2, 0, 0)
  else if (dir[2] === -1) rot.set(0, Math.PI, 0) // Back

  return (
    <mesh position={pos} rotation={rot}>
      <planeGeometry args={[0.85, 0.85]} />
      <meshStandardMaterial color={color} roughness={0.1} metalness={0} />
    </mesh>
  )
}


// --- LÓGICA DO JOGO ---

// --- LÓGICA DO JOGO ---

function RubiksGame() {
  const groupRef = useRef<THREE.Group>(null)
  const orbit = useRef<any>(null)
  const isAnimating = useRef(false)

  // Pivot Helper para rotação
  const pivotRef = useRef<THREE.Group>(null)

  // Histórico de movimentos para autolimpar
  const moveHistory = useRef<{ axis: string, slice: number, dir: number }[]>([])

  // Criar os 27 cubos iniciais
  const cubies = useMemo(() => {
    const arr = []
    for (let x = -1; x <= 1; x++)
      for (let y = -1; y <= 1; y++)
        for (let z = -1; z <= 1; z++)
          arr.push({ id: `${x},${y},${z}`, pos: [x, y, z] })
    return arr
  }, [])

  // Variáveis de Drag
  const startPoint = useRef<THREE.Vector3 | null>(null)
  const startFaceNorm = useRef<THREE.Vector3 | null>(null)
  const intersectedObject = useRef<THREE.Object3D | null>(null)

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    // Interromper automação se o usuário interagir? 
    // Por enquanto, bloqueamos interação se estiver animando, mas o usuário pode "brigar" com a automação.
    // O ideal seria pausar a automação. Mas vamos manter simples.
    if (isAnimating.current || !e.face) return
    e.stopPropagation()
    orbit.current.enabled = false

    startPoint.current = e.point.clone()
    const norm = e.face.normal.clone()
    norm.transformDirection(e.object.matrixWorld).round()
    startFaceNorm.current = norm
    intersectedObject.current = e.object.parent
  }

  const onPointerUp = () => {
    startPoint.current = null
    orbit.current.enabled = true
  }

  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!startPoint.current || isAnimating.current || !intersectedObject.current) return

    const moveVec = e.point.clone().sub(startPoint.current)
    if (moveVec.length() < 0.2) return

    const x = Math.abs(moveVec.x)
    const y = Math.abs(moveVec.y)
    const z = Math.abs(moveVec.z)

    const norm = startFaceNorm.current!
    let axisToRotate = ''
    let direction = 0

    if (Math.abs(norm.x) > 0.5) {
      if (y > z) { axisToRotate = 'z'; direction = moveVec.y > 0 ? -1 : 1 }
      else { axisToRotate = 'y'; direction = moveVec.z > 0 ? 1 : -1 }
    }
    else if (Math.abs(norm.y) > 0.5) {
      if (x > z) { axisToRotate = 'z'; direction = moveVec.x > 0 ? 1 : -1 }
      else { axisToRotate = 'x'; direction = moveVec.z > 0 ? 1 : -1 }
    }
    else {
      if (x > y) { axisToRotate = 'y'; direction = moveVec.x > 0 ? 1 : -1 }
      else { axisToRotate = 'x'; direction = moveVec.y > 0 ? -1 : 1 }
    }

    const pos = intersectedObject.current.position.clone()
    const sliceVal = axisToRotate === 'x' ? Math.round(pos.x)
      : axisToRotate === 'y' ? Math.round(pos.y)
        : Math.round(pos.z)

    rotateLayer(axisToRotate, sliceVal, direction, 300)

    startPoint.current = null
    orbit.current.enabled = true
  }

  // Promise-based Rotation para permitir automação async
  const rotateLayer = (axis: string, sliceIndex: number, dir: number, duration: number = 300) => {
    return new Promise<void>((resolve) => {
      if (isAnimating.current) { resolve(); return }
      isAnimating.current = true

      // 1. Encontrar cubos na fatia
      const targetCubies: THREE.Object3D[] = []
      const tolerance = 0.1

      groupRef.current?.children.forEach(child => {
        if (child.name === 'pivot' || !child.name) return
        const p = child.position
        let inSlice = false
        if (axis === 'x' && Math.abs(p.x - sliceIndex) < tolerance) inSlice = true
        if (axis === 'y' && Math.abs(p.y - sliceIndex) < tolerance) inSlice = true
        if (axis === 'z' && Math.abs(p.z - sliceIndex) < tolerance) inSlice = true

        if (inSlice) targetCubies.push(child)
      })

      // 2. Anexar ao Pivot
      const pivot = pivotRef.current!
      pivot.rotation.set(0, 0, 0)
      pivot.position.set(0, 0, 0)
      pivot.updateMatrixWorld()

      targetCubies.forEach(cubie => {
        pivot.attach(cubie)
      })

      // 3. Animar
      const targetRot = Math.PI / 2 * dir
      const startRot = 0
      const startTime = Date.now()

      const animate = () => {
        const now = Date.now()
        const progress = Math.min((now - startTime) / duration, 1)
        const ease = 1 - Math.pow(1 - progress, 3)

        const currentAngel = startRot + (targetRot * ease)

        if (axis === 'x') pivot.rotation.x = currentAngel
        if (axis === 'y') pivot.rotation.y = currentAngel
        if (axis === 'z') pivot.rotation.z = currentAngel

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          // 4. Finalizar
          pivot.updateMatrixWorld()
          const count = pivot.children.length
          for (let i = count - 1; i >= 0; i--) {
            groupRef.current?.attach(pivot.children[i])
          }

          targetCubies.forEach(c => {
            c.position.set(Math.round(c.position.x), Math.round(c.position.y), Math.round(c.position.z))
            c.rotation.set(Math.round(c.rotation.x / (Math.PI / 2)) * (Math.PI / 2),
              Math.round(c.rotation.y / (Math.PI / 2)) * (Math.PI / 2),
              Math.round(c.rotation.z / (Math.PI / 2)) * (Math.PI / 2))
            c.updateMatrix()
          })

          isAnimating.current = false
          resolve()
        }
      }
      animate()
    })
  }

  // --- Automação: Embaralhar e Resolver ---
  useEffect(() => {
    let mounted = true

    const runSequence = async () => {
      // Delay inicial
      await new Promise(r => setTimeout(r, 1000))

      while (mounted) {
        // --- FASE 1: EMBARALHAR (Scramble) ---
        // 10 Movimentos rápidos
        for (let i = 0; i < 8; i++) {
          if (!mounted) return

          // Escolher movimento aleatório
          const axes = ['x', 'y', 'z']
          const axis = axes[Math.floor(Math.random() * axes.length)]
          // Slices: -1, 0, 1
          const slice = Math.floor(Math.random() * 3) - 1
          const dir = Math.random() > 0.5 ? 1 : -1

          // Guardar para resolver depois
          moveHistory.current.push({ axis, slice, dir })

          // Girar rápido (150ms)
          await rotateLayer(axis, slice, dir, 150)
          await new Promise(r => setTimeout(r, 50))
        }

        if (!mounted) return
        await new Promise(r => setTimeout(r, 800)) // Pausa breve embaralhado

        // --- FASE 2: RESOLVER (Solve) ---
        // Reverter histórico
        while (moveHistory.current.length > 0) {
          if (!mounted) return
          const move = moveHistory.current.pop()!
          // Inverter direção
          await rotateLayer(move.axis, move.slice, move.dir * -1, 300)
          await new Promise(r => setTimeout(r, 100))
        }

        if (!mounted) return
        await new Promise(r => setTimeout(r, 2000)) // Pausa resolvido antes de recomeçar
      }
    }

    runSequence()

    return () => { mounted = false }
  }, []) // Executar apenas no mount

  return (
    <group
      ref={groupRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <group ref={pivotRef} name="pivot" />

      {cubies.map((c, i) => (
        <Cubie key={i} position={c.pos} name={`cubie-${i}`} />
      ))}

      <OrbitControls ref={orbit} enablePan={false} enableZoom={false} rotateSpeed={0.5} />
    </group>
  )
}

export function RubiksCube3D() {
  return (
    <div className="w-full h-full relative cursor-pointer">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [3.5, 3.5, 3.5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-mapSize={2048} castShadow />
        <Environment preset="city" />

        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
          <RubiksGame />
        </Float>

        <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2.5} far={2.5} />
      </Canvas>
    </div>
  )
}
