"use server";
import { cookies } from "next/headers";

/**
 * Get access token from cookies (Server Components / Server Actions only)
 */
export async function getAccessToken() {
  return (await cookies()).get("access_token")?.value;
}

// console.log((await getAccessToken()));

/**
 * Set access token cookie
 */
export async function setAccessToken(token: string) {
  (await cookies()).set("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

/**
 * Delete access token cookie
 */
export async function deleteAccessToken() {
  (await cookies()).delete("access_token");
}
