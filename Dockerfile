# =====================
# Builder Stage
# =====================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

RUN corepack enable && pnpm install --frozen-lockfile 2>/dev/null || npm install

# Copy patches BEFORE build so patch-package postinstall runs
COPY patches ./patches
COPY . .

# Run postinstall to apply patches, then build
RUN npm run postinstall 2>/dev/null; npm run build

# =====================
# Runner Stage
# =====================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_CACHE_IMAGES_DIR=/tmp/next-cache/images

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    mkdir -p /tmp/next-cache/images && \
    chmod -R 777 /tmp/next-cache

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/src ./src

EXPOSE 3000
USER nextjs

CMD npx next start -p $PORT
