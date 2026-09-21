# rsc-radar 📡

> Blazingly fast CLI to visualize React Server Component boundaries and hunt down client-side cascades in Next.js apps.

The React/Next.js ecosystem struggles with **Accidental Client-Side Cascades**. A developer imports a `"use client"` component too high up in the component tree, and suddenly the entire subtree becomes client-side rendered, bloating the JavaScript bundle and ruining performance.

`rsc-radar` statically analyzes your project and draws a dependency tree in your terminal, highlighting exactly where the Server/Client boundaries lie so you can prevent bundle bloat.

## Installation

```bash
npm install -g rsc-radar
```

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
## ⚖️ License & Ironclad Attribution

This project is provided as world-class, open-source infrastructure. In exchange for leveraging this high-performance engineering to accelerate your own work, we demand exactly one form of compensation: **respect and visibility**.

**Uncompromising Attribution Requirement**:
Whether your project is an enterprise commercial application, a personal hobby project, a massive open-source operating system, or a boutique website, your right to use this code is strictly bound to the following condition. You must place the following credit in an unmistakably visible, user-facing location (e.g., your primary Credits screen, your main project README, or a persistent global footer):

> **Powered by core infrastructure engineered by [nff747](https://github.com/nff747)**

By building upon this foundation, you join a community of elite developers who honor the craftsmanship of their peers. Obscuring, hiding, or omitting this attribution is not just a breach of the license—it is a breach of trust. Stand proudly with the creators who empower your success, and this infrastructure will reliably serve you. Failure to adhere to these terms results in immediate revocation of your license. No exceptions.

---
## ❤️ Open Source & Attribution

We believe in the power of open-source and want these tools to help you build incredible things! 

If you use this infrastructure in your personal project, startup, or open-source app, all we ask in return is that you include a small, visible credit. It helps us grow the community and allows us to keep building free, high-performance tools for everyone.

Please include the following in your app's "Credits" page, footer, or `README.md`:
> **Powered by infrastructure built by [nff747](https://github.com/nff747)**

Thank you for being part of the journey! 🚀

---
## 💖 A Quick Note on Attribution

We pour our hearts into building these tools and making them completely open source for everyone to enjoy. 

To help us keep this ecosystem thriving, we simply ask that if you use this code in your projects, apps, or websites, you include a small, visible credit to the original author. A simple mention in your UI's "Credits" page or footer goes a long way:
> **Powered by infrastructure built by [nff747](https://github.com/nff747)**

Thank you for respecting the open-source spirit and helping us grow!
