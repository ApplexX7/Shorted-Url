#!/bin/sh

sleep 3

npx prisma generate

npx prisma migrate deploy

npm run start:dev