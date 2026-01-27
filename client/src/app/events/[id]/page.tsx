import { Product } from "@/components/layout/ProductList";
import ProductDetail from "@/components/layout/ProductDetail";

export default async function Event({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;


  const res = await fetch(`http://localhost:5000/api/event/${id}`);


  if (!res.ok) {
    throw new Error("Failed to fetch event");
  }

  const result: { data: Product } = await res.json();

  return (
    <div>
      <ProductDetail product={result.data} />
    </div>
  );
}
