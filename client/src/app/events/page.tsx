import { ProductList, ProductListProps } from "@/components/layout/ProductList";

export default async function Events() {
  const res = await fetch("http://localhost:5000/api/event");
  if (!res.ok) {
    throw new Error("Failed to fetch events");
  }

  const data: { data: ProductListProps[] } = await res.json();

  return (
    <div className="">
      <ProductList data={data.data} />
    </div>
  );
}
