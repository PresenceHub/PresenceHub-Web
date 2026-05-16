import { AppShell } from "@/components/layout/app-shell";
import { listPlatforms } from "@/lib/api/platforms";
import { getAuthCookiesForApi, requireAuth } from "@/lib/auth/session";
import type { AuthSession } from "@/lib/auth/types";

function sidebarUserFromSession(session: AuthSession) {
  const email = session.user.email?.trim() ?? "";
  const name = session.user.name?.trim() ?? "";
  const displayName = name || email || "Account";
  return { displayName, email };
}

export default async function DashboardGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requireAuth();
  const user = sidebarUserFromSession(session);
  const credentials = await getAuthCookiesForApi();
  const platforms = credentials
    ? await listPlatforms(credentials.token, credentials.workspaceUuid)
    : [];

  return (
    <AppShell
      sidebar={{
        user,
        platforms,
      }}
    >
      {children}
    </AppShell>
  );
}
