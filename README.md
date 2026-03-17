# Shorten-Url
A full-stack URL shortener application built with NestJS, React, Prisma, and PostgreSQL.

**By Mohammed Hilali**

---

## Tech Stack

| Part | Technology |
|---|---|
| Backend | NestJS + Prisma |
| Frontend | React + Vite + Tailwind |
| Database | PostgreSQL |
| Containerization | Docker + Docker Compose |

---

## Project Structure

```
Shorten-Url/
  back-end/        # NestJS + Prisma
  front-end/       # React + Vite
  docker-compose.yml
  makefile
  README.md
```

---

## Prerequisites

Make sure you have the following installed:
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Make](https://www.gnu.org/software/make/) (optional, for makefile commands)
- [Node.js](https://nodejs.org/) v20+ (optional, for running locally without Docker)

---

## Running the Project

### With Docker (Recommended)

#### Using the Makefile

```bash
# Build and start all services (frontend, backend, database)
make all

# Build images only
make build

# Start services in background
make start

# Stop services
make stop

# Stop and remove volumes
make down

# View logs for all services
make logs

# View logs for backend only
make logs-server

# View logs for frontend only
make logs-client

# Restart all services
make restart

# Remove all containers, images and volumes
make clean

# Clear Docker build cache
make clean-cache
```

#### Without the Makefile

```bash
# Build and start all services
docker-compose up --build

# Start in background
docker-compose up -d --build

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View logs
docker-compose logs -f

# View logs for a specific service
docker-compose logs -f server
docker-compose logs -f client
```

---

### Without Docker (Local Development)

#### 1. Start the Database

Make sure you have PostgreSQL running locally, then create a database:

```sql
CREATE DATABASE shortenurl;
```

#### 2. Start the Backend

```bash
cd back-end
npm install
```

Create a `.env` file in `back-end/`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/shortenurl"
```

Run migrations and start:
```bash
npx prisma migrate deploy
npm run start:dev
```

Backend runs on: `http://localhost:3000`

#### 3. Start the Frontend

```bash
cd front-end
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## Running Tests

### With Makefile

```bash
# Run backend tests
make all && make test

# Run backend e2e tests
make all && make test:e2e
```

### With Docker

```bash
# Run backend tests
docker exec server npm run test

# Run backend e2e tests
docker exec server npm run test:e2e
```

### Without Docker

```bash
cd back-end
npm run test          # unit tests
npm run test:e2e      # integration tests
npm run test:cov      # test coverage
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/urls` | Get all shortened URLs (paginated) |
| `POST` | `/urls` | Create a new shortened URL |
| `GET` | `/:shortCode` | Redirect to the original URL |

### Query Parameters for GET /urls

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | number | 1 | Page number |
| `limit` | number | 15 | Results per page |

### Example Request

```bash
# Create a short URL
curl -X POST http://localhost:3000/urls \
  -H "Content-Type: application/json" \
  -d '{"longUrl": "https://example.com/very/long/url"}'

# Response
{
  "id": 1,
  "shortCode": "abc123",
  "longUrl": "https://example.com/very/long/url",
  "createdAt": "2026-03-16T00:00:00.000Z"
}
```

---

## Features

- Paste a long URL and get a short one instantly
- Visit the short URL to be redirected to the original
- View all shortened URLs with infinite scroll pagination
- Fully containerized with Docker

---

## Access the App

Once running, open your browser:

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000 |
| Database | localhost:5432 |