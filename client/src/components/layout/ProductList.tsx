import { ProductCard } from "./ProductCard";


export interface Product {
  id: string;
  name: string;
  description: string | null;
  image: string;
  joining_fee: number;
  status: string;
  location: string;
  date_time: string;
  people_capacity: string;
  category: string;
}

export function ProductList({ data }: { data: Product[] }) {
  return (
    <section className="py-32">
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {data.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
