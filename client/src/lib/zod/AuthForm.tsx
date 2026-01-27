import z from "zod";

export const loginFormSchema = z.object({
  email: z.email({ error: "Invalid email address" }),
  password: z
    .string()
    .min(6, { error: "Password must be at least 6 characters" }),
});

export const signinFormSchema = z.object({
  name: z.string().min(1, { error: "Invalid Name" }),
  email: z.email({ error: "Invalid Email" }),
  password: z.string().min(6, { error: "passowrd must be 6 char" }),
});