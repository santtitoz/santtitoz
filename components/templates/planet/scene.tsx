"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Float, ContactShadows, Environment } from "@react-three/drei"
import * as THREE from "three"

// ─── Colour palette ──────────────────────────────────────────────────────────
const C = {
  O: "#4A7EC7",  // ocean
  D: "#2E5492",  // deep ocean
  S: "#6B9FDB",  // shallow / coast
  L: "#6BBE45",  // land / grass
  H: "#4E9C30",  // highland
  W: "#F0F2F4",  // cloud
  I: "#C8E8F8",  // ice / arctic
}

const HEIGHT: Record<string, number> = {
  [C.O]: 0.010, [C.D]: 0.007, [C.S]: 0.016,
  [C.L]: 0.030, [C.H]: 0.046, [C.W]: 0.048, [C.I]: 0.018,
}

const MAT: Record<string, { roughness: number; metalness: number }> = {
  [C.O]: { roughness: 0.25, metalness: 0.15 },
  [C.D]: { roughness: 0.20, metalness: 0.18 },
  [C.S]: { roughness: 0.30, metalness: 0.10 },
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

const { O, D, S, L, H, W, I } = C
type Row10 = [string,string,string,string,string,string,string,string,string,string]
type Map10 = [Row10,Row10,Row10,Row10,Row10,Row10,Row10,Row10,Row10,Row10]

const MAPS: Map10[] = [
  [[D,O,O,O,O,O,O,O,O,D],[O,O,O,S,S,O,O,O,O,O],[O,O,L,L,L,O,O,O,W,O],[O,O,H,H,L,L,O,O,O,O],[W,O,L,H,H,L,O,O,O,O],[O,O,L,L,H,L,O,W,O,O],[O,S,S,L,L,O,O,O,O,O],[O,O,O,S,L,L,O,O,W,O],[O,O,O,O,S,L,O,O,O,O],[I,I,O,O,O,O,O,O,I,I]],
  [[D,D,O,O,O,O,O,D,D,D],[O,O,O,O,S,O,O,O,O,O],[O,W,O,L,L,L,L,O,O,O],[O,O,L,L,H,H,L,L,O,O],[O,L,H,H,H,H,L,L,W,O],[O,L,L,H,H,L,L,L,O,O],[W,O,L,L,L,S,S,O,O,O],[O,O,O,L,L,L,O,W,O,O],[O,O,O,O,O,S,O,O,O,O],[I,I,I,O,O,O,I,I,I,I]],
  [[O,O,S,L,L,S,O,O,O,D],[O,W,O,L,H,L,O,W,O,O],[S,O,L,L,L,L,O,O,S,O],[O,O,O,W,O,O,L,L,O,O],[O,L,O,O,O,W,O,L,O,O],[O,O,W,O,L,L,O,O,W,O],[I,O,O,L,L,O,O,O,O,I],[I,I,O,O,W,O,S,O,I,I],[I,I,I,O,O,O,O,I,I,I],[I,I,I,I,W,I,I,I,I,I]],
  [[D,D,O,O,O,O,O,O,D,D],[D,O,O,S,O,O,S,O,O,D],[O,O,L,L,O,O,L,O,O,O],[O,L,L,H,O,W,H,L,O,O],[O,O,W,O,I,I,O,W,O,O],[O,O,O,I,I,I,O,O,O,O],[O,O,O,O,I,O,O,O,O,O],[O,S,O,O,O,O,O,S,O,O],[D,O,O,W,O,W,O,O,O,D],[D,D,O,O,O,O,O,O,D,D]],
  [[D,D,O,O,O,O,O,O,D,D],[O,O,O,S,S,S,O,O,O,O],[O,W,O,L,L,L,H,O,W,O],[O,O,L,L,H,H,L,L,O,O],[O,L,L,H,H,H,L,L,O,W],[W,L,H,H,H,L,L,S,O,O],[O,L,L,L,L,S,S,O,O,O],[O,O,L,L,L,L,O,O,W,O],[O,O,S,S,O,O,O,O,O,O],[I,I,O,O,W,O,O,O,I,I]],
  [[D,D,D,D,O,D,D,D,D,D],[D,O,O,O,O,O,O,D,D,D],[O,O,O,L,L,L,O,O,O,O],[W,O,L,H,H,L,L,O,W,O],[O,O,L,L,H,L,O,O,O,O],[O,O,S,L,L,S,O,O,O,O],[O,W,O,S,O,O,O,O,W,O],[O,O,O,O,L,L,L,O,O,O],[O,O,O,L,H,L,S,O,O,O],[I,I,O,O,O,O,O,O,I,I]],
]

const GRID = 10
const TILE = 1.0 / GRID
const GAP  = 0.004

function Voxel({ pos, rot, color, h }: { pos: V3; rot: V3; color: string; h: number }) {
  const mat = MAT[color] ?? { roughness: 0.6, metalness: 0 }
  const isCloud = color === C.W
  return (
    <mesh position={pos} rotation={rot} castShadow receiveShadow>
      <boxGeometry args={[TILE - GAP, TILE - GAP, h]} />
      <meshStandardMaterial color={color} roughness={mat.roughness} metalness={mat.metalness}
        emissive={isCloud ? new THREE.Color("#ffffff") : undefined}
        emissiveIntensity={isCloud ? 0.08 : 0}
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
      <boxGeometry args={[0.82, 0.82, 0.82]} />
      <meshStandardMaterial color="#FF6B1A" emissive={new THREE.Color("#FF4400")}
        emissiveIntensity={0.6} roughness={1} metalness={0} transparent opacity={0.92} />
    </mesh>
  )
}

function EarthSculpture() {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * 0.18
    groupRef.current.rotation.x += delta * 0.025
  })

  const tiles: React.ReactNode[] = []
  FACES.forEach(({ normal, u, v, rot }, fi) => {
    const nv = new THREE.Vector3(...normal)
    const uv = new THREE.Vector3(...u)
    const vv = new THREE.Vector3(...v)
    for (let row = 0; row < GRID; row++) {
      for (let col = 0; col < GRID; col++) {
        const color = MAPS[fi][row][col]
        const h = HEIGHT[color] ?? 0.010
        const uOff = col / GRID - 0.5 + TILE / 2
        const vOff = row / GRID - 0.5 + TILE / 2
        const cx = nv.x * (0.5 + h / 2) + uv.x * uOff + vv.x * vOff
        const cy = nv.y * (0.5 + h / 2) + uv.y * uOff + vv.y * vOff
        const cz = nv.z * (0.5 + h / 2) + uv.z * uOff + vv.z * vOff
        tiles.push(<Voxel key={`${fi}-${row}-${col}`} pos={[cx, cy, cz]} rot={rot} color={color} h={h} />)
      }
    }
  })

  return (
    <group ref={groupRef}>
      <Core />
      <mesh>
        <boxGeometry args={[1.002, 1.002, 1.002]} />
        <meshStandardMaterial color="#0D1A2A" roughness={0.9} transparent opacity={0.06} />
      </mesh>
      {tiles}
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
