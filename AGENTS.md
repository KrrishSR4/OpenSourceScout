# AGENTS.md

# OpenSource Scout — Engineering Guidelines

## Mission

Transform the existing OpenSource Scout prototype into a production-ready SaaS application following modern Full Stack, DevOps, DevSecOps, Cloud, and SRE best practices.

The project should prioritize clean architecture, maintainability, scalability, observability, and performance over unnecessary complexity.

---

# Product Overview

OpenSource Scout helps developers discover the best GitHub repositories to contribute to.

Current functionality already includes:

* Premium landing page
* Repository discovery
* Language detection
* Framework recommendation
* GitHub repository parsing
* Repository cards
* External GitHub links

Future development must improve architecture instead of redesigning existing UI.

UI is considered stable.

Focus on backend, infrastructure, security, observability, and production readiness.

---

# Tech Stack

## Frontend

* React
* TypeScript
* Tailwind CSS
* Framer Motion
* Lenis

Purpose:

* Modern UI
* Strong typing
* Smooth animations
* Excellent developer experience

---

## Backend

* Node.js
* Express.js
* TypeScript

Architecture

controllers/
services/
routes/
middlewares/
utils/
config/

Business logic must stay inside Services.

Controllers should remain lightweight.

---

## Database

PostgreSQL

Use PostgreSQL for:

* Search History
* Framework Mapping
* Cached Repository Metadata
* Saved Searches
* Bookmarks (future)
* Analytics (future)

---

## ORM

Use Prisma ORM.

Reason:

* Type-safe queries
* Database migrations
* Better maintainability
* Reduced SQL boilerplate

Avoid raw SQL unless absolutely necessary.

---

## Cache

Redis (Upstash)

Use Redis only for:

* GitHub API caching
* Frequently requested repository searches
* Rate-limit reduction

Do not cache everything.

Only cache expensive GitHub API responses.

---

# API Layer

GitHub REST API

Implement:

* Rate limit handling
* Retry strategy
* Error handling
* Pagination
* Response caching

Never expose GitHub tokens to frontend.

---

# Frontend Guidelines

The UI already exists.

Do not redesign components unless required.

Focus on:

* Better loading states
* Skeleton loaders
* Better empty states
* Error handling
* Responsive improvements
* Accessibility

Animations must remain smooth.

Performance always takes priority over visual effects.

---

# DevOps

Use only essential DevOps tools.

Required:

* Docker
* Docker Compose
* GitHub Actions
* Nginx

Avoid unnecessary infrastructure.

---

## Docker

Containerize:

* Frontend
* Backend

Database and Redis should run as separate services.

---

## Docker Compose

Provide a one-command local setup.

docker compose up

should start

* Frontend
* Backend
* PostgreSQL
* Redis

---

## GitHub Actions

CI Pipeline

On every Pull Request:

* Install dependencies
* Lint
* Type Check
* Build
* Run Tests
* Docker Build

Deploy workflow should remain separate.

---

## Nginx

Use as:

* Reverse Proxy
* Static Asset Server
* API Gateway

---

# Cloud

Use free services only.

Frontend

* Vercel

Backend

* Render

Database

* Supabase PostgreSQL

Cache

* Upstash Redis

No paid infrastructure.

---

# DevSecOps

Minimum required security:

* Helmet
* CORS
* Rate Limiting
* Input Validation
* Environment Variables
* GitHub CodeQL
* Dependabot
* Secret Scanning

Never hardcode secrets.

Never commit API keys.

---

# Observability (SRE)

Implement production monitoring.

---

## Logging

Use Pino.

Every request should generate structured logs.

Log:

* Request ID
* Route
* Status Code
* Duration
* Errors

---

## Metrics

Expose

/metrics

using Prometheus.

Track:

* Total Requests
* Response Time
* Error Rate
* Cache Hit Ratio
* GitHub API Calls

---

## Dashboard

Grafana should visualize:

* API Requests
* Latency
* Error Rate
* Cache Performance
* GitHub API Usage

---

## Health Checks

Implement:

GET /health
GET /ready
GET /live

These endpoints should be lightweight.

---

# Performance

Implement:

* Lazy Loading
* Redis Caching
* Pagination
* Optimized API Calls
* Image Optimization
* Compression

Avoid unnecessary network requests.

---

# Folder Structure

client/

server/

docker/

monitoring/

nginx/

.github/workflows/

docs/

---

# Code Quality

Always use:

* TypeScript
* ESLint
* Prettier
* Modular Architecture

No duplicated logic.

Keep components reusable.

Keep services independent.

---

# Design Philosophy

Do not change the visual identity.

The UI is already considered production quality.

Future improvements should prioritize:

* Better engineering
* Better infrastructure
* Better monitoring
* Better performance
* Better developer experience

over visual redesign.

---

# Engineering Principle

Every technology added to the project must solve a real engineering problem.

Do not introduce tools only because they are popular.

Each dependency must have a clear justification in terms of:

* Performance
* Maintainability
* Security
* Scalability
* Developer Experience
* Reliability

If a technology does not provide measurable value to the application, it should not be added.

Keep the architecture simple, production-ready, and interview-friendly.
