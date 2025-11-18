# Builder stage
FROM node:18-alpine AS builder
WORKDIR /app

# Ensure NODE_ENV development so devDependencies (vite plugins) are installed
ENV NODE_ENV=development

# Install system packages needed for native builds and git (if any dependency uses git)
# We install bash too to ease debugging
RUN apk add --no-cache python3 make g++ git bash

# Copy package manifests first to leverage docker cache
COPY package.json package-lock.json* ./

# Try clean install with npm ci; if it fails, fallback to npm install.
# We show verbose logs if failures happen.
RUN set -eux; \
    if npm ci --silent; then \
      echo "npm ci succeeded"; \
    else \
      echo "npm ci failed — falling back to npm install (verbose)"; \
      npm install --verbose; \
    fi

# Copy source files
COPY . .

# Build the app (produces /app/dist)
RUN npm run build

# Production stage: use nginx to serve the build
FROM nginx:stable-alpine AS runtime
# remove default nginx html pages (safety)
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
