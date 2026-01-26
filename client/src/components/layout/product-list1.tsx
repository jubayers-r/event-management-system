import { Price, PriceValue } from "@/components/layout/price";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { PreludeState } from "next/dist/server/app-render/dynamic-rendering";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

// interface ProductPrice {
//   regular: number;
//   sale?: number;
//   currency: string;
// }

// interface Product {
//   name: string;
//   image: {
//     src: string;
//     alt: string;
//   };
//   link: string;
//   description: string;
//   price: ProductPrice;
//   badge?: {
//     text: string;
//     color?: string;
//   };
// }

// type ProductCardProps = Product;

// type ProductList = Array<Product>;

// const PRODUCTS_LIST: ProductList = [
//   {
//     name: "Vexon CoreStep '08 LX",
//     image: {
//       src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/joshua-diaz-ETNoDLl8yFE-unsplash-1.jpg",
//       alt: "",
//     },
//     link: "#",
//     description:
//       "Everyday comfort meets bold tri-color style in this performance-driven design.",
//     price: {
//       regular: 499.0,
//       sale: 399.0,
//       currency: "USD",
//     },
//     badge: {
//       text: "Selling fast!",
//       color: "oklch(57.7% 0.245 27.325)",
//     },
//   },
//   {
//     name: "Urban Chill Jacket",
//     image: {
//       src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764040-2.jpg",
//       alt: "",
//     },
//     link: "#",
//     description:
//       "A denim puffer with tonal blues, perfect for layering across seasons.",
//     price: {
//       regular: 180.0,
//       currency: "USD",
//     },
//   },
//   {
//     name: "Maison Liora Bag",
//     image: {
//       src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/Woman-with-Tote-Bag-1.png",
//       alt: "",
//     },
//     link: "#",
//     description:
//       "A refined bag that easily switches from shoulder to crossbody or top-handle.",
//     price: {
//       regular: 420.0,
//       currency: "USD",
//     },
//     badge: {
//       text: "New",
//     },
//   },
//   {
//     name: "Maison Liora Bag",
//     image: {
//       src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/Woman-with-Tote-Bag-1.png",
//       alt: "",
//     },
//     link: "#",
//     description:
//       "A refined bag that easily switches from shoulder to crossbody or top-handle.",
//     price: {
//       regular: 420.0,
//       currency: "USD",
//     },
//     badge: {
//       text: "New",
//     },
//   },
//   {
//     name: "Maison Liora Bag",
//     image: {
//       src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/Woman-with-Tote-Bag-1.png",
//       alt: "",
//     },
//     link: "#",
//     description:
//       "A refined bag that easily switches from shoulder to crossbody or top-handle.",
//     price: {
//       regular: 420.0,
//       currency: "USD",
//     },
//     badge: {
//       text: "New",
//     },
//   },
// ];

export interface ProductListProps {
  id: string;
  name: string;
  date_time: string;
  location: string;
  category: string | null;
  people_capacity: number;
  description: string | null;
  image: string;
  joining_fee: number;
  status: string;
  hostId: string;
  managerId: string;
  created_at: string;
  updated_at: string;
}

// interface ProductList1Props {
//   className?: string;
// }

// type ProductListProps = {
//   data: ProductList[];
// };

const ProductList1 = ({ data }: { data: ProductListProps[] }) => {
  return (
    <section className="py-32">
      {/* <div className="container"> */}
      <div className="grid xl:grid-cols-4 gap-5 md:grid-cols-3 sm:grid-cols-2 ">
        {data?.map((item: ProductListProps, index: number) => (
          <ProductCard key={`product-list-1-card-${index}`} product={item} />
        ))}
        {/* </div> */}
      </div>
    </section>
  );
};

const ProductCard = ({ product }: { product: ProductListProps }) => {
  // const { regular, sale, currency } = product;

  return (
    // <a
    //   href="#"
    //   className="block h-full w-full max-w-md transition-opacity hover:opacity-80 "
    // >
    <Card className="h-full overflow-hidden p-0">
      <CardHeader className="relative block p-0">
        <AspectRatio ratio={1.268115942} className="overflow-hidden">
          <Image
            unoptimized
            width={800}
            height={800}
            src={
              "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/joshua-diaz-ETNoDLl8yFE-unsplash-1.jpg"
            }
            alt={product?.name}
            className="block size-full object-cover object-center"
          />
        </AspectRatio>
        {product.image && (
          <Badge
            style={{
              backgroundColor: badge.color,
            }}
            className="absolute start-4 top-4"
          >
            {badge.text}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="flex h-full flex-col gap-4 pb-6">
        <CardTitle className="text-xl font-semibold">{product.name}</CardTitle>
        <CardDescription className="font-medium text-muted-foreground">
          {product.description}
        </CardDescription>
        <div className="mt-auto">
          <Price className="text-lg font-semibold">
            {/* <PriceValue price={sale} currency={currency} variant="sale" /> */}
            <PriceValue
              price={product.joining_fee}
              currency={"USD"}
              variant="regular"
            />
          </Price>
        </div>
        <Link href={`/event/${product.id}`}>
          <Button className="w-full">Buy Now</Button>
        </Link>
      </CardContent>
    </Card>
    // </a>
  );
};

export { ProductList1 as ProductList };
