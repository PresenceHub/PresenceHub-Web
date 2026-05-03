"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { establishSessionCookiesAction } from "./session-actions";
import type { AuthFormState } from "./actions";
import { loginRequest } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function fieldError(
  fieldErrors: Record<string, string[]> | undefined,
  key: string
) {
  return fieldErrors?.[key]?.[0];
}

export function LoginForm() {
  const router = useRouter();
  const [state, setState] = useState<AuthFormState>({});
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");

    if (!email || !password) {
      setState({ error: "Email and password are required." });
      return;
    }

    startTransition(async () => {
      setState({});
      const result = await loginRequest({ email, password });
      if (!result.ok) {
        setState({
          error: result.message,
          fieldErrors: result.fieldErrors,
        });
        return;
      }

      await establishSessionCookiesAction({
        token: result.token,
        currentWorkspaceUuid: result.currentWorkspaceUuid,
        emailFallback: email,
        user: result.user,
      });
      router.push("/dashboard");
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-4"
    >
      {state.error ? (
        <p
          className="rounded-2xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={pending}
          className={cn(fieldError(state.fieldErrors, "email") && "aria-invalid")}
          aria-invalid={Boolean(fieldError(state.fieldErrors, "email"))}
        />
        {fieldError(state.fieldErrors, "email") ? (
          <p className="text-xs text-destructive">{fieldError(state.fieldErrors, "email")}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={pending}
          className={cn(fieldError(state.fieldErrors, "password") && "aria-invalid")}
          aria-invalid={Boolean(fieldError(state.fieldErrors, "password"))}
        />
        {fieldError(state.fieldErrors, "password") ? (
          <p className="text-xs text-destructive">{fieldError(state.fieldErrors, "password")}</p>
        ) : null}
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        No account?{" "}
        <Link className="font-medium text-foreground underline underline-offset-4" href="/register">
          Register
        </Link>
      </p>
    </form>
  );
}
