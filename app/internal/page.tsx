export const revalidate = 60;

export default async function InternalPage() {
  const url = process.env.APPSCRIPT_URL!;
  const res = await fetch(url, { next: { revalidate: 60 } });
  const data = await res.json();

  if (!data?.ok) {
    return <main className="p-6">Error: {data?.error ?? "API no disponible"}</main>;
  }

  return (
    <main className="mx-auto max-w-[1200px] p-6">
      <h1 className="text-2xl font-bold mb-6">Stock — Vista Interna</h1>
      <div className="overflow-x-auto rounded-lg border border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-[#1F2833] text-gray-300">
            <tr>
              <th className="p-2 text-left">Modelo</th>
              <th className="p-2 text-left">Combustión/Batería</th>
              <th className="p-2 text-left">Especificaciones</th>
              <th className="p-2 text-left">Cant.</th>
              <th className="p-2 text-left">Precio</th>
              <th className="p-2 text-left">Llegada</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r: any, i: number) => (
              <tr key={i} className="border-b border-gray-800 hover:bg-[#1F2833]">
                <td className="p-2">{r.modelo}</td>
                <td className="p-2">{r.combustion}</td>
                <td className="p-2">{r.especificaciones}</td>
                <td className="p-2">{r.cantidad}</td>
                <td className="p-2 font-semibold">{r.precioRaw}</td>
                <td className="p-2">{r.llegada}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
