"use client"

import { useRef, useState, useMemo } from "react"
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber"
import { OrbitControls, Float, ContactShadows, Environment } from "@react-three/drei"
import * as THREE from "three"

// ─── Extended voxel type (supports emissive glow) ────────────────────────────
type VC = {
  color: string
  depth: number
  emissive?: string
  emissiveIntensity?: number
}
type V3 = [number, number, number]

// ─── Palette ── Obsidian + purple glow + dark red accents ────────────────────
const OBS: VC = { color: "#24183A", depth: 0.030 }          // obsidian
const DRK: VC = { color: "#18102A", depth: 0.020 }          // dark obsidian
const TRM: VC = { color: "#0E0A18", depth: 0.018 }          // trim / frame
const OBL: VC = { color: "#352449", depth: 0.038 }          // lighter obsidian
const RED: VC = { color: "#5C1212", depth: 0.035 }          // red accent
const RDB: VC = { color: "#3D0A0A", depth: 0.022 }          // dark red
const EYE: VC = { color: "#8822CC", depth: 0.052,           // outer eye
  emissive: "#5500AA", emissiveIntensity: 0.7 }
const EYG: VC = { color: "#CC55FF", depth: 0.068,           // bright eye
  emissive: "#AA00FF", emissiveIntensity: 1.6 }
const EYC: VC = { color: "#66DDFF", depth: 0.050,           // cyan center
  emissive: "#00BBFF", emissiveIntensity: 1.4 }
const INT: VC = { color: "#0C0612", depth: 0.008 }          // interior fill

// ─── Face maps ───────────────────────────────────────────────────────────────
// ESIDE  — obsidian sides (10 rows × 8 cols)
const ESIDE: VC[][] = [
  [TRM,TRM,TRM,TRM,TRM,TRM,TRM,TRM],
  [TRM,OBS,OBL,OBS,OBS,OBL,OBS,TRM],
  [TRM,OBL,RED,RDB,RDB,RED,OBL,TRM],
  [TRM,OBS,RDB,OBS,OBS,RDB,OBS,TRM],
  [TRM,DRK,OBS,DRK,DRK,OBS,DRK,TRM],
  [TRM,DRK,OBS,DRK,DRK,OBS,DRK,TRM],
  [TRM,OBS,RDB,OBS,OBS,RDB,OBS,TRM],
  [TRM,OBL,RED,RDB,RDB,RED,OBL,TRM],
  [TRM,OBS,OBL,OBS,OBS,OBL,OBS,TRM],
  [TRM,TRM,TRM,TRM,TRM,TRM,TRM,TRM],
]

// EFRONT — front face with glowing eyes (10 rows × 8 cols)
const EFRONT: VC[][] = [
  [TRM,TRM,TRM,TRM,TRM,TRM,TRM,TRM],
  [TRM,OBS,OBL,OBS,OBS,OBL,OBS,TRM],
  [TRM,OBL,RED,RDB,RDB,RED,OBL,TRM],
  [TRM,OBS,EYE,EYG,EYG,EYE,OBS,TRM],
  [TRM,OBS,EYG,EYC,EYC,EYG,OBS,TRM],
  [TRM,OBS,EYE,EYG,EYG,EYE,OBS,TRM],
  [TRM,OBL,RED,RDB,RDB,RED,OBL,TRM],
  [TRM,OBS,OBL,OBS,OBS,OBL,OBS,TRM],
  [TRM,OBS,DRK,OBS,OBS,DRK,OBS,TRM],
  [TRM,TRM,TRM,TRM,TRM,TRM,TRM,TRM],
]

// ETOP — top face (8 rows × 8 cols)
const ETOP: VC[][] = [
  [TRM,TRM,TRM,TRM,TRM,TRM,TRM,TRM],
  [TRM,OBL,DRK,OBL,OBL,DRK,OBL,TRM],
  [TRM,DRK,OBS,DRK,DRK,OBS,DRK,TRM],
  [TRM,OBL,DRK,OBS,OBS,DRK,OBL,TRM],
  [TRM,OBL,DRK,OBS,OBS,DRK,OBL,TRM],
  [TRM,DRK,OBS,DRK,DRK,OBS,DRK,TRM],
  [TRM,OBL,DRK,OBL,OBL,DRK,OBL,TRM],
  [TRM,TRM,TRM,TRM,TRM,TRM,TRM,TRM],
]

