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
        <table className="table table-fixed">
          {/* Anchuras estables por columna */}
          <colgroup>
            <col className="w-[20%]" /> {/* Modelo */}
            <col className="w-[18%]" /> {/* Combustión */}
            <col className="w-[42%]" /> {/* Especificaciones */}
            <col className="w-[8%]" />  {/* Cant. */}
            {showPrice && <col className="w-[12%]" />} {/* Precio */}
            <col className="w-[12%]" /> {/* Llegada */}
          </colgroup>

          <thead>
            <tr>
              <th>Modelo</th>
              <th>Combustión/Batería</th>
              <th>Especificaciones</th>
              <th className="text-center">Cant.</th>
              {showPrice && <th className="text-right">Precio</th>}
              <th className="text-right">Llegada</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="font-medium">{r.modelo}</td>
                <td className="text-rtm-sub">{r.combustion}</td>

                <td className="pr-4">
                  <p className="text-rtm-text/90 truncate">{r.especificaciones}</p>
                </td>

                <td className="text-center">{r.cantidad}</td>

                {showPrice && (
                  <td className="text-right font-semibold tabular-nums">
                    {r.precioRaw || "-"}
                  </td>
                )}

                {/* OJO: el <td> ya NO es flex. Usamos un contenedor inline para la píldora */}
                <td className="text-right">
                  <span className="inline-flex items-center gap-2 justify-end">
                    <span>{r.llegada || "-"}</span>
                    {r.urgent ? (
                      <span className="chip chip-warn whitespace-nowrap">
                        Próxima llegada
                      </span>
                    ) : null}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
