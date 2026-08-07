FROM node:26-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --chown=node:node package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --chown=node:node index.mjs index.d.ts README.md LICENSE ./
COPY --chown=node:node src ./src
USER node
CMD ["node", "--input-type=module", "-e", "import('./index.mjs').then(() => console.log('discord library loaded'))"]
