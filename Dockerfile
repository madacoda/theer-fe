# Use the official Bun image
# https://hub.docker.com/r/oven/bun
FROM oven/bun:latest AS base
WORKDIR /app

# Step 1: Install dependencies
# Using a separate stage to cache dependencies
FROM base AS install
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Step 2: Build the application
FROM base AS build
COPY --from=install /app/node_modules ./node_modules
COPY . .

# Build-time arguments
ARG VITE_API_URL
ARG API_URL
ENV VITE_API_URL=$VITE_API_URL
ENV API_URL=$API_URL

RUN bun run build

# Step 3: Production runner
FROM base AS release
COPY --from=build /app/.output ./.output
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/public ./public

# Runtime environment variables
ENV NODE_ENV=production
ENV PORT=1000
ENV NITRO_PORT=1000
ENV HOST=0.0.0.0
ENV API_URL=http://mctheer-api:3000

# You can override this at runtime
# ENV VITE_API_URL=http://your-api.com

EXPOSE 1000

# Start the TanStack Start (Nitro) server
CMD ["bun", ".output/server/index.mjs"]
