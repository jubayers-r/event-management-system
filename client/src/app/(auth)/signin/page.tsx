"use client";


import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { loginFormSchema } from "@/lib/zod/AuthForm";
import { useAuth } from "@/hooks/useAuth";


export default function Signin() {
  const { signIn } = useAuth();
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof loginFormSchema>) {
    try {
      await signIn({
        email: data.email,
        password: data.password,
      });
      toast.success("Login form submitted", {
        description: (
          <pre className="mt-2 rounded-md bg-zinc-900 p-3 text-xs text-white">
            {JSON.stringify(data, null, 2)}
          </pre>
        ),
        position: "bottom-right",
      });
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  }

  return (
    <div>
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Cannot wait to get you in, login in asap
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="login-form">Email</FieldLabel>
                    <Input
                      {...field}
                      name="email"
                      id="login-form-title"
                      aria-invalid={fieldState.invalid}
                      placeholder="Input Email"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="login-form">passoword</FieldLabel>
                    <Input
                      {...field}
                      name="password"
                      id="login-form-password"
                      type="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="Input Password 6 char"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Field orientation="horizontal">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button
              type="submit"
              form="login-form"
              onClick={() => {
                console.log("values", form.getValues());
                console.log("errors", form.formState.errors);
              }}
            >
              Submit
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}
