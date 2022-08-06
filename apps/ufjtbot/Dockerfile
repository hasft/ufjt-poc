FROM node:18-alpine AS base
ENV NODE_OPTIONS="--dns-result-order ipv4first"
RUN corepack enable
RUN corepack prepare pnpm@6.22.2 --activate
WORKDIR /root/monorepo

FROM base AS dev
ARG PACKAGE_PATH
COPY ./meta .
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store pnpm install --filter "{${PACKAGE_PATH}}..." --frozen-lockfile --unsafe-perm | grep -v "cross-device link not permitted\|Falling back to copying packages from store"

COPY ./dep .
RUN pnpm build --if-present --filter "{${PACKAGE_PATH}}^..."
RUN pnpm type --if-present --filter "{${PACKAGE_PATH}}^..."

COPY ./pkg .
ENV NODE_ENV=production
RUN pnpm build --filter "{${PACKAGE_PATH}}"

FROM dev AS assets
RUN rm -rf node_modules && pnpm recursive exec -- rm -rf ./src ./node_modules

FROM base AS prod
ARG PACKAGE_PATH
COPY ./meta .
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store pnpm install --filter "{${PACKAGE_PATH}}..." --frozen-lockfile --unsafe-perm --prod | grep -v "cross-device link not permitted\|Falling back to copying packages from store"
COPY --from=assets /root/monorepo .

WORKDIR /root/monorepo/${PACKAGE_PATH}
EXPOSE 8000
ENTRYPOINT ["pnpm", "start"]