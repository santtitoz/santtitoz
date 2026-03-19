"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Float, ContactShadows, Environment } from "@react-three/drei"
import * as THREE from "three"

// ─── Colour palette ──────────────────────────────────────────────────────────
const C = {
  O: "#4A7EC7",  // ocean
  D: "#2E5492",  // deep ocean
  DP: "#1A365D", // deepest / trench
  S: "#6B9FDB",  // shallow / coast
  CO: "#88C5E5", // very shallow / bright coast
  L: "#6BBE45",  // land / grass
  H: "#4E9C30",  // highland
  W: "#F0F2F4",  // cloud
  I: "#C8E8F8",  // ice / arctic
}

const HEIGHT: Record<string, number> = {
  [C.O]: 0.035, [C.D]: 0.012, [C.DP]: 0.006, [C.S]: 0.050, [C.CO]: 0.060,
  [C.L]: 0.085, [C.H]: 0.155, [C.W]: 0.055, [C.I]: 0.045,
}

const MAT: Record<string, { roughness: number; metalness: number }> = {
  [C.O]: { roughness: 0.25, metalness: 0.15 },
  [C.D]: { roughness: 0.20, metalness: 0.18 },
  [C.DP]: { roughness: 0.15, metalness: 0.20 },
  [C.S]: { roughness: 0.30, metalness: 0.10 },
  [C.CO]: { roughness: 0.35, metalness: 0.05 },
  [C.L]: { roughness: 0.70, metalness: 0.00 },
  [C.H]: { roughness: 0.75, metalness: 0.00 },
  [C.W]: { roughness: 0.90, metalness: 0.00 },
  [C.I]: { roughness: 0.40, metalness: 0.12 },
}

type V3 = [number, number, number]
const FACES: { normal: V3; u: V3; v: V3; rot: V3 }[] = [
  { normal: [ 1, 0, 0], u: [0, 0,-1], v: [0, 1, 0], rot: [0,  Math.PI/2, 0] },
  { normal: [-1, 0, 0], u: [0, 0, 1], v: [0, 1, 0], rot: [0, -Math.PI/2, 0] },
  { normal: [ 0, 1, 0], u: [1, 0, 0], v: [0, 0,-1], rot: [-Math.PI/2, 0, 0] },
  { normal: [ 0,-1, 0], u: [1, 0, 0], v: [0, 0, 1], rot: [ Math.PI/2, 0, 0] },
  { normal: [ 0, 0, 1], u: [1, 0, 0], v: [0, 1, 0], rot: [0, 0, 0]          },
  { normal: [ 0, 0,-1], u: [-1,0, 0], v: [0, 1, 0], rot: [0, Math.PI, 0]   },
]

const { O, D, DP, S, CO, L, H, W, I } = C
type Row10 = [string,string,string,string,string,string,string,string,string,string]
type Map10 = [Row10,Row10,Row10,Row10,Row10,Row10,Row10,Row10,Row10,Row10]

