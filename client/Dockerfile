FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY public ./public
COPY src ./src

ARG REACT_APP_API_BASE
ENV REACT_APP_API_BASE=${REACT_APP_API_BASE}

RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve

COPY --from=build /app/build ./build

EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
