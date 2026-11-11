---
id: docker-compose
name: "Docker Compose"
kind: tool
status: planned
tags: [docker-compose, containers, docker, orchestration, devops]
what: "A declarative tool for defining and running multi-container Docker applications using a single YAML configuration file."
why: "Spins up complete multi-service development stacks (Node app, PostgreSQL, Redis) with unified networking and volumes in a single command."
problem: "Running multiple containerized services manually requires memorizing complex docker run CLI commands, network bridges, volume mounts, and restart policies."
relations:
  - { to: docker, label: "uses" }
  - { to: postgresql, label: "integrates with" }
  - { to: mysql, label: "integrates with" }
  - { to: nodejs, label: "runs on" }
links:
  - { title: "Docker Compose Documentation", url: "https://docs.docker.com/compose/" }
  - { title: "Compose File Reference", url: "https://docs.docker.com/reference/compose-file/" }
alsoIn: []
source: self-study
---

## Example
```yaml
# compose.yaml - Local multi-service development stack
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:secret123@db:5432/myapp
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secret123
      POSTGRES_DB: myapp
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
```

## Key points
- **Automatic internal DNS networking**: services on the same Compose file communicate using service names as hostnames (e.g., `db:5432` or `redis:6379`) without exposing ports to the public host.
- **Named volume persistence**: database data must be mounted to a named volume (`pgdata:`); otherwise, database records are lost when containers are recreated or stopped.
- **Healthcheck dependency**: use `depends_on: { db: { condition: service_healthy } }` to ensure your backend Node application waits until the database server is fully listening before starting up.
