# ==========================================
# Stage 1: Build Workspace
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /workspace

# Copy root configs and workspaces package structures for cached installs
COPY package.json package-lock.json tsconfig.json turbo.json ./
COPY packages/core-types/package.json ./packages/core-types/
COPY packages/crypto-utils/package.json ./packages/crypto-utils/
COPY apps/admin-dashboard/package.json ./apps/admin-dashboard/

# Clean install workspaces dependencies
RUN npm ci

# Copy codebase source trees
COPY packages/core-types/src ./packages/core-types/src
COPY packages/core-types/tsconfig.json ./packages/core-types/

COPY packages/crypto-utils/src ./packages/crypto-utils/src
COPY packages/crypto-utils/tsconfig.json ./packages/crypto-utils/

COPY apps/admin-dashboard/src ./apps/admin-dashboard/src
COPY apps/admin-dashboard/tsconfig.json ./apps/admin-dashboard/
COPY apps/admin-dashboard/vite.config.ts ./apps/admin-dashboard/
COPY apps/admin-dashboard/index.html ./apps/admin-dashboard/

# Build shared library packages and compile Vite React production bundle
RUN npm run build --workspace=@veritas/core-types \
    && npm run build --workspace=@veritas/crypto-utils \
    && npm run build --workspace=@veritas/admin-dashboard

# ==========================================
# Stage 2: Production Nginx Server
# ==========================================
FROM nginx:alpine AS runner

# Copy compiled static Vite assets to Nginx html root
COPY --from=builder /workspace/apps/admin-dashboard/dist /usr/share/nginx/html

# Copy custom Nginx configuration supporting SPA routing fallbacks and API proxying
COPY apps/admin-dashboard/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
