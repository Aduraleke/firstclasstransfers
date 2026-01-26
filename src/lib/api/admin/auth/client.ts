const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!BASE_URL) {
  throw new Error("API base URL is not defined")
}

export async function authFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem("admin_token")

  if (!token) {
    throw new Error("Not authenticated")
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  })

  let data: unknown = null
  try {
    data = await res.json()
  } catch {}

  if (!res.ok) {
  if (typeof data === "object" && data !== null) {
    // Convert DRF error object to readable string
    const messages = Object.entries(data)
      .map(([field, errors]) =>
        Array.isArray(errors)
          ? `${field}: ${errors.join(", ")}`
          : `${field}: ${String(errors)}`
      )
      .join("\n")

    throw new Error(messages)
  }

  throw new Error("Unable to complete request.")
}


  return data as T
}
