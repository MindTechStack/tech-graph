---
id: nestjs
name: "NestJS"
kind: framework
status: planned
tags: [nestjs, typescript, backend, mvc, dependency-injection, architecture]
what: "Progressive, opinionated Node.js framework built with TypeScript for building enterprise-grade, scalable server-side applications."
why: "Provides a structured modular architecture (`@Module`, `@Controller`, `@Injectable`) with built-in Dependency Injection and native support for REST, GraphQL, WebSockets, and Microservices."
problem: "Unopinionated frameworks like Express lack architectural conventions, leading large teams to create inconsistent file structures, ad-hoc dependency wiring, and hard-to-test codebases."
relations:
  - { to: nodejs, label: "runs on" }
  - { to: typescript, label: "written in" }
  - { to: express, label: "built on" }
  - { to: fastify, label: "runs on" }
  - { to: mvc, label: "implements" }
  - { to: kafka, label: "integrates with" }
links:
  - { title: "NestJS Documentation", url: "https://docs.nestjs.com/" }
  - { title: "NestJS GitHub", url: "https://github.com/nestjs/nest" }
alsoIn: []
source: self-study
---

## Example
```ts
import { Controller, Get, Param, Injectable, Module } from "@nestjs/common";

@Injectable()
export class UsersService {
  private readonly users = [{ id: "1", name: "Alice", role: "admin" }];

  findOne(id: string) {
    return this.users.find((u) => u.id === id);
  }
}

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(":id")
  getUser(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }
}

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

## Key points
- **Dependency Injection & IoC container**: classes declare dependencies in constructors; Nest instantiates, wires, and scopes them automatically, making unit testing with mocks seamless.
- **Modular architecture**: applications are organized into domain-specific modules (`@Module`) that encapsulate controllers, providers, and exported capabilities.
- **HTTP engine abstraction**: uses Express by default for ecosystem compatibility, or swaps to Fastify via `FastifyAdapter` for higher throughput without changing controller code.
