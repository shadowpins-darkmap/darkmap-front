# DarkMap Tour Frontend (darkmap-front)

> 🇰🇷 [한국어 README](./README.md)

**DarkMap Tour** is a **civic hacking project** that visualizes street harassment and sexual crime incidents on a map,
empowering citizens to report incidents and share their experiences through a community platform.
This repository is maintained by [ShadowPins](https://weareshadowpins.com).

- Live service: [https://kdark.weareshadowpins.com](https://kdark.weareshadowpins.com)
- Deployment: [Vercel](https://vercel.com) (PR → merged by repo owner → auto-deployed)

---

## Table of Contents

1. [About the Project](#1-about-the-project)
2. [Tech Stack](#2-tech-stack)
3. [Key Features](#3-key-features)
4. [Getting Started](#4-getting-started)
5. [Project Structure](#5-project-structure)
6. [Environment Variables](#6-environment-variables)
7. [Contributing](#7-contributing)
8. [Security](#8-security)
9. [License](#9-license)

---

## 1. About the Project

DarkMap is a **non-profit civic hacking project** that collects and visualizes crime news data on a map,
and provides a platform for citizens to report incidents and share their experiences within a community.

| | |
|---|---|
| Organization | [ShadowPins](https://weareshadowpins.com) |
| Project Type | Non-profit Civic Hacking |
| Target Audience | Street harassment survivors and concerned citizens |
| Languages | Korean, English |

---

## 2. Tech Stack

| Category | Technology |
|---|---|
| UI Framework | [Vue 3](https://vuejs.org/) (Composition API) |
| State Management | [Pinia](https://pinia.vuejs.org/) + pinia-plugin-persistedstate |
| Routing | [Vue Router 4](https://router.vuejs.org/) |
| Maps | [Google Maps JS API](https://developers.google.com/maps) + MarkerClusterer |
| HTTP Client | [Axios](https://axios-http.com/) |
| Build Tool | Vue CLI 5 (Webpack-based) |
| Styling | SCSS (Sass) |
| Deployment | [Vercel](https://vercel.com) |
| Node.js | v20 (managed via `.nvmrc`) |

---

## 3. Key Features

### Map Visualization

- Displays crime news articles as Google Maps markers
- Color-coded by crime type (assault, stalking, indecent exposure, hunting, etc.)
- Marker clustering via MarkerClusterer
- District-level filtering and search

### Community

- Login: Kakao / Google OAuth2
- Onboarding flow for new users (nickname setup · marketing consent)
- Board categories: Experience sharing · Concerns · Questions · Incident reports · Notices
- Comments, likes, and report functions
- Direct incident report submission form

### World Tour Mode

- Map of international cyber-flashing criminal cases (UK, USA, Austria, etc.)
- Country tabs, case cards, FAQ, and newsletter sign-up

---

## 4. Getting Started

### Prerequisites

- Node.js v20 (recommended)
- npm

```bash
# Switch to the required Node.js version (if using nvm)
nvm use
```

### Install dependencies

```bash
npm install
```

### Run the local development server

```bash
npm run serve
```

Open `http://localhost:3000` in your browser.

> When running the backend API locally, the proxy in `vue.config.js` forwards `/api` requests  
> to `http://localhost:8080` (default Spring Boot port).

### Build for production

```bash
npm run build
```

### Lint and format check

```bash
npm run lint
```

---

## 5. Project Structure

```
src/
├── api/            # Axios API modules
│   ├── articles.js
│   ├── boards.js
│   ├── comments.js
│   ├── crimeCases.js
│   ├── cyberFlashing.js
│   └── user.js
├── assets/         # Static assets (images, icons)
├── components/     # Reusable UI components
├── composables/    # Vue Composition hooks (useDevice, useTranslation)
├── constant/       # Constants and code definitions (URLs, region data, etc.)
├── lib/            # Third-party wrappers and utilities
├── routers/        # Vue Router configuration
├── store/          # Pinia stores
│   ├── useAuthStore.js
│   ├── useStatsStore.js
│   ├── newsListStore.js
│   ├── useTourModeStore.js
│   ├── useCaseTourStore.js
│   └── useCyberFlashingStore.js
├── styles/         # Global SCSS styles
├── translations/   # i18n translation files (ko.js / en.js)
├── utils/          # Shared utility functions
└── views/          # Page view components
    └── MainView.vue
```

---

## 6. Environment Variables

Create a `.env.local` file in the project root and set the following values.
(Actual key values are shared through the team's internal channel.)

```env
VUE_APP_GOOGLE_MAPS_API_KEY=   # Obtain from Google Cloud Console (Maps JS API)
VUE_APP_API_BASE_URL=          # For local dev, replace with e.g. http://localhost:3000
```

| Variable | Description |
|---|---|
| `VUE_APP_GOOGLE_MAPS_API_KEY` | Google Maps JavaScript API key |
| `VUE_APP_API_BASE_URL` | Backend API base URL |


> ⚠️ Never commit `.env.local` to Git. It is already included in `.gitignore`.

---

## 7. Contributing

Contributions are welcome!

### Contribution Flow

1. Fork this repository.
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "feat: describe your change"`
4. Push to your branch: `git push origin feature/my-feature`
5. Open a Pull Request.
6. Once the repo owner reviews and merges the PR, Vercel automatically deploys the changes.

### Commit Message Convention

| Type | Description |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code refactoring |
| `style` | Formatting / style changes |
| `docs` | Documentation updates |
| `chore` | Build or config changes |

---

## 8. Security

If you discover a security vulnerability, please do **not** open a public issue.
Instead, report it privately via email so we can address it promptly.

**📧 [weareshadowpins@gmail.com](mailto:weareshadowpins@gmail.com)**

Please include the following in your report:

- Type of vulnerability and how it was found
- Steps to reproduce (screenshots or a step-by-step description)
- Estimated impact and affected scope

---

## 9. License

This project is operated as a civic hacking initiative for the public interest.  
The license policy will be finalized in consultation with the ShadowPins team. 
Contact: [weareshadowpins@gmail.com](mailto:weareshadowpins@gmail.com)