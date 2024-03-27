import { createConfig } from 'fuels';

export default createConfig({
  contracts: [
    'docs/guides/examples/fuelnaut/fuelnaut-contract',
    'docs/guides/examples/fuelnaut/hello-world',
    'docs/guides/examples/fuelnaut/payback',
    'docs/guides/examples/fuelnaut/coin-flip',
    'docs/guides/examples/fuelnaut/vault',
  ],
  output: './src/fuelnaut-api',
  useBuiltinForc: false,
  chainConfig: './src/config/chainConfig.json',
});

/**
 * Check the docs:
 * https://fuellabs.github.io/fuels-ts/guide/cli/config-file
 */
