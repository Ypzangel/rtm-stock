import dynamic from "next/dynamic";
import Link from "next/link";

export const revalidate = 60;

const StockClient = dynamic(() => import("../components/StockClient"), { ssr: false });

type ApiData = {
  ok?: boolean;
  rows?: any[];
  stats?: { total: number; stock: number; heli: number; ambas: number };
  updatedAt?: string | number;
  error?: string;
};

function Updated({ at }: { at?: string | number }) {
  if (!at) return null;
  const date = typeof at === "number" ? new Date(at) : new Date(String(at));
  if (isNaN(date.getTime())) return null;
  return <span className="text-rtm-sub">Actualizado: {date.toLocaleString()}</span>;
}

export default async function DealersPage() {
  const url = process.env.APPSCRIPT_URL!;
  let data: ApiData = {};
  let err: string | null = null;

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    data = await res.json();
  } catch (e: any) {
    err = e?.message || "No se pudo cargar";
  }

  if (err || data?.ok === false) {
    return (
      <section className="grid gap-6">
        <header className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold">Stock — Distribuidores</h1>
            <p className="text-rtm-sub">Sin precios</p>
          </div>
          <Nav active="dealers" />
        </header>
        <div className="card p-6">Error: {data?.error ?? err ?? "API no disponible"}</div>
      </section>
    );
  }

  const rows = data?.rows ?? [];

  return (
    <section className="grid gap-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Stock — Distribuidores</h1>
          <p className="flex gap-2 items-center text-rtm-sub">
            <span>Sin precios.</span>
            <Updated at={data?.updatedAt} />
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="chip chip-muted">Visible: {rows.length}</span>
          <Nav active="dealers" />
        </div>
      </header>

      <StockClient rows={rows} showPrice={false} pageSize={25} />
    </section>
  );
}

/** Botonera fija que navega por rutas del MISMO dominio */
function Nav({ active }: { active: "dealers" | "internal" }) {
  const base =
    "px-4 py-2 rounded-lg border border-rtm-border hover:bg-rtm-accent/10 transition select-none";
  const activeCls = "bg-rtm-accent text-white border-rtm-accent";
  const inactive = "text-rtm-ink";
  return (
    <nav className="flex gap-2">
      <Link
        href="/dealers"
        className={`${base} ${active === "dealers" ? activeCls : inactive}`}
        aria-current={active === "dealers" ? "page" : undefined}
      >
        Distribuidores
      </Link>
      <Link
        href="/internal"
        className={`${base} ${active === "internal" ? activeCls : inactive}`}
        aria-current={active === "internal" ? "page" : undefined}
      >
        Interno
      </Link>
    </nav>
  );
}
