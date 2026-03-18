"use client"

import { useRef, useState, useMemo, useEffect } from "react"
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber"
import { OrbitControls, Float, ContactShadows, Environment } from "@react-three/drei"
import * as THREE from "three"

// ─── Types ───────────────────────────────────────────────────────────────────
type CV = [string, number]
type V3 = [number, number, number]

// ─── Palette ─────────────────────────────────────────────────────────────────
const BRD: CV = ["#1E0A02", 0.018]
const CRN: CV = ["#3D1E08", 0.022]
const SEP: CV = ["#2A1006", 0.006]
const P1H: CV = ["#F0A828", 0.046]
const P1M: CV = ["#E09020", 0.032]
const P1D: CV = ["#C07810", 0.020]
const P2H: CV = ["#D88A18", 0.038]
const P2M: CV = ["#C87810", 0.025]
const P2D: CV = ["#A86008", 0.016]
const P3H: CV = ["#C07818", 0.031]
const P3M: CV = ["#B06810", 0.021]
const P3D: CV = ["#985008", 0.013]
const TPH: CV = ["#F8B030", 0.050]
const TPM: CV = ["#F0A020", 0.036]
const TPD: CV = ["#D08010", 0.022]
const INT: CV = ["#0C0602", 0.008]
const IL:  CV = ["#C4CDD6", 0.082]
const IM:  CV = ["#9AAAB5", 0.066]
const ID:  CV = ["#6A7A88", 0.050]
const ILL: CV = ["#D8E2EC", 0.098]

// ─── Face maps ────────────────────────────────────────────────────────────────
const BSIDE: CV[][] = [
  [CRN,BRD,BRD,BRD,BRD,BRD,BRD,CRN],
  [BRD,P1H,P1M,P1H,P1M,P1H,P1M,BRD],
  [BRD,P1M,P1H,P1D,P1M,P1D,P1H,BRD],
  [BRD,SEP,SEP,SEP,SEP,SEP,SEP,BRD],
  [BRD,P2H,P2M,P2H,P2M,P2H,P2M,BRD],
  [BRD,P2M,P2H,P2D,P2M,P2D,P2H,BRD],
  [BRD,SEP,SEP,SEP,SEP,SEP,SEP,BRD],
  [BRD,P3H,P3M,P3H,P3M,P3H,P3M,BRD],
  [BRD,P3M,P3H,P3D,P3M,P3D,P3H,BRD],
  [CRN,BRD,BRD,BRD,BRD,BRD,BRD,CRN],
]

const BTOP: CV[][] = [
  [CRN,BRD,BRD,BRD,BRD,BRD,BRD,CRN],
  [BRD,TPH,TPM,TPH,TPM,TPH,TPM,BRD],
  [BRD,TPM,TPH,TPD,TPM,TPD,TPH,BRD],
  [BRD,SEP,SEP,SEP,SEP,SEP,SEP,BRD],
  [BRD,TPH,TPM,TPH,TPM,TPH,TPM,BRD],
  [BRD,TPM,TPD,TPH,TPM,TPH,TPD,BRD],
  [BRD,SEP,SEP,SEP,SEP,SEP,SEP,BRD],
  [CRN,BRD,BRD,BRD,BRD,BRD,BRD,CRN],
]

const LSIDE: CV[][] = [
  [CRN,BRD,BRD,BRD,BRD,BRD,BRD,CRN],
  [BRD,P1H,P1M,P1H,P1M,P1H,P1M,BRD],
  [BRD,P1M,P1H,P1D,P1M,P1D,P1H,BRD],
  [CRN,BRD,BRD,BRD,BRD,BRD,BRD,CRN],
]

const fill = (r: number, c: number): CV[][] =>
  Array.from({length:r}, () => Array.from({length:c}, () => INT))

