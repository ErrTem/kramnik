# Phase 01: Monorepo Foundation - Pattern Map

**Mapped:** 2026-05-18  
**Files analyzed:** 32 new/modified paths  
**Analogs found:** 14 / 32

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `package.json` (root) | config | batch | `package.json` (root, pre-migration) | partial |
| `pnpm-workspace.yaml` | config | — | — | none |
| `pnpm-lock.yaml` | config | — | `package-lock.json` | role-match (lockfile only) |
| `turbo.json` | config | batch | — | none |
| `tsconfig.base.json` | config | transform | `tsconfig.app.json` | partial |
| `eslint.config.js` (root shared) | config | — | `eslint.config.js` | exact (extend/split) |
| `.prettierrc` | config | — | — | none |
| `docker-compose.yml` | config | — | — | none |
| `.gitignore` | config | — | `.gitignore` | partial |
| `README.md` (dev section) | config/docs | — | `README.md` | partial (GSD blocks stay) |
| `apps/web/package.json` | config | — | `package.json` | partial |
| `apps/web/vite.config.ts` | config | request-response | `vite.config.ts` | exact |
| `apps/web/index.html` | config | — | `index.html` | exact |
| `apps/web/tsconfig.json` | config | — | `tsconfig.json` | exact |
| `apps/web/tsconfig.app.json` | config | — | `tsconfig.app.json` | exact |
| `apps/web/tsconfig.node.json` | config | — | `tsconfig.node.json` | exact |
| `apps/web/eslint.config.js` | config | — | `eslint.config.js` | exact (per-app override) |
| `apps/web/src/main.tsx` | hook | — | `src/main.tsx` | exact |
| `apps/web/src/index.css` | utility | — | `src/index.css` | partial (strip demo layout) |
| `apps/web/src/app/AppShell.tsx` | component | — | `src/App.tsx` | anti-pattern (replace demo) |
| `apps/web/src/shared/` | utility | — | — | none (empty placeholder) |
| `apps/web/public/` | utility | file-I/O | `public/` | exact |
| `apps/api/package.json` | config | — | — | none |
| `apps/api/src/main.ts` | hook | request-response | — | none |
| `apps/api/src/app.module.ts` | provider | — | — | none |
| `apps/api/src/app.controller.ts` | controller | request-response | — | none |
| `apps/api/.env.example` | config | — | — | none |
| `packages/types/package.json` | config | — | root `package.json` `build` script | partial |
| `packages/types/src/index.ts` | utility | transform | — | none |
| `packages/types/tsconfig.json` | config | transform | `tsconfig.app.json` | partial (emit `dist/`) |
| Delete `package-lock.json` | — | — | `package-lock.json` | exact (remove) |
| Delete root `src/`, `vite.config.ts`, etc. | — | — | same paths at root | exact (move then delete) |

## Pattern Assignments

### `package.json` (root) (config, batch)

**Analog:** `package.json` (brownfield root — orchestration scripts only; dependencies move to workspaces)

**Scripts pattern** — migrate dev orchestration to Turbo; pin manager (RESEARCH Pattern 1):

```json
{
  "name": "kramnik-shop",
  "private": true,
  "packageManager": "pnpm@9.15.9",
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "format": "prettier --write \"**/*.{ts,tsx,js,json,md,css}\"",
    "db:up": "docker compose up -d",
    "db:down": "docker compose down"
  }
}
```

**Brownfield scripts to retire** (lines 6-11 of root `package.json`):

```6:11:package.json
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
```

Move `dev`/`build`/`lint`/`preview` into `apps/web/package.json`; root only delegates to `turbo`.

---

### `pnpm-workspace.yaml` (config)

**Analog:** None in repo.

**Use RESEARCH.md Pattern 1** — copy verbatim from `01-RESEARCH.md` § Pattern 1 (`packages: ['apps/*', 'packages/*']`).

---

### `turbo.json` (config, batch)

**Analog:** None in repo.

**Use RESEARCH.md Pattern 2** — `dev.dependsOn: ["@kramnik/types#build"]`, `build.outputs: ["dist/**"]`, `dev.persistent: true`, `dev.cache: false`. Do not add `^dev` (PITFALLS §5 / Turbo persistent-task rule).

---

### `tsconfig.base.json` (config, transform)

**Analog:** `tsconfig.app.json` (compiler defaults)

**Core compiler options to hoist** (lines 2-22):

