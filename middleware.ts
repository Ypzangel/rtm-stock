import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host") || "";

  // Evitar interferir con previews y el dominio vercel.app
  if (host.includes("vercel.app")) {
    return NextResponse.next();
  }

  // No tocar si ya está en /dealers o /internal
  if (url.pathname.startsWith("/dealers") || url.pathname.startsWith("/internal")) {
    return NextResponse.next();
  }

  // dealers.rtmequipment.net -> /dealers
  if (host.startsWith("dealers.")) {
    url.pathname = "/dealers";
    return NextResponse.rewrite(url);
  }

  // internal.rtmequipment.net -> /internal
  if (host.startsWith("internal.")) {
    url.pathname = "/internal";
    return NextResponse.rewrite(url);
  }

  // En el dominio raíz no redirigimos (deja la home)
  return NextResponse.next();
}

export const config = {
  // No aplicar a assets internos ni al logo
  matcher: ["/((?!_next|favicon.ico|rtm-logo-.*\\.svg).*)"],
};
