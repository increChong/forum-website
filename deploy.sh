#!/bin/bash

# Forum Website Deployment Script
# Usage: ./deploy.sh [environment]

set -e

ENVIRONMENT=${1:-development}
VERSION=${2:-latest}
REGISTRY=${3:-}

echo "🚀 Starting deployment..."
echo "Environment: $ENVIRONMENT"
echo "Version: $VERSION"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Load environment variables
if [ -f ".env.$ENVIRONMENT" ]; then
    echo "📋 Loading environment variables from .env.$ENVIRONMENT"
    export $(cat ".env.$ENVIRONMENT" | grep -v '^#' | xargs)
elif [ -f ".env" ]; then
    echo "📋 Loading environment variables from .env"
    export $(cat .env | grep -v '^#' | xargs)
fi

# Set COMPOSE_FILE based on environment
if [ "$ENVIRONMENT" = "production" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
else
    COMPOSE_FILE="docker-compose.yml"
fi

# Build images
echo "🔨 Building Docker images..."
docker-compose -f $COMPOSE_FILE build

# Push images to registry (if specified)
if [ -n "$REGISTRY" ] && [ "$ENVIRONMENT" = "production" ]; then
    echo "📤 Pushing images to registry..."
    docker tag forum-backend:$VERSION $REGISTRY/forum-backend:$VERSION
    docker tag forum-frontend:$VERSION $REGISTRY/forum-frontend:$VERSION
    docker push $REGISTRY/forum-backend:$VERSION
    docker push $REGISTRY/forum-frontend:$VERSION
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f $COMPOSE_FILE down

# Start containers
echo "🚀 Starting containers..."
docker-compose -f $COMPOSE_FILE up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check if backend is responding
if curl -f http://localhost:3000/api/v1/health &> /dev/null; then
    echo "✅ Backend is healthy"
else
    echo "⚠️ Backend health check failed"
fi

# Check if frontend is responding
if curl -f http://localhost:80 &> /dev/null; then
    echo "✅ Frontend is healthy"
else
    echo "⚠️ Frontend health check failed"
fi

echo ""
echo "🎉 Deployment completed!"
echo ""
echo "📍 Application URLs:"
echo "   Frontend: http://localhost:80"
echo "   Backend API: http://localhost:3000/api/v1"
echo "   API Docs: http://localhost:3000/api/docs"
echo "   MinIO Console: http://localhost:9001"
echo ""
echo "📊 View logs: docker-compose -f $COMPOSE_FILE logs -f"
