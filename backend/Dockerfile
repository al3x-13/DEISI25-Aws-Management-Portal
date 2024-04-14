FROM node:18-alpine

# pnpm setup
RUN npm install -g pnpm

WORKDIR /app

# workspace setup
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .
COPY types ./types
COPY backend ./backend
RUN pnpm install

# types setup
WORKDIR /app/types
RUN pnpm install --prod

# backend setup
WORKDIR /app/backend
RUN pnpm install --prod
RUN pnpm run build

EXPOSE 3000

CMD [ "node", "-r", "tsconfig-paths/register", "build/backend/src/index.js" ]