```2:22:tsconfig.app.json
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "es2023",
    "lib": ["ES2023", "DOM"],
    "module": "esnext",
    "types": ["vite/client"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true
  },
```

**App extension pattern** — `apps/web/tsconfig.app.json` keeps `noEmit: true`, `types: ["vite/client"]`, `include: ["src"]`. **Package extension** — `packages/types/tsconfig.json` overrides `noEmit: false`, adds `composite`, `declaration`, `outDir: "dist"`, `rootDir: "src"` per RESEARCH Pattern 5.

---

### `eslint.config.js` (root shared) (config)

**Analog:** `eslint.config.js` (exact — split into shared base + per-app)

**Imports + flat config structure** (lines 1-22):

```1:22:eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
])
```

**Planner action:** Root file becomes shared ignores + TS recommended only; move React/browser block to `apps/web/eslint.config.js` with `import.meta.dirname` and `parserOptions.project` pointing at app tsconfigs (PITFALLS §5 / RESEARCH Pitfall 5). Add `globals.node` block for `apps/api`.

---

### `apps/web/vite.config.ts` (config, request-response)

**Analog:** `vite.config.ts` (exact — relocate unchanged)

```1:8:vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

Default port 5173 — no `server` block needed (Vite default). Config must live beside `apps/web/index.html`.

---

### `apps/web/index.html` (config)

**Analog:** `index.html` (exact — update title per D-19)

**Entry script pattern** (lines 9-11):

```9:11:index.html
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
```

**Title change** (line 7): change `"kramnik"` to `"Kramnik Shop"`.

---

### `apps/web/src/main.tsx` (hook)

**Analog:** `src/main.tsx` (exact)

```1:10:src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

**Planner action:** Import `AppShell` from `./app/AppShell.tsx` (or `./app/index.ts` barrel) instead of `./App.tsx`; drop `App.css` import.

---

### `apps/web/src/app/AppShell.tsx` (component)

**Analog:** `src/App.tsx` — **anti-pattern to remove**, not to copy

**Demo UI to delete** (lines 1-5, 10-31 — counter/hero pattern):

```1:5:src/App.tsx
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
```

```10:31:src/App.tsx
  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>
```

Replace with RESEARCH minimal shell (functional component, no state, no asset imports):

```tsx
export function AppShell() {
  return (
    <main>
      <h1>Kramnik Shop</h1>
    </main>
  );
}
```

Simplify `src/index.css`: keep `@import "tailwindcss";` and base `body { margin: 0; }`; remove demo-specific `#root` width/center layout and marketing sections (lines 55-117 of `src/index.css`).

---

### `apps/web/package.json` (config)

**Analog:** root `package.json` (dependencies + scripts)

**Dependencies to move wholesale** (lines 12-30):

```12:30:package.json
  "dependencies": {
    "@tailwindcss/vite": "^4.3.0",
    "react": "^19.2.6",
    "react-dom": "^19.2.6",
    "tailwindcss": "^4.3.0"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@types/node": "^24.12.3",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "eslint": "^10.3.0",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.6.0",
    "typescript": "~6.0.2",
    "typescript-eslint": "^8.59.2",
    "vite": "^8.0.12"
  }
```

**Scripts** — keep brownfield build chain:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

Set `"name": "@kramnik/web"` (RESEARCH assumption A1).

---

### `packages/types/package.json` + `src/index.ts` + `tsconfig.json` (utility/config, transform)

**Analog (partial):** root `package.json` `build` script uses `tsc -b`; types package uses single-project `tsc -p`.

**Stub export** — RESEARCH Pattern 5: `export {};` in `src/index.ts`.

**tsconfig** — extend `../../tsconfig.base.json`; override emit settings (composite, declaration, outDir `dist`) — opposite of app `noEmit: true` in `tsconfig.app.json`.

No import from `@kramnik/types` in Phase 1 apps yet (D-07 is Turbo ordering only).

---

### `apps/api/src/main.ts` (hook, request-response)

**Analog:** None in repo.

**Use RESEARCH Pattern 4** — `NestFactory.create`, `enableCors({ origin: 'http://localhost:5173' })`, `listen(process.env.PORT ?? 3000)`.

---

### `apps/api/src/app.controller.ts` (controller, request-response)

**Analog:** None in repo.

**Use RESEARCH Pattern 4** — `@Controller()`, `@Get()`, `@Get('health')`, static JSON responses (no services/Prisma in Phase 1).

---

### `apps/api/.env.example` (config)

**Analog:** None in repo.

**Use RESEARCH Pattern 6:**

