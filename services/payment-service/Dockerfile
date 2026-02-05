FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY src ./src

ENV NODE_ENV=production
EXPOSE 4004

CMD ["node", "src/index.js"]
