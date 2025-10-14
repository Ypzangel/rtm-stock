import StockTable from "@/components/StockTable";

export const revalidate = 60;

export default async function DealersPage() {
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
          <h1 className="text-2xl font-bold">Stock — Distribuidores</h1>
          <p className="text-rtm-sub">Sin precios. Actualizado: {new Date(data.updatedAt).toLocaleString()}</p>
        </div>
        <span className="chip chip-muted">Visible: {data.rows.length}</span>
      </header>

      <StockTable rows={data.rows} showPrice={false} />
    </section>
  );
}
