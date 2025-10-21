"use client";

import * as React from "react";

export type Row = {
  fotoUrl?: string;
  tipo?: string;
  modelo?: string;
  combustion?: string;
  especificaciones?: string;
  cantidad?: string | number;
  precioRaw?: string;   // precio dealers en texto (se respeta formato)
  llegada?: string;
  urgent?: boolean;
  [key: string]: any;   // permite columnas extra como ubicacion
};

type ExtraColumn = {
  key: string;          // propiedad del row, p.ej. "ubicacion"
  title: string;        // encabezado a mostrar, p.ej. "Ubicación"
  render?: (row: Row) => React.ReactNode; // opcional render personalizado
};

type Props = {
  rows: Row[];
  showPrice?: boolean;
  pageSize?: number;
  /** NUEVO: columnas extra al final de la tabla (p.ej. Ubicación) */
  extraColumns?: ExtraColumn[];
};

export default function StockClient({
  rows,
  showPrice = false,
  pageSize = 25,
  extraColumns = [],   // <-- por defecto vacío
}: Props) {
  const [q, setQ] = React.useState("");
  const [page, setPage] = React.useState(1);

  const filtered = React.useMemo(() => {
    if (!q.trim()) return rows;
    const needle = q.toLowerCase();
    return rows.filter((r) => {
      const hay =
        (r.tipo || "") +
        " " +
        (r.modelo || "") +
        " " +
        (r.combustion || "") +
        " " +
        (r.especificaciones || "") +
        " " +
        (r.llegada || "") +
        " " +
        (r.precioRaw || "");
      return hay.toLowerCase().includes(needle);
    });
  }, [rows, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  React.useEffect(() => {
    setPage(1);
  }, [q]);

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filtrar por MODELO, ESPECIFICACIONES…"
          className="input"
        />
        <div className="text-rtm-sub">
          Total filas cargadas (visibles): {filtered.length}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Foto</th>
                <th>Modelo</th>
                <th>Combustión/Batería</th>
                <th>Especificaciones</th>
                <th>Cant.</th>
                {showPrice && <th>Precio Dealers</th>}
                <th>Llegada</th>

                {/* (A) ENCABEZADOS EXTRA */}
                {extraColumns.map((col) => (
                  <th key={col.key}>{col.title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((r, idx) => (
                <tr key={idx}>
                  <td style={{ width: 70 }}>
                    <img
                      src={
                        r.fotoUrl ||
                        "data:image/svg+xml;utf8," +
                          encodeURIComponent(
                            `<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60'><rect width='100%' height='100%' fill='#e9eef6'/></svg>`
                          )
                      }
                      alt={r.modelo}
                      width={60}
                      height={60}
                      className="rounded border border-rtm-border object-cover"
                    />
                  </td>
                  <td>
                    <div className="font-semibold">{r.modelo || "-"}</div>
                    <div className="text-rtm-sub text-sm">{r.tipo || ""}</div>
                  </td>
                  <td>{r.combustion || "-"}</td>
                  <td
                    dangerouslySetInnerHTML={{
                      __html: (r.especificaciones || "").replace(/\n/g, "<br>"),
                    }}
                  />
                  <td className="text-center">{r.cantidad ?? "-"}</td>
                  {showPrice && (
                    <td>
                      {r.precioRaw?.trim()?.length ? (
                        <div>
                          <strong>{r.precioRaw.replace(/\n/g, " · ")}</strong>{" "}
                          <small className="text-rtm-sub">+ IVA</small>
                        </div>
                      ) : (
                        <span className="text-rtm-sub">Consultar</span>
                      )}
                    </td>
                  )}
                  <td>
                    <div className="flex items-center gap-2">
                      <span>{r.llegada || "-"}</span>
                      {r.urgent ? (
                        <span className="chip chip-warn">Próxima llegada</span>
                      ) : null}
                    </div>
                  </td>

                  {/* (B) CELDAS EXTRA */}
                  {extraColumns.map((col) => (
                    <td key={col.key}>
                      {col.render ? col.render(r) : r[col.key] ?? "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex items-center justify-end gap-2 p-3 border-t border-rtm-border">
          <button
            className="btn"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ◀
          </button>
          <div className="text-sm text-rtm-sub">
            Página {page} / {totalPages}
          </div>
          <button
            className="btn"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}
