import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

/** ESLint flat config: Next.js recommended rules + Core Web Vitals checks. */
const eslintConfig = [
  ...nextCoreWebVitals,
  {
    ignores: [
      '.next/**',
      'out/**',
      'node_modules/**',
      '.generated/**',
      'public/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },
  {
    rules: {
      // Static export: images are pre-optimized by scripts/optimize-images.mjs, so plain <img> is intended.
      '@next/next/no-img-element': 'off',
    },
  },
];

export default eslintConfig;
