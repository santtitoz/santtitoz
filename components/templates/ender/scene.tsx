"use client"

import { useRef, useState, useMemo, useEffect } from "react"
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber"
import { OrbitControls, Float, ContactShadows, Environment } from "@react-three/drei"
import * as THREE from "three"

// ─── Extended voxel type ─────────────────────────────────────────────────────
type VC = {
  color: string
  depth: number
  emissive?: string
  emissiveIntensity?: number
}
type V3 = [number, number, number]

// ─── Cartoon Palette ── Teal Obsidian + Yellow Latch + Cyan Eye ──────────────
// Offset depths for tactile relief ("mesma pegada"), softer cartoon colors
const TRM: VC = { color: "#111A1C", depth: 0.050 } // Trim / Frame (black/dark-blueish)
const OBS: VC = { color: "#253436", depth: 0.035 } // Base obsidian
const OBL: VC = { color: "#3B4E4D", depth: 0.045 } // Lighter obsidian pop
const DRK: VC = { color: "#172022", depth: 0.020 } // Darker crevices
const EY1: VC = { color: "#1A3D36", depth: 0.038 } // Outer eye aura
const EY2: VC = { color: "#4A8A6A", depth: 0.050, emissive: "#4D8F70", emissiveIntensity: 0.8 } // Bright green/cyan
const EY3: VC = { color: "#82E2A6", depth: 0.065, emissive: "#7ED49A", emissiveIntensity: 1.5 } // Core eye bright glow
const INT: VC = { color: "#000000", depth: 0.010 } // Interior void

const LLY: VC = { color: "#F0E486", depth: 0.025 } // Latch highlights
const LLM: VC = { color: "#DBCF74", depth: 0.025 }
const LLD: VC = { color: "#B8AD5B", depth: 0.025 }

// ─── Face maps ───────────────────────────────────────────────────────────────
// ESIDE (10 rows × 8 cols)
const ESIDE: VC[][] = [
  [TRM,TRM,TRM,TRM,TRM,TRM,TRM,TRM],
  [TRM,OBS,OBL,OBS,DRK,OBL,OBS,TRM],
  [TRM,OBL,DRK,OBS,OBS,DRK,OBL,TRM],
  [TRM,OBS,OBL,DRK,OBL,OBS,DRK,TRM],
  [TRM,DRK,OBS,OBL,DRK,OBS,OBL,TRM],
  [TRM,OBS,DRK,OBS,OBL,DRK,OBS,TRM],
  [TRM,OBL,OBS,DRK,OBS,OBL,DRK,TRM],
  [TRM,DRK,OBL,OBS,DRK,OBS,OBL,TRM],
  [TRM,OBS,DRK,OBL,OBS,DRK,OBS,TRM],
  [TRM,TRM,TRM,TRM,TRM,TRM,TRM,TRM],
]

// EFRONT — eye placed centrally
const EFRONT: VC[][] = [
  [TRM,TRM,TRM,TRM,TRM,TRM,TRM,TRM],
  [TRM,OBS,OBL,EY1,EY1,OBL,OBS,TRM],
  [TRM,OBL,EY1,EY2,EY2,EY1,OBL,TRM],
  [TRM,OBS,EY2,EY3,EY3,EY2,DRK,TRM],
  [TRM,DRK,EY2,EY3,EY3,EY2,OBL,TRM],
  [TRM,OBS,EY1,EY2,EY2,EY1,OBS,TRM],
  [TRM,OBL,OBS,EY1,EY1,OBL,DRK,TRM],
  [TRM,DRK,OBL,OBS,DRK,OBS,OBL,TRM],
  [TRM,OBS,DRK,OBL,OBS,DRK,OBS,TRM],
  [TRM,TRM,TRM,TRM,TRM,TRM,TRM,TRM],
]

// ETOP (8 rows × 8 cols)
const ETOP: VC[][] = [
  [TRM,TRM,TRM,TRM,TRM,TRM,TRM,TRM],
  [TRM,OBS,DRK,OBL,OBS,DRK,OBS,TRM],
  [TRM,DRK,OBL,OBS,DRK,OBL,DRK,TRM],
  [TRM,OBL,OBS,DRK,OBL,OBS,OBL,TRM],
  [TRM,OBS,DRK,OBL,OBS,DRK,OBS,TRM],
  [TRM,DRK,OBL,OBS,DRK,OBL,DRK,TRM],
  [TRM,OBL,OBS,DRK,OBL,OBS,OBL,TRM],
  [TRM,TRM,TRM,TRM,TRM,TRM,TRM,TRM],
]

// ELSIDE — lid side (4 rows × 8 cols)
const ELSIDE: VC[][] = [
  [TRM,TRM,TRM,TRM,TRM,TRM,TRM,TRM],
  [TRM,OBL,DRK,OBS,OBL,DRK,OBL,TRM],
  [TRM,OBS,OBL,DRK,OBS,OBL,OBS,TRM],
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

const OVERLAP = 1.01 // Eliminando a transparência entre pixels (igual báu normal)

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
          roughness={0.85}
          metalness={0.05}
          emissive={emissive ? new THREE.Color(emissive) : undefined}
          emissiveIntensity={emissiveIntensity ?? 0}
        />
      </mesh>
    )
  }))
}

