"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import { Effects, PerformanceMonitor, AdaptiveDpr } from "@react-three/drei";
import { UnrealBloomPass } from "three-stdlib";
import { MathUtils, type Group, type InstancedMesh } from "three";
import * as THREE from "three";

extend({ UnrealBloomPass });

/** Tracks the pointer across the whole viewport, not just canvas-hover,
 * so the object "looks toward" the cursor wherever it is on the page. */
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

// Scaled down from the original 20k/radius-120 reference so this runs as a
// hero-scoped decorative piece rather than a full-screen showcase: fewer
// instances (CPU-computed per-particle each frame, so count is the main
// cost), smaller world scale to match our camera, no OrbitControls.
const COUNT = 2600;
const PARAMS = {
  radius: 6.2,
  fusion: 2.5,
  convect: 1.2,
  magnetic: 1.4,
  wind: 1.8,
  loops: 14,
};

function ParticleSun() {
  const meshRef = useRef<InstancedMesh>(null);
  const groupRef = useRef<Group>(null);
  const pointer = useGlobalPointer();

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const positions = useMemo(() => {
    // Deterministic scatter (not Math.random -- these are only a starting
    // point before the per-frame lerp takes over toward computed targets).
    const pos: THREE.Vector3[] = [];
    for (let i = 0; i < COUNT; i++) {
      const h1 = (Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1) - 0.5;
      const h2 = (Math.abs(Math.sin(i * 78.233) * 12543.123) % 1) - 0.5;
      const h3 = (Math.abs(Math.sin(i * 45.164) * 98765.432) % 1) - 0.5;
      pos.push(new THREE.Vector3(h1 * 6, h2 * 6, h3 * 6));
    }
    return pos;
  }, []);

  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: 0xffffff }), []);
  const geometry = useMemo(() => new THREE.TetrahedronGeometry(0.02), []);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    const group = groupRef.current;
    if (!mesh || !group) return;

    const time = state.clock.getElapsedTime();
    const { radius: scaleR, fusion: fusionRate, convect: convection, magnetic, wind: windSpeed, loops } = PARAMS;
    const loopsCount = loops;

    for (let i = 0; i < COUNT; i++) {
      const t = i / Math.max(1, COUNT);
      const h1 = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
      const h2 = Math.abs(Math.sin(i * 78.233) * 12543.123) % 1;
      const h3 = Math.abs(Math.sin(i * 45.164) * 98765.432) % 1;
      const h4 = Math.abs(Math.sin(i * 33.719) * 54321.987) % 1;
      const h5 = Math.abs(Math.sin(i * 61.431) * 31415.9265) % 1;

      const t0 = 0.12,
        t1 = 0.32,
        t2 = 0.55,
        t3 = 0.68,
        t4 = 0.78,
        t5 = 0.9;

      let px = 0,
        py = 0,
        pz = 0;

      if (t < t0) {
        // Fusion core -- blue-white, pulsing
        const coreR = scaleR * 0.22;
        const theta = h1 * 6.2831853;
        const cphi = h2 * 2 - 1;
        const sphi = Math.sqrt(Math.max(0, 1 - cphi * cphi));
        const rr = Math.cbrt(Math.max(h3, 0.0001)) * coreR;
        const jitter = Math.sin(time * 3 + h4 * 6.283) * coreR * 0.03;
        const rad = rr + jitter;
        px = rad * sphi * Math.cos(theta);
        py = rad * sphi * Math.sin(theta);
        pz = rad * cphi;
        const burst = Math.pow(0.5 + 0.5 * Math.sin(time * fusionRate * 4 + h5 * 18.85), 6);
        const bright = 0.5 + 0.5 * burst;
        color.setHSL(0.6, 1.0, Math.min(0.95, 0.55 + bright * 0.4));
      } else if (t < t1) {
        // Radiative zone -- deep indigo
        const rMin = scaleR * 0.22,
          rMax = scaleR * 0.46;
        const rr = rMin + h1 * (rMax - rMin);
        const theta = h2 * 6.2831853 + Math.sin(time * 0.03 + h3 * 6.283) * 0.3;
        const cphi = h3 * 2 - 1;
        const sphi = Math.sqrt(Math.max(0, 1 - cphi * cphi));
        const wander = Math.sin(time * 0.08 + h4 * 6.283) * scaleR * 0.02;
        const rad = rr + wander;
        px = rad * sphi * Math.cos(theta);
        py = rad * sphi * Math.sin(theta);
        pz = rad * cphi;
        color.setHSL(0.64, 0.9, 0.35 + h5 * 0.1);
      } else if (t < t2) {
        // Convective granulation cells -- blue heat map
        const rMin = scaleR * 0.46,
          rMax = scaleR * 0.72;
        const rr = rMin + h1 * (rMax - rMin);
        const theta = h2 * 6.2831853;
        const cphi = h3 * 2 - 1;
        const sphi = Math.sqrt(Math.max(0, 1 - cphi * cphi));
        const cell =
          Math.sin(theta * 6 + time * convection * 0.5) +
          Math.sin(cphi * 18 + time * convection * 0.4 + h4 * 6.283) +
          Math.sin((theta + cphi) * 12 - time * convection * 0.6);
        const flow = cell * convection * scaleR * 0.015;
        const rad = rr + flow;
        px = rad * sphi * Math.cos(theta + flow * 0.01);
        py = rad * sphi * Math.sin(theta + flow * 0.01);
        pz = rad * cphi;
        const heat = (cell + 3) / 6;
        color.setHSL(0.58, 1.0, 0.4 + heat * 0.35);
      } else if (t < t3) {
        // Photosphere -- teal surface, dimmer sunspots
        const R = scaleR * 0.76;
        const theta = h1 * 6.2831853;
        const cphi = h2 * 2 - 1;
        const sphi = Math.sqrt(Math.max(0, 1 - cphi * cphi));
        const granule =
          Math.sin(theta * 24 + time * 0.6) +
          Math.sin(cphi * 30 - time * 0.5 + h3 * 6.283) +
          Math.sin(theta * 17 + cphi * 13 + time * 0.4);
        const spotNoise = Math.sin(theta * 3 + h4 * 6.283) + Math.sin(cphi * 4 + time * 0.05);
        const spotDark = Math.max(0, -spotNoise - 1.1) * 0.8;
        const rad = R + granule * scaleR * 0.004;
        px = rad * sphi * Math.cos(theta);
        py = rad * sphi * Math.sin(theta);
        pz = rad * cphi;
        const bright = 0.6 + granule * 0.1 - spotDark;
        color.setHSL(0.51, 0.9, Math.max(0.08, Math.min(0.85, bright)));
      } else if (t < t4) {
        // Chromosphere spicules -- teal-cyan jets
        const Rbase = scaleR * 0.79;
        const theta = h1 * 6.2831853;
        const cphi = h2 * 2 - 1;
        const sphi = Math.sqrt(Math.max(0, 1 - cphi * cphi));
        const spiculeLen = scaleR * 0.05;
        const spicule = Math.abs(Math.sin(time * 2 + h3 * 18.85)) * spiculeLen;
        const rad = Rbase + spicule;
        px = rad * sphi * Math.cos(theta);
        py = rad * sphi * Math.sin(theta);
        pz = rad * cphi;
        color.setHSL(0.53, 0.85, 0.45 + (spicule / Math.max(spiculeLen, 0.0001)) * 0.25);
      } else if (t < t5) {
        if (h5 < 0.5) {
          // Coronal loops -- violet magnetic arches
          const loopIndex = Math.floor(i % loopsCount);
          const lh1 = Math.abs(Math.sin(loopIndex * 17.17) * 6543.21) % 1;
          const lh2 = Math.abs(Math.sin(loopIndex * 29.71) * 7654.32) % 1;
          const lh3 = Math.abs(Math.sin(loopIndex * 53.13) * 8765.43) % 1;
          const lh4 = Math.abs(Math.sin(loopIndex * 71.91) * 9876.54) % 1;
          const pcphi = lh2 * 2 - 1;
          const psphi = Math.sqrt(Math.max(0, 1 - pcphi * pcphi));
          const pTheta = lh1 * 6.2831853;
          const pX = psphi * Math.cos(pTheta),
            pY = psphi * Math.sin(pTheta),
            pZ = pcphi;
          const refX = 0,
            refY = 1,
            refZ = 0.15;
          let e1x = refY * pZ - refZ * pY,
            e1y = refZ * pX - refX * pZ,
            e1z = refX * pY - refY * pX;
          const len1 = Math.max(Math.sqrt(e1x * e1x + e1y * e1y + e1z * e1z), 1e-5);
          e1x /= len1;
          e1y /= len1;
          e1z /= len1;
          let e2x = pY * e1z - pZ * e1y,
            e2y = pZ * e1x - pX * e1z,
            e2z = pX * e1y - pY * e1x;
          const len2 = Math.max(Math.sqrt(e2x * e2x + e2y * e2y + e2z * e2z), 1e-5);
          e2x /= len2;
          e2y /= len2;
          e2z /= len2;
          const halfWidth = 0.2 + lh3 * 0.35;
          const s = h1;
          const alpha = (s - 0.5) * halfWidth * 2;
          let dirx = e1x * Math.cos(alpha) + e2x * Math.sin(alpha);
          let diry = e1y * Math.cos(alpha) + e2y * Math.sin(alpha);
          let dirz = e1z * Math.cos(alpha) + e2z * Math.sin(alpha);
          const dlen = Math.max(Math.sqrt(dirx * dirx + diry * diry + dirz * dirz), 1e-5);
          dirx /= dlen;
          diry /= dlen;
          dirz /= dlen;
          const bulge = Math.cos((s - 0.5) * 3.14159);
          const flarePulse = 0.6 + 0.4 * Math.sin(time * 0.4 * magnetic + lh4 * 6.283);
          const archHeight = scaleR * (0.1 + lh3 * 0.15) * Math.max(0.1, magnetic) * flarePulse;
          const radius = scaleR * 0.8 + archHeight * bulge;
          px = dirx * radius;
          py = diry * radius;
          pz = dirz * radius;
          color.setHSL(0.72, 0.55, 0.45 + bulge * 0.3);
        } else {
          // Solar wind -- fading blue trails
          const theta = h1 * 6.2831853;
          const cphi = h2 * 2 - 1;
          const sphi = Math.sqrt(Math.max(0, 1 - cphi * cphi));
          const travel = (time * windSpeed * 0.6 + h3 * 18) % 18;
          const rad = scaleR * 0.82 + travel * scaleR * 0.05;
          px = rad * sphi * Math.cos(theta);
          py = rad * sphi * Math.sin(theta);
          pz = rad * cphi;
          const fade = Math.max(0, 1 - travel / 18);
          color.setHSL(0.58, 0.4, 0.25 + fade * 0.5);
        }
      } else {
        // Outer loops + wind
        const loopIndex = Math.floor(i % loopsCount);
        const lh1 = Math.abs(Math.sin(loopIndex * 21.31) * 5432.19) % 1;
        const lh2 = Math.abs(Math.sin(loopIndex * 37.77) * 6321.98) % 1;
        const lh3 = Math.abs(Math.sin(loopIndex * 59.59) * 7219.87) % 1;
        const lh4 = Math.abs(Math.sin(loopIndex * 83.13) * 8123.65) % 1;
        const pcphi = lh2 * 2 - 1;
        const psphi = Math.sqrt(Math.max(0, 1 - pcphi * pcphi));
        const pTheta = lh1 * 6.2831853;
        const pX = psphi * Math.cos(pTheta),
          pY = psphi * Math.sin(pTheta),
          pZ = pcphi;
        const refX = 0.15,
          refY = 0,
          refZ = 1;
        let e1x = refY * pZ - refZ * pY,
          e1y = refZ * pX - refX * pZ,
          e1z = refX * pY - refY * pX;
        const len1 = Math.max(Math.sqrt(e1x * e1x + e1y * e1y + e1z * e1z), 1e-5);
        e1x /= len1;
        e1y /= len1;
        e1z /= len1;
        let e2x = pY * e1z - pZ * e1y,
          e2y = pZ * e1x - pX * e1z,
          e2z = pX * e1y - pY * e1x;
        const len2 = Math.max(Math.sqrt(e2x * e2x + e2y * e2y + e2z * e2z), 1e-5);
        e2x /= len2;
        e2y /= len2;
        e2z /= len2;
        const halfWidth = 0.3 + lh3 * 0.5;
        const s = h1;
        const alpha = (s - 0.5) * halfWidth * 2;
        let dirx = e1x * Math.cos(alpha) + e2x * Math.sin(alpha);
        let diry = e1y * Math.cos(alpha) + e2y * Math.sin(alpha);
        let dirz = e1z * Math.cos(alpha) + e2z * Math.sin(alpha);
        const dlen = Math.max(Math.sqrt(dirx * dirx + diry * diry + dirz * dirz), 1e-5);
        dirx /= dlen;
        diry /= dlen;
        dirz /= dlen;
        const bulge = Math.cos((s - 0.5) * 3.14159);
        const flarePulse = 0.5 + 0.5 * Math.sin(time * 0.5 * magnetic + lh4 * 6.283);
        const archHeight = scaleR * (0.2 + lh3 * 0.3) * Math.max(0.1, magnetic) * flarePulse;
        const radius = scaleR * 0.79 + archHeight * bulge;
        px = dirx * radius;
        py = diry * radius;
        pz = dirz * radius;
        color.setHSL(0.7, 0.6, 0.4 + flarePulse * 0.3 + bulge * 0.1);
      }

      target.set(px, py, pz);
      positions[i].lerp(target, 0.1);
      dummy.position.copy(positions[i]);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, color);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

    // Look-at-cursor: idle drift always running, damped toward pointer on
    // top of it -- same pattern as the rest of the site, no free-orbit drag.
    const idleY = time * 0.05;
    const targetX = pointer.current.y * 0.25;
    const targetY = idleY + pointer.current.x * 0.35;
    group.rotation.x = MathUtils.damp(group.rotation.x, targetX, 4, delta);
    group.rotation.y = MathUtils.damp(group.rotation.y, targetY, 4, delta);
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[geometry, material, COUNT]} />
    </group>
  );
}

export default function HeroScene() {
  const [dpr, setDpr] = useState(1.5);
  const [highQuality, setHighQuality] = useState(true);

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 16], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl, scene, camera }) => {
        void gl.compileAsync?.(scene, camera);
      }}
    >
      <PerformanceMonitor
        onDecline={() => {
          setDpr(1);
          setHighQuality(false);
        }}
      />
      <AdaptiveDpr pixelated />

      <ParticleSun />

      {highQuality && (
        <Effects disableGamma>
          {/* @ts-expect-error -- three-stdlib pass registered via extend() */}
          <unrealBloomPass threshold={0} strength={2.2} radius={0.55} />
        </Effects>
      )}
    </Canvas>
  );
}
