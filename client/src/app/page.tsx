// app/dashboard/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const token = (await cookies()).get("token");




  console.log(token);

  if (!token) {
    redirect("/signin");
  }
  return (
  <div>Dashboard


  </div>
  );
}