const MAPS: Map10[] = [
  [[DP,D,O,O,O,O,O,O,D,DP],[D,O,O,S,CO,S,O,W,O,D],[W,O,L,L,L,O,O,O,O,O],[O,O,H,H,L,L,O,O,O,O],[O,O,L,H,H,L,O,O,W,O],[O,O,L,L,H,L,O,O,O,O],[O,S,CO,L,L,O,O,O,O,O],[O,O,O,S,L,L,O,O,W,O],[O,O,D,O,S,L,O,W,O,O],[I,I,O,O,O,D,DP,D,I,I]],
  [[DP,DP,D,O,O,O,D,DP,DP,DP],[D,O,W,O,S,O,O,O,O,D],[O,O,O,L,L,L,L,O,O,O],[O,O,L,L,H,H,L,L,O,O],[O,L,H,H,H,H,L,L,O,O],[O,L,L,H,H,L,L,L,O,O],[W,O,L,L,L,S,CO,O,O,O],[O,O,O,L,L,L,O,O,W,O],[O,O,O,O,O,S,D,O,O,O],[I,I,I,O,W,O,I,I,I,I]],
  [[O,O,S,L,L,S,O,O,O,D],[O,O,O,L,H,L,O,W,O,O],[S,CO,L,L,L,L,O,O,S,O],[O,O,O,O,O,W,L,L,O,O],[O,L,O,O,O,W,O,L,O,O],[O,O,W,O,L,L,O,O,W,O],[I,O,O,L,L,O,O,O,O,I],[I,I,O,O,W,O,S,O,I,I],[I,I,I,O,O,O,O,I,I,I],[I,I,I,I,O,I,I,I,I,I]],
  [[D,DP,D,O,O,O,O,O,D,DP],[D,D,O,S,CO,O,S,O,W,D],[O,O,L,L,O,O,L,O,O,O],[O,L,L,H,O,O,H,L,O,O],[O,O,W,O,I,I,O,O,O,O],[O,O,O,I,I,I,W,O,O,O],[O,O,O,O,I,O,O,O,O,O],[O,S,O,O,O,O,O,S,O,O],[DP,D,O,O,O,W,O,O,D,DP],[DP,DP,D,O,O,O,O,D,DP,DP]],
  [[DP,D,O,O,O,O,O,O,D,DP],[D,O,O,S,S,S,O,O,O,D],[O,W,O,L,L,L,H,O,O,O],[O,O,L,L,H,H,L,L,O,O],[O,L,L,H,H,H,L,L,O,O],[O,L,H,H,H,L,L,S,O,O],[O,L,L,L,L,S,CO,O,O,O],[D,O,L,L,L,L,O,O,W,O],[D,O,S,S,O,O,O,D,D,D],[I,I,O,O,W,O,O,O,I,I]],
  [[DP,DP,D,D,O,D,D,DP,DP,DP],[D,O,W,O,O,O,O,D,D,D],[O,O,O,L,L,L,O,O,O,O],[W,O,L,H,H,L,L,O,W,O],[O,O,L,L,H,L,O,O,O,O],[O,O,S,L,L,S,O,O,O,O],[O,W,O,S,O,O,O,O,O,O],[O,O,O,O,L,L,L,O,O,O],[O,D,O,L,H,L,S,O,W,O],[I,I,O,O,O,O,O,O,I,I]],
]

const GRID = 10
const TILE = 1.0 / GRID
const OVERLAP = 1.02

function Voxel({ pos, rot, color, h, scale = 1 }: { pos: V3; rot: V3; color: string; h: number; scale?: number }) {
  const mat = MAT[color] ?? { roughness: 0.6, metalness: 0 }
  const isCloud = color === C.W
  const isDeep = color === C.D || color === C.DP
  const isOcean = color === C.O
  const isShallow = color === C.S || color === C.CO
  const isWater = isDeep || isOcean || isShallow
  
  // Base scales
  const baseW = isCloud ? TILE * 2.2 : TILE * OVERLAP
  const baseH = isCloud ? h * 1.2 : h
  
  return (
    <mesh position={pos} rotation={rot} castShadow receiveShadow>
      <boxGeometry args={[baseW * scale, baseW * scale, baseH * (isCloud ? scale : 1)]} />
      <meshStandardMaterial color={color} roughness={mat.roughness} metalness={mat.metalness}
        emissive={isWater ? new THREE.Color(color).multiplyScalar(0.2) : (isCloud ? new THREE.Color("#ffffff") : undefined)}
        emissiveIntensity={isCloud ? 0.08 : 0.4}
        transparent={isCloud || isWater}
        opacity={isCloud ? 0.8 : (isDeep ? 0.3 : isOcean ? 0.5 : isShallow ? 0.7 : 1)}
      />
    </mesh>
  )
}

function Core() {
  const meshRef = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 0.6 + Math.sin(clock.elapsedTime * 1.2) * 0.15
    }
  })
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[0.92, 0.92, 0.92]} />
      <meshStandardMaterial color="#FF3D00" emissive={new THREE.Color("#FF2200")}
        emissiveIntensity={0.6} roughness={1} metalness={0} side={THREE.DoubleSide} />
    </mesh>
  )
}

