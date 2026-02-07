# Backend Architecture

This document describes the architecture of the blog backend: a **NestJS** application using **modular design**, **ports & adapters (hexagonal)** for persistence, and **application services** for use cases. Examples are taken from the project.

---

## 1. High-Level Overview

- **Framework**: [NestJS](https://nestjs.com/) (Node.js)
- **API**: REST, with **Swagger** at `/api/docs` and **global validation** via `class-validator` / `class-transformer`.
- **Persistence**: [Prisma](https://www.prisma.io/) with PostgreSQL; data access is abstracted behind **ports** and implemented by **adapters** (e.g. `PrismaPostRepository`, `PrismaSettingsRepository`).
- **Structure**: Feature-based **modules**; each module can expose **controllers**, **application services**, **DTOs**, **ports**, and **adapters**.

**Design goals:**

- Clear separation between HTTP, application logic, and persistence.
- Testability: repositories are injectable via tokens, so adapters can be swapped (e.g. in-memory in tests).
- Reuse: application services are shared across controllers (e.g. public vs admin both use content services).

---

## 2. Directory Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Data model and migrations
│   └── migrations/
├── src/
│   ├── main.ts                # Bootstrap: CORS, ValidationPipe, Swagger
│   ├── app.module.ts          # Root module, imports feature modules
│   ├── common/                # Shared infrastructure
│   │   └── prisma/
│   │       ├── prisma.module.ts
│   │       └── prisma.service.ts
│   └── modules/
│       ├── content/           # Posts (CRUD, listing, editor data)
│       ├── public/            # Public read-only API (uses ContentModule)
│       ├── insights/          # Admin insights (uses ContentModule)
│       ├── settings/          # Admin/site settings
│       └── taxonomy/          # Tags (used by content)
└── test/
```

Each feature module typically follows:

```
modules/<feature>/
├── <feature>.module.ts        # Nest module: controllers, providers, exports
├── <feature>.controller.ts    # HTTP layer (or controllers/ subfolder)
├── dto/                       # Request/response DTOs (validation + Swagger)
├── application/               # Use-case services (inject ports, no HTTP)
├── ports/                     # Repository interfaces + injection token
└── adapters/                  # Implementations (e.g. Prisma)
```

---

## 3. Layers and Data Flow

### 3.1 Request Flow (top to bottom)

1. **HTTP** → Controller receives request, parses body/params with **DTOs**.
2. **Controller** → Calls one or more **application services** (use cases).
3. **Application service** → Uses **ports** (repository interfaces) to read/write data; contains business rules.
4. **Adapter** → Implements the port (e.g. `PrismaPostRepository`); talks to Prisma/DB.
5. **Response** → Controller returns DTOs or service result; Nest serializes and sends response.

### 3.2 Dependency Rule

- **Controllers** depend on **application services** and **DTOs**.
- **Application services** depend on **ports** (interfaces), not on concrete adapters or HTTP.
- **Adapters** depend on **PrismaService** (or other infra) and implement **ports**.
- **DTOs** are used at the boundary (controller in/out); application layer uses its own **views** or **entities** where useful.

---

## 4. Root and Global Setup

### 4.1 `main.ts`

- Creates Nest app from `AppModule`.
- **CORS**: allowed origins for frontend (e.g. `localhost:3000`, `3001`), `credentials: true`.
- **ValidationPipe**: `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true` so DTOs are validated and transformed.
- **Swagger**: DocumentBuilder + `SwaggerModule.setup('api/docs', app, document)` with tags `public` and `admin`.
- Listens on `PORT` (default 4000).

### 4.2 `app.module.ts`

Imports only feature and infrastructure modules; no controllers or business logic at root:

```ts
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

### 4.3 `PrismaModule` (global)

- **Global** module that provides and exports `PrismaService`.
- `PrismaService` extends `PrismaClient` and hooks `onModuleInit` / `onModuleDestroy` for `$connect` / `$disconnect`.
- Any module can inject `PrismaService` without importing `PrismaModule` again.

---

## 5. Feature Module Deep Dive: Settings

The **Settings** module is a full example of ports & adapters and application services.

### 5.1 Port (interface + token)

**File:** `modules/settings/ports/settings.repository.port.ts`

- **Entity** and **update** types define the domain-shaped data.
- **Interface** `ISettingsRepository`: `get()`, `getOrCreate(defaults)`, `update(data)`.
- **Token** `SETTINGS_REPOSITORY` (Symbol) used for dependency injection so the module can bind a concrete implementation.

```ts
export interface AdminSettingsEntity {
  id: number;
  seoTitleSuffix: string;
  seoDefaultDescription: string;
  // ...
  updatedAt: Date;
}

export interface ISettingsRepository {
  get(): Promise<AdminSettingsEntity | null>;
  getOrCreate(defaults: AdminSettingsEntity): Promise<AdminSettingsEntity>;
  update(data: AdminSettingsUpdate): Promise<AdminSettingsEntity>;
}

export const SETTINGS_REPOSITORY = Symbol('SETTINGS_REPOSITORY');
```

### 5.2 Adapter (Prisma implementation)

**File:** `modules/settings/adapters/prisma-settings.repository.ts`

- Implements `ISettingsRepository`.
- Injects `PrismaService`, uses `prisma.adminSettings.findFirst/create/update`.
- Maps Prisma rows to `AdminSettingsEntity` in a private `toEntity()` to keep domain shape in one place.

### 5.3 Application services

- **GetSettingsService**: Injects `SETTINGS_REPOSITORY`, calls `getOrCreate()` with defaults, maps entity to an **AdminSettingsView** (shape used by API).
- **UpdateSettingsService**: Injects repository, receives `AdminSettingsView`, calls `update()` with mapped fields, returns the same view (no re-read in this design).

### 5.4 DTOs

**File:** `modules/settings/dto/settings.dto.ts`

- **AdminSettingsBodyDto**: Request body (nested `SeoDefaultsDto`, `IntegrationsDto`) with `class-validator` decorators and `@ApiProperty` for Swagger.
- **AdminSettingsResponseDto**: Response shape for GET/PUT (same structure as view).

### 5.5 Controller

**File:** `modules/settings/settings.controller.ts`

- `@Controller('api/admin/settings')`, `@ApiTags('admin')`.
- **GET**: Calls `GetSettingsService.execute()`, returns `AdminSettingsResponseDto`.
- **PUT**: Validates body as `AdminSettingsBodyDto`, builds view from body, calls `UpdateSettingsService.execute(view)`, returns response DTO.

### 5.6 Module wiring

**File:** `modules/settings/settings.module.ts`

- Registers `SettingsController`.
- Providers: `{ provide: SETTINGS_REPOSITORY, useClass: PrismaSettingsRepository }`, `GetSettingsService`, `UpdateSettingsService`.
- No exports (settings are only used inside this module).

---

## 6. Feature Module Deep Dive: Content and Public

**Content** owns posts and exposes both admin and shared application services. **Public** and **Insights** consume Content’s services.

### 6.1 Content module

- **Port**: `post.repository.port.ts` — `PostEntity`, `PostCreateInput`, `PostUpdateInput`, `IPostRepository` (create, update, findById, findBySlug, listAll, listPublished, listAllWithAnalytics), `POST_REPOSITORY` token.
- **Adapter**: `prisma-post.repository.ts` — implements `IPostRepository`, maps Prisma `Post` (with tags, optional analytics) to `PostEntity`.
- **Application services**: e.g. `SaveDraftService`, `GetPostEditorDataService`, `ListAdminPostsService`, `ListPublishedPostsService`, `GetPublicPostBySlugService`. They depend on `POST_REPOSITORY` and contain rules (e.g. slug uniqueness, status handling).
- **Controller**: `AdminPostsController` under `api/admin/posts` (list, editor-data, save-draft).
- **Module**: Binds `POST_REPOSITORY` to `PrismaPostRepository`, declares all application services, **exports** `ListPublishedPostsService`, `GetPublicPostBySlugService`, `ListAdminPostsService` for other modules.

### 6.2 Public module (thin API layer)

**File:** `modules/public/public.module.ts`

```ts
@Module({
  imports: [ContentModule],
  controllers: [PublicController],
})
export class PublicModule {}
```

- No own persistence; **imports** `ContentModule` to use its exported services.
- **PublicController** (`api/public/posts`): injects `ListPublishedPostsService` and `GetPublicPostBySlugService`, exposes GET list and GET by-slug/:slug. Returns public-facing DTOs (e.g. `PostResponseDto`).

This shows **module composition**: public and admin are separate API surfaces, but both rely on the same content application layer.

### 6.3 Insights module (cross-feature use case)

**File:** `modules/insights/insights.module.ts`

```ts
@Module({
  imports: [ContentModule],
  controllers: [InsightsController],
  providers: [GetInsightsService],
})
export class InsightsModule {}
```

- **GetInsightsService**: Injects `ListAdminPostsService` (from ContentModule). Uses the list of posts with analytics to build insight groups (top posts, decaying, high-read low-share) and returns a structured list. No repository dependency in Insights; it reuses Content’s application service.

---

## 7. API Surface and Conventions

- **Public**: `api/public/*` — read-only, no auth in this slice (e.g. list posts, get post by slug).
- **Admin**: `api/admin/*` — writer console (posts, settings, insights). Auth can be added at guard level.
- **Tags**: Swagger `@ApiTags('public')` and `@ApiTags('admin')`; operations documented with `@ApiOperation` and `@ApiResponse`.
- **Validation**: All body/query/param inputs go through DTOs; invalid payloads are rejected by `ValidationPipe` before reaching services.

---

## 8. Data Layer (Prisma)

- **Schema**: `prisma/schema.prisma` — PostgreSQL; models include `Post`, `Tag`, `PostTag`, `PostAnalytics`, `AdminSettings`; enums (e.g. `PostStatus`).
- **Usage**: Only **adapters** (and tests that need DB) use Prisma. Application services never import `@prisma/client`; they depend on port interfaces and entity types defined in ports.
- **Migrations**: Managed by Prisma CLI; applied separately from app startup.

---

## 9. Summary Diagram (conceptual)

```
                    ┌─────────────────────────────────────────┐
                    │              main.ts                     │
                    │  (CORS, ValidationPipe, Swagger)       │
                    └────────────────────┬────────────────────┘
                                         │
                    ┌────────────────────▼────────────────────┐
                    │              AppModule                    │
                    │  PrismaModule (global), ContentModule,   │
                    │  PublicModule, InsightsModule,           │
                    │  SettingsModule, TaxonomyModule          │
                    └────────────────────┬────────────────────┘
                                         │
     ┌───────────────────────────────────┼───────────────────────────────────┐
     │                                   │                                   │
     ▼                                   ▼                                   ▼
┌─────────────┐                  ┌─────────────┐                    ┌─────────────┐
│   Public    │                  │   Content   │                    │  Settings   │
│   Module    │                  │   Module    │                    │   Module    │
│ imports     │                  │ ports +     │                    │ ports +     │
│ Content     │                  │ adapters +  │                    │ adapters +  │
│             │                  │ services   │                    │ services    │
└──────┬──────┘                  └──────┬──────┘                    └──────┬──────┘
       │                                │                                  │
       │                                │                                  │
       ▼                                ▼                                  ▼
  Controller                      Controller                          Controller
  (DTOs in/out)                   (DTOs in/out)                       (DTOs in/out)
       │                                │                                  │
       ▼                                ▼                                  ▼
  App services                    App services                        App services
  (from Content)                  (inject POST_REPOSITORY)             (inject SETTINGS_REPOSITORY)
       │                                │                                  │
       │                                ▼                                  ▼
       │                         IPostRepository                    ISettingsRepository
       │                                │                                  │
       │                                ▼                                  ▼
       │                         PrismaPostRepository               PrismaSettingsRepository
       │                                │                                  │
       │                                └──────────────┬───────────────────┘
       │                                               │
       │                                               ▼
       │                                        PrismaService
       │                                               │
       │                                               ▼
       │                                        PostgreSQL
       └───────────────────────────────────────────────┘
```

---

## 10. Adding a New Feature

1. **Domain / persistence**: Add or reuse Prisma models; define **entities** and **repository interface** in `modules/<feature>/ports/`.
2. **Adapter**: Implement the port in `adapters/prisma-<feature>.repository.ts` using `PrismaService`.
3. **Application services**: Add use-case classes in `application/` that depend on the port token and optional other services.
4. **DTOs**: Add request/response DTOs in `dto/` with validation and Swagger decorators.
5. **Controller**: Wire routes, inject application services, map DTOs to/from service views.
6. **Module**: Create `<feature>.module.ts` with controller, `{ provide: TOKEN, useClass: Adapter }`, and application services; export services if other modules need them.
7. **App**: Import the new module in `app.module.ts`.

This keeps the same layering (HTTP → application → port → adapter → DB) and makes the backend easy to extend and test.
