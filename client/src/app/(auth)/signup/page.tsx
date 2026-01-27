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

import { signinFormSchema } from "@/lib/zod/AuthForm";
import { useAuth } from "@/hooks/useAuth";


export default function Signup() {
  const { signUp } = useAuth();
  const form = useForm<z.infer<typeof signinFormSchema>>({
    resolver: zodResolver(signinFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof signinFormSchema>) {
    try {
      await signUp({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      toast.success("Registration form submitted", {
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
          <CardTitle>Registration</CardTitle>
          <CardDescription>
            So that you can do whatever you want
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="registration-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="registration-form">Name</FieldLabel>
                    <Input
                      {...field}
                      name="name"
                      id="registration-form-title"
                      aria-invalid={fieldState.invalid}
                      placeholder="Input Name"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="registration-form">Email</FieldLabel>
                    <Input
                      {...field}
                      name="email"
                      id="registration-form-title"
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
                    <FieldLabel htmlFor="registration-form">
                      passoword
                    </FieldLabel>
                    <Input
                      {...field}
                      name="password"
                      id="registration-form-password"
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
              form="registration-form"
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
