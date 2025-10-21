import dynamic from "next/dynamic";

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
        </div>
      </header>

      <StockClient rows={rows} showPrice={false} pageSize={25} />
    </section>
  );
}
