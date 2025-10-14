'use client';

import { useState } from "react";

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
  return v.replace(/\s€$/, "\u00A0€");
}

export default function StockTable({
  rows,
  showPrice = false,
}: {
  rows: Row[];
  showPrice?: boolean;
}) {
  // set con índices expandidos
  const [open, setOpen] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    const next = new Set(open);
    next.has(i) ? next.delete(i) : next.add(i);
    setOpen(next);
  };

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table">
          <colgroup>
            <col className="md:w-[22%]" />
            <col className="hidden md:table-column md:w-[18%]" />
            <col className="md:w-[42%]" />
            <col className="md:w-[8%]" />
            {showPrice && <col className="md:w-[12%]" />}
            <col className="md:w-[12%]" />
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
            {rows.map((r, i) => {
              const isOpen = open.has(i);
              const longText = (r.especificaciones || "").length > 140;

              return (
                <tr key={i}>
                  {/* Modelo */}
                  <td className="font-medium pr-2">
                    <span className="block truncate">{r.modelo}</span>
                  </td>

                  {/* Combustión (oculta en móvil) */}
                  <td className="hidden md:table-cell text-rtm-sub pr-2">
                    <span className="block">{r.combustion}</span>
                  </td>

                  {/* Especificaciones: wrap normal; clamp cuando está cerrado */}
                  <td className="pr-2 align-top">
                    <div className={isOpen ? "" : "clamp-2"}>
                      {r.especificaciones}
                    </div>
                    {longText && (
                      <button
                        type="button"
                        onClick={() => toggle(i)}
                        className="mt-1 text-rtm-brand underline underline-offset-2"
                      >
                        {isOpen ? "Ver menos" : "Ver más"}
                      </button>
                    )}
                  </td>

                  {/* Cantidad */}
                  <td className="text-center whitespace-nowrap align-top">{r.cantidad}</td>

                  {/* Precio */}
                  {showPrice && (
                    <td className="text-right font-semibold whitespace-nowrap tabular-nums align-top">
                      {keepEuroNoWrap(r.precioRaw)}
                    </td>
                  )}

                  {/* Llegada */}
                  <td className="text-right whitespace-nowrap align-top">
                    <span className="inline-flex items-center gap-2 justify-end">
                      <span>{r.llegada || "-"}</span>
                      {r.urgent ? (
                        <span className="chip chip-warn whitespace-nowrap">Próxima llegada</span>
                      ) : null}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
