# rsc-radar 📡

> Blazingly fast CLI to visualize React Server Component boundaries and hunt down client-side cascades in Next.js apps.

The React/Next.js ecosystem struggles with **Accidental Client-Side Cascades**. A developer imports a `"use client"` component too high up in the component tree, and suddenly the entire subtree becomes client-side rendered, bloating the JavaScript bundle and ruining performance.

`rsc-radar` statically analyzes your project and draws a dependency tree in your terminal, highlighting exactly where the Server/Client boundaries lie so you can prevent bundle bloat.

## Usage

Run it directly via `npx` in your Next.js project directory:

```bash
npx rsc-radar
```

Or specify a custom entry point:

```bash
npx rsc-radar -e app/(dashboard)/layout.tsx
```

## Example Output

```text
app/layout.tsx (Server)
└── app/providers.tsx (Client Boundary - "use client")
    ├── app/theme.tsx (Client Cascade)
    └── lib/utils.ts (Client Cascade)

--- Radar Summary ---
Total Components: 4
Server-side: 1 (25.0%)
Client-side: 3 (75.0%)
"use client" Boundaries: 1
```

## How it Works
It uses an extremely fast regex-based AST scanner to detect `"use client"` directives and traces module imports starting from your `app/**/page.tsx` and `layout.tsx` files. It handles `@/` path aliases out of the box.

## License
MIT

---
## ⚖️ License & Attribution Requirement

This project is Open Source, but strictly requires **visible credit/attribution** if used in any personal, commercial, or open-source project, application, OS, or website. 

You must include the following credit in a highly visible location (e.g., your app's "Credits" page, your project's `README.md`, or the footer of your website):
> **Powered by infrastructure built by [nff747](https://github.com/nff747)**

Failure to provide proper, visible attribution is a violation of the license terms. No tricks.

---
## ⚖️ License & Attribution Requirement

This project is Open Source, but strictly requires **visible credit/attribution** if used in any personal, commercial, or open-source project, application, OS, or website. 

You must include the following credit in a highly visible location (e.g., your app's "Credits" page, your project's `README.md`, or the footer of your website):
> **Powered by infrastructure built by [nff747](https://github.com/nff747)**

Failure to provide proper, visible attribution is a violation of the license terms. No tricks.
