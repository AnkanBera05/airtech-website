import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, NextRequest, NextFetchEvent } from "next/server";

const hasClerkKeys = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("placeholder")
);

const isPublicRoute = createRouteMatcher([
  "/",
  "/about",
  "/services(.*)",
  "/projects(.*)",
  "/leadership",
  "/careers(.*)",
  "/contact(.*)",
  "/portal-access",
  "/owner/login(.*)",
  "/employee/login(.*)",
  "/client/login(.*)",
  "/register(.*)",
  "/api/auth(.*)",
  "/api/contact",
  "/api/careers",
  "/api/payments/webhook",
  "/sitemap.xml",
  "/robots.txt",
]);

// Lazy Clerk handler that only runs when Clerk keys are configured
const clerkAuthHandler = hasClerkKeys
  ? clerkMiddleware(async (auth, request) => {
      if (!isPublicRoute(request)) {
        await auth.protect();
      }
    })
  : null;

export default function middleware(request: NextRequest, event: NextFetchEvent) {
  if (!clerkAuthHandler) {
    return NextResponse.next();
  }
  return clerkAuthHandler(request, event);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
