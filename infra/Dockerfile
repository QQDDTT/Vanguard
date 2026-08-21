# Frontend Builder Stage
FROM node:20-slim as frontend-builder
WORKDIR /usr/src/frontend
COPY vanguard-web/package.json vanguard-web/package-lock.json* ./
RUN npm ci
COPY vanguard-web/ ./
RUN npm run build

# Backend Builder Stage
FROM rust:1.95-slim as builder

WORKDIR /usr/src/vanguard

# Install required build dependencies
RUN apt-get update && apt-get install -y pkg-config libssl-dev && rm -rf /var/lib/apt/lists/*

# Copy workspace manifests
COPY Cargo.toml Cargo.lock ./
COPY crates/ crates/

# Build release binary
RUN cargo build --release -p vanguard-api

# Runtime Stage
FROM debian:trixie-slim

RUN apt-get update && apt-get install -y ca-certificates libssl-dev && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=builder /usr/src/vanguard/target/release/vanguard-api /app/vanguard-api
COPY --from=frontend-builder /usr/src/frontend/dist /app/web

EXPOSE 8080
ENV PORT=8080

CMD ["/app/vanguard-api"]
