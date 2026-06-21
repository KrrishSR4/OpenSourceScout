#  OpenSourceScout

[![Vite](https://img.shields.io/badge/Vite-8.0.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![React](https://img.shields.io/badge/React-19.0.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TanStack Router](https://img.shields.io/badge/TanStack_Router-1.x-FF4154?style=for-the-badge&logo=reactrouter&logoColor=white)](https://tanstack.com/router/latest)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **Ship your first PR — and the next 100.**   
> A loud, opinionated, and high-fidelity discovery dashboard for open-source contributions. Avoid the "awesome-lists" rabbit holes. Scout surfaces active GitHub repositories, tracks live `good first issues`, evaluates developer momentum, and helps you pick the right project to ship code today.

---

##  Core Features

- ** Language & Framework Filtering**
  Browse curated repositories organized by **11 popular programming languages** (TypeScript, Go, Rust, Python, etc.) and their respective leading web/application frameworks (Next.js, FastAPI, Actix, Axum, Laravel, etc.).
  
- ** Real-time Scoring Models**
  - **Activity Index (0–100):** Evaluates repository push velocity, applying a daily decay filter to check if the codebase is actually maintained.
  - **Friendliness Score (0–100):** Measures the density of `good first issue` labels weighted against repository size to identify welcoming maintainers.
  - **Difficulty Rating:** A logarithmic classification (`Beginner`, `Intermediate`, `Advanced`) derived from star counts, open issues volume, and GFI density to estimate onboarding friction.
  - **Competition Level (`Low`, `Medium`, `High`):** Evaluates active contributor counts so you can choose between high-velocity teams or quiet, easy-to-help codebases.

- ** Neobrutalist UI/UX**
  A high-contrast, modern UI featuring heavy borders, vibrant HSL accents, glassmorphic filters, crisp micro-animations powered by **Framer Motion**, and ultra-smooth scrolling driven by **Lenis**.

- ** Client-Side Hydrated Search**
  Fetches live data directly from the GitHub REST API (Search Repositories and Search Issues endpoints) to ensure you always see live GFI counts.

---

##  Technical Stack

- **Core Library:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict typing)
- **Routing:** [TanStack Router](https://tanstack.com/router) (Type-safe router with automatic route tree generation)
- **Data Fetching:** [TanStack Query v5](https://tanstack.com/query) (React Query for query caching and mutation states)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (Using CSS variables and custom utility tokens)
- **Animations:** [Framer Motion](https://www.framer.com/motion/) & [tw-animate-css](https://github.com/mrcruz/tw-animate-css)
- **Scroll Engine:** [Lenis Smooth Scroll](https://lenis.darkroom.engineering/)
- **Icons:** [Lucide React](https://lucide.dev/)

---

##  Technical Architecture

This application was successfully migrated from a TanStack Start server-rendered structure to a pure client-side React + Vite SPA. To support this migration without changing the core query files, a custom shim is implemented:

###  Server-to-Client Shim (`src/lib/react-start-compat.ts`)
Instead of rewriting the TanStack Start backend handlers, a compatibility layer shims `createServerFn` and `useServerFn` directly in the client runtime. In `vite.config.ts`, imports from `@tanstack/react-start` are aliased to this shim:

```typescript
// vite.config.ts
resolve: {
  alias: {
    '@tanstack/react-start': path.resolve(__dirname, './src/lib/react-start-compat.ts'),
  },
}
```

This ensures that queries compile natively in a pure client SPA environment, bypassing SSR constraints and routing all API calls directly from the user's browser.

---

##  The Scoring Model Formula

Scout calculates four main metrics on-the-fly when parsing GitHub repository results:

### 1. Activity Score
$$\text{Activity} = 100 - (\text{Days since last push} \times 1.5)$$
*(Clamped between 0 and 100. Lower pushes mean a decaying score).*

### 2. Friendliness Score
$$\text{Friendliness} = 40 + (\log_{10}(\max(1, \text{GFI Count})) \times 25) + (\text{has\_issues} ? 10 : 0)$$
*(Clamped between 0 and 100. Measures density of beginner-friendly entry doors).*

### 3. Difficulty Onboarding
$$\text{Raw Diff} = \log_{10}(\text{stars}) \times 14 + \log_{10}(\text{open\_issues}) \times 8 - \log_{10}(\text{GFI Count}) \times 10$$
- $\text{Raw Diff} < 40 \implies$ **Beginner**
- $\text{Raw Diff} < 70 \implies$ **Intermediate**
- $\text{Otherwise} \implies$ **Advanced**

### 4. Competition Level
- $< 30$ contributors $\implies$ **Low Competition**
- $< 150$ contributors $\implies$ **Medium Competition**
- $\ge 150$ contributors $\implies$ **High Competition**

---

##  Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended) and either `npm` or `bun`.

### 1. Clone the Repository
```bash
git clone https://github.com/KrrishSR4/OpenSourceScout.git
cd OpenSourceScout
```

### 2. Install Dependencies
```bash
npm install
# or if using Bun
bun install
```

### 3. Configure GitHub Authentication (Optional but Recommended)
By default, the unauthenticated GitHub API is limited to **60 requests per hour**. To avoid hitting rate limits, create a Personal Access Token (classic or fine-grained) on GitHub and set it in your environment:

Create a `.env` file in the root directory:
```env
# Personal Access Token to raise GitHub API rate limits
VITE_GITHUB_TOKEN=your_github_personal_access_token
```

### 4. Run the Development Server
```bash
npm run dev
# or
bun run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 5. Build for Production
To bundle the static application for production hosting (Vercel, Netlify, Cloudflare Pages, etc.):
```bash
npm run build
```
The compiled output will be generated in the `dist` directory.

---

##  Project Structure

```text
OpenSourceScout/
├── public/                 # Static assets (favicons, sitemap.xml)
├── src/
│   ├── components/
│   │   ├── site/           # Layout blocks (Navbar, Footer, Shell, Lenis wrapper)
│   │   └── ui/             # Reusable UI primitives (dialogs, buttons, inputs)
│   ├── hooks/              # Custom React hooks
│   ├── lib/
│   │   ├── frameworks.ts   # Curated list of languages and frameworks
│   │   ├── github.functions.ts # GitHub search API handlers and scoring algorithms
│   │   ├── react-start-compat.ts # SPA compatibility shim for Server Functions
│   │   └── utils.ts        # Tailwind merge & cn helper
│   ├── routes/             # TanStack Router page routes
│   │   ├── __root.tsx      # Core root layout, header, footer connection
│   │   ├── index.tsx       # Landing page (manifesto, feature slabs, showcases)
│   │   ├── explore.tsx     # Repository Search Explorer with filters
│   │   ├── docs.tsx        # In-app Documentation page
│   │   ├── about.tsx       # About page
│   │   └── contact.tsx     # Contact page
│   ├── routeTree.gen.ts    # Automatically generated route tree file
│   ├── router.tsx          # TanStack Router configuration
│   ├── main.tsx            # App entry point
│   └── styles.css          # Core design system stylesheet (Tailwind v4 theme variables)
├── index.html              # HTML entry shell
├── package.json            # Scripts and dependencies configuration
├── vite.config.ts          # Vite bundler options and alias mappings
└── tsconfig.json           # TypeScript configuration
```

---

##  Contributing

Contributions are welcome! If you want to add a framework, optimize the scoring model, or polish the UI:

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.
