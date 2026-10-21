// code.js — copy and wrap controls for code blocks (D-035). ~1 KB, progressive:
// the static block is wrapped and readable without it. Loads only on pages
// that contain a .code block (gate L-03 checks both ways); event delegation,
// so render timing is irrelevant. The build renders the buttons and their
// labels in the page's language (src/lib/rehype/code.mjs): data-on /
// data-off on Wrap, data-label / data-copied / data-failed on Copy. This
// file only swaps them.
document.addEventListener('click', e => {
  const btn = e.target.closest('.code-copy, .code-wrap');
  if (!btn) return;
  const block = btn.closest('.code');
  const pre = block && block.querySelector('pre');
  if (!pre) return;
  const d = btn.dataset;
  if (btn.classList.contains('code-wrap')) {
    const off = block.getAttribute('data-wrap') === 'off';
    block.setAttribute('data-wrap', off ? 'on' : 'off');
    btn.textContent = off ? (d.on || 'Wrap · on') : (d.off || 'Wrap · off');
    btn.setAttribute('aria-pressed', off ? 'true' : 'false');
    return;
  }
  // the resting label comes from the markup, never from the button's
  // current text, so a second click inside 1.5 s cannot keep "Copied"
  const rest = d.label || 'Copy';
  const done = ok => {
    btn.textContent = ok ? (d.copied || 'Copied') : (d.failed || 'Copy failed');
    clearTimeout(btn._bkReset);
    btn._bkReset = setTimeout(() => { btn.textContent = rest; }, 1500);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(pre.textContent).then(() => done(true), () => done(false));
  else done(false);
});
