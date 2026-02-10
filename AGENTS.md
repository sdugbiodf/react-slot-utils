# AGENTS.md

Agent guide for `react-slot-utils`.
This is a TypeScript + React utility library for slot composition and prop merging.

## Instruction files (Cursor/Copilot)

Checked paths:
- `.cursorrules`: not found
- `.cursor/rules/`: not found
- `.github/copilot-instructions.md`: not found

If these files are added later, they override this guide.

## Project snapshot

- Runtime/package manager: Bun (`bun.lock` exists)
- Module mode: ESM (`"type": "module"`)
- Language: TypeScript + TSX
- Lint/format: Biome (`biome.json`)
- Build tool: tsdown (`tsdown.config.ts`)
- TS config: `tsconfig.json` (strict)
- Public entry: `src/index.ts`
- Output: `dist/`

## Setup and baseline commands

- Install deps: `bun install`
- Typecheck: `bun run typecheck`
- Lint/format check: `bun run check`
- Lint/format with autofix: `bun run check:write`
- Full build: `bun run build`

## Build/lint/test command reference

From `package.json` scripts:
- `bun run typecheck` -> `tsc --noEmit`
- `bun run check` -> `biome check`
- `bun run check:write` -> `biome check --write`
- `bun run build` -> `bun run typecheck && bun run check:write && tsdown`
- `bun run prepublishOnly` -> `bun run build`

Behavior notes:
- `bun run build` is mutating because it runs `check:write`.
- During iteration, use `bun run check` when you want non-mutating validation.

## Single-file and single-test commands

Current repo state:
- No test files found.
- No `test` script in `package.json`.

When tests are introduced with Bun:
- Run all tests: `bun test`
- Run one test file: `bun test ./path/to/file.test.ts`
- Run by path substring: `bun test utils`
- Run one case: use `test.only(...)` or `describe.only(...)`

Single-file commands available today:
- `biome check src/path/to/file.ts`
- `biome check --write src/path/to/file.ts`
- `biome lint --write src/path/to/file.ts`
- `biome format --write src/path/to/file.ts`

## Repository structure and exports

- Keep public API wired through `src/index.ts`.
- Prefer named exports.
- Current barrel exports:
  - `./slot`
  - `./slot/utils`
  - `./utils/classname`
  - `./utils/common`
  - `./utils/prop`

## Formatting and imports

From `biome.json`:
- Formatter enabled
- Indent style: spaces (2-space indentation used in source)
- JS/TS quote style: single quotes
- JSX quote style: single quotes
- Linter enabled with recommended rules
- `correctness.noUnusedImports` is `error`
- Organize imports action is on

Agent rules:
- Remove unused imports immediately.
- Let Biome manage import organization/order.
- Do not hand-format against Biome output.

## TypeScript conventions

From `tsconfig.json`:
- `strict: true`
- `noUncheckedIndexedAccess: true`
- `moduleResolution: bundler`
- `verbatimModuleSyntax: true`
- `jsx: react-jsx`

Type safety rules:
- Use `import type` for type-only imports.
- Keep runtime imports separate when practical.
- Prefer `unknown` + type guards over broad casts.
- Avoid `as any`, `@ts-ignore`, and `@ts-expect-error`.
- Use explicit generics where helper typing is non-trivial.

## Naming conventions

Observed in `src/`:
- Components/interfaces: PascalCase (`Slot`, `Slottable`, `SlotProps`)
- Functions/utilities: camelCase (`flattenChildren`, `mergeProps`)
- Predicates/type guards: `is*` (`isRef`, `isStyleObject`, `isSlottable`)
- Higher-order helpers: `with*` (`withDefaultProps`, `withDisplayName`)
- Type aliases: descriptive PascalCase (`ClassNameDefaultize`)

## React and utility behavior

- Use function components; no class components are present.
- Handle `children` defensively:
  - flatten fragments before slot resolution
  - validate with `isValidElement`
  - return `null` for unsupported structures
- Keep prop-merge semantics stable:
  - compose handlers child-first, then slot handler unless default prevented
  - shallow-merge `style`
  - merge class names via `cn` (`classnames`)

## Error handling expectations

- Current source avoids explicit `try/catch` and `throw`.
- Prefer guard clauses and deterministic returns.
- Keep utilities side-effect-light (no noisy logging in shared helpers).
- Preserve existing null-safe behavior for invalid child shapes.

## Build configuration details

From `tsdown.config.ts`:
- `entry: 'src/index.ts'`
- `target: 'ES2024'`
- `format: 'esm'`
- `dts: true`
- `minify: true`
- Externalized deps: `react`, `classnames`

If API surface changes:
- Update exports in `src/index.ts`.
- Run `bun run build` to validate JS output and declarations.

## Agent completion checklist

Before handoff/PR:
1. Keep changes focused (no opportunistic refactors).
2. Run `bun run typecheck`.
3. Run `bun run check`.
4. Run `bun run build` for release-impacting changes.
5. Confirm no unused imports and no export-surface regressions.

## Test strategy note

- No test harness is currently configured in-repo.
- If adding tests, use Bun-native `*.test.ts` / `*.spec.ts`.
- Add a `test` script to `package.json` in the same PR when tests are introduced.
