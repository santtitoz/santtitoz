// Animated typed-code lines displayed alongside the Planet template

export const PLANET_FILENAME = "planet-cube-3d.tsx"

export const PLANET_CODE_LINES: string[] = [
  "import { Canvas, useFrame } from '@react-three/fiber';",
  "import { Float, Environment } from '@react-three/drei';",
  "import * as THREE from 'three';",
  "",
  "const C = {",
  "  O: '#4A7EC7', // ocean",
  "  L: '#6BBE45', // land",
  "  H: '#4E9C30', // highland",
  "  W: '#F0F2F4', // cloud",
  "  I: '#C8E8F8', // ice",
  "};",
  "",
  "function EarthSculpture() {",
  "  const groupRef = useRef(null);",
  "",
  "  useFrame((_, dt) => {",
  "    groupRef.current.rotation.y += dt * 0.18;",
  "    groupRef.current.rotation.x += dt * 0.025;",
  "  });",
  "",
  "  return (",
  "    <group ref={groupRef}>",
  "      <Core />",
  "      {tiles.map(t => <Voxel key={t.id} {...t} />)}",
  "    </group>",
  "  );",
  "}",
]
