"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname() || "/";
  const onDealers = pathname.startsWith("/dealers");
  const onInternal = pathname.startsWith("/internal");

  const linkBase =
    "px-4 py-2 rounded-lg border border-rtm-border hover:bg-rtm-accent/10 transition select-none no-underline";
  const active = "bg-rtm-accent text-white border-rtm-accent";
  const inactive = "text-rtm-ink";

  return (
    <header className="sticky top-0 z-50 border-b border-rtm-border bg-rtm-surface/90 backdrop-blur">
      <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 no-underline">
          {/* Si tienes el logo en public/logo-rtm-white.svg, úsalo; si no, queda el texto */}
          {/* <img src="/logo-rtm-white.svg" alt="RTM" className="h-5" /> */}
          <span className="text-xl font-bold tracking-wide">
            RTM <span className="text-rtm-brand">Equipment</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          {/* Dealers SIEMPRE visible */}
          <Link
            href="/dealers"
            className={`${linkBase} ${onDealers ? active : inactive}`}
            aria-current={onDealers ? "page" : undefined}
          >
            Distribuidores
          </Link>

          {/* Interno SOLO cuando NO estás en /dealers */}
          {!onDealers && (
            <Link
              href="/internal"
              className={`${linkBase} ${onInternal ? active : inactive}`}
              aria-current={onInternal ? "page" : undefined}
            >
              Interno
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
