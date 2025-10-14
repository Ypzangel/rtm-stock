type Row = {
  modelo: string;
  combustion: string;
  especificaciones: string;
  cantidad: string;
  llegada: string;
  precioRaw?: string | null;
  urgent?: boolean;
};

export default function StockTable({
  rows,
  showPrice = false,
}: {
  rows: Row[];
  showPrice?: boolean;
}) {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Modelo</th>
              <th>Combustión/Batería</th>
              <th>Especificaciones</th>
              <th>Cant.</th>
              {showPrice && <th>Precio</th>}
              <th>Llegada</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="font-medium">{r.modelo}</td>
                <td className="text-rtm-sub">{r.combustion}</td>
                <td className="max-w-[520px]">
                  <p className="text-rtm-text/90">{r.especificaciones}</p>
                </td>
                <td>{r.cantidad}</td>
                {showPrice && (
                  <td className="font-semibold">{r.precioRaw || "-"}</td>
                )}
                <td className="flex items-center gap-2">
                  <span>{r.llegada || "-"}</span>
                  {r.urgent ? <span className="chip chip-warn">Próxima llegada</span> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
