import "./globals.css";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "RTM Stock",
  description: "RTM Equipment — Stock para distribuidores e interno",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.className}>
      <body className="min-h-screen bg-rtm-bg text-rtm-text">
        {/* NAVBAR */}
        <header className="sticky top-0 z-50 border-b border-rtm-border bg-rtm-surface/90 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 no-underline">
              <span className="text-xl font-bold tracking-wide">
                RTM <span className="text-rtm-brand">Equipment</span>
              </span>
            </Link>
            <nav className="flex items-center gap-2">
              <Link className="btn btn-ghost no-underline" href="/dealers">Distribuidores</Link>
              <Link className="btn btn-primary no-underline" href="/internal">Interno</Link>
            </nav>
          </div>
        </header>

import "./globals.css";
import Header from "./components/Header";

export const metadata = {
  title: "RTM Stock",
  description: "Stock Heli – RTM Equipment",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-rtm-bg text-rtm-text">
        <Header />
        <main className="max-w-screen-2xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
       
        <main className="mx-auto max-w-7xl px-4 py-8">
          {children}
        </main>

        <footer className="mt-12 border-t border-rtm-border">
          <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-rtm-sub">
            © {new Date().getFullYear()} RTM Equipment — Uso privado. Datos actualizados cada ~60 s.
          </div>
        </footer>
      </body>
    </html>
  );
}
