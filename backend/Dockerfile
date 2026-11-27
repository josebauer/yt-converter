
# ==============================
# Stage 1 - Build
# ==============================

FROM node:24-bookworm-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build


# ==============================
# Stage 2 - Production
# ==============================

FROM node:24-bookworm-slim AS production

ENV NODE_ENV=production
ENV PORT=3333
ENV PATH="/opt/yt-dlp/bin:${PATH}"

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    python3 \
    python3-venv \
    ca-certificates \
    tini \
    && rm -rf /var/lib/apt/lists/*

# Install yt-dlp in a Python virtual environment
RUN python3 -m venv /opt/yt-dlp \
    && /opt/yt-dlp/bin/pip install --no-cache-dir "yt-dlp[default]"

# Install production dependencies
COPY package.json package-lock.json ./

RUN npm ci --omit=dev \
    && npm cache clean --force

# Copy compiled application
COPY --from=builder /app/dist ./dist

# Create temporary directory
RUN mkdir -p /app/temp/source \
    && chown -R node:node /app/temp

# Run as a non-root user
USER node

EXPOSE 3333

ENTRYPOINT ["/usr/bin/tini", "--"]

CMD ["node", "dist/server.js"]
