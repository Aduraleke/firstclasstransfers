import { publicFetch } from "../client"

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  isSuperuser: boolean
  message: string
  permissions: string[]
  tokens: {
    access: string
    refresh: string
  }
}


export async function loginAdmin(
  payload: LoginPayload,
): Promise<LoginResponse> {
  return publicFetch<LoginResponse>("/account/login/", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}
