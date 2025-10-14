type Row = {
  modelo: string;
  combustion: string;
  especificaciones: string;
  cantidad: string;
  llegada: string;
  precioRaw?: string | null;
  urgent?: boolean;
};

function keepEuroNoWrap(v?: string | null) {
  if (!v) return "-";
  // sustituye " €" por "&nbsp;€" para evitar salto de línea
  return v.replace(/\s€$/, "\u00A0€");
}

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
          {/* Anchuras (mejor en md+). En móvil, Tailwind ignora y reparte automático */}
          <colgroup>
            <col className="md:w-[22%]" /> {/* Modelo */}
            <col className="hidden md:table-column md:w-[18%]" /> {/* Combustión */}
            <col className="md:w-[42%]" /> {/* Especificaciones */}
            <col className="md:w-[8%]" />  {/* Cant. */}
            {showPrice && <col className="md:w-[12%]" />} {/* Precio */}
            <col className="md:w-[12%]" /> {/* Llegada */}
          </colgroup>

          <thead className="sticky top-0 z-10">
            <tr>
              <th className="whitespace-nowrap">Modelo</th>
              <th className="hidden md:table-cell whitespace-nowrap">Combustión/Batería</th>
              <th className="whitespace-nowrap">Especificaciones</th>
              <th className="text-center whitespace-nowrap">Cant.</th>
              {showPrice && <th className="text-right whitespace-nowrap">Precio</th>}
              <th className="text-right whitespace-nowrap">Llegada</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                {/* Modelo */}
                <td className="font-medium pr-2">
                  <span className="block truncate">{r.modelo}</span>
                </td>

                {/* Combustión (oculta en móvil) */}
                <td className="hidden md:table-cell text-rtm-sub pr-2">
                  <span className="block truncate">{r.combustion}</span>
                </td>

                {/* Especificaciones: más compacta en móvil */}
                <td className="pr-2">
                  <p className="text-rtm-text/90 md:truncate">
                    {r.especificaciones}
                  </p>
                </td>

                {/* Cantidad */}
                <td className="text-center whitespace-nowrap">{r.cantidad}</td>

                {/* Precio (si aplica) - sin saltos de línea antes del € */}
                {showPrice && (
                  <td className="text-right font-semibold whitespace-nowrap tabular-nums">
                    {keepEuroNoWrap(r.precioRaw)}
                  </td>
                )}

                {/* Llegada (alineada derecha, sin flex en td) */}
                <td className="text-right whitespace-nowrap">
                  <span className="inline-flex items-center gap-2 justify-end">
                    <span>{r.llegada || "-"}</span>
                    {r.urgent ? (
                      <span className="chip chip-warn whitespace-nowrap">Próxima llegada</span>
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
