"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import LogoutButton from "./LogoutButton";
import AuthButtons from "./AuthButtons";

const MENU = [
  { title: "Events", href: "/events" },
  { title: "My Events", href: "/my-events" },
  { title: "Manage Events", href: "/managed-events" },
];

export default function NavbarClient({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-lg font-semibold">
          Eventify
        </Link>

        {/* Desktop */}
        <nav className="hidden items-center gap-6 lg:flex">
          {MENU.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {item.title}
            </Link>
          ))}

          {isLoggedIn ? <LogoutButton /> : <AuthButtons />}
        </nav>

        {/* Mobile */}
        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button size="icon" variant="outline">
              <Menu className="size-4" />
            </Button>
          </SheetTrigger>

          <SheetContent>
            <nav className="mt-8 flex flex-col gap-4">
              {MENU.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium"
                >
                  {item.title}
                </Link>
              ))}

              <div className="mt-4">
                {isLoggedIn ? <LogoutButton /> : <AuthButtons vertical />}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
