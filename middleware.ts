import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { hasSession } from "@/lib/auth/guard-edge";

export function middleware(request: NextRequest) {
  // if (!hasSession(request)) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
