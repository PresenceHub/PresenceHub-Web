import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 p-8">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Register to plan and publish your social presence.
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
