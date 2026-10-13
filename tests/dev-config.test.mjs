import test from 'node:test';
import assert from 'node:assert/strict';
let configure;
try { ({ developmentConfig: configure } = await import('../scripts/development-config.mjs')); } catch(error) { if(error.code !== 'ERR_MODULE_NOT_FOUND') throw error; }
test('development separates its artifacts without disabling production export', () => {
  assert.equal(typeof configure, 'function');
  const production = { output: 'export', trailingSlash: true, images: { unoptimized: true }, reactStrictMode: true };
  const development = configure(production);
  assert.equal(production.output, 'export');
  assert.equal(development.output, undefined);
  assert.equal(development.distDir, '.next-dev');
  assert.equal(development.trailingSlash, true);
  assert.equal(development.images.unoptimized, true);
});
