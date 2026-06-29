import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const password = req.cookies.get("admin_password")?.value;
  const correctPassword = process.env.ADMIN_PASSWORD;

  if (req.nextUrl.pathname.startsWith("/admin/orders")) {
    if (!password || password !== correctPassword) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/orders/:path*"],
};