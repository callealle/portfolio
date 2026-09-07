"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import { Effects, PerformanceMonitor, AdaptiveDpr } from "@react-three/drei";
import { UnrealBloomPass } from "three-stdlib";
import { MathUtils, type Group, type Mesh } from "three";
import * as THREE from "three";

extend({ UnrealBloomPass });

/** Tracks the pointer across the whole viewport, not just canvas-hover. */
function useGlobalPointer() {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    function onMove(e: PointerEvent) {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return pointer;
}

// The platform's actual modules -- kept literal rather than abstracted
// away, per direction: one core, four connected nodes.
const MODULES = ["Purchasing", "Inventory", "Sales", "Financial"];
const NODE_RADIUS = 2.5;

function nodePosition(index: number, total: number): [number, number, number] {
  // Distribute around a tilted ring so the graph reads as a 3D structure
  // rather than a flat wheel from the default camera angle.
  const angle = (index / total) * Math.PI * 2;
  const x = Math.cos(angle) * NODE_RADIUS;
  const z = Math.sin(angle) * NODE_RADIUS;
  const y = Math.sin(angle * 2) * 0.6;
  return [x, y, z];
}

function ConnectionLine({ to, phase }: { to: [number, number, number]; phase: number }) {
  // Built imperatively rather than as JSX -- R3F's <line> intrinsic
  // collides with the DOM/SVG <line> element in the JSX type namespace,
  // a known gotcha; constructing the THREE.Line directly and mounting it
  // via <primitive> sidesteps that ambiguity entirely.
  // The pulse animation lives on opacity via a *ref-attached* material
  // element below rather than a hand-built THREE.LineBasicMaterial --
  // a plain object constructed once in useMemo can't have its properties
  // mutated post-render under the compiler's immutability rule, and a ref
  // can't be written during the render phase (i.e. inside that useMemo
  // factory) either. Letting R3F attach the ref via JSX, then mutating
  // only inside useFrame, satisfies both.
  const materialRef = useRef<THREE.LineBasicMaterial>(null);
  const lineObj = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(...to)]);
    return new THREE.Line(geometry);
  }, [to]);

  useFrame((state) => {
    const material = materialRef.current;
    if (!material) return;
    const t = state.clock.getElapsedTime();
    // A slow pulse traveling along each line, phase-offset per connection,
    // for a "data flowing between modules" read without extra geometry.
    material.opacity = 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(t * 0.8 + phase));
  });

  return (
    <primitive object={lineObj}>
      <lineBasicMaterial
        ref={materialRef}
        attach="material"
        color="#ff5a24"
        transparent
        opacity={0.4}
        toneMapped={false}
      />
    </primitive>
  );
}

function Node({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    const pulse = 1 + 0.12 * Math.sin(t * 1.4 + position[0]);
    meshRef.current.scale.setScalar(pulse);
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.14, 16, 16]} />
      <meshBasicMaterial color="#ff5a24" toneMapped={false} />
    </mesh>
  );
}

function SystemCore({ containerRef }: { containerRef: React.RefObject<HTMLElement | null> }) {
  const groupRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);
  const pointer = useGlobalPointer();

  const nodes = useMemo(
    () => MODULES.map((_, i) => nodePosition(i, MODULES.length)),
    [],
  );

  useFrame((state, delta) => {
    const group = groupRef.current;
    const core = coreRef.current;
    if (!group || !core) return;

    const t = state.clock.getElapsedTime();

    // Fade pointer influence to zero as the hero scrolls out of view, so
    // mouse-look hands off cleanly to the scroll-driven exit rather than
    // fighting it -- computed straight from the DOM, no cross-boundary
    // motion-value plumbing needed.
    let scrollFade = 1;
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const progress = MathUtils.clamp(-rect.top / Math.max(rect.height, 1), 0, 1);
      scrollFade = 1 - progress;
    }

    const idleY = t * 0.06;
    const targetX = pointer.current.y * 0.18 * scrollFade;
    const targetY = idleY + pointer.current.x * 0.28 * scrollFade;

    group.rotation.x = MathUtils.damp(group.rotation.x, targetX, 4, delta);
    group.rotation.y = MathUtils.damp(group.rotation.y, targetY, 4, delta);

    core.rotation.x = t * 0.1;
    core.rotation.y = t * 0.14;
  });

  return (
    <group ref={groupRef}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshBasicMaterial color="#ff5a24" wireframe toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshBasicMaterial color="#fff2ea" toneMapped={false} />
      </mesh>

      {nodes.map((pos, i) => (
        <group key={MODULES[i]}>
          <ConnectionLine to={pos} phase={i * 1.4} />
          <Node position={pos} />
        </group>
      ))}
    </group>
  );
}

function AmbientDust() {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    // Deterministic scatter (not Math.random) -- purely decorative and
    // static, so a fixed hash-based distribution is indistinguishable
    // from random here while staying a pure computation.
    const count = 220;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const h1 = (Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1) - 0.5;
      const h2 = (Math.abs(Math.sin(i * 78.233) * 12543.123) % 1) - 0.5;
      const h3 = (Math.abs(Math.sin(i * 45.164) * 98765.432) % 1) - 0.5;
      arr[i * 3] = h1 * 14;
      arr[i * 3 + 1] = h2 * 14;
      arr[i * 3 + 2] = h3 * 14;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.015;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#8f8d8a" size={0.02} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

export default function HeroScene({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const [dpr, setDpr] = useState(1.5);
  const [highQuality, setHighQuality] = useState(true);

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0.6, 8.5], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl, scene, camera }) => {
        void gl.compileAsync?.(scene, camera);
      }}
    >
      <fogExp2 attach="fog" args={["#0a0a0c", 0.055]} />
      <PerformanceMonitor
        onDecline={() => {
          setDpr(1);
          setHighQuality(false);
        }}
      />
      <AdaptiveDpr pixelated />

      <SystemCore containerRef={containerRef} />
      <AmbientDust />

      {highQuality && (
        <Effects disableGamma>
          {/* @ts-expect-error -- three-stdlib pass registered via extend() */}
          <unrealBloomPass threshold={0} strength={1.3} radius={0.5} />
        </Effects>
      )}
    </Canvas>
  );
}
