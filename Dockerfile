# Builder stage
FROM node:18-alpine AS builder
WORKDIR /app

# Ensure devDependencies are installed during the build (Vite plugins are dev deps).
ENV NODE_ENV=development

# Copy package manifests first to use Docker layer cache efficiently
COPY package.json package-lock.json* ./

# Install dependencies (including devDependencies)
RUN npm ci --silent

# Copy application source
COPY . .

# Build the app (produces /app/dist)
RUN npm run build

# Production stage: serve the built files using nginx
FROM nginx:stable-alpine
# remove default nginx index if present and copy our build
RUN rm -f /usr/share/nginx/html/* || true
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 and start nginx
EXPOSE 80
CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
