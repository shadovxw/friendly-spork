import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { shouldAutoRebuild, markAutoRebuild } from '../../utils/swarmOnce';

// "Swarm rebuild": a crowd of agent cursors rebuilds the real page, piece by piece, in place.
//
// How it works
//  - collectLayers() walks the page and picks the pieces to build: text blocks, boxes (cards, chips, buttons),
//    media and canvases. Each piece is hidden with a data attribute (see index.css) and listed in document order.
//  - Agents (small coloured cursors with a tag) each claim the next visible piece, fly to it, and reveal it:
//    text is "typed" left to right, boxes are dragged out, media wipes in. Size labels show while they work.
//  - Only what is on screen gets built. Tour mode scrolls the page for you; scrolling by hand works too.
//  - Nothing is cloned or changed permanently: exiting removes every attribute and inline effect it added.

// Ways to run it:
//  - Manual (Ctrl K -> Rebuild, Alt+Shift+S): the full, watchable version at normal speed, with the control bar.
//  - Intro: plays once, right after the glitch preloader (which itself plays once per session). INTRO_STYLE picks how:
//      'scroll' - builds only the first screen, then each section as the visitor scrolls to it. Nothing scrolls by
//                 itself, built pieces stay built, and pieces scrolled past before an agent got there just appear.
//                 It switches itself off once the whole page is built.
//      'tour'   - the whole page at high speed, scrolled for you, over in about 10 seconds; any input finishes it.
// Also available: /?rebuild=fast (first screen only, ~2s) and the once-a-day rule in swarmOnce.js, both unused by default.
const INTRO_AFTER_PRELOADER = true;
const AUTO_ON_FIRST_VISIT = false;
const INTRO_STYLE = 'scroll';
const INTRO_OPTS = {
  scroll: { scroll: true, tour: false, speed: 4, ui: 'none', startAgents: 10, maxAgents: 14, scope: 'page', lead: 0.12, deadline: 2500 },
  tour: { tour: true, speed: 8, fast: true, ui: 'skip', startAgents: 20, maxAgents: 20, tourStep: 1, tourEvery: 160, hold: 700, scope: 'page', maxDuration: 12000, returnToTop: true },
}[INTRO_STYLE];

const AGENT_COLORS = ['#a78bfa', '#f472b6', '#34d399', '#fbbf24', '#60a5fa', '#fb7185', '#22d3ee', '#c084fc', '#f97316', '#84cc16'];
const MAX_AGENTS = 20;
const START_AGENTS = 6;
const SPEEDS = [1, 2, 4];

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'LINK', 'META', 'TITLE', 'HEAD', 'BR', 'HR', 'DIALOG', 'IFRAME']);

const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

const hasOwnText = (el) => {
  for (const n of el.childNodes) if (n.nodeType === 3 && /\S/.test(n.textContent)) return true;
  return false;
};

const isBox = (cs, r) => {
  // sections and full-screen backgrounds are left alone; only card-sized things count
  if (r.width > innerWidth * 0.9 && r.height > innerHeight * 0.6) return false;
  const hasBorder = parseFloat(cs.borderTopWidth) > 0 && cs.borderTopStyle !== 'none' && !/rgba?\(\s*\d+,\s*\d+,\s*\d+,\s*0(\.0+)?\s*\)/.test(cs.borderTopColor) && cs.borderTopColor !== 'transparent';
  const bg = cs.backgroundColor;
  const hasBg = bg !== 'transparent' && !/rgba?\(\s*\d+,\s*\d+,\s*\d+,\s*0(\.0+)?\s*\)/.test(bg);
  const hasImg = cs.backgroundImage !== 'none';
  return (hasBorder || hasBg || hasImg) && r.width >= 24 && r.height >= 16;
};

