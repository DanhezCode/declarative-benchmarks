# 📘 TypeScript Project Template

This repository is a **TypeScript template** preconfigured with:

- **ESLint** for linting
- **Prettier** for formatting
- **Husky** for Git hooks
- **Conventional Commits** validation in pre-commit
- **Type checking** and **test scripts**
- Compatible with **pnpm**, **npm**, **yarn**, and **bun**

You can use **any package manager you prefer**. All commands shown below work the same way across tools.

---

## 🚀 Installation

Install dependencies using your preferred package manager:

### pnpm

```bash
pnpm install
```

### npm

```bash
npm install
```

### yarn

```bash
yarn install
```

### bun

```bash
bun install
```

---

## 🔧 Initialize Husky

After installing dependencies, you must run the `prepare` script:

```bash
pnpm prepare
# or npm run prepare
# or yarn prepare
# or bun run prepare
```

Once initialized, **before every commit**, Husky will automatically:

- Run ESLint
- Format code with Prettier
- Check TypeScript types
- Run tests
- **Validate commit messages using Conventional Commits**

This ensures consistent, clean, and safe commits.

---

## 📝 Conventional Commits

This template enforces **Conventional Commits** automatically during `pre-commit`.  
If your commit message does not follow the standard, the commit will be rejected.

### Common commit types

| Type          | Purpose                                        |
| ------------- | ---------------------------------------------- |
| **feat:**     | A new feature                                  |
| **fix:**      | A bug fix                                      |
| **docs:**     | Documentation changes                          |
| **style:**    | Formatting only (no code changes)              |
| **refactor:** | Code refactoring without behavior changes      |
| **test:**     | Adding or updating tests                       |
| **chore:**    | Maintenance tasks (configs, tooling, CI, etc.) |

---

## 📂 Available Scripts

You can run these commands with **pnpm**, **npm**, **yarn**, or **bun**.

### 🔍 Lint

```bash
pnpm lint
```

Runs ESLint to detect code issues.

### 🛠 Fix Lint Issues

```bash
pnpm lint:fix
```

Automatically fixes ESLint problems when possible.

### 🎨 Format

```bash
pnpm format
```

Formats the entire codebase using Prettier.

### 🧪 Type Check

```bash
pnpm typecheck
```

Runs TypeScript’s type checker without emitting files.

### 🧪 Tests

```bash
pnpm test
```

Runs your Node.js test suite.

---

## 🔄 Updating Dependencies

This project uses **strict versioning** (`save-exact=true`), so dependencies **do not update automatically**.  
If you want to update them, you must do it **manually** with your package manager:

- **pnpm**
  ```bash
  pnpm update --latest
  ```
- **npm**
  ```bash
  npm update
  ```
- **yarn**
  ```bash
  yarn upgrade --latest
  ```
- **bun**
  ```bash
  bun update
  ```

This prevents inconsistent installations across machines and ensures full reproducibility.
