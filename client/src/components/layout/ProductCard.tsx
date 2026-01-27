"use client";
import Image from "next/image";
import Link from "next/link";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Price, PriceValue } from "@/components/layout/price";
import { Product } from "./ProductList";
import { usePathname } from "next/navigation";

export function ProductCard({ product }: { product: Product }) {
  const pathname = usePathname();

  return (
    <Card className="h-full overflow-hidden py-0">
      <CardHeader className="relative p-0">
        <AspectRatio ratio={1.27}>
          <Image
            src={
              "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/joshua-diaz-ETNoDLl8yFE-unsplash-1.jpg"
            }
            alt={product.name}
            fill
            className="object-cover"
            unoptimized
          />
        </AspectRatio>

        {product.status && (
          <Badge className="absolute left-4 top-4">{product.status}</Badge>
        )}
      </CardHeader>

      <CardContent className="flex h-full flex-col gap-4 pb-6">
        <CardTitle className="text-xl">{product.name}</CardTitle>

        {product.description && (
          <CardDescription>{product.description}</CardDescription>
        )}

        <div className="mt-auto">
          <Price className="text-lg font-semibold">
            <PriceValue
              price={product.joining_fee}
              currency="USD"
              variant="regular"
            />
          </Price>
        </div>

        {pathname === "/events" ? (
          <Link href={`/events/${product.id}`}>
            <Button className="w-full">Buy Now</Button>
          </Link>
        ) : (
          <Link href={`/events/${product.id}/update`}>
            <Button className="w-full">Edit Event</Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
