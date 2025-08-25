export const API_BASE = 'http://localhost:1337/api';
export const WS_BASE = "ws://localhost:1337/ws";

export const API_URL =
  import.meta.env.VITE_API_URL ?? 'https://api-rs.dexcelerate.com';

export const WS_URL =
  import.meta.env.VITE_WS_URL ?? 'wss://api-rs.dexcelerate.com/ws';