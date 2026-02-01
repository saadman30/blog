# Frontend Testing Feasibility Report

**Project:** Blog frontend  
**Stack:** Next.js 16, React, TypeScript, SCSS modules, Zustand, Storybook, Vitest, Playwright  
**Report date:** February 2026

---

## 1. Executive Summary

The frontend is well set up for testing: Vitest and Playwright are already configured, Storybook covers components with a11y and docs, and five atom-level unit tests exist. The most feasible and high-value approach is to **expand unit and integration tests** (Vitest + React Testing Library) and **add a small set of E2E tests** (Playwright). Storybook can double as a visual and interaction test bed. This report analyzes the codebase and recommends concrete testing strategies by layer and priority.

---

## 2. Project Overview

### 2.1 Structure

| Layer        | Location              | Count | Notes                                      |
|-------------|------------------------|-------|--------------------------------------------|
| **Atoms**   | `src/components/atoms/` | 12  | Box, Button, Card, Flex, Heading, Image, Input, Link, Section, Spacing, Tag, Text, ArticleJsonLd |
| **Molecules** | `src/components/molecules/` | 2 | SearchBar, TagsList                        |
| **Organisms** | `src/components/organisms/` | 5 | ContentCard, ContentCardList, PostCard, ExperienceTimeline, ScrollProgressBar |
| **Templates** | `src/components/templates/` | 4 | AboutTemplate, BlogPost, PageLayout        |
| **Layout**  | `src/components/layout/`  | 1 | RootLayoutShell                            |
| **Pages**   | `src/app/`               | 4 | Home, About, Blog list, Blog post `[slug]` |
| **Lib**     | `src/lib/`               | API client, `readingTime`, types, mockData  |
| **Store**   | `src/store/`             | 3 | blogFiltersStore, bookmarksStore, themeStore |

### 2.2 Current Test Setup

- **Vitest** – `vitest.config.ts`, `vitest.setup.ts`, jsdom, path aliases (`@components`, `@styles`, `@store`, `@lib`), SCSS mock.
- **Playwright** – `playwright.config.ts` points to `./e2e`, Chromium + WebKit, dev server on port 3000. **The `e2e/` directory does not exist yet.**
- **Storybook** – Stories for (almost) all components; addons: Vitest, a11y, docs, Chromatic.

### 2.3 Existing Unit Tests (5 files)

| Component | File                | Coverage focus                    |
|-----------|---------------------|-----------------------------------|
| Box       | `Box.test.tsx`      | Render, layout props              |
| Button    | `Button.test.tsx`   | Render, variant                   |
| Image     | `Image.test.tsx`    | Render, fill, aspectRatio, radius, placeholder |
| Link      | `Link.test.tsx`     | href, external, variant          |
| Text      | `Text.test.tsx`     | Children, `as`, color, size, weight, italic |

Pattern: `render` + `screen` + `expect` with Testing Library; no store or router in these tests.

---

## 3. Testing Layers: Feasibility and Recommendation

### 3.1 Unit Tests (Vitest + React Testing Library)

**Feasibility: High**

- **Already in use** for atoms; setup (aliases, SCSS mock, jsdom) is correct.
- **Pure components** (atoms without Next/router/store): add tests the same way as Box/Button/Text. Low effort, high confidence.
- **Store-dependent components** (e.g. SearchBar, PostCard, BlogPageContent): feasible by either:
  - Wrapping in a test harness that provides the real Zustand store (reset between tests), or
  - Mocking the store hook and asserting on rendered output and callbacks.
- **Pure logic** (e.g. `lib/readingTime.ts`): trivial to test; no DOM.

**Recommendation**

- **High priority:** Add unit tests for:
  - Remaining atoms without tests: Card, Flex, Heading, Input (TextInput), Section, Spacing, Tag, ArticleJsonLd (structure/SEO props).
  - `lib/readingTime.ts` (and any other pure helpers in `lib/`).
- **Medium priority:** Molecules and organisms that use stores (SearchBar, TagsList, PostCard, ContentCard, BlogPageContent) with store reset or mock.

**Effort:** Low–medium. Reuse existing patterns; add a small test utility to reset Zustand stores between tests if needed.

---

### 3.2 Integration Tests (Vitest + RTL, possibly MSW)

**Feasibility: High**

- **BlogPageContent:** Receives `posts` as props; filtering depends on `useBlogFiltersStore()` (query, tag). You can render it with mock `posts` and drive SearchBar + tag clicks, then assert filtered list and “No posts match” state. No real API required.
- **PostCard:** Uses `useBookmarksStore()` and `readingTime`. Test with a mock post; assert title, date, reading time, tag clicks, bookmark button toggles (and store state if you expose it or use a test store).
- **API client** (`lib/api/client.ts`): Test with mocked `fetch`. Verify URL building (`getBaseUrl`, `buildUrl`) and `listPosts` / `getPostBySlug` response handling and error fallback.

**Recommendation**

- Add integration-style tests for:
  - **BlogPageContent:** Filter by query, filter by tag, clear, empty state.
  - **PostCard:** Render with post, tag click callback, bookmark toggle (and optionally store).
  - **api client:** Mock `global.fetch`; assert requests and parsed results.

**Effort:** Medium. One-time setup for store reset and/or fetch mock; then straightforward.

---

### 3.3 E2E Tests (Playwright)

**Feasibility: High**

- Playwright is already configured; only the `e2e/` folder and test files are missing.
- App is classic CRUD/content: home → blog list → post; about; search and tag filter. Ideal for a few E2E flows.

**Recommendation**

