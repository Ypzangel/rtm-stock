import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-rtm-surface/80 backdrop-blur-xl border-b border-rtm-border">
      <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          {/* Logo blanco por defecto */}
          <Image
            src="/rtm-logo-white.svg"
            alt="RTM Equipment"
            width={140}
            height={28}
            priority
          />
          <span className="sr-only">RTM Equipment</span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link href="/dealers" className="chip chip-muted">Distribuidores</Link>
          <Link href="/internal" className="chip chip-brand">Interno</Link>
        </nav>
      </div>
    </header>
  );
}
