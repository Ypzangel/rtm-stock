import dynamic from "next/dynamic";

export const revalidate = 60;

const StockClient = dynamic(() => import("../components/StockClient"), { ssr: false });

export default async function InternalPage() {
  const url = process.env.APPSCRIPT_URL!;
  const res = await fetch(url, { next: { revalidate: 60 } });
  const data = await res.json();

  if (!data?.ok) {
    return <div className="card p-6">Error: {data?.error ?? "API no disponible"}</div>;
  }

  return (
    <section className="grid gap-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Stock — Vista Interna</h1>
          <p className="text-rtm-sub">
            Con precios. Actualizado: {new Date(data.updatedAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {data?.stats ? (
            <>
              <span className="chip chip-muted">Total hoja: {data.stats.total}</span>
              <span className="chip chip-muted">STOCK: {data.stats.stock}</span>
              <span className="chip chip-muted">HELI: {data.stats.heli}</span>
              <span className="chip chip-muted">Cumplen: {data.stats.ambas}</span>
            </>
          ) : null}
        </div>
      </header>

      {/* Activamos precios + ubicación en la tabla interna */}
      <StockClient rows={data.rows} showPrice pageSize={25} showLocation />
    </section>
  );
}
