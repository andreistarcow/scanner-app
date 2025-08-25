## ![](./src/assets/favicon.svg) Dexcelerate Scanner Testcase App

[Demo](https://scanner-app-git-develop-andreistarcows-projects.vercel.app/)
(Install no-CORA browser extension)

Running the development version doesn’t require CORS-unblocking browser extensions, because Vite handles proxying.
See [vite.config.mts](./vite.config.mts) 


### Installation
```bash
  npm install
```

### Development
```bash
  npm run dev

```
Then open `http://localhost:1337`.

### Build
```bash
  npm run build
```

### Preview (after build)
```bash
  npm run preview
```

### Lint
```bash
  npm run lint
  npm run lint:fix
```

### API endpoint setup

See ```.env```

## File structure (high level)
```text
src/
  app/
    App.tsx                # Top-level app layout and routing shell
  assets/                  # Static assets and icons
  components/              # (Reserved) shared components
  config/                  # (Reserved) app configuration
  entities/                # Domain entities (scanner types, utils)
  lib/                     # Generic utilities
  pages/
    ScannerPage/           # Page that composes scanner tables
  shared/
    api/                   # API client/types
      client.ts            # API fetch wrapper helper
    lib/                   # Shared utilities (formatting, constants)
      dexRegistry.ts       # DEX mapper
      explorer.ts          # Chain-specific explorer links
      ws.ts                # Websocket transport helper class
    ui/                    # Reusable UI components (buttons, icons, etc.)
  widgets/
    scanner-table/         # Scanner table widget (state, hooks, ui)
      hooks/               # Data fetching, filters, table state hooks
        useScannerFeed.ts  # WS Subscription & Data fetching logic
        useFilters.ts      # In-memory filters implementation
      model/               # Jotai atoms, types, and helpers
        atoms/             # State atoms
        types.ts
      ui/                  # Visual table (header, rows, cells, filters)
        ScannerTable/      # Core Scanner table component
          components/
            TableHeader/   # Table header with sorters
            VirtalRows/    # Virtualized table rows
            TokenRow/      # Core scanner row component
            filters/       # Filters
              FilterBar/   # Core filter bar component
          grid.ts          # Grid setup
         
```

### Key entry points
- `src/main.tsx`: mounts the app and imports global styles (`index.css`).
- `src/app/App.tsx`: renders the main page.
- `src/pages/ScannerPage/index.tsx`: composes two `ScannerTable` widgets: Trending and New.
- `src/widgets/scanner-table/ui/ScannerTable/index.tsx`: main table widget.

## Tech stack
- React 18, TypeScript, Vite
- TailwindCSS, tailwind-merge, tailwindcss-animate
- Jotai (state), @tanstack/react-virtual (virtualization)
- Testing: Vitest, Testing Library

