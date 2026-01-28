# PeopleFirst-TheGame

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

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

### 3) Install Node 20.20 using fnm

```powershell
fnm install 20.20.0
fnm use 20.20.0
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