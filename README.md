# Product Manager - Full-Stack Application

A full-stack product management application integrating a RESTful API, frontend interaction, and an admin panel.

## Tech Stack

| Service | Framework | Port |
|---|---|---|
| Frontend | Nuxt 4 (Vue 3) + Tailwind CSS | 3000 |
| Backend API | NestJS 11 (TypeScript) + TypeORM | 3001 |
| Admin Panel | Laravel 13 + Filament 5.4 (PHP 8.3+) | 8000 |
| Database | PostgreSQL 15 | 5432 |
| CI/CD | GitLab CI | - |
| Infrastructure | DigitalOcean + Terraform | - |

## Architecture

```
┌──────────────┐     ┌──────────────────┐     ┌────────────────┐
│   Frontend   │────▶│   Backend API    │────▶│  PostgreSQL 15 │
│  Nuxt :3000  │     │  NestJS :3001    │     │  products_db   │
└──────────────┘     └──────────────────┘     └────────────────┘
                                                      ▲
                     ┌──────────────────┐             │
                     │   Admin Panel    │─────────────┘
                     │ Filament :8000   │
                     └──────────────────┘
```

Both the NestJS API and the Laravel Admin Panel connect directly to the same PostgreSQL database (`products_db`), sharing the `products` table.

## Project Setup

### Prerequisites

- **Node.js** 20+
- **PHP** 8.3+ with extensions: `pdo_pgsql`, `mbstring`, `openssl`, `tokenizer`
- **Composer** 2+
- **PostgreSQL** 15
- **Docker & Docker Compose** (optional, for containerized setup)

### 1. Clone the Repository

```bash
git clone https://github.com/andrimahasantri/nuxtjs.git
cd nuxtjs
```

### 2. Database Setup

Create the PostgreSQL database:

```sql
CREATE DATABASE products_db;
```

---

## How to Run the Application

### Option A: Run with Docker Compose

```bash
docker-compose up --build
```

This starts all services automatically:

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001/api/products |
| Admin Panel | http://localhost:8000/admin |

### Option B: Run Each Service Locally

#### Step 1 - Start Backend API (NestJS)

```bash
cd backend-api
npm install
npm run start:dev
```

The API will run on http://localhost:3001. The `products` table is auto-created by TypeORM on first startup.

**Environment variables** (optional, defaults are provided):

| Variable | Default | Description |
|---|---|---|
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_USERNAME` | `postgres` | Database user |
| `DB_PASSWORD` | `andri123` | Database password |
| `DB_DATABASE` | `products_db` | Database name |
| `PORT` | `3001` | API server port |

#### Step 2 - Start Admin Panel (Laravel Filament)

```bash
cd backend-admin
composer install
cp .env.example .env
php artisan key:generate
```

Edit `.env` and set your PostgreSQL credentials:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=products_db
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

Then run migrations and create an admin user:

```bash
php artisan migrate
php artisan make:filament-user
npm install
npm run build
php artisan serve --port=8000
```

Admin panel is accessible at: http://localhost:8000/admin

#### Step 3 - Start Frontend (Nuxt)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:3000.

| Variable | Default | Description |
|---|---|---|
| `NUXT_PUBLIC_API_BASE` | `http://localhost:3001/api` | Backend API URL |

---

## How to Test the Application

### Backend API (NestJS)

```bash
cd backend-api
npm run test         # Jest unit tests
npm run test:e2e     # End-to-end tests
npm run test:cov     # Test coverage report
npm run lint         # ESLint check with auto-fix
```

### Admin Panel (Laravel)

```bash
cd backend-admin
php artisan test     # PHPUnit tests
```

### Manual API Testing

**List all products (with pagination & search):**

```bash
# Basic list
curl http://localhost:3001/api/products

# With pagination
curl "http://localhost:3001/api/products?page=1&limit=5"

# With search
curl "http://localhost:3001/api/products?search=laptop"
```

**Create a new product:**

```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Laptop", "description": "A powerful laptop", "price": 999.99}'
```

**Validation error example** (missing required field):

