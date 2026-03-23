import { auth } from "@/auth";
import { NextResponse } from "next/server";

const ADMIN = "ADMIN" as const;

export default auth((req) => {
  const path = req.nextUrl.pathname;

  if (path.startsWith("/dashboard") && !req.auth) {
    const login = new URL("/login", req.nextUrl.origin);
    login.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(login);
  }

  if (path.startsWith("/admin")) {
    if (!req.auth) {
      const login = new URL("/login", req.nextUrl.origin);
      login.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(login);
    }
    const role = req.auth.user?.role;
    if (role !== ADMIN) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