function EarthSculpture() {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.18
      groupRef.current.rotation.x += delta * 0.025
    }
  })

  const { surfaceTiles, cloudTiles } = useMemo(() => {
    const sTiles: React.ReactNode[] = []
    const cTiles: React.ReactNode[] = []

    FACES.forEach(({ normal, u, v, rot }, fi) => {
      const nv = new THREE.Vector3(...normal)
      const uv = new THREE.Vector3(...u)
      const vv = new THREE.Vector3(...v)
      for (let row = 0; row < GRID; row++) {
        for (let col = 0; col < GRID; col++) {
          const color = MAPS[fi][row][col]
          const isCloud = color === C.W
          
          const h = HEIGHT[color] ?? 0.010
          const uOff = (col / GRID - 0.5 + TILE / 2)
          const vOff = (row / GRID - 0.5 + TILE / 2)

          // Volumetric Cloud Clusters
          const cloudBaseOffset = 0.68
          if (isCloud) {
            const cx = nv.x * cloudBaseOffset + uv.x * uOff + vv.x * vOff
            const cy = nv.y * cloudBaseOffset + uv.y * uOff + vv.y * vOff
            const cz = nv.z * cloudBaseOffset + uv.z * uOff + vv.z * vOff
            
            // Random scaling for variety
            const randomScale = 0.8 + Math.random() * 0.7
            
            // Main cloud body (reduced height multiplier from 1.5 to 0.8)
            cTiles.push(<Voxel key={`${fi}-${row}-${col}-c1`} pos={[cx, cy, cz]} rot={rot} color={color} h={h * 0.8} scale={randomScale} />)
            // Small companion for "cluster" look
            const ox = uv.x * 0.02, oy = uv.y * 0.02, oz = uv.z * 0.02
            cTiles.push(<Voxel key={`${fi}-${row}-${col}-c2`} pos={[cx+ox, cy+oy, cz+oz]} rot={rot} color={color} h={h * 0.5} scale={randomScale * 0.7} />)

            // Fill the surface under the floating cloud with Ocean
            const sH = HEIGHT[C.O]
            const scx = nv.x * (0.5 + sH / 2) + uv.x * uOff + vv.x * vOff
            const scy = nv.y * (0.5 + sH / 2) + uv.y * uOff + vv.y * vOff
            const scz = nv.z * (0.5 + sH / 2) + uv.z * uOff + vv.z * vOff
            sTiles.push(<Voxel key={`under-${fi}-${row}-${col}`} pos={[scx, scy, scz]} rot={rot} color={C.O} h={sH} />)
          }

          const h_surface = HEIGHT[color] ?? 0.010
          const baseOffset = (0.5 + h_surface / 2)
          const sx = nv.x * baseOffset + uv.x * uOff + vv.x * vOff
          const sy = nv.y * baseOffset + uv.y * uOff + vv.y * vOff
          const sz = nv.z * baseOffset + uv.z * uOff + vv.z * vOff

          const tile = (
            <Voxel key={`${fi}-${row}-${col}`} pos={[sx, sy, sz]} rot={rot} color={color} h={h_surface} />
          )

          if (!isCloud) sTiles.push(tile)
        }
      }
    })
    return { surfaceTiles: sTiles, cloudTiles: cTiles }
  }, [])

  return (
    <group ref={groupRef}>
      <Core />
      <mesh>
        <boxGeometry args={[1.0, 1.0, 1.0]} />
        <meshStandardMaterial color="#050B14" roughness={1} side={THREE.DoubleSide} />
      </mesh>
      {surfaceTiles}
      <group>
        {cloudTiles}
      </group>
      <pointLight position={[0, 0, 0]} intensity={0.8} color="#FF6020" distance={1.2} decay={2} />
    </group>
  )
}

export function PlanetCube3D() {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [2.5, 2.1, 2.5], fov: 42 }} gl={{ antialias: true }}>
        <ambientLight intensity={0.45} />
        <directionalLight position={[6, 9, 6]} intensity={1.6} castShadow
          shadow-mapSize-width={2048} shadow-mapSize-height={2048}
          shadow-camera-near={0.1} shadow-camera-far={20}
          shadow-camera-left={-3} shadow-camera-right={3}
          shadow-camera-top={3} shadow-camera-bottom={-3} color="#FFF8F0" />
        <directionalLight position={[-5, 2, -3]} intensity={0.35} color="#A0C0FF" />
        <directionalLight position={[0, -4, -6]} intensity={0.20} color="#FFD0A0" />
        <Environment preset="studio" />
        <Float speed={1.2} rotationIntensity={0.10} floatIntensity={0.22}>
          <EarthSculpture />
        </Float>
        <ContactShadows position={[0, -1.45, 0]} opacity={0.45} scale={7} blur={3} far={3} color="#1a2a40" />
        <OrbitControls enablePan={false} enableZoom={false} rotateSpeed={0.5} />
      </Canvas>
    </div>
  )
}
