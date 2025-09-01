# worm-palace – Repo Map és Technikai Összefoglaló

## 1) Fő meta

**README (első sorok):**

```
# Welcome to worm palace project

## Project info

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
```

**package.json (részlet):**

- name: `vite_react_shadcn_ts`
- version: `0.0.0`
- scripts: ['dev', 'build', 'build:dev', 'lint', 'preview']
- dependencies: 49 csomag
- devDependencies: 17 csomag

## 2) Build & Run

**Bun** ajánlott. Parancsok:
- fejlesztés: `bun install` majd `bun dev`
- build: `bun run build`
- preview: `bun run preview`
Alternatív: ha `npm`/`pnpm` jobban kézre áll, használd a package.json scriptjeit (pl. `npm run dev`).

## 3) Struktúra (kivonat)

```
├── .gitignore
├── README.md
├── bun.lockb
├── components.json
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── public
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src
│   ├── App.css
│   ├── App.tsx
│   ├── assets
│   │   └── default-worm.png
│   ├── components
│   │   ├── Dashboard.tsx
│   │   ├── Inventory.tsx
│   │   ├── JobBoard.tsx
│   │   ├── Navigation.tsx
│   │   ├── ProfileEditor.tsx
│   │   ├── SetupForm.tsx
│   │   ├── Shop.tsx
│   │   ├── TrainingRoom.tsx
│   │   ├── WormCard.tsx
│   │   └── ui
│   │       ├── accordion.tsx
│   │       ├── alert-dialog.tsx
│   │       ├── alert.tsx
│   │       ├── aspect-ratio.tsx
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── breadcrumb.tsx
│   │       ├── button.tsx
│   │       ├── calendar.tsx
│   │       ├── card.tsx
│   │       ├── carousel.tsx
│   │       ├── chart.tsx
│   │       ├── checkbox.tsx
│   │       ├── collapsible.tsx
│   │       ├── command.tsx
│   │       ├── context-menu.tsx
│   │       ├── dialog.tsx
│   │       ├── drawer.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── form.tsx
│   │       ├── hover-card.tsx
│   │       ├── input-otp.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── menubar.tsx
│   │       ├── navigation-menu.tsx
│   │       ├── pagination.tsx
│   │       ├── popover.tsx
│   │       ├── progress.tsx
│   │       ├── radio-group.tsx
│   │       ├── resizable.tsx
│   │       ├── scroll-area.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── sidebar.tsx
│   │       ├── skeleton.tsx
│   │       ├── slider.tsx
│   │       ├── sonner.tsx
│   │       ├── switch.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       ├── textarea.tsx
│   │       ├── toast.tsx
│   │       ├── toaster.tsx
│   │       ├── toggle-group.tsx
│   │       ├── toggle.tsx
│   │       ├── tooltip.tsx
│   │       └── use-toast.ts
│   ├── data
│   │   ├── jobs.ts
│   │   ├── shopItems.ts
│   │   └── trainings.ts
│   ├── hooks
│   │   ├── use-mobile.tsx
│   │   ├── use-toast.ts
│   │   └── useGameData.ts
│   ├── index.css
│   ├── lib
│   │   └── utils.ts
│   ├── main.tsx
│   ├── pages
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   ├── types
│   │   └── game.ts
│   ├── vite-env.d.ts
│   └── worm.png
├── tailwind.config.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts

```

## 4) Kulcs komponensek (src/components)

