import { WS_URL } from "@shared/config";

type Listener = (msg: any) => void

class WSBus {
  private ws?: WebSocket;
  private url = WS_URL; // 'ws://localhost:1337/ws';
  private queue: any[] = [];
  private listeners = new Set<Listener>();
  private reconnectTimer?: number;

  connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) return;
    this.ws = new WebSocket(this.url);
    this.ws.onopen = () => {
      for (const msg of this.queue) this.ws!.send(JSON.stringify(msg));
      this.queue = [];
    };
    this.ws.onmessage = (e) => {
      const parsed = JSON.parse(e.data);
      this.listeners.forEach(l => l(parsed));
    };
    this.ws.onclose = (ev) => {
      console.warn('[WS CLOSE]', { code: ev.code, reason: ev.reason, wasClean: ev.wasClean });
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = window.setTimeout(() => this.connect(), 1000);
    };
    this.ws.onerror = (e) => {
      console.error('[WS ERROR]', e);
      this.ws?.close();
    };
  }

  send(msg: any) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.queue.push(msg);
      this.connect();
    } else {
      this.ws.send(JSON.stringify(msg));
    }
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    this.connect();
    return () => this.listeners.delete(listener);
  }
}

export const wsBus = new WSBus();
