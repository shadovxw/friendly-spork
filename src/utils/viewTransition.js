// Runs a navigation inside the View Transitions API so route changes get the
// glitch-out / scan-open animation defined in index.css (::view-transition-*).
// React Router's own `viewTransition` prop only works with a data router; this app
// uses <BrowserRouter>, so we wrap the navigation ourselves.

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Resolve once the URL changed and React has had a moment to commit the new route.
// setTimeout, not requestAnimationFrame: the browser pauses rendering (and rAF) while
// it waits for this promise, so a rAF-based wait would only resolve when the transition times out.
const waitForPathChange = (from, timeout = 500) =>
  new Promise((resolve) => {
    const start = performance.now();
    const tick = () => {
      if (window.location.pathname !== from || performance.now() - start > timeout) {
        setTimeout(resolve, 60);
      } else {
        setTimeout(tick, 16);
      }
    };
    tick();
  });

export const withViewTransition = (update) => {
  if (!document.startViewTransition || prefersReducedMotion()) {
    update();
    return;
  }
  const from = window.location.pathname;
  document.startViewTransition(() => {
    update();
    return waitForPathChange(from);
  });
};