- `src/components/Dashboard.tsx` → **Dashboard**  (hooks: 0, ui-importok: 2)
- `src/components/Inventory.tsx` → **Inventory**  (hooks: 0, ui-importok: 5)
- `src/components/JobBoard.tsx` → **JobBoard**  (hooks: 4, ui-importok: 3)
- `src/components/Navigation.tsx` → **Navigation**  (hooks: 0, ui-importok: 2)
- `src/components/ProfileEditor.tsx` → **ProfileEditor**  (hooks: 3, ui-importok: 6)
- `src/components/SetupForm.tsx` → **SetupForm**  (hooks: 3, ui-importok: 4)
- `src/components/Shop.tsx` → **Shop**  (hooks: 0, ui-importok: 4)
- `src/components/TrainingRoom.tsx` → **TrainingRoom**  (hooks: 4, ui-importok: 3)
- `src/components/WormCard.tsx` → **WormCard**  (hooks: 0, ui-importok: 2)
- `src/components/ui/accordion.tsx` → **Accordion**  (hooks: 0, ui-importok: 0)
- `src/components/ui/alert-dialog.tsx` → **AlertDialog**  (hooks: 0, ui-importok: 1)
- `src/components/ui/alert.tsx` → **Alert**  (hooks: 0, ui-importok: 0)
- `src/components/ui/aspect-ratio.tsx` → **AspectRatio**  (hooks: 0, ui-importok: 0)
- `src/components/ui/avatar.tsx` → **Avatar**  (hooks: 0, ui-importok: 0)
- `src/components/ui/badge.tsx` → **Badge**  (hooks: 0, ui-importok: 0)
- `src/components/ui/breadcrumb.tsx` → **Breadcrumb**  (hooks: 0, ui-importok: 0)
- `src/components/ui/button.tsx` → **Button**  (hooks: 0, ui-importok: 0)
- `src/components/ui/calendar.tsx` → **Calendar**  (hooks: 0, ui-importok: 1)
- `src/components/ui/card.tsx` → **Card**  (hooks: 0, ui-importok: 0)
- `src/components/ui/carousel.tsx` → **CarouselContext**  (hooks: 5, ui-importok: 1)
- `src/components/ui/chart.tsx` → **THEMES**  (hooks: 2, ui-importok: 0)
- `src/components/ui/checkbox.tsx` → **Checkbox**  (hooks: 0, ui-importok: 0)
- `src/components/ui/collapsible.tsx` → **Collapsible**  (hooks: 0, ui-importok: 0)
- `src/components/ui/command.tsx` → **Command**  (hooks: 0, ui-importok: 1)
- `src/components/ui/context-menu.tsx` → **ContextMenu**  (hooks: 0, ui-importok: 0)
- `src/components/ui/dialog.tsx` → **Dialog**  (hooks: 0, ui-importok: 0)
- `src/components/ui/drawer.tsx` → **Drawer**  (hooks: 0, ui-importok: 0)
- `src/components/ui/dropdown-menu.tsx` → **DropdownMenu**  (hooks: 0, ui-importok: 0)
- `src/components/ui/form.tsx` → **Form**  (hooks: 2, ui-importok: 1)
- `src/components/ui/hover-card.tsx` → **HoverCard**  (hooks: 0, ui-importok: 0)
- `src/components/ui/input-otp.tsx` → **InputOTP**  (hooks: 1, ui-importok: 0)
- `src/components/ui/input.tsx` → **Input**  (hooks: 0, ui-importok: 0)
- `src/components/ui/label.tsx` → **Label**  (hooks: 0, ui-importok: 0)
- `src/components/ui/menubar.tsx` → **MenubarMenu**  (hooks: 0, ui-importok: 0)
- `src/components/ui/navigation-menu.tsx` → **NavigationMenu**  (hooks: 0, ui-importok: 0)
- `src/components/ui/pagination.tsx` → **Pagination**  (hooks: 0, ui-importok: 1)
- `src/components/ui/popover.tsx` → **Popover**  (hooks: 0, ui-importok: 0)
- `src/components/ui/progress.tsx` → **Progress**  (hooks: 0, ui-importok: 0)
- `src/components/ui/radio-group.tsx` → **RadioGroup**  (hooks: 0, ui-importok: 0)
- `src/components/ui/resizable.tsx` → **ResizablePanelGroup**  (hooks: 0, ui-importok: 0)
- `src/components/ui/scroll-area.tsx` → **ScrollArea**  (hooks: 0, ui-importok: 0)
- `src/components/ui/select.tsx` → **Select**  (hooks: 0, ui-importok: 0)
- `src/components/ui/separator.tsx` → **Separator**  (hooks: 0, ui-importok: 0)
- `src/components/ui/sheet.tsx` → **Sheet**  (hooks: 0, ui-importok: 0)
- `src/components/ui/sidebar.tsx` → **SIDEBAR_COOKIE_NAME**  (hooks: 5, ui-importok: 6)
- `src/components/ui/skeleton.tsx` → **Skeleton**  (hooks: 0, ui-importok: 0)
- `src/components/ui/slider.tsx` → **Slider**  (hooks: 0, ui-importok: 0)
- `src/components/ui/sonner.tsx` → **Toaster**  (hooks: 0, ui-importok: 0)
- `src/components/ui/switch.tsx` → **Switch**  (hooks: 0, ui-importok: 0)
- `src/components/ui/table.tsx` → **Table**  (hooks: 0, ui-importok: 0)
- `src/components/ui/tabs.tsx` → **Tabs**  (hooks: 0, ui-importok: 0)
- `src/components/ui/textarea.tsx` → **Textarea**  (hooks: 0, ui-importok: 0)
- `src/components/ui/toast.tsx` → **ToastProvider**  (hooks: 0, ui-importok: 0)
- `src/components/ui/toaster.tsx` → **Toaster**  (hooks: 0, ui-importok: 1)
- `src/components/ui/toggle-group.tsx` → **ToggleGroupContext**  (hooks: 1, ui-importok: 1)
- `src/components/ui/toggle.tsx` → **Toggle**  (hooks: 0, ui-importok: 0)
- `src/components/ui/tooltip.tsx` → **TooltipProvider**  (hooks: 0, ui-importok: 0)

## 5) UI készlet (src/components/ui)

