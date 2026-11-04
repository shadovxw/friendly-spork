// Rules for auto-playing the fast swarm rebuild on a first visit (see SwarmRebuild.jsx, AUTO_ON_FIRST_VISIT).
const KEY = 'swarm:auto:last';
const DAY = 24 * 60 * 60 * 1000;

export const shouldAutoRebuild = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  // search engines and performance tests should see the real page
  if (/bot|crawl|spider|lighthouse|headless/i.test(navigator.userAgent)) return false;
  // localStorage with a timestamp (not sessionStorage), so it means "once a day"
  try { return Date.now() - Number(localStorage.getItem(KEY) || 0) > DAY; }
  catch { return false; } // storage blocked: just don't auto-play
};

export const markAutoRebuild = () => {
  try { localStorage.setItem(KEY, String(Date.now())); } catch { /* ignore */ }
};
