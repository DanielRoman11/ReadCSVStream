FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

RUN npm init -y
FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

RUN pnpm config set store-dir /pnpm-store
RUN apk add git

EXPOSE 3000 
CMD [ "pnpm", "start:dev" ]
