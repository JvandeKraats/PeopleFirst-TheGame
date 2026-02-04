# PeopleFirst-TheGame

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Hosted  
Hosted on: https://jvandekraats.github.io/PeopleFirst-TheGame/#/

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

## Dev Container (recommended)

This repo includes a VS Code **Dev Container** configuration for a consistent, ready-to-run dev environment.

Prereqs:
- Docker Desktop (or another Docker runtime)
- VS Code + the **Dev Containers** extension

Steps:
1) Open the repo in VS Code
2) Run: **Dev Containers: Reopen in Container**
3) Once the container is ready, install deps happens automatically (`npm ci`)
4) Start the app:

```sh
npm run dev
```

Notes:
- The Vite dev server runs on port `5173` and is forwarded automatically.
- If you want the dev server reachable from other devices, use:

```sh
npm run dev:host
```

## Windows setup (fnm + PowerShell + Node.js)

If you want to be able to switch Node versions per-project, this repo works well with **fnm** (Fast Node Manager) on Windows.

### 1) Install fnm

Using winget:

```powershell
winget install Schniz.fnm
```

Close and reopen your terminal after installing.

### 2) Initialize fnm in your PowerShell profile

Create your PowerShell profile file if it doesn't exist:

```powershell
if (!(Test-Path $PROFILE)) { New-Item -ItemType File -Path $PROFILE -Force }
```

Open the profile in VS Code:

```powershell
code $PROFILE
```

Add this line to the profile:

```powershell
fnm env --use-on-cd | Out-String | Invoke-Expression
```

Restart PowerShell (or run `. $PROFILE`) so it takes effect.

### 3) Install Node 24 using fnm

```powershell
fnm install 24
fnm use 24
node -v
npm -v
```

### 4) Install dependencies

From the repository root:

```sh
npm i
```

### 5) Run the project

```sh
npm run dev
```

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
``` 

## Deploy to GitHub Pages

This repo is set up to deploy the Vite build output (`dist/`) to GitHub Pages on every push to `main`.

1) In GitHub: **Settings → Pages → Source → GitHub Actions**

2) Push to `main` and wait for the workflow in [​.github/workflows/workflow.yml](.github/workflows/workflow.yml)

Notes:
- The workflow sets `VITE_BASE` to `/<repo>/` so assets work on a GitHub Pages **project** site.
- The router uses hash mode, so deep links work on Pages (URLs look like `/#/game`).
- If you use a custom domain or a user/org Pages site, set `VITE_BASE` to `/` in the workflow.

## Renovate

This repository uses **Renovate** to keep dependencies up to date.

Config lives in [renovate.json](renovate.json) and is set up to:
- Update **npm** dependencies and **GitHub Actions** versions
- Create a **Dependency Dashboard** issue
- Run on a schedule (Europe/Amsterdam): **Mondays between 01:00–02:00**
- Limit PR churn (`prHourlyLimit: 2`, `prConcurrentLimit: 5`)
- Keep **automerge disabled** (updates are always reviewed)
- Run weekly **lockfile maintenance**

Grouping and labeling:
- GitHub Actions updates are grouped as “github actions” and labeled `dependencies` + `ci`
- Vite-related minor/patch updates are grouped as “vite ecosystem (minor/patch)”
- Vue-related minor/patch updates are grouped as “vue ecosystem (minor/patch)”
- `@azure/msal-browser` updates get extra labels (including `security`) and higher priority
- Major updates are labeled `breaking`
