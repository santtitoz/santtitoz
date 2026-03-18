// Animated typed-code lines displayed alongside the Rubik's Cube template

export const RUBIKS_FILENAME = "rubiks-cube-3d.tsx"

export const RUBIKS_CODE_LINES: string[] = [
  "import { Canvas } from '@react-three/fiber';",
  "import { OrbitControls, Float } from '@react-three/drei';",
  "",
  "const COLORS = {",
  "  R: '#C41E3A',   // Right  - Red",
  "  L: '#FF5800',   // Left   - Orange",
  "  U: '#FFFFFF',   // Up     - White",
  "  D: '#FFD500',   // Down   - Yellow",
  "  F: '#009E60',   // Front  - Green",
  "  B: '#0051BA',   // Back   - Blue",
  "};",
  "",
  "function RubiksGame() {",
  "  const groupRef = useRef(null);",
  "",
  "  useFrame((_, delta) => {",
  "    groupRef.current.rotation.y += delta * 0.3;",
  "  });",
  "",
  "  return (",
  "    <group ref={groupRef}>",
  "      {cubies.map(c => <Cubie key={c.id} pos={c.pos} />)}",
  "    </group>",
  "  );",
  "}",
]
