FROM node:18-alpine AS builder

# pnpm setup
RUN npm install -g pnpm

WORKDIR /app

# workspace setup
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .
COPY types ./types
COPY frontend ./frontend
RUN pnpm install

# types setup
WORKDIR /app/types
RUN pnpm install --prod

# backend setup
WORKDIR /app/frontend
RUN pnpm install --prod
RUN pnpm run build

# running
WORKDIR /app/frontend/build

ENV HOST=0.0.0.0
ENV PORT=5173
ENV ORIGIN=http://localhost:5173
EXPOSE 5173

CMD [ "node", "index.js" ]