- Create `e2e/` and add a small set of tests, for example:
  - **Smoke:** Load home page; load `/about`; load `/blog`.
  - **Blog list:** `/blog` shows posts (or “no posts”); search and tag filter update the list (and count).
  - **Blog post:** Navigate to a post from `/blog`, then check title and content (and optionally metadata/SEO).
  - **Accessibility:** One or two key pages with `expect(page).toHaveNoViolations()` if you add `@axe-core/playwright` (optional).

**Effort:** Medium. Requires running app (and optionally API); start with 3–5 tests and expand as needed.

---

### 3.4 Storybook-Based Testing

**Feasibility: High (already in place)**

- Stories exist for almost all components; addon-vitest and addon-a11y are installed.
- **Interaction tests:** You can add play functions or use addon-vitest to run tests inside Storybook (good for molecules/organisms with interactions).
- **Visual regression:** Chromatic is configured; you can run snapshot builds on CI.
- **Accessibility:** a11y addon gives in-story a11y checks; can be automated in CI.

**Recommendation**

- Use Storybook as the primary place for “component in isolation” interaction and a11y checks.
- Add play functions or Vitest tests in stories for SearchBar, TagsList, PostCard, ContentCard, filters, etc.
- Optionally run Chromatic (or a similar tool) for visual regression on critical stories.

**Effort:** Low–medium. Build on existing stories; add play functions or story-level tests where they add value.

---

### 3.5 Next.js–Specific Surfaces

| Surface              | Example                     | Feasibility | Suggested approach                          |
|----------------------|-----------------------------|------------|---------------------------------------------|
| Server components    | `app/(marketing)/blog/[slug]/page.tsx` | Medium   | E2E with mocked API, or integration test with mocked `api` module |
| `generateMetadata`   | Same page                   | Medium     | Unit test with mock `params` and mocked `api.getPostBySlug` |
| Client page content  | `BlogPageContent`           | High       | Integration test with mock `posts` and store |
| API route handlers   | None in frontend repo       | N/A        | —                                           |

- **Server components:** Prefer E2E or integration tests that mock the API rather than trying to run Next server in Vitest.
- **generateMetadata:** Extract or invoke with test doubles and assert returned metadata object.

---

## 4. What Kind of Testing Is Most Feasible?

Summary by type:

| Type              | Feasibility | Current state     | Best for                                              |
|-------------------|------------|-------------------|--------------------------------------------------------|
| **Unit (Vitest)** | High       | 5 atom tests      | All atoms, pure lib, simple molecules                  |
| **Integration**   | High       | None              | BlogPageContent, PostCard, SearchBar, API client       |
| **E2E (Playwright)** | High    | Config only       | Critical user journeys (home, blog list, post, about)   |
| **Storybook**     | High       | Stories + addons  | Interaction, a11y, visual regression                   |

**Most feasible and impactful next steps:**

1. **Unit tests** – Easiest. Extend to all atoms and to `lib/readingTime.ts` (and similar). Use existing Vitest + RTL + SCSS mock setup.
2. **Integration tests** – High value. Add tests for BlogPageContent (filtering), PostCard (bookmark, tags), and API client (mocked fetch). One store-reset or mock pattern will unlock many components.
3. **E2E tests** – High value. Add `e2e/` and 3–5 Playwright tests for main routes and blog flow. Ensures the app works end-to-end with real (or stubbed) API.
4. **Storybook** – Use for interaction and a11y; add play functions or story-level Vitest where it pays off; optional Chromatic for visual regression.

---

## 5. Suggested Test Priorities

### Phase 1 – Quick wins (1–2 days)

- Add unit tests for: Card, Flex, Heading, Section, Spacing, Tag, TextInput (and ArticleJsonLd if you care about SEO structure).
- Add unit tests for `lib/readingTime.ts`.
- Create `e2e/` and add: home loads, `/about` loads, `/blog` loads.

### Phase 2 – Integration and E2E (2–4 days)

- Test `lib/api/client.ts` with mocked `fetch`.
- Integration tests for BlogPageContent (search + tag filter + empty state).
- Integration tests for PostCard (render, tag click, bookmark).
- E2E: navigate from blog list to a post; optionally search/filter on blog list.

### Phase 3 – Deepen coverage and quality (ongoing)

- More organisms/templates as needed (ContentCardList, AboutTemplate, etc.).
- Storybook play functions or Vitest-in-Storybook for interactive components.
- Optional: `generateMetadata` tests, Chromatic or similar for visual regression, axe in Playwright for a11y.

---

## 6. Technical Notes

### Store testing

- Zustand stores can be reset in `beforeEach` by calling the store’s `clear` or equivalent, or by re-creating the store in tests. Alternatively, mock the hook (e.g. `jest.mock('@/store/blogFiltersStore')`) and control query/tag in tests.

### Next.js and Vitest

- Client components can be tested with Vitest + RTL as-is. For components that use `useRouter` or `usePathname`, use Next’s `next/jest` or a small mock (e.g. `next/navigation` → mock `useRouter`/`usePathname`). Current app has minimal router usage in components, so impact is low.

### API and E2E

- E2E can run against `pnpm dev` with a real or stubbed API (e.g. json-server with `mock/db.json`). For CI, either start API in the same job or point Playwright at a deployed/staging API and keep E2E to a few stable flows.

### Coverage

- Vitest is already set up with v8 and `reporter: ['text', 'html']`. Run `pnpm test -- --coverage` and use the report to find untested branches (e.g. in API client error handling).

---

## 7. Conclusion

The frontend is in a good position for comprehensive testing: tooling (Vitest, Playwright, Storybook) is in place, and a clear pattern exists for unit tests. The most feasible path is to **expand unit tests** across atoms and lib, **add integration tests** for store-driven and API-related code, and **introduce a small E2E suite** in `e2e/` for critical flows. Storybook can carry interaction and a11y testing. Prioritizing Phase 1 and Phase 2 will give the best balance of effort and confidence.
