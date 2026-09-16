# Builds docs-hub as a Next.js standalone server for Railway.
# Mirrors the Vercel build (`pnpm build:ci`), except that the docs submodules
# are shallow-fetched from .submodule-pins because the build has no .git.

FROM node:20-bookworm-slim AS build
RUN apt-get update && apt-get install -y --no-install-recommends git ca-certificates python3 make g++ \
    && rm -rf /var/lib/apt/lists/*
# pnpm 9 matches lockfileVersion 9.0.
RUN npm install -g pnpm@9.15.9
WORKDIR /app
ENV HUSKY=0 NEXT_TELEMETRY_DISABLED=1
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches
# `prepare` runs copy:icons, which needs the target directory.
RUN mkdir -p public/icons && pnpm install --frozen-lockfile
COPY . .
RUN sh scripts/railway/fetch-submodules.sh

# Build-time (inlined) variables; Railway passes service variables as build args.
ARG NEXT_PUBLIC_ALGOLIA_APP_ID
ARG NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
ARG NEXT_PUBLIC_WALLET_INSTALL
ARG DOCS_BASE_URL
ENV NEXT_PUBLIC_ALGOLIA_APP_ID=$NEXT_PUBLIC_ALGOLIA_APP_ID \
    NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=$NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY \
    NEXT_PUBLIC_WALLET_INSTALL=$NEXT_PUBLIC_WALLET_INSTALL \
    DOCS_BASE_URL=$DOCS_BASE_URL \
    NEXT_OUTPUT=standalone NODE_ENV=production
# Same steps as `build:ci` minus docs:sync (done by fetch-submodules.sh above).
RUN pnpm copy:icons && pnpm exec run-s docs:clean "generate:*" patch:wallet build

# The image/video API routes stream files from these submodule folders at request time.
RUN mkdir -p /runtime-docs && for d in \
      docs/fuels-wallet/packages/docs/public \
      docs/nightly/fuels-wallet/packages/docs/public \
      docs/fuels-ts/apps/docs/src/public \
      docs/nightly/fuels-ts/apps/docs/src/public; do \
      if [ -d "$d" ]; then mkdir -p "/runtime-docs/$d" && cp -r "$d/." "/runtime-docs/$d/"; fi; \
    done

FROM node:20-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
COPY --from=build /runtime-docs/docs ./docs
# /sitemap.xml reads this file at request time.
COPY --from=build /app/src/generated/sitemap.xml ./src/generated/sitemap.xml
EXPOSE 3000
# next's standalone server listens on $PORT (Railway injects it).
HEALTHCHECK --interval=30s --timeout=5s CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/docs/intro/what-is-fuel/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server.js"]
