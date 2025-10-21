'use client';

import { useMemo, useState } from "react";
import StockTable from "./StockTable";

export type Row = {
  tipo?: string;
  modelo: string;
  combustion: string;
  especificaciones: string;
  cantidad: string;
  llegada: string;
  precioRaw?: string | null;
  urgent?: boolean;
  fotoUrl?: string;        // 👈 añadimos la URL de la foto
};

const TYPES_ORDER = ["APILADOR ELECTRICO","CARRETILLA 3R","CARRETILLA 4R","TRANSPALETA ELECTRICA"];

function normalizeType(v?: string) {
  return (v || "").trim().toUpperCase();
}

export default function StockClient({
  rows,
  showPrice = false,
  pageSize = 25,
}: {
  rows: Row[];
  showPrice?: boolean;
  pageSize?: number;
}) {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<string>("TODOS");
  const [page, setPage] = useState(1);

  // contadores por tipo
  const counts = useMemo(() => {
    const all: Record<string, number> = {};
    rows.forEach(r => {
      const t = normalizeType(r.tipo);
      all[t] = (all[t] || 0) + 1;
    });
    return all;
  }, [rows]);

  // datos filtrados
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(r => {
      const okType = activeType === "TODOS" || normalizeType(r.tipo) === activeType;
      const okQuery =
        !q ||
        r.modelo?.toLowerCase().includes(q) ||
        r.especificaciones?.toLowerCase().includes(q);
      return okType && okQuery;
    });
  }, [rows, query, activeType]);

  // paginación
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);

  const onType = (t: string) => { setActiveType(t); setPage(1); };
  const onQuery = (v: string) => { setQuery(v); setPage(1); };

  const typesSorted = useMemo(() => {
    const set = new Set(TYPES_ORDER.map(normalizeType));
    const present = Object.keys(counts);
    const known = TYPES_ORDER.map(normalizeType).filter(t => present.includes(t));
    const others = present.filter(t => !set.has(t)).sort();
    return [...known, ...others];
  }, [counts]);

  return (
    <section className="grid gap-4">
      {/* Filtros + buscador (sticky bajo el header) */}
      <div className="sticky top-[var(--header-h)] z-30 bg-rtm-surface/80 backdrop-blur-xl border border-rtm-border rounded-xl px-3 py-3 sticky-elev">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onType("TODOS")}
              className={`chip ${activeType === "TODOS" ? "chip-active" : "chip-muted"}`}
            >
              Todos ({rows.length})
            </button>

            {typesSorted.map(t => (
              <button
                key={t}
                onClick={() => onType(t)}
                className={`chip ${activeType === t ? "chip-active" : "chip-muted"}`}
              >
                {t.charAt(0) + t.slice(1).toLowerCase()} ({counts[t] || 0})
              </button>
            ))}
          </div>

          <input
            placeholder="Filtrar por modelo o especificaciones…"
            value={query}
            onChange={e => onQuery(e.target.value)}
            className="bg-rtm-surface2 border border-rtm-border rounded-lg px-3 py-2 text-sm outline-none focus:border-rtm-brand w-[320px] max-w-full"
          />
        </div>
      </div>

      {/* Tabla */}
      <StockTable rows={pageRows} showPrice={showPrice} />

      {/* Paginación */}
      <div className="flex items-center justify-between text-sm text-rtm-sub">
        <div>
          Mostrando {start + 1}-{Math.min(start + pageSize, filtered.length)} de {filtered.length}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn btn-ghost"
            disabled={safePage <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            ← Anterior
          </button>
          <span>Página {safePage} / {totalPages}</span>
          <button
            className="btn btn-ghost"
            disabled={safePage >= totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          >
            Siguiente →
          </button>
        </div>
      </div>
    </section>
  );
}
