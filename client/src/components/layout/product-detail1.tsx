"use client";

import { CircleCheck } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";

import { ProductListProps } from "./product-list1";

interface PriceProps {
  value: number;
  currency?: string;
}

const Price = ({ value, currency = "USD" }: PriceProps) => {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);

  return <p className="text-3xl font-bold text-primary">{formatted}</p>;
};

interface ProductDetailProps {
  product: ProductListProps;
}

const ProductDetail = ({ product }: ProductDetailProps) => {
  return (
    <section className="py-24">
      <div className="container">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 justify-center lg:items-center">
          {/* IMAGE */}
          <AspectRatio ratio={1} className="overflow-hidden rounded-xl border">
            <Image
              unoptimized
              width={750}
              height={750}
              src={
                "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/joshua-diaz-ETNoDLl8yFE-unsplash-1.jpg"
              }
              alt={product.name}
              className="object-cover"
              priority
            />
          </AspectRatio>

          {/* INFO */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold">{product.name}</h1>

            <Badge variant="secondary" className="w-fit">
              <CircleCheck className="mr-1 size-4" />
              {product.status}
            </Badge>

            <Price value={product.joining_fee} currency="USD" />

            {product.description && (
              <p className="text-muted-foreground">{product.description}</p>
            )}

            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Location:</span>{" "}
                {product.location}
              </p>
              <p>
                <span className="font-medium">Date:</span>{" "}
                {new Date(product.date_time).toLocaleString()}
              </p>
              <p>
                <span className="font-medium">Capacity:</span>{" "}
                {product.people_capacity} people
              </p>
              {product.category && (
                <p>
                  <span className="font-medium">Category:</span>{" "}
                  {product.category}
                </p>
              )}
            </div>

            <Button size="lg" className="w-full">
              Join Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