// What kind of piece an element is ('text', 'box', 'media', 'scene'), or null if it is not built on its own.
const classify = (el, scope = 'page') => {
  if (SKIP_TAGS.has(el.tagName)) return null;
  if (el.closest('[data-swarm-ui]') || el.closest('[data-swarm-skip]')) return null; // animated tracks (the marquee) just appear normally
  const tag = el.tagName.toLowerCase();
  if (tag !== 'svg' && el.closest('svg')) return null; // svg internals belong to their <svg>

  const cs = getComputedStyle(el);
  // things that are invisible on purpose (tooltips, hidden panels) are not part of the build. Content added inside a
  // piece that is still waiting to be built inherits its hidden state, which is not "on purpose".
  if (cs.display === 'none' || cs.opacity === '0') return null;
  if (cs.visibility === 'hidden' && !el.closest('[data-swarm="h"]')) return null;
  const r = el.getBoundingClientRect();
  if (r.width < 4 || r.height < 4) return null;
  // fast mode: only the first screen is built, everything else stays as it is
  if (scope === 'viewport' && (r.top >= innerHeight || r.bottom <= 0 || r.left >= innerWidth || r.right <= 0)) return null;

  if (tag === 'canvas') return 'scene';
  if (tag === 'img' || tag === 'video' || tag === 'svg') return 'media';
  if (tag === 'input' || tag === 'textarea') return 'box';
  if (hasOwnText(el)) return 'text';
  if (isBox(cs, r)) return 'box';
  return null;
};

const makeLayer = (el, kind) => ({ el, kind, done: false, claimed: false, vis: false, parent: null, seenAt: 0 });

// a piece can only appear once the piece containing it has
const linkParent = (l, byEl) => {
  let p = l.el.parentElement;
  while (p && !byEl.has(p)) p = p.parentElement;
  l.parent = p ? byEl.get(p) : null;
};

const collectLayers = (root, scope = 'page') => {
  const out = [];
  for (const el of root.querySelectorAll('*')) {
    const kind = classify(el, scope);
    if (kind) out.push(makeLayer(el, kind));
  }
  const byEl = new Map(out.map((l) => [l.el, l]));
  for (const l of out) linkParent(l, byEl);
  return out;
};

