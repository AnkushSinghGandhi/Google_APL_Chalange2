# ---- Stage 1: Build the React app ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy all source files
COPY . .

# Accept optional build-time API keys
ARG VITE_GEMINI_API_KEY_PRIMARY
ARG VITE_GEMINI_API_KEY_FALLBACK
ENV VITE_GEMINI_API_KEY_PRIMARY=$VITE_GEMINI_API_KEY_PRIMARY
ENV VITE_GEMINI_API_KEY_FALLBACK=$VITE_GEMINI_API_KEY_FALLBACK

# Build the production bundle
RUN npm run build

# ---- Stage 2: Serve with Nginx ----
FROM nginx:alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy the built React app from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config so React Router works correctly
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the entrypoint script that injects runtime env vars
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose port 8080 (required by Google Cloud Run)
EXPOSE 8080

# Use entrypoint to inject runtime config before starting nginx
ENTRYPOINT ["/entrypoint.sh"]
