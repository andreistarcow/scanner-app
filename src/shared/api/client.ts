import { API_BASE } from "../config";

export type HttpResult<T> = { ok: true; data: T } | { ok: false; error: Error }

export async function httpGet<T>(path: string, params?: Record<string, any>): Promise<HttpResult<T>> {
  try {
    const qs = params ? '?' + new URLSearchParams(
      Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => [k, String(v)])
    ).toString() : '';
    const res = await fetch(`${API_BASE}${path}${qs}`);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const json = await res.json();
    return { ok: true, data: json as T };
  } catch (e) {
    return { ok: false, error: e as Error };
  }
}
