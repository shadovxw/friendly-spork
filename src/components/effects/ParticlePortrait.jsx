import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import portraitUrl from '../../assets/portrait.jpg';

// The portrait as a cloud of points. Each point has a scattered position and a "home" on the photo;
// the cloud assembles when it scrolls into view, and the cursor pushes nearby points away (they spring back).
// Background colour is removed so only the person is drawn.

const GRID = 190; // samples per side (~25-30k points once the background is dropped)
const FOV = 35;
const CAM_Z = 3;
const HALF_H = Math.tan((FOV * Math.PI) / 360) * CAM_Z; // world half-height at z=0

const VERTEX = /* glsl */ `
  attribute vec3 aScatter;
  attribute float aLum;
  attribute float aSeed;
  uniform float uForm;
  uniform float uTime;
  uniform float uScale;
  uniform float uSize;
  uniform vec2 uMouse;
  uniform float uMouseOn;
  varying float vLum;
  varying float vNear;
  void main() {
    // staggered assembly: each point starts a little later than the one before it in the random order
    float f = smoothstep(0.0, 1.0, clamp(uForm * 1.5 - aSeed * 0.5, 0.0, 1.0));
    vec3 p = mix(aScatter, position, f);

    // idle shimmer, calmer once assembled
    p.xy += 0.006 * vec2(sin(uTime * 0.9 + aSeed * 40.0), cos(uTime * 0.8 + aSeed * 31.0)) * (1.2 - f * 0.8);

    // cursor pushes points away
    vec2 d = p.xy - uMouse;
    float falloff = exp(-dot(d, d) * 9.0) * uMouseOn * f;
    p.xy += normalize(d + 1e-4) * falloff * 0.22;
    p.z += falloff * 0.35;
    vNear = falloff;
    vLum = aLum;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.7 + aLum * 0.7 + falloff * 0.9) * uScale / -mv.z;
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  varying float vLum;
  varying float vNear;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    float a = smoothstep(0.5, 0.1, r);
    vec3 col = mix(uColor * (0.35 + vLum * 1.2), vec3(1.0), clamp(vNear * 1.4, 0.0, 1.0));
    gl_FragColor = vec4(col, a * (0.3 + vLum * 0.8));
  }
`;

// Read the photo's pixels and turn them into point data.
const buildPoints = (img) => {
  const c = document.createElement('canvas');
  c.width = c.height = GRID;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  // cover-fit the photo into a square
  const s = Math.min(img.width, img.height);
  ctx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, GRID, GRID);
  const { data } = ctx.getImageData(0, 0, GRID, GRID);

  const home = [];
  const scatter = [];
  const lum = [];
  const seed = [];
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      const i = (y * GRID + x) * 4;
      const r = data[i] / 255, g = data[i + 1] / 255, b = data[i + 2] / 255;
      // The backdrop is a lavender gradient that gets darker toward the top corners, so one colour won't do:
      // it is bright and bluer than it is red or green, which skin, hair and the olive shirt are not.
      if (b - r > 0.045 && b - g > 0.07 && (r + g + b) / 3 > 0.5) continue;

      // lift shadows so dark hair and beard keep their texture on a dark page
      let l = 0.299 * r + 0.587 * g + 0.114 * b;
      l = Math.min(Math.max((l - 0.04) / 0.7, 0), 1) ** 0.6;
      l = 0.2 + l * 0.8;

      // small jitter inside the cell so the grid doesn't show
      const jx = (Math.random() - 0.5) / GRID;
      const jy = (Math.random() - 0.5) / GRID;
      home.push(((x / GRID) * 2 - 1 + jx) * HALF_H, (1 - (y / GRID) * 2 + jy) * HALF_H, 0);

      // scattered start: a wide, shallow cloud
      const a = Math.random() * Math.PI * 2;
      const rad = 0.8 + Math.random() * 1.6;
      scatter.push(Math.cos(a) * rad * 1.4, Math.sin(a) * rad, (Math.random() - 0.5) * 2.5);

      lum.push(l);
      seed.push(Math.random());
    }
  }
  return {
    home: new Float32Array(home),
    scatter: new Float32Array(scatter),
    lum: new Float32Array(lum),
    seed: new Float32Array(seed),
  };
};

const Cloud = ({ data, active, reduced, wrapRef }) => {
  const size = useThree((s) => s.size);
  const gl = useThree((s) => s.gl);
  const mouse = useRef({ x: 0, y: 0, on: 0, target: 0 });
  const form = useRef(reduced ? 1 : 0);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uForm: { value: reduced ? 1 : 0 },
          uTime: { value: 0 },
          uScale: { value: 1 },
          uSize: { value: 0.012 },
          uMouse: { value: new THREE.Vector2(9, 9) },
          uMouseOn: { value: 0 },
          uColor: { value: new THREE.Color('#22d3ee') },
        },
      }),
    [reduced]
  );

  // cursor -> world coordinates (z = 0 plane), tracked on the window so the canvas can ignore pointer events
  useEffect(() => {
    if (reduced) return;
    const onMove = (e) => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = 1 - ((e.clientY - r.top) / r.height) * 2;
      mouse.current.x = nx * HALF_H * (r.width / r.height);
      mouse.current.y = ny * HALF_H;
      mouse.current.target = Math.abs(nx) < 1.1 && Math.abs(ny) < 1.1 ? 1 : 0;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduced, wrapRef]);

  // rendering is paused while off screen, so restart the assembly each time it comes back into view
  useEffect(() => {
    if (active && !reduced) form.current = 0;
  }, [active, reduced]);

  useFrame(({ clock }, dt) => {
    const u = material.uniforms;
    u.uTime.value = clock.getElapsedTime();
    // pixels per world unit at z = 1, for perspective point sizes
    u.uScale.value = (size.height * gl.getPixelRatio()) / (2 * Math.tan((FOV * Math.PI) / 360));

    // assemble while on screen
    if (!reduced) {
      form.current += ((active ? 1 : 0) - form.current) * Math.min(dt * (active ? 1.4 : 3), 1);
      u.uForm.value = form.current;
      const m = mouse.current;
      m.on += (m.target - m.on) * Math.min(dt * 6, 1);
      u.uMouse.value.set(m.x, m.y);
      u.uMouseOn.value = m.on;
    }
  });

  return (
    <points material={material} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.home, 3]} />
        <bufferAttribute attach="attributes-aScatter" args={[data.scatter, 3]} />
        <bufferAttribute attach="attributes-aLum" args={[data.lum, 1]} />
        <bufferAttribute attach="attributes-aSeed" args={[data.seed, 1]} />
      </bufferGeometry>
    </points>
  );
};

const ParticlePortrait = () => {
  const wrapRef = useRef(null);
  const [data, setData] = useState(null);
  const [active, setActive] = useState(false);
  const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setData(buildPoints(img));
    img.src = portraitUrl;
  }, []);

  // render (and assemble) only while it is on screen
  useEffect(() => {
    if (!wrapRef.current) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0.15 });
    io.observe(wrapRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="pointer-events-none relative h-full w-full" aria-hidden="true">
      {data && (
        <Canvas
          camera={{ fov: FOV, position: [0, 0, CAM_Z], near: 0.1, far: 50 }}
          dpr={[1, 2]}
          frameloop={active ? 'always' : 'demand'}
          gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
          flat
          style={{ pointerEvents: 'none' }}
        >
          <Cloud data={data} active={active} reduced={reduced} wrapRef={wrapRef} />
        </Canvas>
      )}
    </div>
  );
};

export default ParticlePortrait;
