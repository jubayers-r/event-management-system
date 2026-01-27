import { Product, ProductList } from "@/components/layout/ProductList";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function MyEvent() {
  const token = (await cookies()).get("access_token")?.value;

  // 🔐 Guard auth early
  if (!token) {
    return <p>Please login to see your events.</p>;
  }

  const res = await fetch("http://localhost:5000/api/event/my-events", {
    headers: {
      Authorization: `${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Fetch failed:", res.status);
    return <p>Failed to load events.</p>;
  }

  const result: { data: Product[] } = await res.json();

  if (!result.data.length) {
    return redirect("/events/create");
  }

  return (
    <div>
      <ProductList data={result.data} />
    </div>
  );
}