// ─── Chest dimensions ─────────────────────────────────────────────────────────
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

  const bodyVoxels = useMemo(() => [
    ...buildFace("+z", [0, BY, D/2],    W, H, EFRONT, "bf"),
    ...buildFace("-z", [0, BY,-D/2],    W, H, ESIDE,  "bk"),
    ...buildFace("+x", [W/2, BY, 0],    D, H, ESIDE,  "br"),
    ...buildFace("-x", [-W/2, BY, 0],   D, H, ESIDE,  "bl"),
    ...buildFace("+y", [0, BY+H/2, 0],  W, D, ETOP,   "bt"),
    ...buildFace("-y", [0, BY-H/2, 0],  W, D, fill(8,8), "bb"),
  ], [])

  const lidVoxels = useMemo(() => [
    ...buildFace("+z", [0, LH/2, D],       W, LH, ELSIDE, "lf"),
    ...buildFace("-z", [0, LH/2, 0],       W, LH, ELSIDE, "lk"),
    ...buildFace("+x", [W/2, LH/2, D/2],   D, LH, ELSIDE, "lr"),
    ...buildFace("-x", [-W/2, LH/2, D/2],  D, LH, ELSIDE, "ll"),
    ...buildFace("+y", [0, LH, D/2],       W, D,  ETOP,   "lt"),
    ...buildFace("-y", [0, 0, D/2],        W, D,  fill(8,8), "lb"),
  ], [])

  const latchVoxels = useMemo(() => {
    const LGRID: VC[][] = [
      [LLY, LLY, LLY ],
      [LLY, LLM, LLY ],
      [LLM, LLD, LLM ],
      [LLD, LLD, LLD ],
    ]
    // Offset Z by 0.052 so the latch pops out significantly from the lid
    return buildFace("+z", [0, 0, D + 0.052], 0.20, 0.28, LGRID, "la")
  }, [])

  const INSET = 0.025
  const iW = W - INSET * 2
  const iD = D - INSET * 2
  const iH = H - INSET * 2

  const interiorGeometry = useMemo(() => (
    <group position={[0, BY, 0]}>
      {/* Floor — matte-black void */}
      <mesh position={[0, -H/2 + INSET, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[iW, iD]} />
        <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, 0, -D/2 + INSET]}>
        <planeGeometry args={[iW, iH]} />
        <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
      </mesh>
      {/* Front wall */}
      <mesh position={[0, 0, D/2 - INSET]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[iW, iH]} />
        <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-W/2 + INSET, 0, 0]} rotation={[0, Math.PI/2, 0]}>
        <planeGeometry args={[iD, iH]} />
        <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
      </mesh>
      {/* Right wall */}
      <mesh position={[W/2 - INSET, 0, 0]} rotation={[0, -Math.PI/2, 0]}>
        <planeGeometry args={[iD, iH]} />
        <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
      </mesh>
    </group>
  ), [])

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.14

    if (pivotRef.current) {
      const target = isOpen ? -Math.PI / 4 : 0
      pivotRef.current.rotation.x = THREE.MathUtils.lerp(
        pivotRef.current.rotation.x, target, delta * 4.5
      )
    }

    if (glowRef.current) {
      const targetIntensity = isOpen ? 3.5 : 0
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
      {interiorGeometry}

      <pointLight
        ref={glowRef}
        position={[0, BY, 0]}
        intensity={0}
        color="#33FFBB"
        distance={2.0}
        decay={1.6}
      />

      {bodyVoxels}

      <group ref={pivotRef} position={[0, BY + H/2, -D/2]}>
        <mesh position={[0, 0.012, D/2]} rotation={[Math.PI/2, 0, 0]}>
          <planeGeometry args={[W - 0.06, D - 0.06]} />
          <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
        </mesh>
        {lidVoxels}
        {latchVoxels}
      </group>
    </group>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────
export function EnderChest3D() {
  const openAudioRef  = useRef<HTMLAudioElement | null>(null)
  const closeAudioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    openAudioRef.current  = new Audio("/templates/ender/ender-open.ogg")
    closeAudioRef.current = new Audio("/templates/ender/ender-close.ogg")
    if (openAudioRef.current) openAudioRef.current.volume  = 0.55
    if (closeAudioRef.current) closeAudioRef.current.volume = 0.55
  }, [])

  const handleOpen  = () => {
    closeAudioRef.current?.pause()
    if (openAudioRef.current) {
      openAudioRef.current.currentTime = 0
      openAudioRef.current.play().catch(() => {})
    }
  }

  const handleClose = () => {
    openAudioRef.current?.pause()
    if (closeAudioRef.current) {
      closeAudioRef.current.currentTime = 0
      closeAudioRef.current.play().catch(() => {})
    }
  }

  return (
    <div className="w-full h-full relative cursor-pointer">
      <Canvas shadows dpr={[1,2]} camera={{ position:[2.2,2.0,2.2], fov:42 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
        
        <ambientLight intensity={0.45} />
        
        <directionalLight position={[-4,8,6]} intensity={2.8} castShadow
          shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0002} color="#F5FEFF" />
          
        <directionalLight position={[6,3,-5]} intensity={1.5} color="#55FFCC" />
        
        <directionalLight position={[0, -5, 0]} intensity={0.8} color="#0D2222" />
        
        <Environment preset="city" />

        <Float speed={1.1} rotationIntensity={0.05} floatIntensity={0.10}>
          <EnderChestGroup onOpen={handleOpen} onClose={handleClose} />
        </Float>

        <ContactShadows position={[0,-0.56,0]} opacity={0.65} scale={5} blur={2.0} far={2} color="#081014"/>
        <OrbitControls enablePan={false} enableZoom={false} rotateSpeed={0.5} />
      </Canvas>
    </div>
  )
}
