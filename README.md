# 📘 Project Setup

This project is configured with **TypeScript**, **ESLint**, **Prettier**, and **Husky**.  
You can install dependencies using **pnpm** or **Bun**.

---

## 🚀 Installation

### Using pnpm

```bash
pnpm install
```

### Using Bun

```bash
bun install
```

---

## 🔧 Initialize Husky

Husky is initialized through the `prepare` script:

```bash
pnpm prepare
```

This will create the initialize `.husky/`

---

## 📂 Available Scripts

### pnpm

```bash
pnpm build        # compile TypeScript
pnpm lint         # run ESLint
pnpm lint:fix     # fix ESLint issues
pnpm typecheck    # run TypeScript type checking
pnpm format       # format with Prettier
pnpm test         # run Node.js tests
pnpm prepare      # initialize Husky
```

### Bun

```bash
bun run build
bun run lint
bun run lint:fix
bun run typecheck
bun run format
bun run test
bun run prepare
```
