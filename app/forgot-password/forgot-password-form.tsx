"use client";

import { useState, useTransition } from "react";
import Link from "next/link";

import type { AuthFormState } from "../login/actions";
import { forgotPasswordRequest } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function fieldError(
  fieldErrors: Record<string, string[]> | undefined,
  key: string,
) {
  return fieldErrors?.[key]?.[0];
}

export function ForgotPasswordForm() {
  const [state, setState] = useState<AuthFormState & { success?: string }>({});
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const email = String(fd.get("email") ?? "").trim();

    if (!email) {
      setState({ error: "Email is required." });
      return;
    }

    startTransition(async () => {
      setState({});
      const result = await forgotPasswordRequest(email);
      if (!result.ok) {
        setState({
          error: result.message,
          fieldErrors: result.fieldErrors,
        });
        return;
      }

      setState({
        success: result.message,
      });
      form.reset();
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
      {state.success ? (
        <p
          className="rounded-2xl border border-border bg-muted/40 px-3 py-2 text-sm text-foreground"
          role="status"
        >
          {state.success}
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
          className={cn(
            fieldError(state.fieldErrors, "email") && "aria-invalid",
          )}
          aria-invalid={Boolean(fieldError(state.fieldErrors, "email"))}
        />
        {fieldError(state.fieldErrors, "email") ? (
          <p className="text-xs text-destructive">
            {fieldError(state.fieldErrors, "email")}
          </p>
        ) : null}
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Sending link…" : "Send reset link"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link
          className="font-medium text-foreground underline underline-offset-4"
          href="/login"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
