const API_BASE = import.meta.env.VITE_API_URL || "";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown,
  options?: { headers?: Record<string, string> }
): Promise<Response> {
  const headers: Record<string, string> = { ...options?.headers };

  if (data) {
    headers["Content-Type"] = "application/json";
  }

  if (url.startsWith("/api/admin")) {
    const apiKey = localStorage.getItem("admin_api_key");
    if (apiKey) {
      headers["X-API-Key"] = apiKey;
    }
  }

  const res = await fetch(`${API_BASE}${url}`, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  await throwIfResNotOk(res);
  return res;
}

export type QueryFunction<T> = (context: { queryKey: string[] }) => Promise<T>;

export function getQueryFn<T>({ on401 }: { on401: "returnNull" | "throw" }): QueryFunction<T> {
  return async ({ queryKey }) => {
    const headers: Record<string, string> = {};
    const url = queryKey[0] as string;

    if (url.startsWith("/api/admin")) {
      const apiKey = localStorage.getItem("admin_api_key");
      if (apiKey) {
        headers["X-API-Key"] = apiKey;
      }
    }

    const res = await fetch(`${API_BASE}${url}`, { headers });

    if (on401 === "returnNull" && res.status === 401) {
      return null as T;
    }

    await throwIfResNotOk(res);
    return await res.json() as T;
  };
}
