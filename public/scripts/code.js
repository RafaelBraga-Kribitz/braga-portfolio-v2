// code.js — copy and wrap controls for code blocks (D-035). ~1 KB, progressive:
// the static block is wrapped and readable without it. Loads only on pages
// that contain a .code block; event delegation, so render timing is irrelevant.
document.addEventListener('click', e => {
  const btn = e.target.closest('.code-copy, .code-wrap');
  if (!btn) return;
  const block = btn.closest('.code');
  const pre = block && block.querySelector('pre');
  if (!pre) return;
  if (btn.classList.contains('code-wrap')) {
    const off = block.getAttribute('data-wrap') === 'off';
    block.setAttribute('data-wrap', off ? 'on' : 'off');
    btn.textContent = off ? 'Wrap · on' : 'Wrap · off';
    btn.setAttribute('aria-pressed', off ? 'true' : 'false');
    return;
  }
  const text = pre.textContent;
  const done = ok => { const was = btn.textContent; btn.textContent = ok ? 'Copied' : 'Copy failed'; setTimeout(() => { btn.textContent = was; }, 1500); };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(() => done(true), () => done(false));
  else done(false);
});
