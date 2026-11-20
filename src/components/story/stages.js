// The landing page told as a build pipeline: each section is one stage.
// `id` is the DOM id of the section's wrapper in LandingPage ('top' = the hero, scroll 0).
export const STAGES = [
  { id: 'top',        cmd: 'boot',    label: 'Hello',      teaser: 'who I am, in one screen' },
  { id: 'projects',   cmd: 'build',   label: 'Projects',   teaser: "things I've built and shipped" },
  { id: 'stack',      cmd: 'install', label: 'Stack',      teaser: 'the tools behind them' },
  { id: 'experience', cmd: 'log',     label: 'Experience', teaser: "where I've put them to work" },
  { id: 'about',      cmd: 'whoami',  label: 'About',      teaser: 'the person behind the commits' },
  { id: 'footer',     cmd: 'deploy',  label: 'Contact',    teaser: "your turn: let's talk" },
];

export const LAST_STAGE = STAGES.length - 1;

export const pad = (n) => String(n).padStart(2, '0');

// Scroll through Lenis when it's running, so jumps use the same easing as the wheel.
export const scrollToStage = (index, opts = {}) => {
  const stage = STAGES[index];
  if (!stage) return;
  const target = stage.id === 'top' ? 0 : document.getElementById(stage.id);
  if (target === null) return;
  const lenis = window.__lenis;
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.4, ...opts });
  } else if (target === 0) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    target.scrollIntoView({ behavior: 'smooth' });
  }
};
