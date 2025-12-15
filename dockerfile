# -------- Stage 1: build (Vite/React) --------
FROM node:22-alpine AS build
WORKDIR /app

# install deps
COPY package.json package-lock.json ./
RUN npm ci

# build
COPY . .
RUN npm run build

# -------- Stage 2: nginx --------
FROM nginx:1.27-alpine

# Vite outputs to /dist (CRA -> /build)
COPY --from=build /app/dist /usr/share/nginx/html

# SPA routing for React Router
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]