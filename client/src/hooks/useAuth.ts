type LoginPayload = {
  email: string;
  password: string;
};

type SignUpPayload = LoginPayload & {
  name: string;
};

import { useRouter } from "next/navigation";

export const useAuth = () => {
  const router = useRouter();

  const signUp = async (payload: SignUpPayload) => {
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
    router.push("/signin");
  };

  const signIn = async (payload: LoginPayload) => {
    const res = await fetch("http://localhost:5000/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Login failed");
    }
    router.push("/events");
  };

  return {signUp, signIn}
};