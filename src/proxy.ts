import { auth } from "@/auth";

export const proxy = auth((request) => {
  const isAdmin = request.auth?.user?.role === "ADMIN";

  if (!isAdmin) {
    const loginUrl = new URL("/login", request.nextUrl.origin);

    loginUrl.searchParams.set(
      "callbackUrl",
      request.nextUrl.pathname,
    );

    return Response.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};