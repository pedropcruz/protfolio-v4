# PORTFOLIO_V4 [NEO-BRUTALIST_EDITION]

> A raw, high-contrast, interactive portfolio built with modern web technologies and a brutally honest design philosophy.

![Tech Stack](https://img.shields.io/badge/NUXT-4-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white)
![Tech Stack](https://img.shields.io/badge/TAILWIND-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Tech Stack](https://img.shields.io/badge/GSAP-ANIMATION-88CE02?style=for-the-badge&logo=greensock&logoColor=white)
![Tech Stack](https://img.shields.io/badge/POSTHOG-ANALYTICS-1d1d1d?style=for-the-badge&logo=posthog&logoColor=white)

---

## 🇬🇧 English

This project is an exploration of the **Neo-Brutalist** web design trend, combining raw UI elements, bold typography, and high-contrast visuals with a robust Nuxt 4 architecture.

### Key Features

*   **Neo-Brutalist Design System**: Hard shadows, monospaced fonts, marquee text, and raw borders.
*   **Site Audit Tool**: An interactive component that analyzes any given URL using the **Google PageSpeed Insights API** (with a custom fallback scraper for robustness). It provides "brutally honest" feedback on performance, SEO, and code quality.
*   **Real-time Statistics**: Fetches live analytics (visitors, page views, avg. session duration) directly from **PostHog** via server-side API routes, filtering out development traffic.
*   **Global Command Palette**: Accessible via `Cmd+K`, offering quick navigation and theme toggling.
*   **Internationalization (i18n)**: Full support for English and Portuguese.
*   **Performance First**: Server-Side Rendering (SSR) and optimized asset delivery.

### Tech Stack

*   **Framework**: Nuxt 4 (Vue 3)
*   **Styling**: TailwindCSS
*   **Animations**: GSAP (GreenSock)
*   **Content**: Nuxt Content (Markdown-based blog and projects)
*   **Analytics**: PostHog (Client-side tracking + Server-side data fetching)

---

## 🇵🇹 Português

Este projeto é uma exploração da tendência de web design **Neo-Brutalista**, combinando elementos de UI crus, tipografia arrojada e visuais de alto contraste com uma arquitetura Nuxt 4 robusta.

### Funcionalidades Principais

*   **Sistema de Design Neo-Brutalista**: Sombras duras, fontes monoespaçadas, texto em marquee e bordas cruas.
*   **Ferramenta "Site Audit"**: Um componente interativo que analisa qualquer URL usando a **API Google PageSpeed Insights** (com um scraper de fallback personalizado). Fornece feedback "brutalmente honesto" sobre performance, SEO e qualidade do código.
*   **Estatísticas em Tempo Real**: Obtém dados analíticos ao vivo (visitantes, visualizações, duração média da sessão) diretamente do **PostHog** via rotas de API do servidor, filtrando tráfego de desenvolvimento.
*   **Command Palette Global**: Acessível via `Cmd+K`, oferecendo navegação rápida.
*   **Internacionalização (i18n)**: Suporte completo para Inglês e Português.
*   **Performance First**: Server-Side Rendering (SSR) e entrega otimizada de assets.

---

## 🛠 Setup & Development

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# (Add your NUXT_POSTHOG_API_KEY and NUXT_POSTHOG_PROJECT_ID)

# Start development server
npm run dev
```

## 🚀 Build

```bash
# Build for production
npm run build
```

---

**Author**: Pedro Cruz
**License**: MIT
