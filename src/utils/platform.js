// Label for the command-palette modifier key: ⌘ on Apple devices, Ctrl everywhere else.
const isApple = () =>
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent || '');

export const modKeyLabel = () => (isApple() ? '⌘' : 'Ctrl');
