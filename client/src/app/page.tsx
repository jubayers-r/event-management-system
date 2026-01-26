// app/dashboard/page.tsx
import LogoutButton from "@/components/LogoutButton";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const token = (await cookies()).get("token");


  console.log(token);

  if (!token) {
    redirect("/login");
  }
  return (
  <div>Dashboard


  </div>
  );
}
