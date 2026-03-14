ARG NODE_VERSION=22.14.0

# Alpine image
FROM node:${NODE_VERSION}-alpine AS alpine
RUN apk update
RUN apk add --no-cache libc6-compat

# Setup pnpm on the alpine base
FROM alpine AS base
RUN npm install pnpm@10.15.1 --global
RUN pnpm config set store-dir ~/.pnpm-store

# Build the project
FROM base AS builder

ENV CI=true
WORKDIR /app

# Copy lockfile and package.json's
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json ./apps/api/
COPY libs/helpers/package.json ./libs/helpers/
COPY libs/typescript-config/package.json ./libs/typescript-config/

# First install the dependencies (as they change less often)
RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm install --frozen-lockfile --ignore-scripts

# Copy source code
COPY apps/api ./apps/api
COPY libs/helpers ./libs/helpers
COPY libs/typescript-config ./libs/typescript-config

RUN pnpm --filter api build
RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm prune --prod --no-optional --ignore-scripts
RUN rm -rf ./**/*/src

# Final image
FROM alpine AS runner

# Install yt-dlp and its dependencies
RUN apk add --no-cache ffmpeg curl bash \
  && curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux -o /usr/local/bin/yt-dlp \
  && chmod a+rx /usr/local/bin/yt-dlp

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
USER nodejs

WORKDIR /app
COPY --from=builder --chown=nodejs:nodejs /app .
WORKDIR /app/apps/api

ARG PORT=3000
ENV PORT=${PORT}
ENV NODE_ENV=production
ENV NODE_OPTIONS="--import ./dist/src/tracing.js"
EXPOSE ${PORT}

CMD ["npm", "run", "start"]
