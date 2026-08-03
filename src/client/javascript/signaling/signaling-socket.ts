type Listener = (data: unknown) => void;

export class SignalingSocket {
  private ws: WebSocket | null = null;
  private url: string;
  private listeners = new Map<string, Listener[]>();
  private queue: string[] = [];
  private reconnectDelay = 1000;
  private closed = false;

  constructor(url: string) {
    this.url = this.toAbsoluteWsUrl(url);
    this.connect();
  }

  // Drop-in for socket.send(Message) — wraps in {type:'message', data:...}
  send(message: unknown): void {
    this.transmit(JSON.stringify({ type: 'message', data: message }));
  }

  // Send a control message (join, host-ready, etc.)
  sendControl(type: string, data?: unknown): void {
    this.transmit(JSON.stringify({ type, ...(data !== undefined ? { data } : {}) }));
  }

  on(type: string, handler: Listener): void {
    if (!this.listeners.has(type)) this.listeners.set(type, []);
    this.listeners.get(type)!.push(handler);
  }

  off(type: string, handler: Listener): void {
    const handlers = this.listeners.get(type);
    if (handlers) this.listeners.set(type, handlers.filter(h => h !== handler));
  }

  close(): void {
    this.closed = true;
    this.ws?.close(1000, 'closed');
  }

  private connect(): void {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.reconnectDelay = 1000;
      this.queue.forEach(msg => this.ws!.send(msg));
      this.queue = [];
      this.emit('connect', null);
    };

    this.ws.onmessage = (event: MessageEvent) => {
      let msg: { type?: string; data?: unknown };
      try {
        msg = JSON.parse(event.data as string);
      } catch {
        return;
      }
      if (msg.type) this.emit(msg.type, msg.data);
    };

    this.ws.onclose = (event: CloseEvent) => {
      if (!this.closed) {
        this.emit('disconnect', event.reason);
        setTimeout(() => this.connect(), this.reconnectDelay);
        this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000);
      }
    };

    this.ws.onerror = () => {
      this.emit('error', 'WebSocket error');
    };
  }

  private transmit(data: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    } else {
      this.queue.push(data);
    }
  }

  private emit(type: string, data: unknown): void {
    (this.listeners.get(type) ?? []).forEach(h => h(data));
  }

  private toAbsoluteWsUrl(url: string): string {
    if (url.startsWith('ws://') || url.startsWith('wss://')) return url;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url.replace(/^http/, 'ws');
    }
    // Relative path or empty — resolve against current page origin
    const origin = window.location.origin.replace(/^http/, 'ws');
    return origin + (url.startsWith('/') ? url : `/${url}`);
  }
}
