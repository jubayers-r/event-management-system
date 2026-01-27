"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import Link from "next/link";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("http://localhost:5000/api/auth/signout", {
      method: "POST",
      credentials: "include",
    });

    // 🔥 THIS IS THE KEY
    router.replace("/signin");
    router.refresh(); // re-render Server Components
  }

  return (
    <>
      <Link href={"/events/create"}>
        <CirclePlus />
      </Link>
      <Button onClick={handleLogout}>Logout</Button>
    </>
  );
}
