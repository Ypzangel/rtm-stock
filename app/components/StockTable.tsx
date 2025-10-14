'use client';

import { useEffect, useRef, useState } from "react";

type Row = {
  tipo?: string;
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

/** Celda de especificaciones con detección real de overflow */
function SpecCell({
  text,
  isOpen,
  onToggle,
}: {
  text: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [isOverflow, setIsOverflow] = useState(false);

  const checkOverflow = () => {
    const el = boxRef.current;
    if (!el) return;
    // Cuando está abierto no hay clamp; para detectar si haría falta botón,
    // medimos con la clase 'clamp-2' aplicada.
    const wasOpen = isOpen;
    if (wasOpen) el.classList.add("clamp-2");
    const needs = el.scrollHeight > el.clientHeight + 1; // margen
    setIsOverflow(needs);
    if (wasOpen) el.classList.remove("clamp-2");
  };

  useEffect(() => {
    checkOverflow();
    const onResize = () => checkOverflow();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  // cada vez que cambiamos open, recalcular (por si cambia layout)
  useEffect(() => {
    checkOverflow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <td className="pr-2 align-top">
      <div ref={boxRef} className={isOpen ? "" : "clamp-2"}>
        {text}
      </div>
      {isOverflow && (
        <button
          type="button"
          onClick={onToggle}
          className="mt-1 text-rtm-brand underline underline-offset-2"
        >
          {isOpen ? "Ver menos" : "Ver más"}
        </button>
      )}
    </td>
  );
}

export default function StockTable({
  rows,
  showPrice = false,
}: {
  rows: Row[];
  showPrice?: boolean;
}) {
  // índices expandidos para "Ver más"
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

                  {/* Especificaciones con detección real de overflow */}
                  <SpecCell
                    text={r.especificaciones || ""}
                    isOpen={isOpen}
                    onToggle={() => toggle(i)}
                  />

                  {/* Cantidad */}
                  <td className="text-center whitespace-nowrap align-top">{r.cantidad}</td>

                  {/* Precio (si aplica) */}
                  {showPrice && (
                    <td className="text-right font-semibold whitespace-nowrap tabular-nums align-top">
                      {keepEuroNoWrap(r.precioRaw)}
                    </td>
                  )}

{/* Llegada */}
<td className="text-right whitespace-nowrap align-top">
  {(() => {
    const raw = (r.llegada || "").trim();
    const norm = raw
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase(); // quita acentos: FABRICACIÓN -> FABRICACION

    // badge a mostrar
    let badge: JSX.Element | null = null;
    // texto (fecha) a mostrar
    let text: string | null = null;

    if (norm === "FABRICACION") {
      // Solo badge azul
      badge = <span className="chip-info">Fabricación</span>;
    } else if (norm === "STOCK") {
      // Solo badge verde
      badge = <span className="chip-ok">Stock</span>;
    } else if (raw) {
      // Fecha (con o sin "Próxima llegada")
      text = raw;
      if (r.urgent) {
        badge = <span className="chip chip-warn">Próxima llegada</span>;
      }
    } else {
      text = "-";
    }

    return (
      <span className="inline-flex items-center gap-2 justify-end">
        {text ? <span>{text}</span> : null}
        {badge}
      </span>
    );
  })()}
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
