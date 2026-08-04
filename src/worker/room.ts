import type { Env } from './index';

interface RoomInfo {
  files: FileDescription[];
  roomCode: string;
}

interface FileDescription {
  fileName: string;
  fileSize: number;
  fileType: string;
}

export class Room {
  constructor(private state: DurableObjectState, private env: Env) {}

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const role = url.searchParams.get('role');

    if (request.headers.get('Upgrade') !== 'websocket') {
      return new Response('Expected WebSocket upgrade', { status: 426 });
    }

    if (role !== 'host' && role !== 'client') {
      return new Response('Missing or invalid role param', { status: 400 });
    }

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);

    server.serializeAttachment({ role });
    this.state.acceptWebSocket(server, [role]);

    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer): Promise<void> {
    if (typeof message !== 'string') return;

    let msg: { type: string; id?: string; data?: unknown };
    try {
      msg = JSON.parse(message);
    } catch {
      return;
    }

    const { role: myRole } = ws.deserializeAttachment() as { role: 'host' | 'client' };

    switch (msg.type) {
      case 'host-ready': {
        // Host signals it's ready — no-op, presence via WS tag is enough
        break;
      }

      case 'joined': {
        // Client notifying room it has connected — relay to host(s)
        for (const host of this.state.getWebSockets('host')) {
          host.send(JSON.stringify({ type: 'client-joined' }));
        }
        break;
      }

      case 'message': {
        // WebRTC signal relay — forward to all WebSockets with the opposite role
        const targetRole = myRole === 'host' ? 'client' : 'host';
        for (const target of this.state.getWebSockets(targetRole)) {
          target.send(message);
        }
        break;
      }
    }
  }

  async webSocketClose(ws: WebSocket): Promise<void> {
    const { role } = ws.deserializeAttachment() as { role: 'host' | 'client' };

    if (role === 'host') {
      for (const client of this.state.getWebSockets('client')) {
        client.send(JSON.stringify({ type: 'host-disconnected' }));
      }
    }
  }

  async webSocketError(ws: WebSocket, error: unknown): Promise<void> {
    console.error('Room WebSocket error:', error);
  }
}
