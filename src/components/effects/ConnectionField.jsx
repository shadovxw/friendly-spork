import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';

// Contact background: a drifting nebula of points that pulls together into a loose ring as the section scrolls
// into view (a connection being made). The cursor swirls the points, and a successful form send pulses the ring.
// Built from scratch for this site: small (a few thousand points), additive, paused off screen.

const COUNT = 5200;
const FOV = 40;
const CAM_Z = 4;
const HALF_H = Math.tan((FOV * Math.PI) / 360) * CAM_Z;

const VERTEX = /* glsl */ `
  attribute vec3 aTarget;   // ring position as (angle, radius, depth)
  attribute vec2 aSeed;     // x: random 0..1, y: brightness
  uniform float uTime;
  uniform float uForm;
  uniform float uPulse;
  uniform float uScale;
  uniform float uSize;
  uniform vec2 uMouse;
  uniform float uMouseOn;
  varying float vBright;
  varying float vNear;

  void main() {
    float seed = aSeed.x;

    // nebula: the resting position, drifting slowly
    vec3 nebula = position;
    nebula.x += 0.12 * sin(uTime * 0.25 + seed * 40.0);
    nebula.y += 0.12 * cos(uTime * 0.21 + seed * 31.0);

    // ring: polar target, slowly turning, and a little wider while pulsing
    float a = aTarget.x + uTime * 0.06;
    float r = aTarget.y * (1.0 + 0.12 * uPulse);
    vec3 ring = vec3(cos(a) * r * 1.1, sin(a) * r * 0.6 + 0.42, aTarget.z);

    // staggered assembly so the points arrive one after another
    float f = smoothstep(0.0, 1.0, clamp(uForm * 1.6 - seed * 0.6, 0.0, 1.0));
    vec3 p = mix(nebula, ring, f);

    // cursor vortex: twist the points around the pointer
    vec2 d = p.xy - uMouse;
    float fall = exp(-dot(d, d) * 2.2) * uMouseOn;
    float ang = 1.5 * fall;
    float c = cos(ang), s = sin(ang);
    p.xy = uMouse + vec2(c * d.x - s * d.y, s * d.x + c * d.y);
    vNear = fall;

    vBright = aSeed.y * (0.55 + 0.45 * f) + uPulse * 0.5;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.6 + aSeed.y * 0.9 + fall * 0.8 + uPulse * 0.8) * uScale / -mv.z;
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  varying float vBright;
  varying float vNear;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    float a = smoothstep(0.5, 0.05, r);
    // brightens toward a pale tint (not white); the page's colour overlay turns it pale purple
    vec3 col = mix(uColor, vec3(0.65, 0.95, 0.99), clamp(vNear * 0.7 + vBright * 0.25, 0.0, 1.0));
    gl_FragColor = vec4(col, a * (0.15 + vBright * 0.7) * (1.0 - 0.3 * vNear));
  }
`;

const buildData = () => {
  const position = new Float32Array(COUNT * 3);
  const target = new Float32Array(COUNT * 3);
  const seed = new Float32Array(COUNT * 2);
  const halfW = HALF_H * 1.2;
  for (let i = 0; i < COUNT; i++) {
    // nebula: denser toward the middle, spread wide, a little depth
    const spread = Math.pow(Math.random(), 0.6);
    const ang = Math.random() * Math.PI * 2;
    position[i * 3] = Math.cos(ang) * spread * halfW * 1.6;
    position[i * 3 + 1] = Math.sin(ang) * spread * HALF_H * 1.2;
    position[i * 3 + 2] = (Math.random() - 0.5) * 1.6;

    // ring: angle, radius (with thickness), depth
    // two thirds of the points sit on the upper half of the ring (behind the heading), the rest below
    target[i * 3] = Math.random() < 0.66 ? Math.random() * Math.PI : Math.PI + Math.random() * Math.PI;
    target[i * 3 + 1] = 0.85 + (Math.random() - 0.5) * 0.45 + (Math.random() < 0.15 ? Math.random() * 0.4 : 0);
    target[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

    seed[i * 2] = Math.random();
    seed[i * 2 + 1] = 0.25 + Math.random() * 0.75;
  }
  return { position, target, seed };
};

const Field = ({ active, wrapRef }) => {
  const size = useThree((s) => s.size);
  const gl = useThree((s) => s.gl);
  const data = useMemo(buildData, []);
  const form = useRef(0);
  const pulse = useRef(0);
  const mouse = useRef({ x: 9, y: 9, on: 0, target: 0 });

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uForm: { value: 0 },
          uPulse: { value: 0 },
          uScale: { value: 1 },
          uSize: { value: 0.016 },
          uMouse: { value: new THREE.Vector2(9, 9) },
          uMouseOn: { value: 0 },
          // the page's colour overlay turns this cyan into the site's purple
          uColor: { value: new THREE.Color('#22d3ee') },
        },
      }),
    []
  );

  // pointer position -> world coordinates, tracked on the window because the canvas ignores pointer events
  useEffect(() => {
    const onMove = (e) => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = 1 - ((e.clientY - r.top) / r.height) * 2;
      mouse.current.x = nx * HALF_H * (r.width / r.height);
      mouse.current.y = ny * HALF_H;
      mouse.current.target = Math.abs(nx) <= 1 && Math.abs(ny) <= 1 ? 1 : 0;
    };
    const onSent = () => { pulse.current = 1; };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('contact-sent', onSent);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('contact-sent', onSent);
    };
  }, [wrapRef]);

  // every time the section comes back into view the points gather again
  useEffect(() => {
    if (active) form.current = 0;
  }, [active]);

  useFrame(({ clock }, dt) => {
    const u = material.uniforms;
    u.uTime.value = clock.getElapsedTime();
    u.uScale.value = (size.height * gl.getPixelRatio()) / (2 * Math.tan((FOV * Math.PI) / 360));

    form.current = Math.min(form.current + dt / 3.2, 1);
    u.uForm.value = form.current;

    pulse.current = Math.max(pulse.current - dt * 0.9, 0);
    u.uPulse.value = Math.sin(pulse.current * Math.PI);

    const m = mouse.current;
    m.on += (m.target - m.on) * Math.min(dt * 5, 1);
    u.uMouse.value.set(m.x, m.y);
    u.uMouseOn.value = m.on;
  });

  return (
    <points material={material} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.position, 3]} />
        <bufferAttribute attach="attributes-aTarget" args={[data.target, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[data.seed, 2]} />
      </bufferGeometry>
    </points>
  );
};

const ConnectionField = ({ fallback = null }) => {
  const wrapRef = useRef(null);
  const [active, setActive] = useState(false);
  // phones and reduced-motion visitors get the lighter fallback instead of a WebGL canvas
  const simple = useMemo(
    () => window.matchMedia('(max-width: 767px)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  useEffect(() => {
    if (simple || !wrapRef.current) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: '100px 0px' });
    io.observe(wrapRef.current);
    return () => io.disconnect();
  }, [simple]);

  if (simple) return fallback;

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0" aria-hidden="true">
      <Canvas
        camera={{ fov: FOV, position: [0, 0, CAM_Z], near: 0.1, far: 50 }}
        dpr={[1, 1.5]}
        frameloop={active ? 'always' : 'never'}
        gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
        flat
        style={{ pointerEvents: 'none' }}
      >
        <Field active={active} wrapRef={wrapRef} />
      </Canvas>
    </div>
  );
};

export default ConnectionField;
