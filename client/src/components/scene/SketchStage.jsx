import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";

function OrbitingSketch() {
  const shellRef = useRef(null);
  const ringRef = useRef(null);

  useFrame((state, delta) => {
    if (shellRef.current) {
      shellRef.current.rotation.y += delta * 0.45;
      shellRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.25;
    }

    if (ringRef.current) {
      ringRef.current.rotation.x += delta * 0.4;
      ringRef.current.rotation.z += delta * 0.25;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.65} floatIntensity={1.6}>
      <group>
        <mesh ref={shellRef}>
          <icosahedronGeometry args={[1.35, 12]} />
          <meshStandardMaterial
            color="#4da8ff"
            metalness={0.45}
            roughness={0.2}
            emissive="#4d2ea8"
            emissiveIntensity={0.24}
          />
        </mesh>
        <mesh ref={ringRef} scale={1.5}>
          <torusGeometry args={[1.3, 0.08, 16, 100]} />
          <meshStandardMaterial color="#8d6bff" metalness={0.6} roughness={0.16} />
        </mesh>
      </group>
    </Float>
  );
}

export default function SketchStage() {
  return (
    <div className="relative h-[300px] w-full overflow-hidden rounded-[2rem] border border-white/20 bg-gradient-to-br from-slate-900/70 to-indigo-950/60 shadow-2xl shadow-indigo-900/30">
      <div className="hero-grid absolute inset-0 animate-grid-pan opacity-35" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_5%,rgba(125,204,255,0.35),transparent_50%)]" />
      <Canvas camera={{ position: [0, 0, 4.4], fov: 45 }}>
        <ambientLight intensity={0.75} />
        <directionalLight intensity={1.4} position={[3, 3, 2]} color="#95b8ff" />
        <OrbitingSketch />
        <Environment preset="night" />
      </Canvas>
      <div className="pointer-events-none absolute bottom-4 left-4 rounded-full border border-sky-200/30 bg-slate-900/65 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-100 backdrop-blur">
        NEOROX Motion Lab
      </div>
    </div>
  );
}
