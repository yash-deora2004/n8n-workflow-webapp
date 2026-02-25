# n8n Workflow Web App

Turn an n8n Cloud workflow into a standalone web app with a proper frontend.

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **UI:** React, TypeScript, Tailwind CSS
- **Backend:** n8n Cloud (webhook triggers)

## Development Workflow

1. **Audit n8n workflow** — Ensure the workflow has a Webhook trigger node (accepts JSON input) and a Respond to Webhook node (returns structured JSON output). Use the n8n MCP to inspect and modify.
2. **Build frontend** — Create the Next.js app that sends data to the n8n webhook and displays the response.
3. **Test locally** — Run `npm run dev` and verify the full round-trip: frontend → n8n webhook → response → UI.
4. **Push to GitHub** — Commit and push via GitHub MCP or CLI.

## Project Structure

```
src/
  app/           → Pages and routes (Next.js App Router)
  components/    → Reusable React components
  lib/           → API helpers, types, utilities
public/          → Static assets (images, icons)
```

## Available Tools

| Tool | Purpose |
|------|---------|
| n8n MCP | Inspect and modify n8n workflows, nodes, and configurations |
| GitHub MCP | Push code, manage branches and PRs |
| `/n8n` skill | n8n node and configuration knowledge |
| `/front-end-designer` skill | UI/UX design assistance |

## Commands

```bash
npm run dev      # Start local dev server
npm run build    # Production build
npm run lint     # Run linter
```

## Conventions

- Keep files and components lean — no unnecessary abstractions
- Prefer React Server Components where possible
- Co-locate related files (component + its types/utils nearby)
- One workflow = one app — the n8n webhook URL is stored in `.env.local` as `NEXT_PUBLIC_N8N_WEBHOOK_URL`
- Never commit `.env.local` — add it to `.gitignore`
