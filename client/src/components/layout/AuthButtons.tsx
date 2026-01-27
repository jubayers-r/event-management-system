import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthButtons({ vertical }: { vertical?: boolean }) {
  return (
    <div className={`flex gap-2 ${vertical ? "flex-col" : ""}`}>
      <Button asChild variant="outline" size="sm">
        <Link href="/signin">Login</Link>
      </Button>
      <Button asChild size="sm">
        <Link href="/signup">Sign up</Link>
      </Button>
    </div>
  );
}
