// Animated typed-code lines displayed alongside the Chest template

export const CHEST_FILENAME = "minecraft-chest-3d.tsx"

export const CHEST_CODE_LINES: string[] = [
  "import { Canvas, useFrame } from '@react-three/fiber';",
  "import { Float, ContactShadows } from '@react-three/drei';",
  "",
  "const WOOD  = ['#C8841A', '#D49220', '#BF7C14'];",
  "const DARK  = '#2D1506';",
  "const IRON  = '#9BA8B2';",
  "",
  "function MinecraftChest() {",
  "  const [isOpen, setIsOpen] = useState(false);",
  "  const pivotRef = useRef(null);",
  "",
  "  useFrame((_, dt) => {",
  "    const target = isOpen ? -1.45 : 0;",
  "    pivotRef.current.rotation.x =",
  "      lerp(pivotRef.current.rotation.x, target, dt * 5);",
  "  });",
  "",
  "  return (",
  "    <group onClick={() => setIsOpen(o => !o)}>",
  "      <Chest material={WOOD} />",
  "      <Latch material={IRON} />",
  "    </group>",
  "  );",
  "}",
]
