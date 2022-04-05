FROM node:16-alpine AS project-build
LABEL name="city-search"


WORKDIR /app/

COPY package.json package-lock.json tsconfig.json tsconfig.build.json ./
RUN npm install

COPY . .

RUN npm run build
RUN npm prune --production

#second stage
FROM node:16-alpine

COPY . .
COPY --from=project-build /app/node_modules ./node_modules
COPY --from=project-build /app/dist ./dist

EXPOSE 3000
CMD npm run start
