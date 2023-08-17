cd docs/fuels-ts
NODE_ENV=development pnpm install
pnpm build
cd apps/docs
pnpm run docs