// ─── Face orientation ─────────────────────────────────────────────────────────
const PI2 = Math.PI / 2
const FROT: Record<string, { rot: V3; u: V3; v: V3; norm: V3 }> = {
  "+z": { rot:[0,0,0],        u:[1,0,0],  v:[0,1,0],  norm:[0,0,1]  },
  "-z": { rot:[0,Math.PI,0],  u:[-1,0,0], v:[0,1,0],  norm:[0,0,-1] },
  "+x": { rot:[0,PI2,0],      u:[0,0,-1], v:[0,1,0],  norm:[1,0,0]  },
  "-x": { rot:[0,-PI2,0],     u:[0,0,1],  v:[0,1,0],  norm:[-1,0,0] },
  "+y": { rot:[-PI2,0,0],     u:[1,0,0],  v:[0,0,-1], norm:[0,1,0]  },
  "-y": { rot:[PI2,0,0],      u:[1,0,0],  v:[0,0,1],  norm:[0,-1,0] },
}

const OVERLAP = 1.004

function buildFace(key: string, fc: V3, fw: number, fh: number, grid: CV[][], prefix: string): React.ReactNode[] {
  const { rot, u, v, norm } = FROT[key]
  const nv = new THREE.Vector3(...norm)
  const uv = new THREE.Vector3(...u)
  const vv = new THREE.Vector3(...v)
  const cv = new THREE.Vector3(...fc)
  const rows = grid.length, cols = grid[0].length
  const vw = fw / cols, vh = fh / rows

  return grid.flatMap((row, r) => row.map(([color, depth], c) => {
    const uOff = (c / cols - 0.5 + 0.5 / cols) * fw
    const vOff = (r / rows - 0.5 + 0.5 / rows) * fh
    const px = cv.x + nv.x*(depth/2) + uv.x*uOff + vv.x*vOff
    const py = cv.y + nv.y*(depth/2) + uv.y*uOff + vv.y*vOff
    const pz = cv.z + nv.z*(depth/2) + uv.z*uOff + vv.z*vOff
    return (
      <mesh key={`${prefix}${r}-${c}`} position={[px,py,pz]} rotation={rot} castShadow receiveShadow>
        <boxGeometry args={[vw*OVERLAP, vh*OVERLAP, depth + 0.002]} />
        <meshStandardMaterial color={color} roughness={0.78} metalness={0.02} />
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
const SHELL = 0.015

function ChestGroup({ onOpen, onClose }: { onOpen?: () => void; onClose?: () => void }) {
  const groupRef = useRef<THREE.Group>(null)
  const pivotRef = useRef<THREE.Group>(null)
  const [isOpen, setIsOpen] = useState(false)

  const bodyVoxels = useMemo(() => [
    ...buildFace("+z", [0, BY, D/2],    W, H, BSIDE, "bf"),
    ...buildFace("-z", [0, BY,-D/2],    W, H, BSIDE, "bk"),
    ...buildFace("+x", [W/2, BY, 0],    D, H, BSIDE, "br"),
    ...buildFace("-x", [-W/2, BY, 0],   D, H, BSIDE, "bl"),
    ...buildFace("+y", [0, BY+H/2, 0],  W, D, BTOP,  "bt"),
    ...buildFace("-y", [0, BY-H/2, 0],  W, D, fill(8,8), "bb"),
  ], [])

  const lidVoxels = useMemo(() => [
    ...buildFace("+z", [0, LH/2, D],      W, LH, LSIDE, "lf"),
    ...buildFace("-z", [0, LH/2, 0],      W, LH, LSIDE, "lk"),
    ...buildFace("+x", [W/2, LH/2, D/2],  D, LH, LSIDE, "lr"),
    ...buildFace("-x", [-W/2, LH/2, D/2], D, LH, LSIDE, "ll"),
    ...buildFace("+y", [0, LH, D/2],      W, D, BTOP, "lt"),
    ...buildFace("-y", [0, 0, D/2],       W, D, fill(8,8), "lb"),
  ], [])

  const latchVoxels = useMemo(() => {
    const LGRID: CV[][] = [
      [IL,  IL,  IL ],
      [IL,  IM,  IL ],
      [IM,  ID,  IM ],
      [ILL, ILL, ILL],
    ]
    return buildFace("+z", [0, 0, D + 0.005], 0.20, 0.28, LGRID, "la")
  }, [])

  // ── Interior geometry (MeshBasicMaterial = always visible, no light needed) ──
  // Placed just inside the outer voxel walls so they show through the opening.
  const INSET = 0.025
  const iW   = W - INSET * 2
  const iD   = D - INSET * 2
  const iH   = H - INSET * 2

  const interiorGeometry = useMemo(() => (
    <group position={[0, BY, 0]}>
      {/* Chão */}
      <mesh position={[0, -H/2 + INSET, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[iW, iD]} />
        <meshBasicMaterial color="#2A1006" />
      </mesh>
      {/* Parede de fundo (-Z) */}
      <mesh position={[0, 0, -D/2 + INSET]}>
        <planeGeometry args={[iW, iH]} />
        <meshBasicMaterial color="#3D1A08" />
      </mesh>
      {/* Parede da frente (+Z) — visível quando aberto */}
      <mesh position={[0, 0, D/2 - INSET]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[iW, iH]} />
        <meshBasicMaterial color="#3D1A08" />
      </mesh>
      {/* Parede esquerda (-X) */}
      <mesh position={[-W/2 + INSET, 0, 0]} rotation={[0, Math.PI/2, 0]}>
        <planeGeometry args={[iD, iH]} />
        <meshBasicMaterial color="#3D1A08" />
      </mesh>
      {/* Parede direita (+X) */}
      <mesh position={[W/2 - INSET, 0, 0]} rotation={[0, -Math.PI/2, 0]}>
        <planeGeometry args={[iD, iH]} />
        <meshBasicMaterial color="#3D1A08" />
      </mesh>
    </group>
  ), [])



  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.16
    if (pivotRef.current) {
      const target = isOpen ? -1.38 : 0
      pivotRef.current.rotation.x = THREE.MathUtils.lerp(
        pivotRef.current.rotation.x, target, delta * 4.5
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
      {/* Interior body walls — always visible via BasicMaterial */}
      {interiorGeometry}
      {bodyVoxels}
      <group ref={pivotRef} position={[0, BY + H/2, -D/2]}>
        {/* Lid interior ceiling — visible face when lid is open */}
        <mesh position={[0, 0.012, D/2]} rotation={[Math.PI/2, 0, 0]}>
          <planeGeometry args={[W - 0.06, D - 0.06]} />
          <meshBasicMaterial color="#2A1006" />
        </mesh>
        {lidVoxels}
        {latchVoxels}
      </group>
    </group>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────
export function MinecraftChest3D() {
  const openAudioRef  = useRef<HTMLAudioElement | null>(null)
  const closeAudioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    openAudioRef.current  = new Audio("/templates/chest/chest-open.ogg")
    closeAudioRef.current = new Audio("/templates/chest/chest-close.ogg")
    openAudioRef.current.volume  = 0.55
    closeAudioRef.current.volume = 0.55
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
      <Canvas shadows dpr={[1,2]} camera={{ position:[1.9,1.7,1.9], fov:46 }}
        gl={{ antialias: true }}>
        <ambientLight intensity={0.42} />
        <directionalLight position={[-5,9,4]} intensity={1.7} castShadow
          shadow-mapSize-width={1024} shadow-mapSize-height={1024} color="#FFF4E8" />
        <directionalLight position={[4,2,-4]} intensity={0.22} color="#B0C8FF" />
        <Environment preset="studio" />

        <Float speed={1.3} rotationIntensity={0.07} floatIntensity={0.16}>
          <ChestGroup onOpen={handleOpen} onClose={handleClose} />
        </Float>

        <ContactShadows position={[0,-0.56,0]} opacity={0.45} scale={5} blur={2.5} far={2} color="#1a0800"/>
        <OrbitControls enablePan={false} enableZoom={false} rotateSpeed={0.5} />
      </Canvas>

    </div>
  )
}
