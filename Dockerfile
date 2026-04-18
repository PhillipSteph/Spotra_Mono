# Stage 1: Build Backend (Java/Gradle)
FROM gradle:8.14-jdk17 AS backend-builder

WORKDIR /app

# Copy backend source code
COPY Spotra_BE/ /app/backend/

WORKDIR /app/backend

# Build the backend JAR
RUN gradle clean build -x test

# Stage 2: Build Frontend (Node.js)
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy frontend source code
COPY Spotra_FE/ /app/frontend/

WORKDIR /app/frontend

# Install dependencies and build
RUN npm ci && npm run build

# Stage 3: Runtime - Combine both applications
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Copy the built backend JAR from backend-builder stage
COPY --from=backend-builder /app/backend/build/libs/*.jar /app/backend.jar

# Copy the built frontend assets from frontend-builder stage
COPY --from=frontend-builder /app/frontend/build /app/static

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Expose ports
EXPOSE 8085 8086

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8085/h2-console || exit 1

# Start the backend application
ENTRYPOINT ["java", "-jar", "/app/backend.jar", "--server.port=8085"]
