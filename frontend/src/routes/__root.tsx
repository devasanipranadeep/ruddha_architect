import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Cursor } from "@/components/common/cursor";
import { Loader } from "@/components/common/loader";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="font-display text-[14vw] leading-none text-gradient-gold">404</div>
      <h2 className="mt-4 font-display text-3xl">This page exists only in concept.</h2>
      <p className="mt-2 text-sm text-muted-foreground max-w-md">
        The route you tried to reach was never built — or has been refactored into something quieter.
      </p>
      <a
        href="/"
        className="mt-10 inline-flex border border-gold px-8 py-3 text-[11px] uppercase tracking-wider-2 text-gold hover:bg-gold hover:text-primary-foreground transition-colors"
      >
        Return home
      </a>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
      <div>
        <div className="font-display text-5xl text-gradient-gold">Something is off.</div>
        <p className="mt-3 text-sm text-muted-foreground">A quiet error interrupted the load.</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-8 border border-gold px-6 py-3 text-[11px] uppercase tracking-wider-2 text-gold hover:bg-gold hover:text-primary-foreground transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Ruddhaa Architects & Interiors — Architecture of stillness" },
      {
        name: "description",
        content:
          "Ruddhaa Architects & Interiors crafts cinematic residential, commercial and landscape spaces where light, material and stillness become architecture.",
      },
      { property: "og:title", content: "Ruddhaa Architects & Interiors" },
      { property: "og:description", content: "Architecture of stillness. Interiors of intent." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#0A0A0A" },
    ],
    links: [
      { rel: "icon", href: "/LOGO.jpg", type: "image/jpeg" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  const isAdminRoute = router.state.location.pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <Loader />
      <Cursor />
      {!isAdminRoute && <Navbar />}
      <main className="min-h-screen">
        <Outlet />
      </main>
      {!isAdminRoute && <Footer />}
    </QueryClientProvider>
  );
}
