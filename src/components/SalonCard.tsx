import type { MouseEvent as ReactMouseEvent } from 'react';
import { Icon } from '@/components/Icon';
import { estadoLegible, evaluarHorario, type AhoraLima } from '@/lib/horario';
import { enlaceRuta, formatoPrecio, iniciales } from '@/lib/format';
import { enlaceContacto, precioDesde } from '@/lib/mappers';
import type { Salon } from '@/types/domain';

type SalonCardProps = {
  salon: Salon;
  activo: boolean;
  ahora: AhoraLima;
  onResaltar: (salon: Salon) => void;
  onSeleccionar: (salon: Salon) => void;
  onVerDetalles: (salon: Salon) => void;
};

export function SalonCard({
  salon,
  activo,
  ahora,
  onResaltar,
  onSeleccionar,
  onVerDetalles,
}: SalonCardProps) {
  const precio = precioDesde(salon);
  const estado = estadoLegible(evaluarHorario(salon.listedHours, ahora));
  const contacto = enlaceContacto(salon);
  const servicios = salon.services.slice(0, 2);
  const restantes = salon.services.length - servicios.length;

  const resaltar = () => {
    if (salon.hasMap) onResaltar(salon);
  };

  const alHacerClic = (evento: ReactMouseEvent<HTMLElement>) => {
    if ((evento.target as HTMLElement).closest('a, button')) return;
    if (salon.hasMap) onSeleccionar(salon);
  };

  return (
    <article
      id={`salon-${salon.id}`}
      aria-labelledby={`salon-nombre-${salon.id}`}
      onMouseEnter={resaltar}
      onFocusCapture={resaltar}
      onClick={alHacerClic}
      className={`rounded-lg border bg-canvas p-3.5 shadow-e1 transition-all duration-200 ${
        activo
          ? 'border-rose ring-2 ring-rose/40'
          : 'border-wine-soft hover:border-rose/60 hover:shadow-e2'
      } ${salon.hasMap ? 'cursor-pointer' : 'border-dashed'}`}
    >
      <div className="flex gap-3.5">
        <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-md bg-gradient-to-br from-wine-soft to-rose-wash">
          <span className="absolute inset-0 flex items-center justify-center font-display text-[26px] font-semibold text-wine/85">
            {iniciales(salon.name)}
          </span>
          <span className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-1 bg-wine/85 py-0.5 text-[9px] font-semibold uppercase tracking-[0.06em] text-on-primary">
            {salon.hasMap ? 'En mapa' : 'Sin mapa'}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3
              id={`salon-nombre-${salon.id}`}
              className="text-[16px] font-bold leading-tight text-on-surface transition-colors group-hover:text-wine"
            >
              {salon.name}
            </h3>
          </div>

          <p className="mt-0.5 flex items-start gap-1 text-body-sm text-on-surface-variant">
            <Icon name={salon.hasMap ? 'location_on' : 'location_off'} size={14} className="mt-0.5 shrink-0 text-outline" />
            <span className="line-clamp-2">{salon.address ?? salon.area ?? 'Dirección por confirmar'}</span>
          </p>

          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {servicios.map((servicio) => (
              <span
                key={servicio.name}
                className="max-w-full truncate rounded bg-surface-container px-2 py-0.5 text-[11px] font-medium text-on-surface-variant"
              >
                {servicio.name}
              </span>
            ))}
            {restantes > 0 && (
              <span className="rounded bg-surface-container px-2 py-0.5 text-[11px] font-medium text-on-surface-variant">
                +{restantes}
              </span>
            )}
          </div>

          {estado.tono !== 'desconocido' && (
            <p className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold">
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full ${estado.tono === 'abierto' ? 'bg-emerald' : 'bg-outline'}`}
              />
              <span className={estado.tono === 'abierto' ? 'text-emerald' : 'text-on-surface-variant'}>
                {estado.etiqueta}
                {estado.detalle ? ` · ${estado.detalle}` : ''}
              </span>
            </p>
          )}
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-wine-soft/70 pt-2.5">
        <span className={`text-label-md ${precio !== null ? 'font-semibold text-wine' : 'italic text-on-surface-variant'}`}>
          {precio !== null ? `Desde ${formatoPrecio(precio)}` : 'Precio a consultar'}
        </span>

        <div className="flex items-center gap-1.5">
          {salon.hasMap && (
            <a
              href={enlaceRuta(salon.latitude as number, salon.longitude as number)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-wine-soft text-wine transition-colors hover:bg-wine-soft/60"
              aria-label={`Cómo llegar a ${salon.name} en Google Maps`}
              title="Cómo llegar"
            >
              <Icon name="directions" size={18} />
            </a>
          )}

          {!salon.hasMap && contacto && (
            <a
              href={contacto}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-surface-container px-3 py-1.5 text-label-md font-medium text-on-surface transition-colors hover:bg-surface-container-high"
              aria-label={`Contactar con ${salon.name}`}
            >
              Contactar
            </a>
          )}

          <button
            type="button"
            onClick={() => onVerDetalles(salon)}
            className="rounded-md bg-wine px-3 py-1.5 text-label-md font-semibold text-on-primary transition-colors hover:bg-wine-deep"
            aria-label={`Ver detalles de ${salon.name}`}
          >
            Ver detalles
          </button>
        </div>
      </div>
    </article>
  );
}
