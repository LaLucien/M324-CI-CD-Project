FROM node:22-alpine AS build

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

FROM node:22-alpine AS runtime

ENV NODE_ENV=production
ENV PORT=4000

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --omit=dev

COPY --from=build /app/frontend/dist ./dist

EXPOSE 4000

CMD ["node", "dist/m324-cicd-frontend/server/server.mjs"]
