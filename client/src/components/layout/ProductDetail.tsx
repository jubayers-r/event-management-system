import Image from "next/image";
import { CircleCheck } from "lucide-react";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "./ProductList";

function Price({
  value,
  currency = "USD",
}: {
  value: number;
  currency?: string;
}) {
  return (
    <p className="text-3xl font-bold text-primary">
      {new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
      }).format(value)}
    </p>
  );
}

export default function ProductDetail({ product }: { product: Product }) {
  return (
    <section className="py-24">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Image */}
          <AspectRatio className="overflow-hidden rounded-xl border">
            <Image
              src={
                "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/joshua-diaz-ETNoDLl8yFE-unsplash-1.jpg"
              }
              alt={product.name}
              fill
              priority
              className="object-cover"
              unoptimized
            />
          </AspectRatio>

          {/* Details */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold">{product.name}</h1>

            <Badge variant="secondary" className="w-fit">
              <CircleCheck className="mr-1 size-4" />
              {product.status}
            </Badge>

            <Price value={product.joining_fee} />

            {product.description && (
              <p className="text-muted-foreground">{product.description}</p>
            )}

            <ul className="space-y-2 text-lg">
              <li>
                <span className="font-medium">Location:</span>{" "}
                {product.location}
              </li>
              <li>
                <span className="font-medium">Date:</span>{" "}
                {new Date(product.date_time).toLocaleString()}
              </li>
              <li>
                <span className="font-medium">Capacity:</span>{" "}
                {product.people_capacity} people
              </li>
              {product.category && (
                <li>
                  <span className="font-medium">Category:</span>{" "}
                  {product.category}
                </li>
              )}
            </ul>

            <Button size="lg" className="w-full">
              Join Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
