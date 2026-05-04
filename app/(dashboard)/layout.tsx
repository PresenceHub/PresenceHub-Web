import { AppShell } from "@/components/layout/app-shell";
import { requireAuth } from "@/lib/auth/session";

export default async function DashboardGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAuth();
  return <AppShell>{children}</AppShell>;
}