// ELSIDE — lid side (4 rows × 8 cols)
const ELSIDE: VC[][] = [
  [TRM,TRM,TRM,TRM,TRM,TRM,TRM,TRM],
  [TRM,OBL,DRK,OBL,OBL,DRK,OBL,TRM],
  [TRM,OBS,RED,RDB,RDB,RED,OBS,TRM],
  [TRM,TRM,TRM,TRM,TRM,TRM,TRM,TRM],
]

const fill = (r: number, c: number): VC[][] =>
  Array.from({ length: r }, () => Array.from({ length: c }, () => INT))

// ─── Face orientation ─────────────────────────────────────────────────────────
const PI2 = Math.PI / 2
const FROT: Record<string, { rot: V3; u: V3; v: V3; norm: V3 }> = {
  "+z": { rot: [0,0,0],        u:[1,0,0],  v:[0,1,0],  norm:[0,0,1]  },
  "-z": { rot: [0,Math.PI,0],  u:[-1,0,0], v:[0,1,0],  norm:[0,0,-1] },
  "+x": { rot: [0,PI2,0],      u:[0,0,-1], v:[0,1,0],  norm:[1,0,0]  },
  "-x": { rot: [0,-PI2,0],     u:[0,0,1],  v:[0,1,0],  norm:[-1,0,0] },
  "+y": { rot: [-PI2,0,0],     u:[1,0,0],  v:[0,0,-1], norm:[0,1,0]  },
  "-y": { rot: [PI2,0,0],      u:[1,0,0],  v:[0,0,1],  norm:[0,-1,0] },
}

const OVERLAP = 1.004

function buildFace(
  key: string, fc: V3, fw: number, fh: number, grid: VC[][], prefix: string
): React.ReactNode[] {
  const { rot, u, v, norm } = FROT[key]
  const nv = new THREE.Vector3(...norm)
  const uv = new THREE.Vector3(...u)
  const vv = new THREE.Vector3(...v)
  const cv = new THREE.Vector3(...fc)
  const rows = grid.length, cols = grid[0].length
  const vw = fw / cols, vh = fh / rows

  return grid.flatMap((row, r) => row.map((vc, c) => {
    const { color, depth, emissive, emissiveIntensity } = vc
    const uOff = (c / cols - 0.5 + 0.5 / cols) * fw
    const vOff = (r / rows - 0.5 + 0.5 / rows) * fh
    const px = cv.x + nv.x * (depth / 2) + uv.x * uOff + vv.x * vOff
    const py = cv.y + nv.y * (depth / 2) + uv.y * uOff + vv.y * vOff
    const pz = cv.z + nv.z * (depth / 2) + uv.z * uOff + vv.z * vOff
    return (
      <mesh key={`${prefix}${r}-${c}`} position={[px,py,pz]} rotation={rot} castShadow receiveShadow>
        <boxGeometry args={[vw*OVERLAP, vh*OVERLAP, depth + 0.002]} />
        <meshStandardMaterial
          color={color}
          roughness={0.72}
          metalness={0.04}
          emissive={emissive ? new THREE.Color(emissive) : undefined}
          emissiveIntensity={emissiveIntensity ?? 0}
        />
      </mesh>
    )
  }))
}

// ─── Chest dimensions (same as regular chest) ────────────────────────────────
const W  = 0.95
const H  = 0.72
const D  = 0.95
const LH = 0.26
const BY = -LH / 2

