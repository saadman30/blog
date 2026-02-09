# NestJS Tutorial: How Nest Works and Why It Wraps Express

This document is a **detailed tutorial** on how NestJS works, how it wraps Express to reduce complexity, and how this blog backend is structured. It uses **concrete examples from this project** so you can understand both the framework and the codebase in one place.

---

## Table of Contents

1. [NestJS vs Express: The Big Picture](#1-nestjs-vs-express-the-big-picture)
2. [How Nest Wraps Express](#2-how-nest-wraps-express)
3. [Dependency Injection and the IoC Container](#3-dependency-injection-and-the-ioc-container)
4. [Modules: The Unit of Organization](#4-modules-the-unit-of-organization)
5. [Controllers: HTTP Without Boilerplate](#5-controllers-http-without-boilerplate)
6. [Pipes, Validation, and DTOs](#6-pipes-validation-and-dtos)
7. [Services and Application Logic](#7-services-and-application-logic)
8. [Ports, Adapters, and Testability](#8-ports-adapters-and-testability)
9. [Lifecycle Hooks](#9-lifecycle-hooks)
10. [This Project End-to-End](#10-this-project-end-to-end)
11. [Summary: Where Nest Hides Express Complexity](#11-summary-where-nest-hides-express-complexity)

---

## 1. NestJS vs Express: The Big Picture

### What Express Gives You (and What It Doesn’t)

**Express** is a minimal HTTP framework. You get:

- Routing: `app.get('/posts', handler)`
- Middleware: `app.use(middleware)`
- `req` and `res` objects

You do **not** get:

- A standard way to structure the app (folders, layers, naming).
- Built-in dependency injection (you pass dependencies manually or use globals).
- A standard way to validate request bodies (you wire `express-validator` or similar yourself).
- Built-in OpenAPI/Swagger (you document by hand or with extra libs).
- A clear convention for where routes, business logic, and data access live.

So in a typical Express app you end up:

- Manually wiring routes, validation, error handling, and DB access.
- Deciding yourself how to inject repositories or services (constructor args, factories, or singletons).
- Repeating similar patterns in every controller.

### What NestJS Adds on Top of Express

NestJS **uses Express under the hood** (via `@nestjs/platform-express`). You can see it in this project’s `package.json`:

```json
"@nestjs/platform-express": "^10.4.15"
```

Nest does **not** replace Express; it **wraps** it and adds:

| Concern | In Express (typical) | In Nest (this project) |
|--------|-----------------------|-------------------------|
| **Routing** | Manual `app.get/post/put` and router files | Declarative `@Controller`, `@Get`, `@Post`, `@Put` on classes |
| **Dependency injection** | Manual wiring or globals | Constructor injection + IoC container; bindings in modules |
| **Validation** | Manual middleware (e.g. express-validator) | `ValidationPipe` + DTO classes with `class-validator` |
| **Structure** | You invent it | Modules → Controllers → Services → Ports/Adapters |
| **Documentation** | Manual or separate tooling | `@nestjs/swagger` decorators on same DTOs/controllers |
| **Lifecycle** | Manual `app.listen` and cleanup | `OnModuleInit`, `OnModuleDestroy`, `bootstrap()` |

So Nest is **efficient over Express** in the sense that it **wraps a lot of recurring complexity** behind conventions and decorators, so you write less glue code and get a consistent structure.

---

## 2. How Nest Wraps Express

### Bootstrap: One Entry Point

In this project, the app starts in `src/main.ts`:

```ts
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ ... });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT != null ? Number(process.env.PORT) : 4000;
  await app.listen(port);
}
bootstrap();
```

- **`NestFactory.create(AppModule)`** creates the Nest application and the **injector** (IoC container). It also creates an Express app internally and attaches Nest’s request handling to it.
- **`app.enableCors()`** and **`app.useGlobalPipes()`** are Nest APIs that ultimately configure the underlying Express app (CORS middleware and a global middleware that runs validation).
- **`app.listen(port)`** is the same idea as `express().listen(port)`, but Nest first initializes all modules and their providers (e.g. `PrismaService.$connect()`).

So: **Express is still there**; you just don’t touch `app.get/post` or `router` directly. Nest turns **modules, controllers, and route decorators** into Express routes and middleware for you.

### What Happens When a Request Hits the Server

1. **Express** receives the HTTP request (Nest uses Express as the default HTTP adapter).
2. **Nest’s pipeline** runs: middleware → guards → pipes → controller method.
3. In this project, **ValidationPipe** runs early and validates (and transforms) the body/query/params against the DTO class for that route. Invalid requests are rejected before the controller.
4. The **controller** method runs. It uses **constructor-injected** services (no manual `new` or globals).
5. The return value is serialized and sent back via Express.

So the “efficiency” is: you don’t manually register routes, validation middleware, or dependency wiring; you declare them with decorators and modules, and Nest wraps Express to run them in the right order.

---

## 3. Dependency Injection and the IoC Container

### Why DI Matters

In plain Express you might do:

```ts
// Hypothetical Express style
const postRepository = new PrismaPostRepository(prisma);
const saveDraftService = new SaveDraftService(postRepository);
app.post('/api/admin/posts/save-draft', (req, res) => {
  saveDraftService.execute(req.body).then(...);
});
```

You have to **build the object graph yourself** and pass it into routes. In Nest, you declare **what** you need in the constructor; the **container** provides the **how** and the **when**.

### Injecting Services in Controllers

Example from this project — **SettingsController** only declares dependencies; it never creates them:

```ts
// src/modules/settings/settings.controller.ts
@Controller('api/admin/settings')
export class SettingsController {
  constructor(
    private readonly getSettings: GetSettingsService,
    private readonly updateSettings: UpdateSettingsService,
  ) {}

  @Get()
  async get(): Promise<AdminSettingsResponseDto> {
    return this.getSettings.execute();
  }

  @Put()
  async update(@Body() body: AdminSettingsBodyDto): Promise<AdminSettingsResponseDto> {
    const view = { ... };
    return this.updateSettings.execute(view);
  }
}
```

Nest sees that `SettingsController` needs `GetSettingsService` and `UpdateSettingsService`. It looks them up in the **module** where the controller is declared and injects the same singleton instances. You get **testability** (you can pass mocks in tests by overriding the module) and **no manual wiring** in application code.

### Injecting Ports (Interfaces) via Tokens

Application services often depend on **abstractions** (e.g. a repository interface), not concrete classes. JavaScript/TypeScript don’t have a native way to bind “interface → implementation” in a DI container, so this project uses **tokens** (Symbols):

```ts
// src/modules/settings/ports/settings.repository.port.ts
export interface ISettingsRepository {
  get(): Promise<AdminSettingsEntity | null>;
  getOrCreate(defaults: AdminSettingsEntity): Promise<AdminSettingsEntity>;
  update(data: AdminSettingsUpdate): Promise<AdminSettingsEntity>;
}

export const SETTINGS_REPOSITORY = Symbol('SETTINGS_REPOSITORY');
```

In the **module**, we bind the token to the concrete adapter:

```ts
// src/modules/settings/settings.module.ts
@Module({
  controllers: [SettingsController],
  providers: [
    { provide: SETTINGS_REPOSITORY, useClass: PrismaSettingsRepository },
    GetSettingsService,
    UpdateSettingsService,
  ],
})
export class SettingsModule {}
```

Then in the service we **inject by token**:

```ts
// src/modules/settings/application/get-settings.service.ts
@Injectable()
export class GetSettingsService {
  constructor(
    @Inject(SETTINGS_REPOSITORY) private readonly settings: ISettingsRepository,
  ) {}

  async execute(): Promise<AdminSettingsView> {
    const entity = await this.settings.getOrCreate({ ... });
    return { ... };
  }
}
```

So: **Nest’s efficiency** here is that it gives you one consistent way to wire interfaces to implementations (tokens + `providers`) and inject them anywhere in the module (or in importing modules if you export the service). In Express you’d typically do this with your own factory or container.

---

## 4. Modules: The Unit of Organization

### What a Module Is

A **module** is a boundary for:

- **Controllers** (HTTP entrypoints).
- **Providers** (services, repositories, anything injectable).
- **Exports** (what other modules can use).

Nest uses modules to build a **graph**: `AppModule` imports feature modules, and feature modules can import each other (e.g. `PublicModule` and `InsightsModule` import `ContentModule`).

### Root Module: Only Imports

```ts
// src/app.module.ts
@Module({
  imports: [
    PrismaModule,
    TaxonomyModule,
    ContentModule,
    PublicModule,
    InsightsModule,
    SettingsModule,
  ],
})
export class AppModule {}
```

There are **no controllers or providers** at the root; the root only composes the app from feature and infrastructure modules. All HTTP and business logic live inside those modules. This keeps the app easy to navigate and test.

### Feature Module: Controllers + Providers + Optional Exports

**SettingsModule** is self-contained: it has one controller, application services, and a repository binding. It doesn’t export anything because nothing else needs settings.

```ts
// src/modules/settings/settings.module.ts
@Module({
  controllers: [SettingsController],
  providers: [
    { provide: SETTINGS_REPOSITORY, useClass: PrismaSettingsRepository },
    GetSettingsService,
    UpdateSettingsService,
  ],
})
export class SettingsModule {}
```

**ContentModule** is the opposite: it **exports** application services so other modules can use them without touching the repository or admin controller:

```ts
// src/modules/content/content.module.ts
@Module({
  controllers: [AdminPostsController],
  providers: [
    { provide: POST_REPOSITORY, useClass: PrismaPostRepository },
    SaveDraftService,
    GetPostEditorDataService,
    ListAdminPostsService,
    ListPublishedPostsService,
    GetPublicPostBySlugService,
  ],
  exports: [
    ListPublishedPostsService,
    GetPublicPostBySlugService,
    ListAdminPostsService,
  ],
})
export class ContentModule {}
```

So **PublicModule** and **InsightsModule** don’t duplicate post logic; they **import ContentModule** and use its exported services. That’s **module composition**: Nest resolves the dependency graph and injects the right instances.

### Global Module: Available Everywhere

**PrismaModule** is marked `@Global()` so every module can inject `PrismaService` without importing `PrismaModule`:

```ts
// src/common/prisma/prisma.module.ts
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

So: **Nest wraps the complexity** of “who gets which dependency” into a single, declarative system (modules + imports + exports + global). In Express you’d pass a `prisma` instance through middleware or attach it to `req` yourself.

---

## 5. Controllers: HTTP Without Boilerplate

### Declarative Routing

In Express you write:

```ts
router.get('/api/admin/settings', getSettingsHandler);
router.put('/api/admin/settings', putSettingsHandler);
```

In this project the **same thing** is expressed on the class and methods:

```ts
// src/modules/settings/settings.controller.ts
@ApiTags('admin')
@Controller('api/admin/settings')
export class SettingsController {
  @Get()
  async get(): Promise<AdminSettingsResponseDto> { ... }

  @Put()
  async update(@Body() body: AdminSettingsBodyDto): Promise<AdminSettingsResponseDto> { ... }
}
```

Nest **registers** these routes with Express for you. The **efficiency** is: no separate router file, no manual `req.body` / `res.json`; you use **parameter decorators** (`@Body()`, `@Param()`, `@Query()`) and return values (or throw Nest exceptions like `NotFoundException`), and Nest handles the rest.

### Parameter Decorators Replace Manual Parsing

Example from **AdminPostsController**:

```ts
// src/modules/content/controllers/admin-posts.controller.ts
@Get(':id/editor-data')
async getEditorData(@Param('id') id: string): Promise<PostEditorDataResponseDto> {
  if (id === 'new') return this.getPostEditorData.execute('new');
  const numId = parseInt(id, 10);
  if (Number.isNaN(numId)) throw new BadRequestException('Invalid post id');
  return this.getPostEditorData.execute(numId);
}

@Post('save-draft')
@HttpCode(HttpStatus.OK)
async saveDraft(@Body() body: SaveDraftBodyDto): Promise<{ id: number }> {
  try {
    const result = await this.saveDraftService.execute({ ... });
    return result;
  } catch (e) {
    if (msg.includes('not found')) throw new NotFoundException(msg);
    throw new BadRequestException(msg);
  }
}
```

- **`@Param('id')`** gives you the route param already; no `req.params.id`.
- **`@Body()`** gives you the body. Because of **ValidationPipe**, `body` is already validated and transformed into a `SaveDraftBodyDto` instance; invalid bodies never reach this method.
- **`NotFoundException`** and **BadRequestException** are Nest HTTP exceptions that produce the correct status and JSON body.

So Nest wraps the complexity of parsing and validating request data and of sending consistent error responses.

---

## 6. Pipes, Validation, and DTOs

### Global ValidationPipe

In `main.ts` we have:

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }),
);
```

- **whitelist**: strip properties not present on the DTO (no accidental `__proto__` or extra fields).
- **forbidNonWhitelisted**: if the client sends unknown properties, respond with 400.
- **transform**: turn plain objects into class instances and apply `class-transformer` (e.g. for nested DTOs and types).
- **enableImplicitConversion**: coerce query/param strings to numbers etc. when the DTO type says so.

So **every** route that uses a DTO in `@Body()`, `@Query()`, or `@Param()` gets validation and transformation **before** the controller runs. In Express you’d add validation middleware per route or per router and remember to use it everywhere.

### DTOs as Single Source of Truth

Request DTOs in this project use **class-validator** and **Swagger** on the same class:

```ts
// src/modules/settings/dto/settings.dto.ts
export class AdminSettingsBodyDto {
  @ApiProperty({ type: SeoDefaultsDto })
  @IsObject()
  @ValidateNested()
  @Type(() => SeoDefaultsDto)
  seoDefaults!: SeoDefaultsDto;

  @ApiProperty()
  @IsString()
  authorName!: string;
  // ...
}
```

- **Validation**: `ValidationPipe` uses the same decorators to validate incoming bodies.
- **Documentation**: `@nestjs/swagger` reads `@ApiProperty` and friends to build OpenAPI at `api/docs`.

So one class defines shape, validation, and API docs. Nest’s efficiency is that it **integrates** validation and Swagger with the same DTOs and one global pipe, instead of you wiring validators and docs by hand in Express.

---

## 7. Services and Application Logic

### Controllers Stay Thin

Controllers in this project only:

- Map HTTP (body/params) to a view or command.
- Call one or more application services.
- Return DTOs or throw Nest HTTP exceptions.

They do **not** contain business rules or database access. That lives in **application services** (in `application/` folders).

### Application Services Own the Use Cases

Example: **SaveDraftService** contains the rules for “create or update a draft” (slug uniqueness, status mapping, when to set `publishedAt`):

```ts
// src/modules/content/application/save-draft.service.ts
@Injectable()
export class SaveDraftService {
  constructor(@Inject(POST_REPOSITORY) private readonly postRepository: IPostRepository) {}

  async execute(cmd: SaveDraftCommand): Promise<{ id: number }> {
    const status = statusMap[cmd.status];
    const publishedAt = status === 'PUBLISHED' ? new Date() : null;
    const scheduledFor = cmd.scheduledFor ? new Date(cmd.scheduledFor) : null;

    if (cmd.id != null) {
      const existing = await this.postRepository.findById(cmd.id);
      if (!existing) throw new Error(`Post ${cmd.id} not found`);
      await this.postRepository.update(cmd.id, { ... });
      return { id: cmd.id };
    }

    const slugExists = await this.postRepository.findBySlug(cmd.slug);
    if (slugExists) throw new Error(`Slug already in use: ${cmd.slug}`);

    const post = await this.postRepository.create({ ... });
    return { id: post.id };
  }
}
```

The service depends only on **IPostRepository** (a port). It doesn’t know about HTTP, Express, or Prisma. So:

- **Testing**: you inject a fake repository and test the use case in isolation.
- **Reuse**: the same service can be used from different controllers (e.g. admin vs a future CLI).

Nest’s role is to **inject** the repository and the service where needed, so you don’t pass them manually through layers (as you would in a raw Express app).

### Cross-Module Use of Services

**InsightsModule** doesn’t have a post repository; it reuses **ContentModule**’s application layer:

```ts
// src/modules/insights/insights.module.ts
@Module({
  imports: [ContentModule],
  controllers: [InsightsController],
  providers: [GetInsightsService],
})
export class InsightsModule {}
```

```ts
// src/modules/insights/application/get-insights.service.ts
@Injectable()
export class GetInsightsService {
  constructor(private readonly listAdminPosts: ListAdminPostsService) {}

  async execute(): Promise<PostInsightResult[]> {
    const posts = await this.listAdminPosts.execute();
    // ... build insight groups from posts
    return [ ... ];
  }
}
```

Nest injects `ListAdminPostsService` from the imported `ContentModule`. So “cross-feature” reuse is just **import module → inject exported service**. In Express you’d either pass the service in or use some shared registry; Nest wraps that in the module system.

---

## 8. Ports, Adapters, and Testability

### Why Ports and Adapters (Hexagonal)

Application services should not depend on Prisma or Express. So we define **ports** (interfaces) in the feature and **adapters** (implementations) that talk to the DB. The module binds the port to the adapter; in tests we can bind the port to an in-memory fake.

### Port: Interface + Token

```ts
// src/modules/settings/ports/settings.repository.port.ts
export interface ISettingsRepository {
  get(): Promise<AdminSettingsEntity | null>;
  getOrCreate(defaults: AdminSettingsEntity): Promise<AdminSettingsEntity>;
  update(data: AdminSettingsUpdate): Promise<AdminSettingsEntity>;
}
export const SETTINGS_REPOSITORY = Symbol('SETTINGS_REPOSITORY');
```

### Adapter: Implements Port, Uses Prisma

```ts
// src/modules/settings/adapters/prisma-settings.repository.ts
@Injectable()
export class PrismaSettingsRepository implements ISettingsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async get(): Promise<AdminSettingsEntity | null> {
    const row = await this.prisma.adminSettings.findFirst();
    return row ? this.toEntity(row) : null;
  }
  // ...
  private toEntity(row): AdminSettingsEntity { ... }
}
```

Application code (e.g. `GetSettingsService`) only sees `ISettingsRepository` and the token. Nest’s **efficiency** here is that the same **provider** mechanism that wires services also wires “interface → implementation” via `{ provide: SETTINGS_REPOSITORY, useClass: PrismaSettingsRepository }`, so you get testability and clear boundaries without building your own DI or factory layer.

---

## 9. Lifecycle Hooks

Nest calls lifecycle methods so you can hook into “app started” and “app shutting down” without manual coordination. In this project, **PrismaService** uses them to connect and disconnect:

```ts
// src/common/prisma/prisma.service.ts
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const connectionString = process.env.DATABASE_URL ?? 'postgresql://localhost:5432/blog';
    const adapter = new PrismaPg({ connectionString });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

When the app boots, Nest initializes modules and their providers; when it does, it calls `onModuleInit()` so Prisma connects. When the app shuts down, it calls `onModuleDestroy()` so the DB connection is closed cleanly. In Express you’d typically do this in a custom bootstrap and in `process.on('SIGTERM', ...)`; Nest wraps that in a standard lifecycle so every injectable can participate.

---

## 10. This Project End-to-End

### Request Flow (Example: GET /api/admin/settings)

1. **Express** receives the request (Nest’s default adapter).
2. **Nest** matches the route to `SettingsController.get()`.
3. No body/params need validation for this route; **ValidationPipe** has nothing to do.
4. Nest invokes `get()` on the singleton `SettingsController`, which was constructed with `GetSettingsService` and `UpdateSettingsService` injected.
5. `get()` calls `this.getSettings.execute()`.
6. `GetSettingsService.execute()` uses the injected `ISettingsRepository` (bound to `PrismaSettingsRepository`) and calls `getOrCreate(...)`.
7. `PrismaSettingsRepository` uses `PrismaService` to talk to PostgreSQL and returns an entity.
8. `GetSettingsService` maps the entity to `AdminSettingsView` and returns it.
9. The controller returns that value; Nest serializes it to JSON and sends it via Express.

So: **HTTP → Controller → Application Service → Port (Repository) → Adapter (Prisma) → DB**. Every step is testable and replaceable; Nest’s job is to wire and run this pipeline.

### Where Different Concerns Live

| Concern | Where it lives in this project |
|--------|--------------------------------|
| Route definition | Controller class + method decorators |
| Request validation | DTOs + global ValidationPipe |
| API docs | Same DTOs + `@ApiTags`, `@ApiOperation`, `@ApiResponse` |
| Use-case logic | `application/*.service.ts` |
| Repository interface | `ports/*.port.ts` |
| DB access | `adapters/prisma-*.repository.ts` |
| Module wiring | `*.module.ts` |
| App bootstrap | `main.ts` |

---

## 11. Summary: Where Nest Hides Express Complexity

| Express complexity | How Nest wraps it in this project |
|--------------------|------------------------------------|
| Registering routes | `@Controller` + `@Get` / `@Post` / `@Put`; Nest registers them with Express |
| Parsing body/params/query | Parameter decorators `@Body()`, `@Param()`, `@Query()`; ValidationPipe + DTOs |
| Validation | One global ValidationPipe + class-validator on DTOs; no per-route middleware |
| OpenAPI/Swagger | Same DTOs with `@ApiProperty`; DocumentBuilder + SwaggerModule in `main.ts` |
| Creating and passing services/repos | IoC container; constructor injection; modules declare `providers` and `exports` |
| Interface → implementation | Token (Symbol) + `{ provide: TOKEN, useClass: Impl }` in module |
| Global infra (e.g. DB client) | `@Global()` module (PrismaModule) so any module can inject PrismaService |
| Startup/shutdown (e.g. DB connect/disconnect) | `OnModuleInit` / `OnModuleDestroy` on PrismaService |
| Consistent error responses | Throw `NotFoundException`, `BadRequestException`; Nest turns them into HTTP status + body |

So Nest is **efficient over Express** by wrapping these repeated concerns behind **conventions and decorators**: you get a clear structure (modules, controllers, services, ports/adapters), less glue code, and a single place to plug in validation, docs, and DI. Express remains the HTTP engine; Nest is the structure and the pipeline on top of it.

For more on this project’s layout and how to add features, see [ARCHITECTURE.md](./ARCHITECTURE.md).
