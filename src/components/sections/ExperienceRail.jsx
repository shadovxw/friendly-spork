import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';

// The timeline's backbone: a straight core cable with two strands twisting around it.
// Everything above the scroll "head" is lit; a pulse of light keeps travelling down the lit part.
// Orthographic camera => 1 world unit is 1 CSS pixel, so y lines up with the DOM timeline.

const VERTEX = /* glsl */ `
  uniform float uR;
  uniform float uH;
  uniform float uFreq;
  uniform float uPhase;
  uniform float uStrand;
  varying float vY;
  varying float vDepth;
  void main() {
    float a = position.y * uFreq + uPhase + uStrand;
    vec3 p = position;
    // over the last 240px the strands untwist into the core, so the rail trails off as one thin line
    float conv = smoothstep(-uH * 0.5, -uH * 0.5 + 240.0, position.y);
    p.x += uR * conv * cos(a);
    p.z += uR * conv * sin(a);
    vY = p.y;
    vDepth = uR > 0.0 ? sin(a) : 1.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec3 uBright;
  uniform vec3 uDim;
  uniform float uHeadY;
  uniform float uTime;
  uniform float uAlpha;
  varying float vY;
  varying float vDepth;
  void main() {
    float lit = smoothstep(uHeadY - 3.0, uHeadY + 3.0, vY);
    float depth = 0.65 + 0.35 * vDepth;
    float pulse = smoothstep(0.92, 1.0, sin(vY * 0.035 + uTime * 2.5)) * lit;
    float head = exp(-abs(vY - uHeadY) / 14.0);
    vec3 col = mix(uDim, uBright, lit) * depth + vec3(pulse * 0.6 + head * 0.8);
    float a = (mix(0.3, 1.0, lit) + head * 0.5) * uAlpha;
    gl_FragColor = vec4(col, a);
  }
`;

const BRIGHT = new THREE.Color('#22d3ee');
const DIM = new THREE.Color('#3a3a46');

const makeMaterial = ({ r, strand, alpha }) =>
  new THREE.ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uR: { value: r },
      uH: { value: 0 },
      uFreq: { value: (Math.PI * 2) / 180 }, // one twist per 180px
      uPhase: { value: 0 },
      uStrand: { value: strand },
      uBright: { value: BRIGHT },
      uDim: { value: DIM },
      uHeadY: { value: 0 },
      uTime: { value: 0 },
      uAlpha: { value: alpha },
    },
  });

const Cable = ({ headRef }) => {
  const height = useThree((s) => s.size.height);
  const segments = Math.max(8, Math.ceil(height / 3));

  // core, its soft glow, and the two twisting strands
  const mats = useMemo(
    () => [
      makeMaterial({ r: 0, strand: 0, alpha: 1 }),
      makeMaterial({ r: 0, strand: 0, alpha: 0.14 }),
      makeMaterial({ r: 15, strand: 0, alpha: 0.9 }),
      makeMaterial({ r: 15, strand: Math.PI, alpha: 0.9 }),
    ],
    []
  );
  const radii = [1.2, 6, 1.4, 1.4];

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const headY = height / 2 - headRef.current;
    for (const m of mats) {
      m.uniforms.uH.value = height;
      m.uniforms.uTime.value = t;
      m.uniforms.uHeadY.value = headY;
      // strands twist slowly with time and a little more as the page scrolls
      m.uniforms.uPhase.value = t * 0.5 + headRef.current * 0.004;
    }
  });

  return (
    <group>
      {mats.map((m, i) => (
        <mesh key={i} material={m}>
          <cylinderGeometry args={[radii[i], radii[i], height, 8, segments, true]} />
        </mesh>
      ))}
    </group>
  );
};

// active=false pauses rendering (section off screen); the last frame stays on the canvas.
const ExperienceRail = ({ headRef, active }) => (
  <Canvas
    orthographic
    camera={{ position: [0, 0, 100], zoom: 1, near: 0.1, far: 1000 }}
    dpr={[1, 1.5]}
    frameloop={active ? 'always' : 'never'}
    gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
    flat
    style={{ pointerEvents: 'none' }}
  >
    <Cable headRef={headRef} />
  </Canvas>
);

export default ExperienceRail;
