"use client";

import { useState, useMemo } from "react";

type Row = {
  tipo: string;
  modelo: string;
  combustion: string;
  especificaciones: string;
  cantidad: string;
  llegada: string;
  fotoUrl: string;
  precioRaw: string;
  precio: number | null;
  ubicacion?: string;
  urgent?: boolean;
  daysTo?: number | null;
};

export default function StockClient({
  rows,
  showPrice = true,
  showLocation = false,
  pageSize = 20,
}: {
  rows: Row[];
  showPrice?: boolean;
  showLocation?: boolean;
  pageSize?: number;
}) {
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const sortedRows = useMemo(() => {
    if (!sortKey) return rows;

    const dir = sortDir === "asc" ? 1 : -1;
    return [...rows].sort((a: any, b: any) => {
      const av = (a[sortKey] ?? "").toString().toLowerCase();
      const bv = (b[sortKey] ?? "").toString().toLowerCase();

      if (sortKey === "precio") return ((a.precio ?? 0) - (b.precio ?? 0)) * dir;
      if (sortKey === "cantidad") return ((+a.cantidad || 0) - (+b.cantidad || 0)) * dir;

      return av > bv ? dir : av < bv ? -dir : 0;
    });
  }, [rows, sortKey, sortDir]);

  const totalPages = Math.ceil(sortedRows.length / pageSize);
  const start = (page - 1) * pageSize;
  const visible = sortedRows.slice(start, start + pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-rtm-border bg-rtm-surface">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-rtm-surface-dark text-rtm-sub uppercase text-xs">
            <th onClick={() => handleSort("modelo")} className="cursor-pointer px-4 py-2 text-left">
              Modelo {sortKey === "modelo" && (sortDir === "asc" ? "▲" : "▼")}
            </th>
            <th onClick={() => handleSort("combustion")} className="cursor-pointer px-4 py-2 text-left">
              Combustión/Batería {sortKey === "combustion" && (sortDir === "asc" ? "▲" : "▼")}
            </th>
            <th className="px-4 py-2 text-left">Especificaciones</th>
            <th onClick={() => handleSort("cantidad")} className="cursor-pointer px-4 py-2 text-right">
              Cant. {sortKey === "cantidad" && (sortDir === "asc" ? "▲" : "▼")}
            </th>

            {showPrice && (
              <th onClick={() => handleSort("precio")} className="cursor-pointer px-4 py-2 text-right">
                Precio {sortKey === "precio" && (sortDir === "asc" ? "▲" : "▼")}
              </th>
            )}

            {showLocation && (
              <th onClick={() => handleSort("ubicacion")} className="cursor-pointer px-4 py-2 text-left">
                Ubicación {sortKey === "ubicacion" && (sortDir === "asc" ? "▲" : "▼")}
              </th>
            )}

            <th onClick={() => handleSort("llegada")} className="cursor-pointer px-4 py-2 text-right">
              Llegada {sortKey === "llegada" && (sortDir === "asc" ? "▲" : "▼")}
            </th>
          </tr>
        </thead>

        <tbody>
          {visible.map((r, i) => (
            <tr key={i} className="border-t border-rtm-border/40 hover:bg-rtm-surface-dark/50">
              <td className="px-4 py-2 font-medium">{r.modelo}</td>
              <td className="px-4 py-2 whitespace-nowrap">{r.combustion}</td>
              <td className="px-4 py-2 text-ellipsis max-w-xs overflow-hidden">
                <details>
                  <summary className="cursor-pointer text-rtm-brand">Ver más</summary>
                  {r.especificaciones}
                </details>
              </td>
              <td className="px-4 py-2 text-right">{r.cantidad}</td>

              {showPrice && <td className="px-4 py-2 text-right">{r.precioRaw}</td>}

              {showLocation && <td className="px-4 py-2">{r.ubicacion || "-"}</td>}

              <td className="px-4 py-2 text-right">
                {r.llegada || "-"}
                {r.urgent && (
                  <span className="ml-2 inline-block rounded-full bg-yellow-700/20 text-yellow-400 text-xs px-2 py-0.5">
                    Próxima llegada
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="flex items-center justify-between p-3 border-t border-rtm-border text-rtm-sub text-sm">
        <span>
          Mostrando {start + 1}-{Math.min(start + pageSize, rows.length)} de {rows.length}
        </span>
        <div className="flex gap-2">
          <button
            className="btn btn-ghost px-3 py-1"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            ← Anterior
          </button>
          <span>Página {page}</span>
          <button
            className="btn btn-ghost px-3 py-1"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  );
}
