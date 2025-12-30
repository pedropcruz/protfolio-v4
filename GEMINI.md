# Project Context: Pedro Cruz Portfolio V4

## Overview
This is a personal portfolio website built with **Nuxt 4** and **Nuxt UI**. It is a modern, statically generated or server-side rendered application designed to showcase a developer's work. The project uses **Bun** as the package manager and runtime.

## Technology Stack
- **Framework**: [Nuxt 4](https://nuxt.com) (Vue 3)
- **UI Library**: [Nuxt UI](https://ui.nuxt.com) (Tailwind CSS)
- **Package Manager**: [Bun](https://bun.sh)
- **Language**: TypeScript
- **Content**: Nuxt Content
- **Internationalization**: Nuxt i18n
- **Linting**: ESLint with Nuxt preset

## Directory Structure
The project follows the [Nuxt 4 `app/` directory structure](https://nuxt.com/docs/guide/directory-structure/app):

- **`app/`**: Contains the main source code.
  - **`app.vue`**: The root component acting as the main layout wrapper. Uses `UApp`, `UHeader`, `UMain`, `UFooter`.
  - **`app.config.ts`**: App-level configuration (e.g., UI colors).
  - **`pages/`**: Application routes (e.g., `index.vue`).
  - **`components/`**: Vue components (e.g., `AppLogo.vue`, `LanguageSwitch.vue`).
  - **`assets/`**: Static assets like CSS (`main.css`).
  - **`i18n/`**: Localization files.
- **`public/`**: Publicly accessible static files (favicon, images).
- **`nuxt.config.ts`**: Main Nuxt configuration file defining modules, compatibility date, and build settings.

## Development Workflow

### specific commands
All commands should be run using `bun`.

| Command | Description |
| :--- | :--- |
| `bun dev` | Start the development server (usually at `http://localhost:3000`). |
| `bun run build` | Build the application for production. |
| `bun run preview` | Preview the production build locally. |
| `bun run lint` | Run ESLint to check code quality. |
| `bun run typecheck` | Run TypeScript type checking. |

### Configuration
- **Nuxt Config**: `nuxt.config.ts` handles module registration (`@nuxt/ui`, `@nuxt/content`, etc.) and core settings.
- **UI Config**: `app/app.config.ts` allows customization of Nuxt UI tokens (colors, etc.).
- **ESLint**: `eslint.config.mjs` extends the base Nuxt ESLint config.

## Development Conventions
- **Component Usage**: Leverage Nuxt UI components (prefixed with `U`, e.g., `UButton`, `UHeader`) for consistent styling.
- **Type Safety**: The project is TypeScript-based. Ensure strict typing where possible.
- **File Organization**: Keep source code within the `app/` directory.
- **Routing**: File-based routing is used via the `app/pages/` directory.
