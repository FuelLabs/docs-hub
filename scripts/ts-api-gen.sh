cd docs/fuels-ts
pnpm install
pnpm build
cd apps/docs
pnpm typedoc && pnpm tsx ./scripts/typedoc-postbuild.ts