```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{"description": "Missing name and price"}'
# Returns 400 with validation error messages
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | List all products (paginated) |
| `POST` | `/api/products` | Create a new product |

### GET /api/products - Query Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page |
| `search` | string | - | Search by name or description |

### GET /api/products - Response

```json
{
  "data": [
    {
      "id": 1,
      "name": "Laptop",
      "description": "A powerful laptop",
      "price": "999.99",
      "created_at": "2026-04-03T10:00:00.000Z",
      "updated_at": "2026-04-03T10:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

### POST /api/products - Request Body

| Field | Type | Required | Validation |
|---|---|---|---|
| `name` | string | Yes | Non-empty string |
| `description` | string | No | Optional text |
| `price` | number | Yes | >= 0, max 2 decimal places |

---

## Database Schema

### Products Table

| Column | Type | Constraints |
|---|---|---|
| `id` | `SERIAL` | Primary key, auto-increment |
| `name` | `VARCHAR(255)` | Not null |
| `description` | `TEXT` | Nullable |
| `price` | `DECIMAL(10,2)` | Not null |
| `created_at` | `TIMESTAMP` | Auto-set on create |
| `updated_at` | `TIMESTAMP` | Auto-set on update |

---

## Frontend Features

- **Product List** - Responsive grid layout displaying all products
- **Product Details** - Each card shows name, description, and price
- **Add Product** - Form with validation to create new products
- **Search** - Real-time search with debounce (300ms) filtering by name/description
- **Pagination** - Navigate through pages with Previous/Next and page number buttons

---

## Admin Panel Features (Laravel Filament)

- **Dashboard** at `/admin`
- **Product CRUD** - Full create, read, update, delete operations
- **Search** - Searchable by name and description columns
- **Filters** - Filter products with description
- **Sorting** - Sortable columns (id, name, price, dates)
- **Bulk Actions** - Bulk delete products
- **Authentication** - Login-protected admin panel

---

## CI/CD Pipeline (GitLab CI)

The `.gitlab-ci.yml` defines a three-stage pipeline:

### Stage 1: Build (parallel jobs)

| Job | Image | Action |
|---|---|---|
| `build-frontend` | `node:20-alpine` | `npm ci && npm run build` |
| `build-backend-api` | `node:20-alpine` | `npm ci && npm run build` |
| `build-backend-admin` | `php:8.3-cli` | `composer install` + `php artisan key:generate` |

### Stage 2: Test (parallel jobs with PostgreSQL service)

| Job | Action |
|---|---|
| `test-backend-api` | `npm run lint` + `npm run test` |
| `test-backend-admin` | `php artisan test` |

### Stage 3: Deploy (main branch only)

1. Build Docker images via `docker compose build`
2. Push images to GitLab Container Registry
3. SSH into production server
4. Pull latest images and restart: `docker compose pull && docker compose up -d`

---

## Infrastructure Description (DigitalOcean + Terraform)

### Deployment Strategy

The application is designed to be deployed on **DigitalOcean** using **Terraform** for infrastructure provisioning. All three services (Frontend, Backend API, Admin Panel) run as Docker containers orchestrated with Docker Compose on a DigitalOcean Droplet, connected to a Managed PostgreSQL database.

### Terraform-Managed Resources

| Resource | DigitalOcean Type | Purpose |
|---|---|---|
| **Droplet** | `digitalocean_droplet` | Application server (Docker host) running all three services |
| **Managed Database** | `digitalocean_database_cluster` | PostgreSQL 15 with automated backups, failover, and maintenance |
| **Firewall** | `digitalocean_firewall` | Restrict inbound traffic to ports 80 (HTTP), 443 (HTTPS), and 22 (SSH) |
| **Domain** | `digitalocean_domain` | DNS zone configuration |
| **DNS Record** | `digitalocean_record` | A record pointing domain to Droplet IP |
| **Load Balancer** | `digitalocean_loadbalancer` | (Optional) Distribute traffic across multiple Droplets for scaling |
| **Spaces Bucket** | `digitalocean_spaces_bucket` | (Optional) Object storage for static assets or file uploads |

### Provisioning Flow

```
Terraform Apply
    │
    ├──▶ Provision Droplet (with cloud-init to install Docker)
    ├──▶ Provision Managed PostgreSQL cluster
    ├──▶ Configure Firewall rules (80, 443, 22)
    ├──▶ Set up DNS records
    │
    └──▶ Output: Droplet IP, DB connection string
              │
              ▼
         GitLab CI deploys via SSH:
         docker compose pull && docker compose up -d
```

### Scaling Considerations

- **Horizontal scaling**: Add more Droplets behind a DigitalOcean Load Balancer
- **Database scaling**: Managed PostgreSQL handles automatic backups, failover, and read replicas
- **Static assets**: Serve frontend build output via DigitalOcean Spaces + CDN
- **Monitoring**: Use DigitalOcean Monitoring + alerts for CPU, memory, and disk usage
