import { auth } from "@/auth";
import { API_AUTH_PREFIX, LOGIN_PATH, publicRoutes } from "./routes";

export default auth(async (req) => {
  const isAuthenticated = !!req.auth;
  const isApiAuthRoute = req.nextUrl.pathname.startsWith(API_AUTH_PREFIX);
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);

  if (isApiAuthRoute) return;
  if (isAuthenticated) {
    // const user = await db.user.findMany();
    // if (!user?.emailVerified) {
    //   return Response.redirect(new URL("/auth/verify", req.nextUrl));
    // }
  } else {
    if (!isPublicRoute) {
      return Response.redirect(new URL(LOGIN_PATH, req.nextUrl));
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
