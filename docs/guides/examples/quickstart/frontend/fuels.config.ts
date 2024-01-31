import { createConfig } from 'fuels';

export default createConfig({
  contracts: [
        '../counter-contract',
  ],
  output: './src/sway-api',
  useBuiltinForc: false,
});

/**
 * Check the docs:
 * https://fuellabs.github.io/fuels-ts/guide/cli/config-file
 */
