// Keep dev compilation isolated from next build, and let the dev router serve
// newly authored filesystem content. Production still uses next.config.mjs.
export function developmentConfig(production) {
  const { output, ...configuration } = production;
  return { ...configuration, distDir: '.next-dev' };
}
