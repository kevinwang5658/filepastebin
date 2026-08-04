import { Room } from './room';

export { Room };

export interface Env {
  ROOMS_KV: KVNamespace;
  ROOM: DurableObjectNamespace;
  TURN_KEY_ID: string;
  TURN_KEY_API_TOKEN: string;
}

interface FileDescription {
  fileName: string;
  fileSize: number;
  fileType: string;
}

interface RoomInfo {
  files: FileDescription[];
  roomCode: string;
}

interface IceServer {
  urls: string | string[];
  username?: string;
  credential?: string;
}

async function getTurnIceServers(env: Env): Promise<IceServer[]> {
  if (!env.TURN_KEY_ID || !env.TURN_KEY_API_TOKEN) return [];
  try {
    const res = await fetch(
      `https://rtc.live.cloudflare.com/v1/turn/keys/${env.TURN_KEY_ID}/credentials/generate`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.TURN_KEY_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ttl: 86400 }),
      },
    );
    if (!res.ok) return [];
    const data = await res.json<{ iceServers: IceServer }>();
    return [data.iceServers];
  } catch {
    return [];
  }
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function cors(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [k, v] of Object.entries(CORS_HEADERS)) headers.set(k, v);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

function json(data: unknown, status = 200): Response {
  return cors(new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  }));
}

function randomCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function uuid(): string {
  return crypto.randomUUID();
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // POST /api/room — create a new room
    if (url.pathname === '/api/room' && request.method === 'POST') {
      const body = await request.json<{ files: FileDescription[] }>();
      const roomId = uuid();
      const roomCode = randomCode();

      const roomInfo: RoomInfo = { files: body.files, roomCode };
      await env.ROOMS_KV.put(`room-id:${roomId}`, JSON.stringify(roomInfo), {
        expirationTtl: 86400,
      });
      await env.ROOMS_KV.put(`room-code:${roomCode}`, roomId, {
        expirationTtl: 86400,
      });

      const iceServers = await getTurnIceServers(env);
      return json({ roomId, roomCode, iceServers });
    }

    // GET /api/room/:code — look up room by 6-digit code
    const codeMatch = url.pathname.match(/^\/api\/room\/([0-9]{6})$/);
    if (codeMatch && request.method === 'GET') {
      const roomId = await env.ROOMS_KV.get(`room-code:${codeMatch[1]}`);
      if (!roomId) return json(null, 404);
      return json({ roomId });
    }

    // GET /api/room/:roomId/info — get room metadata (files list)
    const infoMatch = url.pathname.match(/^\/api\/room\/([^/]+)\/info$/);
    if (infoMatch && request.method === 'GET') {
      const roomInfo = await env.ROOMS_KV.get<RoomInfo>(`room-id:${infoMatch[1]}`, 'json');
      if (!roomInfo) return json(null, 404);
      const iceServers = await getTurnIceServers(env);
      return json({ files: roomInfo.files, iceServers });
    }

    // GET /room/:roomId/ws — WebSocket upgrade to Durable Object
    const wsMatch = url.pathname.match(/^\/room\/([^/]+)\/ws$/);
    if (wsMatch) {
      const roomId = wsMatch[1];
      const roomInfo = await env.ROOMS_KV.get(`room-id:${roomId}`);
      if (!roomInfo) {
        return cors(new Response('Room not found', { status: 404 }));
      }

      const stub = env.ROOM.get(env.ROOM.idFromName(roomId));
      return stub.fetch(request);
    }

    return cors(new Response('Not Found', { status: 404 }));
  },
};