```env
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/shop_dev
```

Add `apps/api/.env` to `.gitignore` (not covered by `*.local` alone).

---

### `docker-compose.yml` (config)

**Analog:** None in repo.

**Use RESEARCH Pattern 6** — `postgres:16`, user/password/db `postgres`/`postgres`/`shop_dev`, port `5432:5432`, named volume `postgres_data`.

---

### `.gitignore` (config)

**Analog:** `.gitignore`

**Existing ignores to keep** (lines 10-12):

```10:12:.gitignore
node_modules
dist
dist-ssr
```

**Add for Phase 1:**

```
apps/api/.env
```

---

### `README.md` (dev documentation)

**Analog:** `README.md` (partial — preserve GSD comment blocks; replace Vite template prose)

**Preserve** GSD-managed sections (`<!-- GSD:project-start -->` through `<!-- GSD:workflow-end -->`, lines 1-105).

**Replace** template ESLint expansion (lines 1-73 of current README) with dev flow:

1. `corepack enable` + `corepack prepare pnpm@9.15.9 --activate`
2. `pnpm install`
3. `pnpm db:up` (optional until Phase 2; required for FOUND-03)
4. `pnpm dev` → Turbo runs `@kramnik/types#build` then web:5173 + api:3000

Map `turbo dev` ≈ parallel `ng serve` for Angular background (CONTEXT specifics).

---

## Shared Patterns

### Vite + React + Tailwind bootstrap

**Source:** `vite.config.ts`, `src/main.tsx`, `src/index.css`  
**Apply to:** `apps/web`

Keep plugin trio (React + Tailwind v4 via `@tailwindcss/vite`). Entry: `StrictMode` + `createRoot` + global CSS import.

### TypeScript strictness

**Source:** `tsconfig.app.json`, `tsconfig.node.json`  
**Apply to:** `tsconfig.base.json`, all workspace `tsconfig.json` files

Hoist `target`, `moduleResolution: "bundler"`, `verbatimModuleSyntax`, lint flags (`noUnusedLocals`, etc.). Apps use project references pattern from root `tsconfig.json`:

```1:7:tsconfig.json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

Replicate under `apps/web/tsconfig.json` with paths adjusted.

### ESLint flat config (TypeScript + React)

**Source:** `eslint.config.js`  
**Apply to:** root shared config + `apps/web/eslint.config.js`

Use `defineConfig`, `globalIgnores(['dist', '**/node_modules'])`, `typescript-eslint` recommended, React hooks + refresh for web only.

### Brownfield move discipline

**Source:** `.planning/research/PITFALLS.md` §5  
**Apply to:** entire Phase 1 file move

Move together: `index.html`, `vite.config.ts`, `src/`, `public/`. Verify `pnpm --filter @kramnik/web dev` before deleting root copies. Never leave duplicate root `src/` or `vite.config.ts`.

### Lockfile migration

**Source:** `package-lock.json` (delete)  
**Apply to:** root

Remove npm lockfile; generate `pnpm-lock.yaml` only after `packageManager` + `pnpm-workspace.yaml` exist. Never run `npm install` at root post-migration (D-01/D-02).

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `pnpm-workspace.yaml` | config | — | Greenfield monorepo; no workspaces yet |
| `turbo.json` | config | batch | No Turborepo in brownfield |
| `.prettierrc` | config | — | No Prettier config in repo |
| `docker-compose.yml` | config | — | No Docker files |
| `apps/api/**` (Nest bootstrap) | controller/hook/module | request-response | No backend code; use RESEARCH Pattern 4 + Nest CLI scaffold |
| `apps/web/src/shared/**` | utility | — | Intentional empty placeholders (ARCHITECTURE.md future layout) |
| `packages/types/src/index.ts` | utility | transform | No shared package yet; RESEARCH stub only |

**Planner fallback:** For all rows above, use concrete snippets in `01-RESEARCH.md` § Patterns 1–6 (already cited in phase research).

## Metadata

**Analog search scope:** repo root (`package.json`, `vite.config.ts`, `eslint.config.js`, `tsconfig*.json`, `src/**`, `index.html`, `public/`, `.gitignore`, `README.md`); `.planning/research/` for target layout only (not code analogs)  
**Files scanned:** 30 tracked paths at repo root + planning docs  
**Pattern extraction date:** 2026-05-18  
**Project rules:** `.cursor/rules` — fixed stack, Turborepo, GSD workflow, minimal Phase 1 deps
