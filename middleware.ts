import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/quiz(.*)", "/slides(.*)"]);

export default clerkMiddleware((auth, req) => {
  // if (isProtectedRoute(req)) auth().protect();
  const ip = req.ip ?? "127.0.0.1";
  console.log(`[${new Date().toISOString()}] ${ip}`);
});
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
