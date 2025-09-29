## MovieBase Client

Dev

- API runs at `http://localhost:3000` (NestJS).
- Client proxies `/api/*` → `http://localhost:3000/api/v1/*` via `next.config.ts`.

Scripts

- `pnpm dev` – start client
- `pnpm build && pnpm start`

Env

- Optionally set `NEXT_PUBLIC_API_URL` to override proxy target.

Auth

- Token stored in `localStorage` under `mb_token`. User under `mb_user`.

Pages

- `/login`, `/signup`
- `/movies`, `/movies/create`, `/movies/[id]/edit`
