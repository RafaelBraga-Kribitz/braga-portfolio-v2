// lint:style (scripts/lint/no-inline-style.mjs) — the forms it must catch
// and the text it must leave alone (BUILD-BRIEF §6 rule 1). Each case is
// one file's text; the path decides markup or code, and a path under
// src/components/tools/ is a Preact island.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lintText } from '../../scripts/lint/no-inline-style.mjs';

const fails = (file, text) => lintText(file, text).length > 0;

test('lint:style · real properties fail in every form', () => {
  assert.ok(fails('src/components/A.astro', '<div style="color: red">x</div>'));
  assert.ok(fails('src/components/A.tsx', "const A = () => <div style={{color:'red'}}>x</div>;"));
  // spaced attribute, in JSX and in markup
  assert.ok(fails('src/components/A.tsx', "const A = () => <div style = {{ color: 'red' }}>x</div>;"));
  assert.ok(fails('src/components/A.astro', '<div style = "color: red">x</div>'));
  // a spread, and the props of h() / createElement()
  assert.ok(fails('src/components/A.tsx', "const A = () => <div {...{ style: { color: 'red' } }}>x</div>;"));
  assert.ok(fails('src/components/A.tsx', "const A = () => h('div', { style: { color: 'red' } }, 'x');"));
  assert.ok(fails('src/components/A.tsx', "const A = () => createElement('div', { id: 'a', style: 'color: red' });"));
  // upper case reaches the page as style
  assert.ok(fails('src/content/x.md', 'Text <b STYLE="color:red">x</b>.'));
  assert.ok(fails('dist/en/index.html', '<p STYLE="color:red">x</p>'));
});

test('lint:style · custom properties only where rule 1 allows them', () => {
  assert.equal(fails('dist/en/index.html', '<span class="ev-fill" style="--w: 40%"></span>'), false);
  assert.equal(fails('dist/en/index.html', '<span class="ev-mid" style="--x: 50%"></span>'), false);
  assert.equal(fails('dist/en/index.html', '<svg viewBox="0 0 10 10"><g><rect style="--w: 4"></rect></g></svg>'), false);
  assert.equal(fails('dist/en/index.html', '<astro-island uid="1"><div style="--w: 4%"></div></astro-island>'), false);
  assert.equal(fails('src/components/tools/X.tsx', "const A = () => <div style={{ '--w': w }} />;"), false);
  assert.equal(fails('src/components/E.astro', '<span class="ev-fill" style={geometry(b)}></span>\nconst geometry = (b) => `--w: ${b.w}`;'), false);
  // the same declaration on any other element fails (finding 14)
  assert.ok(fails('dist/en/index.html', '<div style="--w: 40%">x</div>'));
  assert.ok(fails('src/components/A.astro', '<div class="card" style="--w: 40%">x</div>'));
});

test('lint:style · text that only looks like an attribute passes', () => {
  // an HTML example in a code block, escaped in the built page
  assert.equal(fails('dist/en/index.html', '<pre><code class="language-html">&lt;b style="color:red"&gt;x&lt;/b&gt;</code></pre>'), false);
  // the same example in the Markdown source: a fence and a code span
  assert.equal(fails('src/content/writing/en/a.md', 'Before.\n\n```html\n<b style="color:red">x</b>\n```\n\nAnd `<i style="color:red">` inline.\n'), false);
  // a variable named style is not an attribute
  assert.equal(fails('src/lib/a.mjs', "let style = 'color: red';\nstyle = x ? a : b;"), false);
  // a comment or a script in a built page is not markup
  assert.equal(fails('dist/en/index.html', '<!-- <b style="color:red"> --><script>var s = \'<b style="color:red">\';</script>'), false);
});

test('lint:style · a props object with a style key, spread later', () => {
  assert.ok(fails('src/components/A.tsx', "const props = { style: { color: 'red' } };\nexport const C = () => <div {...props}>c</div>;"));
  // a type annotation is not a style object
  assert.equal(fails('src/components/A.tsx', 'interface P { style: string }\nexport const C = (p: P) => <div>c</div>;'), false);
});
