const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export async function apiClient(path: string, options: RequestInit = {}) {
  const isServer = typeof window === "undefined";

  let extraHeaders = {};

  if (isServer) {
    // SSR → leer cookies httpOnly desde el servidor
    const { cookies } = await import("next/headers");
    extraHeaders = {
      cookie: cookies().toString(),
    };
  }

  return fetch(`${BACKEND_URL}/api${path}`, {
    ...options,
    credentials: isServer ? undefined : "include", // solo en CSR
    headers: {
      "Content-Type": "application/json",
      ...extraHeaders,
      ...(options.headers || {}),
    },
  });
}
