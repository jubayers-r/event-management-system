"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface Signup1Props {
  heading?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title?: string;
  };
  buttonText?: string;
  signupText?: string;
  signupUrl?: string;
  className?: string;
}

const Signup1 = ({
  heading = "Signup",
  logo = {
    url: "https://www.shadcnblocks.com",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-wordmark.svg",
    alt: "logo",
    title: "shadcnblocks.com",
  },
  buttonText = "Create Account",
  signupText = "Already a user?",
  signupUrl = "/login",
  className,
}: Signup1Props) => {
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await signup({ name, email, password });
      // Move navigation INSIDE the try block so it only happens on success
      router.push("/login");
      alert("account creation successful");
    } catch (err: any) {
      alert(err.message || "An error occurred during signup");
    }
  };

  return (
    <section className={cn("py-32", className)}>
      <div className="container flex flex-col items-center gap-10">
        <Link href={logo.url} className="flex items-center gap-2">
          <img src={logo.src} className="h-8" alt={logo.alt} />
          <span className="text-xl font-bold">{logo.title}</span>
        </Link>
        <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 shadow-sm">
          <h1 className="mb-6 text-2xl font-semibold tracking-tight">
            {heading}
          </h1>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Input name="name" placeholder="Full Name" required />
            </div>
            <div className="grid gap-2">
              <Input name="email" type="email" placeholder="Email" required />
            </div>
            <div className="grid gap-2">
              <Input
                name="password"
                type="password"
                placeholder="Password"
                required
              />
            </div>
            <div className="grid gap-2">
              <Input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              {buttonText}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            {signupText}{" "}
            <Link
              href={signupUrl}
              className="text-primary underline underline-offset-4"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup1;
