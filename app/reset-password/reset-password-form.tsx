"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { AuthFormState } from "../login/actions";
import { resetPasswordRequest } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function fieldError(
  fieldErrors: Record<string, string[]> | undefined,
  key: string,
) {
  return fieldErrors?.[key]?.[0];
}

type ResetPasswordFormProps = {
  initialToken: string;
  initialEmail: string;
};

export function ResetPasswordForm({
  initialToken,
  initialEmail,
}: ResetPasswordFormProps) {
  const router = useRouter();
  const [state, setState] = useState<AuthFormState>({});
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const token = String(fd.get("token") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    const password_confirmation = String(
      fd.get("password_confirmation") ?? "",
    ).trim();

    if (!token || !email || !password || !password_confirmation) {
      setState({ error: "All fields are required." });
      return;
    }

    if (password !== password_confirmation) {
      setState({ error: "Password and confirmation do not match." });
      return;
    }

    startTransition(async () => {
      setState({});
      const result = await resetPasswordRequest({
        token,
        email,
        password,
        password_confirmation,
      });
      if (!result.ok) {
        setState({
          error: result.message,
          fieldErrors: result.fieldErrors,
        });
        return;
      }

      router.push("/login?reset=success");
      router.refresh();
    });
  }

  if (!initialToken || !initialEmail) {
    return (
      <div className="flex w-full max-w-sm flex-col gap-4 text-center">
        <p
          className="rounded-2xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          This reset link is invalid or incomplete. Request a new link from the
          forgot password page.
        </p>
        <Link
          className="text-sm font-medium text-foreground underline underline-offset-4"
          href="/forgot-password"
        >
          Forgot password
        </Link>
      </div>
    );
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
      <input type="hidden" name="token" value={initialToken} />
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={initialEmail}
          required
          readOnly
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
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-sm font-medium text-foreground"
        >
          New password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          disabled={pending}
          className={cn(
            fieldError(state.fieldErrors, "password") && "aria-invalid",
          )}
          aria-invalid={Boolean(fieldError(state.fieldErrors, "password"))}
        />
        {fieldError(state.fieldErrors, "password") ? (
          <p className="text-xs text-destructive">
            {fieldError(state.fieldErrors, "password")}
          </p>
        ) : null}
      </div>
      <div className="space-y-2">
        <label
          htmlFor="password_confirmation"
          className="text-sm font-medium text-foreground"
        >
          Confirm new password
        </label>
        <Input
          id="password_confirmation"
          name="password_confirmation"
          type="password"
          autoComplete="new-password"
          required
          disabled={pending}
          className={cn(
            fieldError(state.fieldErrors, "password_confirmation") &&
              "aria-invalid",
          )}
          aria-invalid={Boolean(
            fieldError(state.fieldErrors, "password_confirmation"),
          )}
        />
        {fieldError(state.fieldErrors, "password_confirmation") ? (
          <p className="text-xs text-destructive">
            {fieldError(state.fieldErrors, "password_confirmation")}
          </p>
        ) : null}
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Resetting password…" : "Reset password"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        <Link
          className="font-medium text-foreground underline underline-offset-4"
          href="/login"
        >
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