- `src/components/ui/accordion.tsx`
- `src/components/ui/alert-dialog.tsx`
- `src/components/ui/alert.tsx`
- `src/components/ui/aspect-ratio.tsx`
- `src/components/ui/avatar.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/breadcrumb.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/calendar.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/carousel.tsx`
- `src/components/ui/chart.tsx`
- `src/components/ui/checkbox.tsx`
- `src/components/ui/collapsible.tsx`
- `src/components/ui/command.tsx`
- `src/components/ui/context-menu.tsx`
- `src/components/ui/dialog.tsx`
- `src/components/ui/drawer.tsx`
- `src/components/ui/dropdown-menu.tsx`
- `src/components/ui/form.tsx`
- `src/components/ui/hover-card.tsx`
- `src/components/ui/input-otp.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/label.tsx`
- `src/components/ui/menubar.tsx`
- `src/components/ui/navigation-menu.tsx`
- `src/components/ui/pagination.tsx`
- `src/components/ui/popover.tsx`
- `src/components/ui/progress.tsx`
- `src/components/ui/radio-group.tsx`
- `src/components/ui/resizable.tsx`
- `src/components/ui/scroll-area.tsx`
- `src/components/ui/select.tsx`
- `src/components/ui/separator.tsx`
- `src/components/ui/sheet.tsx`
- `src/components/ui/sidebar.tsx`
- `src/components/ui/skeleton.tsx`
- `src/components/ui/slider.tsx`
- `src/components/ui/sonner.tsx`
- `src/components/ui/switch.tsx`
- `src/components/ui/table.tsx`
- `src/components/ui/tabs.tsx`
- `src/components/ui/textarea.tsx`
- `src/components/ui/toast.tsx`
- `src/components/ui/toaster.tsx`
- `src/components/ui/toggle-group.tsx`
- `src/components/ui/toggle.tsx`
- `src/components/ui/tooltip.tsx`
- `src/components/ui/use-toast.ts`

## 6) App belépési pontok

**index.html (kivonat):**
```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Kukac Nevelde - Worm Daycare</title>
    <meta name="description" content="Neveld fel a saját kukacod! Edzéssel fejleszd a statjait, végezz munkákat, és versenyezz a ranglistán." />
    <meta name="author" content="Acoeric" />

    <meta property="og:title" content="Kukac Nevelde - Worm Daycare" />
    <meta property="og:description" content="Neveld fel a saját kukacod! Edzéssel fejleszd a statjait, végezz munkákat, és versenyezz a rangl
```

**src/App.tsx importok:**
```
./pages/Index
./pages/NotFound
@/components/ui/sonner
@/components/ui/toaster
@/components/ui/tooltip
@tanstack/react-query
react-router-dom
```

## 7) Public és assetek

- `public/` fájlok: favicon.ico, placeholder.svg, robots.txt
- `src/assets/`: default-worm.png

## 8) ESLint & PostCSS & components.json

**eslint.config.js (részlet):**
```
import js from "@eslint/js"; import globals from "globals"; import reactHooks from "eslint-plugin-react-hooks"; import reactRefresh from "eslint-plugin-react-refresh"; import tseslint from "typescript-eslint"; export default tseslint.config( { ignores: ["dist"] }, { extends: [js.configs.recommended, ...tseslint.configs.recommended], files: ["**/*.{ts,tsx}"], languageOptions: { ecmaVersion: 2020, globals: globals.browser, }, plugins: { "react-hooks": reactHooks, "react-refresh": reactRefresh, }, rules: { ...reactHooks.configs.recommended.rules, "react-refresh/only-export-components": [ "warn", { allowConstantExport: true }, ], "@typescript-eslint/no-unused-vars": "off", }, } );
```

**postcss.config.js (részlet):**
```
export default { plugins: { tailwindcss: {}, autoprefixer: {}, }, }
```

**components.json (részlet):**
```
{ "$schema": "https://ui.shadcn.com/schema.json", "style": "default", "rsc": false, "tsx": true, "tailwind": { "config": "tailwind.config.ts", "css": "src/index.css", "baseColor": "slate", "cssVariables": true, "prefix": "" }, "aliases": { "components": "@/components", "utils": "@/lib/utils", "ui": "@/components/ui", "lib": "@/lib", "hooks": "@/hooks" } }
```

## 9) Következő lépések javaslatok

- Állapotkezelés egységesítése (pl. Zustand/Jotai vagy React Context + reducer).
- Router bevezetése (React Router) ha több nézet között váltasz (Dashboard, Shop, TrainingRoom stb.).
- Típusok pontosítása a komponensek props-ainál (TS interface-ek/exportált típusok).
- UI készlet központosítása és dokumentálása (Storybook).
- Alap tesztek: vitest/jest + React Testing Library a kulcs komponensekre.
- CI: GitHub Actions workflow a build + lint + test futtatására.
- Performance: memoizáció kritikus listáknál, lazy loading nagyobb nézetekre.
- Accessibility: fókusz, kontraszt, ARIA attribútumok ellenőrzése a UI komponenseknél.
- i18n: ha kell többnyelvűség, `react-i18next` integráció.
