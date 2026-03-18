"use client"

import { useRef, useState, useMemo } from "react"
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

// No gap — tiles are seamless. A tiny extra depth overlap (+0.002) hides z-fighting between adjacent tiles.
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
        {/* OVERLAP slightly larger width/height so tiles touch with no gap */}
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
const BY = -LH / 2   // body Y center → full chest centered at y=0

// Shell inset thickness — interior face sits just inside the voxel surface
const SHELL = 0.015

function ChestGroup() {
  const groupRef = useRef<THREE.Group>(null)
  const pivotRef = useRef<THREE.Group>(null)
  const [isOpen, setIsOpen] = useState(false)

  // ── Body voxel faces ──────────────────────────────────────────────────────
  const bodyVoxels = useMemo(() => [
    ...buildFace("+z", [0, BY, D/2],    W, H, BSIDE, "bf"),
    ...buildFace("-z", [0, BY,-D/2],    W, H, BSIDE, "bk"),
    ...buildFace("+x", [W/2, BY, 0],    D, H, BSIDE, "br"),
    ...buildFace("-x", [-W/2, BY, 0],   D, H, BSIDE, "bl"),
    ...buildFace("+y", [0, BY+H/2, 0],  W, D, BTOP,  "bt"),
    ...buildFace("-y", [0, BY-H/2, 0],  W, D, fill(8,8), "bb"),
  ], [])

  // ── Lid voxel faces (pivot-local space) ───────────────────────────────────
  // Pivot at world (0, BY+H/2, -D/2)
  // Lid local bounds: x∈[-W/2,W/2], y∈[0,LH], z∈[0,D]
  const lidVoxels = useMemo(() => [
    ...buildFace("+z", [0, LH/2, D],    W, LH, LSIDE, "lf"),  // FRONT
    ...buildFace("-z", [0, LH/2, 0],    W, LH, LSIDE, "lk"),  // BACK
    ...buildFace("+x", [W/2, LH/2, D/2], D, LH, LSIDE, "lr"),
    ...buildFace("-x", [-W/2, LH/2, D/2], D, LH, LSIDE, "ll"),
    ...buildFace("+y", [0, LH, D/2],    W, D, BTOP, "lt"),     // TOP
    ...buildFace("-y", [0, 0, D/2],     W, D, fill(8,8), "lb"),// BOTTOM (interior)
  ], [])

  // ── Latch (pivot-local: front-center-bottom of lid) ────────────────────
  const latchVoxels = useMemo(() => {
    const LGRID: CV[][] = [
      [IL,  IL,  IL ],
      [IL,  IM,  IL ],
      [IM,  ID,  IM ],
      [ILL, ILL, ILL],
    ]
    return buildFace("+z", [0, 0, D + 0.005], 0.20, 0.28, LGRID, "la")
  }, [])

  // ── Dark interior shell (body) ─────────────────────────────────────────
  // A solid box rendered on the inside of the body so the opening is never see-through.
  // Rendered with backSide so it's visible only from above/inside when the lid lifts.
  const bodyInteriorShell = useMemo(() => {
    const iW = W - SHELL * 2
    const iH = H - SHELL * 2
    const iD = D - SHELL * 2
    return (
      <mesh position={[0, BY, 0]}>
        <boxGeometry args={[iW, iH, iD]} />
        {/* side=BackSide renders interior faces — visible only when looking inside */}
        <meshStandardMaterial
          color="#0A0502"
          roughness={1}
          metalness={0}
          side={THREE.BackSide}
        />
      </mesh>
    )
  }, [])

  // ── Dark interior shell (lid, pivot-local) ─────────────────────────────
  const lidInteriorShell = useMemo(() => {
    const iW = W - SHELL * 2
    const iLH = LH - SHELL
    const iD = D - SHELL * 2
    return (
      <mesh position={[0, LH/2, D/2]}>
        <boxGeometry args={[iW, iLH, iD]} />
        <meshStandardMaterial
          color="#0A0502"
          roughness={1}
          metalness={0}
          side={THREE.BackSide}
        />
      </mesh>
    )
  }, [])

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.16
    if (pivotRef.current) {
      const target = isOpen ? -1.38 : 0
      pivotRef.current.rotation.x = THREE.MathUtils.lerp(
        pivotRef.current.rotation.x, target, delta * 4.5
      )
    }
  })

  const onClick = (e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); setIsOpen(o => !o) }

  return (
    <group ref={groupRef} onClick={onClick}>

      {/* Dark interior shell renders first so it sits behind voxels */}
      {bodyInteriorShell}

      {bodyVoxels}

      {/* ── Lid pivot: world (0, BY+H/2, -D/2) ── */}
      <group ref={pivotRef} position={[0, BY + H/2, -D/2]}>

        {lidInteriorShell}

        {lidVoxels}

        {/* Latch fixed to lid front-base */}
        {latchVoxels}
      </group>
    </group>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────
export function MinecraftChest3D() {
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
          <ChestGroup />
        </Float>

        <ContactShadows position={[0,-0.56,0]} opacity={0.45} scale={5} blur={2.5} far={2} color="#1a0800"/>
        <OrbitControls enablePan={false} enableZoom={false} rotateSpeed={0.5} />
      </Canvas>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-background/20 backdrop-blur-md border border-white/10 text-[10px] font-mono tracking-widest text-muted-foreground uppercase pointer-events-none select-none">
        Click to open
      </div>
    </div>
  )
}
