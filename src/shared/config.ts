const isLocalhost = typeof window !== "undefined" && window.location.hostname === "localhost";

export const API_BASE = isLocalhost
  ? "http://localhost:1337/api"
  : "https://api-rs.dexcelerate.com";

export const WS_BASE = isLocalhost
  ? "ws://localhost:1337/ws"
  : "wss://api-rs.dexcelerate.com/ws";
  
export const API_URL =
  import.meta.env.VITE_API_URL ?? 'https://api-rs.dexcelerate.com';

export const WS_URL =
  import.meta.env.VITE_WS_URL ?? 'wss://api-rs.dexcelerate.com/ws';