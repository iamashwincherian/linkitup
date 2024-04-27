import { auth } from "@/auth";
import { API_AUTH_PREFIX, publicRoutes } from "./routes";

export default auth((req) => {
  const isAuthenticated = !!req.auth;
  const isApiAuthRoute = req.nextUrl.pathname.startsWith(API_AUTH_PREFIX);
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);

  if (isApiAuthRoute) return;
  if (!isPublicRoute && !isAuthenticated) {
    return Response.redirect(new URL("/auth/login", req.nextUrl));
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
