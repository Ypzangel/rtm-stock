import "./globals.css";
import { Inter } from "next/font/google";
import Header from "./components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "RTM Stock",
  description: "RTM Equipment — Stock para distribuidores e interno",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.className}>
      <body className="min-h-screen bg-rtm-bg text-rtm-text">
        <Header />
        <main className="max-w-screen-2xl mx-auto px-4 py-6">
          {children}
        </main>
        <footer className="mt-12 border-t border-rtm-border">
          <div className="max-w-screen-2xl mx-auto px-4 py-6 text-sm text-rtm-sub">
            © {new Date().getFullYear()} RTM Equipment — Uso privado. Datos actualizados cada ~60 s.
          </div>
        </footer>
      </body>
    </html>
  );
}
