



function extractErrorMessages(
  value: unknown,
  path = "",
): string[] {
  if (typeof value === "string") {
    return [path ? `${path}: ${value}` : value];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) =>
      extractErrorMessages(item, path),
    );
  }

  if (typeof value === "object" && value !== null) {
    return Object.entries(value).flatMap(([key, val]) =>
      extractErrorMessages(
        val,
        path ? `${path}.${key}` : key,
      ),
    );
  }

  return [];
}

export async function authFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token =
    localStorage.getItem("driver_token") ??
    localStorage.getItem("admin_token");

  if (!token) {
    throw new Error("Not authenticated");
  }
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  let data: unknown = null;

  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    if (data && typeof data === "object") {
      const messages = extractErrorMessages(data);
      if (messages.length) {
        throw new Error(messages.join("\n"));
      }
    }
    throw new Error("Unable to complete request.");
  }

  return data as T;
}
