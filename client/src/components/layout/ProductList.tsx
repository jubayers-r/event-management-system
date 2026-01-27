import { ProductCardList } from "./ProductCardList";


export interface Product {
  id: string;
  name: string;
  description: string | null;
  image: string;
  joining_fee: number;
  status: string;
}

type ProductListProps = {
  data: Product[];
};

export function ProductList({ data }: ProductListProps) {
  return (
    <section className="py-32">
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {data.map((product) => (
          <ProductCardList key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}


