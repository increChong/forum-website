# Forum Website - Deployment Guide

This document provides instructions for deploying the Forum Website application.

## Prerequisites

- Docker 24.0+
- Docker Compose 2.20+
- At least 2GB RAM
- At least 10GB disk space

## Quick Start (Development)

1. Clone the repository:
```bash
git clone https://github.com/increChong/forum-website.git
cd forum-website
```

2. Start all services:
```bash
docker-compose up -d
```

3. Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api/v1
- API Docs (Swagger): http://localhost:3000/api/docs
- MinIO Console: http://localhost:9001 (minioadmin/minioadmin)

## Production Deployment

### 1. Prepare Environment

1. Copy the example environment file:
```bash
cp .env.example .env.production
```

2. Edit `.env.production` and set secure values:
```bash
# Required - must be changed!
DB_PASSWORD=<secure-password>
REDIS_PASSWORD=<secure-password>
MINIO_PASSWORD=<secure-password>
JWT_SECRET=<at-least-32-characters>
```

### 2. SSL Configuration (Optional)

1. Place your SSL certificates in `docker/nginx/ssl/`:
```
docker/nginx/ssl/
├── cert.pem
└── key.pem
```

2. Update nginx.conf to enable HTTPS.

### 3. Deploy

```bash
# Make the script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh production
```

### 4. Verify Deployment

Check service health:
```bash
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Nginx (80/443)                        │
│                   Reverse Proxy + SSL                        │
├─────────────────────────────────────────────────────────────┤
│           Frontend (Vue 3)    │    Backend API (NestJS)     │
│            :5173              │          :3000               │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL  │    Redis    │     MinIO     │   Volumes      │
│    :5432     │    :6379    │    :9000      │                │
└─────────────────────────────────────────────────────────────┘
```

## Service Management

### Start services
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Stop services
```bash
docker-compose -f docker-compose.prod.yml down
```

### View logs
```bash
docker-compose -f docker-compose.prod.yml logs -f [service]
```

### Restart a service
```bash
docker-compose -f docker-compose.prod.yml restart [service]
```

### Scale backend
```bash
docker-compose -f docker-compose.prod.yml up -d --scale backend=3
```

## Database Management

### Run migrations
```bash
docker-compose -f docker-compose.prod.yml exec backend npm run migration:run
```

### Create backup
```bash
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U forum forum > backup.sql
```

### Restore backup
```bash
cat backup.sql | docker-compose -f docker-compose.prod.yml exec -T postgres psql -U forum forum
```

## Monitoring

### Health Check Endpoints

- Backend: `GET /api/v1/health`
- Database: `pg_isready -U forum`
- Redis: `redis-cli ping`
- MinIO: `GET /minio/health/live`

### Recommended Monitoring Stack

- Prometheus + Grafana for metrics
- ELK Stack for logs
- Uptime Kuma for uptime monitoring

## Troubleshooting

### Backend won't start
1. Check database connection: `docker-compose logs postgres`
2. Check Redis connection: `docker-compose logs redis`
3. Check backend logs: `docker-compose logs backend`

### Frontend shows 502
1. Check if backend is running: `curl http://localhost:3000/api/v1/health`
2. Check nginx logs: `docker-compose logs frontend`

### Database connection errors
1. Verify credentials in `.env.production`
2. Check if database is ready: `docker-compose exec postgres pg_isready`
3. Check database logs: `docker-compose logs postgres`

## Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable HTTPS in production
- [ ] Configure firewall rules
- [ ] Set up regular database backups
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Review and update dependencies regularly

## Support

For issues and questions, please open an issue on GitHub:
https://github.com/increChong/forum-website/issues
