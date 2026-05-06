import { LoginForm } from "../../../features/auth/components/login-form";

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 p-8">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-sm text-muted-foreground">
          Use your PresenceHub account to open the dashboard.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
