"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("http://localhost:5000/api/auth/signout", {
      method: "POST",
      credentials: "include",
      cache: "no-store",
    });

    router.replace("/login"); // prevent back navigation
  }

  return (
    <form action={handleLogout}>
      <Button type="submit">Logout</Button>
    </form>
  );
}
