FROM node:22-bookworm-slim AS frontend_build
WORKDIR /build/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM node:22-bookworm-slim AS backend_deps
WORKDIR /build/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev

FROM node:22-bookworm-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=backend_deps /build/backend/node_modules ./node_modules
COPY backend/package.json ./package.json
COPY backend/src ./src
COPY backend/scripts ./scripts
COPY --from=frontend_build /build/frontend/dist ./public
EXPOSE 5000
CMD ["node", "src/index.js"]