const createEngine = ({ opts, onStats, onStatus }) => {
  const root = document.getElementById('root');
  const host = document.createElement('div');
  host.setAttribute('data-swarm-ui', '');
  host.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9998;overflow:hidden;transition:opacity .6s;';
  document.body.appendChild(host);

  let layers = [];
  let agents = [];
  let done = 0;
  let raf = 0;
  let last = performance.now();
  let status = 'running';
  let alive = true;
  let timers = [];
  let lastScrollY = -1;
  let scrolling = false;
  let stuck = { layer: null, count: 0 };
  let startedAt = performance.now();
  let peakAgents = 0;
  let took = '';
  let heroHeld = false;
  let manualUntil = 0; // the tour stands down for a moment when the visitor scrolls by hand
  // scroll mode: nothing scrolls by itself; each screen is built as the visitor reaches it
  const scrollMode = !!opts.scroll;
  const lead = opts.lead ?? 0.12; // how far below the screen agents may already pick up a piece (fraction of a screen)
  const startPath = window.location.pathname;
  let byEl = new Map();
  let bottomSince = 0;

  const lenis = () => window.__lenis;
  const scrollToY = (y, immediate = false) => {
    const target = Math.max(0, Math.round(y));
    if (lenis()) lenis().scrollTo(target, { immediate, duration: 1.2 / opts.speed });
    else window.scrollTo({ top: target, behavior: immediate ? 'auto' : 'smooth' });
  };

  const stats = () => onStats({ agents: agents.length, peak: peakAgents, done, total: layers.length, took });

  // ---- agents ----
  const makeAgent = (i, onScreen = false) => {
    const color = AGENT_COLORS[i % AGENT_COLORS.length];
    const el = document.createElement('div');
    el.style.cssText = 'position:absolute;left:0;top:0;will-change:transform;transition:opacity .35s;';
    el.innerHTML =
      `<svg width="16" height="16" viewBox="0 0 16 16" style="display:block;filter:drop-shadow(0 1px 2px rgba(0,0,0,.6))"><path d="M1 1l5.2 13 1.9-5.3L13.4 7z" fill="${color}" stroke="#0b0a0d" stroke-width="1"/></svg>` +
      `<span style="position:absolute;left:13px;top:12px;padding:0 6px;border-radius:6px;background:${color};color:#0b0a0d;font:700 10px/16px ui-monospace,monospace;white-space:nowrap">A${i + 1}</span>`;
    const box = document.createElement('div');
    box.style.cssText = `position:absolute;display:none;border:1.5px solid ${color};background:${color}18;border-radius:2px;`;
    const label = document.createElement('div');
    label.style.cssText = `position:absolute;display:none;padding:0 5px;border-radius:4px;background:${color};color:#0b0a0d;font:600 10px/16px ui-monospace,monospace;white-space:nowrap;`;
    host.append(box, label, el);
    // enter from just below the screen
    const x = Math.random() * innerWidth;
    const y = onScreen ? Math.random() * innerHeight * 0.6 : innerHeight + 40;
    const tagEl = el.querySelector('span');
    return { el, box, label, tagEl, id: i + 1, color, x, y, tx: x, ty: y, state: 'idle', layer: null, anim: null, dur: 1, seed: Math.random() * 10, nextWander: 0 };
  };

  const spawn = (onScreen = false) => {
    if (!alive || status !== 'running' || agents.length >= (opts.maxAgents ?? MAX_AGENTS)) return;
    agents.push(makeAgent(agents.length, onScreen));
    peakAgents = Math.max(peakAgents, agents.length);
    stats();
  };

  // show a piece straight away, without an agent (and the pieces around it, so it is not hidden by its parent)
  const instant = (l, fade = false) => {
    for (let p = l; p && !p.done; p = p.parent) {
      if (p.claimed) continue; // an agent is on it and finishes it
      p.el.removeAttribute('data-swarm');
      p.done = true;
      done++;
      if (fade && p.el.isConnected) p.el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240, easing: 'ease-out' });
    }
  };

  // ---- visibility bookkeeping ----
  const refreshVisible = () => {
    const vw = innerWidth;
    const vh = innerHeight;
    if (scrollMode && status === 'running') {
      // the visitor went to another page: stop and leave everything as it should be
      if (window.location.pathname !== startPath) { revealAll(); finish(); return; }
    }
    const now = performance.now();
    for (const l of layers) {
      if (l.done) continue;
      if (!l.el.isConnected) {
        // removed from the page (re-rendered, say): nothing left to build
        if (!l.claimed) { l.done = true; done++; }
        continue;
      }
      const r = l.el.getBoundingClientRect();
      if (scrollMode && !l.claimed) {
        // scrolled past before anyone got to it: it just appears, so going back up never shows a gap or a rebuild
        if (r.bottom <= 0 && r.width > 0) { instant(l); continue; }
        // safety net: a piece that has been in view for a while without an agent appears by itself
        const inView = r.top < vh * 0.85 && r.bottom > 0 && r.right > 0 && r.left < vw;
        if (inView) {
          if (!l.seenAt) l.seenAt = now;
          else if (now - l.seenAt > (opts.deadline ?? 2500)) { instant(l, true); continue; }
        } else l.seenAt = 0;
      }
      const inY = r.bottom > 0 && r.top < vh * (1 + (scrollMode ? lead : 0)) && r.width > 0;
      const offX = r.right < 0 || r.left > vw;
      // parked far off to the side (an animated track, say): nothing to fly to, so it just appears. Pieces that are
      // only a screen or so away, like the pinned About cards, still wait for their turn.
      if (inY && offX && (r.left > vw * 1.6 || r.right < -vw * 0.6)) {
        l.el.removeAttribute('data-swarm');
        l.done = true;
        done++;
        continue;
      }
      l.vis = inY && !offX;
    }
    if (scrollMode && status === 'running' && layers.length) {
      // at the bottom with nothing left in view: whatever never showed up (parked off to the side) just appears
      const atBottom = window.scrollY >= document.documentElement.scrollHeight - vh - 4;
      const idle = !agents.some((a) => a.layer) && !layers.some((l) => !l.done && l.vis);
      if (atBottom && idle) {
        if (!bottomSince) bottomSince = now;
        else if (now - bottomSince > 2500) { revealAll(); finish(); }
      } else bottomSince = 0;
    }
  };

  // ---- scroll mode: content that arrives later (lazy sections, 3D scenes) joins the build ----
  let added = [];
  let addTimer = 0;
  const absorb = () => {
    addTimer = 0;
    const nodes = added;
    added = [];
    if (!alive || status !== 'running') return;
    const vh = innerHeight;
    const fresh = [];
    for (const n of nodes) {
      if (!n.isConnected) continue;
      for (const el of [n, ...n.querySelectorAll('*')]) {
        if (byEl.has(el)) continue;
        const kind = classify(el);
        if (!kind) continue;
        const r = el.getBoundingClientRect();
        // already on screen and visible: hiding it now would make it blink, so it stays as it is
        if (r.bottom > 0 && r.top < vh && !el.closest('[data-swarm="h"]')) continue;
        // above the screen: the visitor has been there already
        if (r.bottom <= 0) continue;
        const l = makeLayer(el, kind);
        byEl.set(el, l);
        fresh.push(l);
      }
    }
    if (!fresh.length) return;
    for (const l of fresh) {
      linkParent(l, byEl);
      l.el.setAttribute('data-swarm', 'h');
    }
    layers.push(...fresh);
  };
  const observer = scrollMode
    ? new MutationObserver((records) => {
      for (const rec of records) {
        for (const n of rec.addedNodes) if (n.nodeType === 1 && !n.closest('[data-swarm-ui]')) added.push(n);
      }
      if (added.length && !addTimer) addTimer = setTimeout(absorb, 150);
    })
    : null;

  const nextLayer = () => {
    for (const l of layers) {
      if (!l.done && !l.claimed && l.vis && (!l.parent || l.parent.done)) return l;
    }
    return null;
  };

  // ---- reveal ----
  const startWork = (a) => {
    const l = a.layer;
    const el = l.el;
    const sp = opts.speed;
    let dur;
    let frames;
    let easing = 'cubic-bezier(.2,.8,.2,1)';
    if (l.kind === 'text') {
      const chars = (el.textContent || '').length;
      dur = clamp(160 + chars * 12, 240, 1300) / sp;
      frames = [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }];
      easing = 'linear';
    } else if (l.kind === 'box') {
      dur = 420 / sp;
      frames = [{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }, { clipPath: 'inset(0 0 0% 0)', opacity: 1 }];
    } else if (l.kind === 'media') {
      dur = 560 / sp;
      frames = [{ clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)' }];
    } else {
      dur = 900 / sp;
      frames = [{ opacity: 0 }, { opacity: 1 }];
    }
    // the animation holds its first frame until it starts, so the piece never flashes in full
    a.anim = el.animate(frames, { duration: dur, easing, fill: 'backwards' });
    a.dur = dur;
    el.removeAttribute('data-swarm');
    a.state = 'work';
    const verb = { text: 'typing', box: 'placing', media: 'importing', scene: 'rendering' }[l.kind];
    a.tagEl.textContent = `A${a.id} · ${verb}`;
    a.box.style.display = 'block';
    a.label.style.display = 'block';
  };

  // a brief outline pulse where a piece just landed
  const flash = (a, r) => {
    const f = document.createElement('div');
    f.style.cssText = `position:absolute;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;border:1.5px solid ${a.color};border-radius:3px;`;
    host.appendChild(f);
    const an = f.animate([{ opacity: 0.9, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(1.035)' }], { duration: 420, easing: 'ease-out' });
    an.onfinish = () => f.remove();
  };

  const finishWork = (a) => {
    if (a.layer.el.isConnected) flash(a, a.layer.el.getBoundingClientRect());
    a.tagEl.textContent = `A${a.id}`;
    a.layer.done = true;
    a.layer.claimed = false;
    done++;
    a.layer = null;
    a.anim = null;
    a.state = 'idle';
    a.box.style.display = 'none';
    a.label.style.display = 'none';
  };

  // let go of a piece: show it at once (reveal) or hand it back to wait for its turn
  const release = (a, reveal) => {
    const l = a.layer;
    l.claimed = false;
    if (reveal) {
      a.anim?.cancel(); // the piece itself is already un-hidden once work started; cancelling shows it in full
      l.el.removeAttribute('data-swarm');
      if (!l.done) { l.done = true; done++; }
    }
    a.tagEl.textContent = `A${a.id}`;
    a.layer = null;
    a.anim = null;
    a.state = 'idle';
    a.box.style.display = 'none';
    a.label.style.display = 'none';
  };

  // ---- main loop ----
  const frame = (now) => {
    if (!alive) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const vw = innerWidth;
    const vh = innerHeight;

    if (status === 'running') {
      for (const a of agents) {
        if (a.state === 'idle') {
          const l = nextLayer();
          if (l) { l.claimed = true; a.layer = l; a.state = 'fly'; a.el.style.opacity = '1'; }
          else if (scrollMode) {
            // nothing to build: get out of the way (just below the screen, where the next section comes from)
            a.ty = vh + 60;
            a.el.style.opacity = '0';
          } else if (now > a.nextWander) {
            // nothing to do: drift around the lower part of the screen
            a.tx = vw * (0.1 + Math.random() * 0.8);
            a.ty = vh * (0.55 + Math.random() * 0.4);
            a.nextWander = now + 1200 + Math.random() * 1500;
          }
        }

        let rate = 4 * opts.speed;
        if (a.layer && scrollMode) {
          // the visitor scrolled on past the piece this agent was on: it just appears, and the agent moves on.
          // Scrolled back up before the agent got there: the piece waits, to be built when the visitor returns.
          const r = a.layer.el.getBoundingClientRect();
          if (!a.layer.el.isConnected || r.bottom <= 0) release(a, true);
          else if (a.state === 'fly' && r.top > vh * (1 + lead) + 40) release(a, false);
        }
        if (a.layer) {
          const r = a.layer.el.getBoundingClientRect();
          const kind = a.layer.kind;
          if (a.state === 'fly') {
            a.tx = clamp(r.left + 4, 8, vw - 24);
            a.ty = clamp(kind === 'text' ? r.top + Math.min(r.height / 2, 14) : r.top + 4, 8, vh - 24);
            rate = 7 * opts.speed;
            // scroll mode: a piece just below the screen is waited for at the edge, and only built once it shows
            const onScreen = !scrollMode || r.top < vh - 4;
            if (onScreen && Math.hypot(a.tx - a.x, a.ty - a.y) < 14) startWork(a);
          }
          if (a.state === 'work') {
            const p = clamp((a.anim?.currentTime ?? 0) / a.dur, 0, 1);
            if (kind === 'text') {
              a.tx = r.left + p * r.width;
              a.ty = r.top + r.height / 2;
            } else {
              a.tx = r.left + p * r.width;
              a.ty = r.top + p * r.height;
            }
            a.tx = clamp(a.tx, 8, vw - 24);
            a.ty = clamp(a.ty, 8, vh - 24);
            rate = 20;
            const bs = a.box.style;
            bs.left = `${r.left}px`;
            bs.top = `${r.top}px`;
            bs.width = `${r.width}px`;
            bs.height = `${r.height}px`;
            a.label.textContent = `${Math.round(r.width)} × ${Math.round(r.height)}`;
            a.label.style.left = `${r.left}px`;
            a.label.style.top = `${r.bottom + 4}px`;
            if (a.anim?.playState === 'finished' || p >= 1) finishWork(a);
          }
        }

        a.x += (a.tx - a.x) * (1 - Math.exp(-dt * rate));
        a.y += (a.ty - a.y) * (1 - Math.exp(-dt * rate));
        a.el.style.transform = `translate3d(${a.x}px,${a.y}px,0)`;
      }

      if (layers.length && done >= layers.length) finish();
    }
    raf = requestAnimationFrame(frame);
  };

  // ---- tour: scroll the page while there is nothing left to build in view ----
  const tourTick = () => {
    if (!alive || status !== 'running') return;
    const sy = window.scrollY;
    scrolling = Math.abs(sy - lastScrollY) > 1;
    lastScrollY = sy;
    if (!opts.tour || scrolling || performance.now() < manualUntil) return;
    // the first screen (name and tagline) gets a moment on its own before the tour moves on
    if (!heroHeld && sy < 10) {
      const busy = agents.some((a) => a.layer) || layers.some((l) => !l.done && !l.claimed && l.vis && (!l.parent || l.parent.done));
      if (!busy) { heroHeld = true; manualUntil = performance.now() + (opts.hold ?? 1300); return; }
    }

    const claimed = agents.some((a) => a.layer);
    const pending = layers.some((l) => !l.done && !l.claimed && l.vis && (!l.parent || l.parent.done));
    if (claimed || pending) return;

    const max = document.documentElement.scrollHeight - innerHeight;
    if (sy >= max - 4) {
      const remaining = layers.find((l) => !l.done);
      if (!remaining) { finish(); return; }
      // leftovers (parked behind something that never showed up): try once to reach them, then give up on them
      if (stuck.layer === remaining) stuck.count++; else stuck = { layer: remaining, count: 1 };
      if (stuck.count > 1) { revealAll(); finish(); return; }
      scrollToY(clamp(remaining.el.getBoundingClientRect().top + sy - innerHeight * 0.3, 0, max));
    } else {
      scrollToY(Math.min(sy + innerHeight * (opts.tourStep ?? 0.6), max));
    }
  };

  const revealAll = () => {
    for (const l of layers) {
      if (!l.done) { l.el.removeAttribute('data-swarm'); l.done = true; }
    }
    done = layers.length;
  };

  const finish = () => {
    if (status !== 'running') return;
    status = 'complete';
    onStatus('complete');
    stats();
    if (opts.fast || scrollMode) goLive();
    else if (opts.tour) timers.push(setTimeout(() => goLive(), 1400));
  };

  const goLive = () => {
    if (!alive || status === 'live') return;
    revealAll();
    // the intro tours the whole page, so the visitor must land back on the hero
    if (opts.returnToTop) scrollToY(0, true);
    status = 'live';
    const secs = Math.round((performance.now() - startedAt) / 1000);
    took = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
    host.style.opacity = '0';
    // a whole-page fade would look like a glitch in the middle of reading, so scroll mode skips it
    if (!scrollMode) root?.animate([{ opacity: 0.55 }, { opacity: 1 }], { duration: 700, easing: 'ease-out' });
    timers.push(setTimeout(() => { if (alive) host.replaceChildren(); agents = []; stats(); }, 700));
    stats();
    onStatus('live');
    if (opts.fast || scrollMode) timers.push(setTimeout(() => api.exit(), 900)); // no control bar in these modes
  };

  // ---- lifecycle ----
  const begin = () => {
    for (const a of agents) a.el.remove();
    host.replaceChildren();
    host.style.opacity = '1';
    agents = [];
    done = 0;
    peakAgents = 0;
    took = '';
    startedAt = performance.now();
    status = 'running';
    stuck = { layer: null, count: 0 };
    onStatus('running');

    // scroll mode starts wherever the visitor is (a refresh can land mid-page): what is above simply appears
    if (!opts.fast && !scrollMode) scrollToY(0, true);
    heroHeld = false;
    bottomSince = 0;
    timers.push(setTimeout(() => {
      if (!alive) return;
      layers = collectLayers(root, opts.scope || 'page');
      byEl = new Map(layers.map((l) => [l.el, l]));
      for (const l of layers) l.el.setAttribute('data-swarm', 'h');
      refreshVisible();
      for (let i = 0; i < (opts.startAgents ?? START_AGENTS); i++) spawn(true);
      stats();
      observer?.observe(root, { childList: true, subtree: true });
    }, opts.fast || scrollMode ? 0 : 450));

    if (opts.maxDuration) {
      // hard cap: whatever is not built by then simply appears
      timers.push(setTimeout(() => { if (status === 'running') { revealAll(); finish(); } }, opts.maxDuration));
    }
  };

  const cleanup = () => {
    observer?.disconnect();
    clearTimeout(addTimer);
    addTimer = 0;
    added = [];
    for (const l of layers) l.el.removeAttribute('data-swarm');
    layers = [];
    byEl = new Map();
  };

  const onManual = () => { manualUntil = performance.now() + 2500; };
  const onSkip = () => { if (status === 'running') { revealAll(); finish(); } };
  if (opts.fast) ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach((t) => window.addEventListener(t, onSkip, { passive: true }));
  window.addEventListener('wheel', onManual, { passive: true });
  window.addEventListener('touchstart', onManual, { passive: true });

  timers.push(setInterval(refreshVisible, 140));
  timers.push(setInterval(tourTick, opts.tourEvery ?? 350));
  // more agents join as the build goes on (in scroll mode, only while there is something to build)
  timers.push(setInterval(() => { if (!scrollMode || nextLayer()) spawn(); }, 700));
  timers.push(setInterval(stats, 250));
  raf = requestAnimationFrame(frame);
  begin();

  const api = {
    replay: () => { cleanup(); begin(); },
    goLive,
    exit: () => {
      alive = false;
      cancelAnimationFrame(raf);
      ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach((t) => window.removeEventListener(t, onSkip));
      window.removeEventListener('wheel', onManual);
      window.removeEventListener('touchstart', onManual);
      timers.forEach((t) => { clearTimeout(t); clearInterval(t); });
      cleanup();
      host.remove();
      onStatus('idle');
    },
  };
  return api;
};

const supported = () =>
  window.location.pathname === '/' &&
  window.innerWidth >= 768 &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const SwarmRebuild = () => {
  const [status, setStatus] = useState('idle'); // idle | running | complete | live
  const [stats, setStats] = useState({ agents: 0, done: 0, total: 0 });
  const [tour, setTour] = useState(true);
  const [speed, setSpeed] = useState(1);
  const engine = useRef(null);
  const opts = useRef({ tour: true, speed: 1 });
  // an engine that switches itself off (fast and scroll modes) must not keep blocking the next run
  const onStatus = useCallback((s) => { if (s === 'idle') engine.current = null; setStatus(s); }, []);

  const exit = useCallback(() => {
    engine.current?.exit();
    engine.current = null;
    setStatus('idle');
  }, []);

  const [ui, setUi] = useState('full'); // full | skip | none

  const startFast = useCallback(() => {
    if (engine.current || !supported()) return;
    opts.current = { tour: false, speed: 4, fast: true, ui: 'none', startAgents: 20, scope: 'viewport', maxDuration: 2200 };
    setUi('none');
    markAutoRebuild(); // a refresh mid-run must not replay it
    engine.current = createEngine({ opts: opts.current, onStats: setStats, onStatus });
  }, [onStatus]);

  const start = useCallback(() => {
    // asking for the full rebuild while the scroll intro is still quietly running replaces it
    if (engine.current && opts.current.scroll) { engine.current.exit(); engine.current = null; }
    if (engine.current || !supported()) return;
    setUi('full');
    opts.current = { tour: true, speed: 1 };
    setTour(true);
    setSpeed(1);
    setStats({ agents: 0, done: 0, total: 0 });
    engine.current = createEngine({ opts: opts.current, onStats: setStats, onStatus });
  }, [onStatus]);

  const startIntro = useCallback(() => {
    if (engine.current || !supported()) return;
    opts.current = { ...INTRO_OPTS };
    setUi(INTRO_OPTS.ui);
    setStats({ agents: 0, done: 0, total: 0 });
    engine.current = createEngine({ opts: opts.current, onStats: setStats, onStatus });
  }, [onStatus]);

  useEffect(() => {
    const onStart = () => start();
    const onIntro = () => { if (INTRO_AFTER_PRELOADER) startIntro(); };
    window.addEventListener('intro-leaving', onIntro);
    const onKey = (e) => {
      if (e.altKey && e.shiftKey && e.code === 'KeyS') { e.preventDefault(); engine.current ? exit() : start(); }
      else if (e.key === 'Escape' && engine.current) exit();
    };
    window.addEventListener('start-rebuild', onStart);
    window.addEventListener('keydown', onKey);
    // /?rebuild starts it by itself once the intro has had time to finish, for recording
    const q = new URLSearchParams(window.location.search);
    let auto = 0;
    if (q.get('rebuild') === 'fast') auto = setTimeout(startFast, 600);
    else if (q.has('rebuild')) auto = setTimeout(start, 6500);
    else if (AUTO_ON_FIRST_VISIT && shouldAutoRebuild()) auto = setTimeout(startFast, 600);
    return () => {
      clearTimeout(auto);
      window.removeEventListener('intro-leaving', onIntro);
      window.removeEventListener('start-rebuild', onStart);
      window.removeEventListener('keydown', onKey);
      engine.current?.exit();
      engine.current = null;
    };
  }, [start, startFast, startIntro, exit]);

  if (status === 'idle' || ui === 'none') return null;

  const pct = stats.total ? Math.round((stats.done / stats.total) * 100) : 0;

  if (ui === 'skip') {
    // intro mode: just a progress hint and a way out
    if (status === 'live') return null;
    return createPortal(
      <button
        type="button"
        data-swarm-ui=""
        onClick={() => engine.current?.goLive()}
        className="fixed bottom-6 left-1/2 z-[9999] flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/15 bg-black/70 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-gray-300 backdrop-blur-xl hover:border-purple-400/60"
      >
        <span>Building · {pct}%</span>
        <span className="text-gray-500">click to skip</span>
      </button>,
      document.body
    );
  }
  const btn = 'rounded-full border border-white/15 px-3 py-1 text-[11px] uppercase tracking-wider transition-colors hover:border-purple-400/70 hover:text-white';

  return createPortal(
    <div
      data-swarm-ui=""
      role="region"
      aria-label="Swarm rebuild controls"
      className="fixed bottom-6 left-1/2 z-[9999] flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/15 bg-black/75 px-4 py-2 font-mono text-[11px] text-gray-300 shadow-2xl backdrop-blur-xl"
    >
      <span className="whitespace-nowrap" aria-live="polite">
        {status === 'live'
          ? `live · built by ${stats.peak} agents in ${stats.took}`
          : `${stats.agents} agents · ${stats.done} / ${stats.total} layers${status === 'complete' ? ' · complete' : ''}`}
      </span>
      {status !== 'live' && (
        <span className="hidden h-1 w-28 overflow-hidden rounded-full bg-white/10 sm:block" aria-hidden="true">
          <span className="block h-full rounded-full bg-purple-400 transition-[width] duration-300" style={{ width: `${pct}%` }} />
        </span>
      )}
      {status === 'running' && (
        <>
          <button
            type="button"
            className={`${btn} ${tour ? 'border-purple-400/60 text-purple-300' : 'text-gray-400'}`}
            aria-pressed={tour}
            onClick={() => { opts.current.tour = !tour; setTour(!tour); }}
          >
            Tour
          </button>
          <button
            type="button"
            className={`${btn} text-gray-300`}
            aria-label={`Build speed ${speed}x, click to change`}
            onClick={() => {
              const next = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length];
              opts.current.speed = next;
              setSpeed(next);
            }}
          >
            {speed}×
          </button>
        </>
      )}
      {status !== 'live' && (
        <button type="button" className={`${btn} text-purple-300`} onClick={() => engine.current?.goLive()}>
          Go live
        </button>
      )}
      <button type="button" className={`${btn} text-gray-300`} onClick={() => engine.current?.replay()}>
        Replay
      </button>
      <button type="button" className={`${btn} text-gray-300`} aria-label="Exit (Esc)" onClick={exit}>
        ✕
      </button>
    </div>,
    document.body
  );
};

export default SwarmRebuild;
