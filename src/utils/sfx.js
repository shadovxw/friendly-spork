// Tiny UI sound engine (Web Audio). Sounds: Kenney "Interface Sounds", CC0 (public/sounds/ui/LICENSE-kenney.txt).
//  - Nothing loads or plays until the visitor's first click / key / touch (browsers block audio before
//    that anyway), so the page never makes noise on its own and the files cost nothing up front.
//  - Mute state persists in localStorage ('sfx:muted'); subscribe() lets the UI show the toggle state.
const FILES = {
  hover: '/sounds/ui/hover.mp3',
  click: '/sounds/ui/click.mp3',
  stage: '/sounds/ui/stage.mp3',
  complete: '/sounds/ui/complete.mp3',
  toggle: '/sounds/ui/toggle.mp3',
  glitch: '/sounds/ui/glitch.mp3',
};
const DEFAULT_VOLUME = { hover: 0.18, click: 0.4, stage: 0.35, complete: 0.4, toggle: 0.4, glitch: 0.15 };
const MIN_GAP = { hover: 45, stage: 120, glitch: 300 }; // ms; stops rapid repeats stacking up

let ctx = null;
let buffers = {};
let loading = null;
let unlocked = false;
const lastPlayed = {};
const listeners = new Set();

let muted = (() => {
  try { return localStorage.getItem('sfx:muted') === '1'; } catch { return false; }
})();

const load = () => {
  if (loading) return loading;
  loading = Promise.all(
    Object.entries(FILES).map(async ([name, url]) => {
      try {
        const res = await fetch(url);
        buffers[name] = await ctx.decodeAudioData(await res.arrayBuffer());
      } catch { /* a missing sound just stays silent */ }
    })
  );
  return loading;
};

const unlock = () => {
  if (unlocked) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  unlocked = true;
  ctx = new AC();
  ctx.resume?.();
  load();
  ['pointerdown', 'keydown', 'touchend'].forEach((t) => window.removeEventListener(t, unlock, true));
};

if (typeof window !== 'undefined') {
  ['pointerdown', 'keydown', 'touchend'].forEach((t) => window.addEventListener(t, unlock, { capture: true, passive: true }));
}

export const sfx = {
  play(name, volume) {
    if (muted || !ctx || !buffers[name]) return;
    const now = performance.now();
    if (MIN_GAP[name] && now - (lastPlayed[name] || 0) < MIN_GAP[name]) return;
    lastPlayed[name] = now;
    if (ctx.state === 'suspended') ctx.resume();
    const src = ctx.createBufferSource();
    const gain = ctx.createGain();
    gain.gain.value = volume ?? DEFAULT_VOLUME[name] ?? 0.3;
    src.buffer = buffers[name];
    src.connect(gain).connect(ctx.destination);
    src.start();
  },
  get muted() { return muted; },
  setMuted(value) {
    muted = value;
    try { localStorage.setItem('sfx:muted', value ? '1' : '0'); } catch { /* ignore */ }
    listeners.forEach((fn) => fn(muted));
    if (!muted) sfx.play('toggle');
  },
  toggle() { sfx.setMuted(!muted); },
  subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
};
