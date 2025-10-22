'use client';

import { useEffect, useRef, useState } from "react";
import type { Row } from "./StockClient";

function keepEuroNoWrap(v?: string | null) {
  if (!v) return "-";
  return v.replace(/\s€$/, "\u00A0€");
}

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
    const wasOpen = isOpen;
    if (wasOpen) el.classList.add("clamp-2");
    const needs = el.scrollHeight > el.clientHeight + 1;
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
  showLocation = false,
}: {
  rows: Row[];
  showPrice?: boolean;
  showLocation?: boolean;
}) {
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
            <col className="md:w-[6%]" />   {/* Foto */}
            <col className="md:w-[20%]" />  {/* Modelo */}
            <col className="hidden md:table-column md:w-[18%]" /> {/* Combustión */}
            <col className="md:w-[36%]" />  {/* Especificaciones */}
            <col className="md:w-[6%]" />   {/* Cant */}
            {showPrice && <col className="md:w-[10%]" />}       {/* Precio */}
            {showLocation && <col className="md:w-[10%]" />}    {/* Ubicación */}
            <col className="md:w-[12%]" />  {/* Llegada */}
          </colgroup>

          <thead className="sticky top-0 z-10">
            <tr>
              <th className="whitespace-nowrap">Foto</th>
              <th className="whitespace-nowrap">Modelo</th>
              <th className="hidden md:table-cell whitespace-nowrap">Combustión/Batería</th>
              <th className="whitespace-nowrap">Especificaciones</th>
              <th className="text-center whitespace-nowrap">Cant.</th>
              {showPrice && <th className="text-right whitespace-nowrap">Precio</th>}
              {showLocation && <th className="whitespace-nowrap">Ubicación</th>}
              <th className="text-right whitespace-nowrap">Llegada</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, i) => {
              const isOpen = open.has(i);
              return (
                <tr key={i}>
                  {/* Foto */}
                  <td className="align-top">
                    {r.fotoUrl ? (
                      <img
                        src={r.fotoUrl}
                        alt={r.modelo}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="h-12 w-12 object-cover rounded-md border border-rtm-border/60 bg-rtm-surface2"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-md border border-rtm-border/60 bg-rtm-surface2" />
                    )}
                  </td>

                  {/* Modelo */}
                  <td className="font-medium pr-2">
                    <span className="block truncate">{r.modelo}</span>
                  </td>

                  {/* Combustión (oculta en móvil) */}
                  <td className="hidden md:table-cell text-rtm-sub pr-2">
                    <span className="block">{r.combustion}</span>
                  </td>

                  {/* Especificaciones */}
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

                  {/* Ubicación (si aplica) */}
                  {showLocation && (
                    <td className="whitespace-nowrap align-top">
                      {r.ubicacion || "-"}
                    </td>
                  )}

                  {/* Llegada */}
                  <td className="text-right whitespace-nowrap align-top">
                    {(() => {
                      const raw = (r.llegada || "").trim();
                      const norm = raw
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .toUpperCase();

                      let badge: JSX.Element | null = null;
                      let text: string | null = null;

                      if (norm === "FABRICACION") {
                        badge = <span className="chip-info">Fabricación</span>;
                      } else if (norm === "STOCK") {
                        badge = <span className="chip-ok">Stock</span>;
                      } else if (raw) {
                        text = raw;
                        if (r.urgent) badge = <span className="chip chip-warn">Próxima llegada</span>;
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
