import { authFetch } from "./auth/client";

/* ───────────────── TYPES ───────────────── */

export interface ActivityLogResponse {
  logs: string[];
}

/* ───────────────── API CALLS ───────────────── */

/**
 * Get system activity logs (Admin only)
 */
export async function getActivityLogs(): Promise<ActivityLogResponse> {
  const response = authFetch<ActivityLogResponse>("/control/activities/");
console.log(response)
  return response
}

/**
 * Download activity logs file (Admin only)
 */
export async function downloadActivityLogs(): Promise<void> {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!BASE_URL) {
    throw new Error("API base URL is not defined");
  }

  const token = localStorage.getItem("admin_token");

  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${BASE_URL}/control/activities/download/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to download activity logs");
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "activity-logs.txt";
  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);
}
