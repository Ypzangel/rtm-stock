import Link from "next/link";
import { headers } from "next/headers";

const BASE_DOMAIN = "rtmequipment.net"; // si algún día cambia, edita aquí

export default function Header() {
  const host = headers().get("host") || "";
  const isDealers = host.startsWith("dealers.");
  const isInternal = host.startsWith("internal.");

  const dealersUrl = `https://dealers.${BASE_DOMAIN}`;
  const internalUrl = `https://internal.${BASE_DOMAIN}`;

  return (
    <header className="sticky top-0 z-50 border-b border-rtm-border bg-rtm-surface/90 backdrop-blur">
      <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo / marca */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <span className="text-xl font-bold tracking-wide">
            RTM <span className="text-rtm-brand">Equipment</span>
          </span>
        </Link>

        {/* Nav contextual por host */}
        <nav className="flex items-center gap-2">
          {/* En internal mostramos SOLO el enlace a dealers (subdominio) */}
          {isInternal && (
            <a className="btn btn-ghost no-underline" href={dealersUrl}>
              Distribuidores
            </a>
          )}

          {/* En dealers NO mostramos nada */}
          {isDealers && null}

          {/* Fallback (por ejemplo en domain vercel o localhost): mostramos rutas locales */}
          {!isDealers && !isInternal && (
            <>
              <Link className="btn btn-ghost no-underline" href="/dealers">
                Distribuidores
              </Link>
              <Link className="btn btn-primary no-underline" href="/internal">
                Interno
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
