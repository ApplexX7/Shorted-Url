FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

ENV DATABASE_URL="postgresql://postgres:postgres@db:5432/shortenurl"

RUN npx prisma generate

RUN npm run build

RUN chmod +x runner.sh

EXPOSE 3000

CMD ["sh", "runner.sh"]