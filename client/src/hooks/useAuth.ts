"use client";

import { useRouter } from "next/navigation";

type SignupPayload = {
  name?: string;
  email: string;
  password: string;
};

export const useAuth = () => {
  const router = useRouter();

  const signup = async (payload: SignupPayload) => {
    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Signup failed");
    }

    router.push("/login");
  };

  const signin = async (payload: {
    email: string;
    password: string;
  }) => {
    const res = await fetch("http://localhost:5000/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Signin failed");
    }

    router.push("/event");
  };

  return { signup, signin };
};
