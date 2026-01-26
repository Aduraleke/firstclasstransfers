const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!BASE_URL) {
  throw new Error("API base URL is not defined")
}

export async function publicFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  })

  let data: unknown = null

  try {
    data = await res.json()
  } catch {
    // response has no JSON body
  }

  if (!res.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof (data as { message: string }).message === "string"
        ? (data as { message: string }).message
        : typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof (data as { error: string }).error === "string"
        ? (data as { error: string }).error
        : res.status === 401
        ? "The email or password you entered is incorrect."
        : "Unable to complete the request. Please try again."

    throw new Error(message)
  }

  return data as T
}
