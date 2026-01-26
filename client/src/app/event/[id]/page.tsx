import { ProductListProps } from "@/components/layout/product-list1";
import ProductDetail from "@/components/layout/product-detail1";

export default async function Event({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  console.log(id);

  const res = await fetch(`http://localhost:5000/api/event/${id}`);

  console.log(res);

  if (!res.ok) {
    throw new Error("Failed to fetch event");
  }

  const result: { data: ProductListProps } = await res.json();

  return (
    <div>
      <ProductDetail product={result.data} />
    </div>
  );
}
