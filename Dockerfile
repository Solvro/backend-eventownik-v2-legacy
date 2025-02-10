FROM node:22 AS base

# All deps stage
FROM base AS deps
WORKDIR /app
ADD package.json ./
RUN npm i

# Production only deps stage
FROM base AS production-deps
WORKDIR /app
ADD package.json ./
RUN npm i --omit=dev

# Build stage
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
ADD . .
RUN node ace build

# Production stage
FROM base
ENV NODE_ENV=production
WORKDIR /app
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app
VOLUME /app/public
EXPOSE 8080
CMD ["node", "./bin/server.js"]
