---
name: cloudflare-migration
description: Active multi-phase refactor moving filepastebin from AWS Lightsail + Socket.IO to Cloudflare Workers + Pages + Durable Objects
metadata:
  type: project
---

Migrating filepastebin from a $10/mo Lightsail Node.js server to Cloudflare's edge infrastructure to fix memory crashes, disconnection issues on large files, and multi-file transfer failures.

**Why:** Lightsail runs out of memory and crashes. Socket.IO fallback causes issues. No horizontal scaling.

**How to apply:** All architectural decisions should be consistent with this migration direction. Do not add new Socket.IO dependencies or server-side state.

## Completed phases

### Phase 1 — Cloudflare Pages (static frontend)
- EJS templates replaced with static HTML in `src/client/public/`
- `client.ts` reads room ID from `window.location.pathname`
- `download-panel-base.tsx` has loading/notFound states (spinner → file list → not found)
- `__SERVER_URL__` webpack DefinePlugin constant: empty = same origin (dev/Lightsail), set to Worker URL for Pages build
- `_redirects` file routes `/*` to `download.html` for room URLs
- Build: `npm run build:pages` → `dist/pages/` (CF Pages output dir)
- Server: CORS added to Socket.IO via `PAGES_ORIGIN` env var

### Phase 2 + 3 — Cloudflare Workers + KV + Durable Objects (signaling)
- `src/worker/index.ts` — Worker entry point (API routes + WS routing)
- `src/worker/room.ts` — Durable Object (one per room, holds tagged WebSockets)
- `wrangler.toml` — needs real KV namespace IDs filled in before deploying
- `SignalingSocket` (`src/client/javascript/signaling/signaling-socket.ts`) replaces socket.io-client
  - Same `.send(Message)` / `.on(event, handler)` interface as Socket.IO
  - Auto-reconnect with exponential backoff (1s → 30s)
  - Message queue while connecting
- Socket.IO file transfer fallback (`SocketFileSender`) deleted — RTC-only now
- `socket.io-client` removed from client bundle (bundles shrank ~150KB each)

## Worker API
- `POST /api/room` — create room, returns `{ roomId, roomCode }`, stores in KV with 24h TTL
- `GET /api/room/:code` — lookup 6-digit code → `{ roomId }` (used by "RECEIVE FILES" dialog)
- `GET /api/room/:roomId/info` — get file list for download page initial render
- `GET /room/:roomId/ws?role=host|client` — WebSocket upgrade to Durable Object

## Durable Object protocol
- Host connects → tagged 'host', sends `{ type: 'host-ready' }`
- Client connects → tagged 'client', sends `{ type: 'joined' }` → DO relays `{ type: 'client-joined' }` to host
- Signal relay: `{ type: 'message', data: Message }` → DO relays to opposite role
- Host disconnect → DO sends `{ type: 'host-disconnected' }` to all clients

## Remaining phases
- Phase 4: Fix multi-file transfers (mux files over one DataChannel), reconnection, fflate zip
- Need to fill in real KV namespace IDs in `wrangler.toml` before deploying
- Need to set `SERVER_URL` env var in Cloudflare Pages dashboard pointing to Worker URL
