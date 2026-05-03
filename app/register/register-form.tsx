"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { establishSessionCookiesAction } from "../login/session-actions";
import type { AuthFormState } from "../login/actions";
import { registerRequest } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function fieldError(
  fieldErrors: Record<string, string[]> | undefined,
  key: string
) {
  return fieldErrors?.[key]?.[0];
}

export function RegisterForm() {
  const router = useRouter();
  const [state, setState] = useState<AuthFormState>({});
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    const confirm_password = String(fd.get("confirm_password") ?? "");

    if (!name || !email || !password || !confirm_password) {
      setState({ error: "All fields are required." });
      return;
    }

    if (password !== confirm_password) {
      setState({ error: "Password and confirmation do not match." });
      return;
    }

    startTransition(async () => {
      setState({});
      const result = await registerRequest({
        name,
        email,
        password,
        confirm_password,
      });
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
        nameFallback: name,
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
        <label htmlFor="name" className="text-sm font-medium text-foreground">
          Name
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          disabled={pending}
          className={cn(fieldError(state.fieldErrors, "name") && "aria-invalid")}
          aria-invalid={Boolean(fieldError(state.fieldErrors, "name"))}
        />
        {fieldError(state.fieldErrors, "name") ? (
          <p className="text-xs text-destructive">{fieldError(state.fieldErrors, "name")}</p>
        ) : null}
      </div>
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
          autoComplete="new-password"
          required
          disabled={pending}
          className={cn(fieldError(state.fieldErrors, "password") && "aria-invalid")}
          aria-invalid={Boolean(fieldError(state.fieldErrors, "password"))}
        />
        {fieldError(state.fieldErrors, "password") ? (
          <p className="text-xs text-destructive">{fieldError(state.fieldErrors, "password")}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <label htmlFor="confirm_password" className="text-sm font-medium text-foreground">
          Confirm password
        </label>
        <Input
          id="confirm_password"
          name="confirm_password"
          type="password"
          autoComplete="new-password"
          required
          disabled={pending}
          className={cn(
            fieldError(state.fieldErrors, "confirm_password") && "aria-invalid"
          )}
          aria-invalid={Boolean(fieldError(state.fieldErrors, "confirm_password"))}
        />
        {fieldError(state.fieldErrors, "confirm_password") ? (
          <p className="text-xs text-destructive">
            {fieldError(state.fieldErrors, "confirm_password")}
          </p>
        ) : null}
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Creating account…" : "Create account"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link className="font-medium text-foreground underline underline-offset-4" href="/login">
          Sign in
        </Link>
      </p>
    </form>
  );
}