// ─── EnderChest inner group ───────────────────────────────────────────────────
function EnderChestGroup({ onOpen, onClose }: { onOpen?: () => void; onClose?: () => void }) {
  const groupRef  = useRef<THREE.Group>(null)
  const pivotRef  = useRef<THREE.Group>(null)
  const glowRef   = useRef<THREE.PointLight>(null)
  const [isOpen, setIsOpen] = useState(false)

  // ── Body voxels ──────────────────────────────────────────────────────────
  const bodyVoxels = useMemo(() => [
    ...buildFace("+z", [0, BY, D/2],    W, H, EFRONT, "bf"),  // front — eyes
    ...buildFace("-z", [0, BY,-D/2],    W, H, ESIDE,  "bk"),  // back
    ...buildFace("+x", [W/2, BY, 0],    D, H, ESIDE,  "br"),  // right
    ...buildFace("-x", [-W/2, BY, 0],   D, H, ESIDE,  "bl"),  // left
    ...buildFace("+y", [0, BY+H/2, 0],  W, D, ETOP,   "bt"),  // top
    ...buildFace("-y", [0, BY-H/2, 0],  W, D, fill(8,8), "bb"), // bottom
  ], [])

  // ── Lid voxels (pivot-local) ─────────────────────────────────────────────
  const lidVoxels = useMemo(() => [
    ...buildFace("+z", [0, LH/2, D],       W, LH, ELSIDE, "lf"),
    ...buildFace("-z", [0, LH/2, 0],       W, LH, ELSIDE, "lk"),
    ...buildFace("+x", [W/2, LH/2, D/2],   D, LH, ELSIDE, "lr"),
    ...buildFace("-x", [-W/2, LH/2, D/2],  D, LH, ELSIDE, "ll"),
    ...buildFace("+y", [0, LH, D/2],       W, D,  ETOP,   "lt"),
    ...buildFace("-y", [0, 0, D/2],        W, D,  fill(8,8), "lb"),
  ], [])

  // ── Interior geometry (MeshBasicMaterial — always visible) ───────────────
  const INSET = 0.025
  const iW = W - INSET * 2
  const iD = D - INSET * 2
  const iH = H - INSET * 2

  const interiorGeometry = useMemo(() => (
    <group position={[0, BY, 0]}>
      {/* Chão — roxo escuro */}
      <mesh position={[0, -H/2 + INSET, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[iW, iD]} />
        <meshBasicMaterial color="#0D0020" />
      </mesh>
      {/* Parede de fundo */}
      <mesh position={[0, 0, -D/2 + INSET]}>
        <planeGeometry args={[iW, iH]} />
        <meshBasicMaterial color="#160030" />
      </mesh>
      {/* Parede da frente */}
      <mesh position={[0, 0, D/2 - INSET]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[iW, iH]} />
        <meshBasicMaterial color="#160030" />
      </mesh>
      {/* Parede esquerda */}
      <mesh position={[-W/2 + INSET, 0, 0]} rotation={[0, Math.PI/2, 0]}>
        <planeGeometry args={[iD, iH]} />
        <meshBasicMaterial color="#160030" />
      </mesh>
      {/* Parede direita */}
      <mesh position={[W/2 - INSET, 0, 0]} rotation={[0, -Math.PI/2, 0]}>
        <planeGeometry args={[iD, iH]} />
        <meshBasicMaterial color="#160030" />
      </mesh>
    </group>
  ), [])

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.14

    if (pivotRef.current) {
      const target = isOpen ? -1.38 : 0
      pivotRef.current.rotation.x = THREE.MathUtils.lerp(
        pivotRef.current.rotation.x, target, delta * 4.5
      )
    }

    // Purple glow fades in when open
    if (glowRef.current) {
      const targetIntensity = isOpen ? 4.0 : 0
      glowRef.current.intensity = THREE.MathUtils.lerp(
        glowRef.current.intensity, targetIntensity, delta * 3.5
      )
    }
  })

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    const next = !isOpen
    setIsOpen(next)
    if (next) onOpen?.()
    else      onClose?.()
  }

  return (
    <group ref={groupRef} onClick={onClick}>
      {/* Interior walls */}
      {interiorGeometry}

      {/* Purple point light — center of body, fades in when open */}
      <pointLight
        ref={glowRef}
        position={[0, BY, 0]}
        intensity={0}
        color="#9900FF"
        distance={1.8}
        decay={1.6}
      />

      {bodyVoxels}

      {/* Lid pivot */}
      <group ref={pivotRef} position={[0, BY + H/2, -D/2]}>
        {/* Lid interior "ceiling" — deep void when open */}
        <mesh position={[0, 0.012, D/2]} rotation={[Math.PI/2, 0, 0]}>
          <planeGeometry args={[W - 0.06, D - 0.06]} />
          <meshBasicMaterial color="#0A0018" />
        </mesh>
        {lidVoxels}
      </group>
    </group>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────
export function EnderChest3D() {
  return (
    <div className="w-full h-full relative cursor-pointer">
      <Canvas shadows dpr={[1,2]} camera={{ position:[1.9,1.7,1.9], fov:46 }}
        gl={{ antialias: true }}>
        <ambientLight intensity={0.28} />
        <directionalLight position={[-5,9,4]} intensity={1.4} castShadow
          shadow-mapSize-width={1024} shadow-mapSize-height={1024} color="#E8D0FF" />
        <directionalLight position={[4,2,-4]} intensity={0.18} color="#6600CC" />
        <Environment preset="night" />

        <Float speed={1.1} rotationIntensity={0.06} floatIntensity={0.14}>
          <EnderChestGroup />
        </Float>

        <ContactShadows position={[0,-0.56,0]} opacity={0.55} scale={5} blur={2.8} far={2} color="#220044"/>
        <OrbitControls enablePan={false} enableZoom={false} rotateSpeed={0.5} />
      </Canvas>

    </div>
  )
}
