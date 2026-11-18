import { useEffect, useRef } from 'react';
import { Icon } from '@/components/Icon';
import { estadoLegible, evaluarHorario, type AhoraLima } from '@/lib/horario';
import { enlaceRuta, enlaceTel, formatoFecha, formatoPrecio } from '@/lib/format';
import { precioDesde } from '@/lib/mappers';
import type { Salon, SalonService } from '@/types/domain';

type SalonDetailPanelProps = {
  salon: Salon;
  ahora: AhoraLima;
  onCerrar: () => void;
};

/** Dominio legible para citar la fuente sin mostrar la URL completa. */
function nombreFuente(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function precioServicio(servicio: SalonService): { valor: string; nota: string | null } {
  switch (servicio.priceStatus) {
    case 'anunciado':
      return {
        valor: servicio.pricePen !== null ? formatoPrecio(servicio.pricePen) : 'Precio a consultar',
        nota: null,
      };
    case 'promocion_vencida_desde':
      return {
        valor: servicio.pricePen !== null ? formatoPrecio(servicio.pricePen) : 'Precio a consultar',
        nota: 'Promoción vencida',
      };
    case 'paquete_sin_vigencia_confirmada':
      return {
        valor: servicio.pricePen !== null ? formatoPrecio(servicio.pricePen) : 'Precio a consultar',
        nota: 'Paquete sin vigencia confirmada',
      };
    case 'importe_del_anuncio':
      return {
        valor: servicio.pricePen !== null ? formatoPrecio(servicio.pricePen) : 'Precio a consultar',
        nota: 'Importe del anuncio',
      };
    default:
      return { valor: 'Precio a consultar', nota: null };
  }
}

export function SalonDetailPanel({ salon, ahora, onCerrar }: SalonDetailPanelProps) {
  const contenedor = useRef<HTMLDivElement>(null);
  const titulo = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    titulo.current?.focus();
  }, []);

  useEffect(() => {
    const alPresionar = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') onCerrar();
    };
    window.addEventListener('keydown', alPresionar);
    return () => window.removeEventListener('keydown', alPresionar);
  }, [onCerrar]);

  const estado = estadoLegible(evaluarHorario(salon.listedHours, ahora));
  const precio = precioDesde(salon);
  const tel = enlaceTel(salon.phone);
  const consultado = formatoFecha(salon.sourceCheckedOn);

  return (
    <div
      ref={contenedor}
      role="region"
      aria-label={`Detalle de ${salon.name}`}
      className="absolute inset-0 z-40 flex flex-col overflow-y-auto bg-canvas"
    >
      <div className="sticky top-0 flex items-center gap-2 border-b border-wine-soft bg-canvas/95 px-3 py-2.5 backdrop-blur">
        <button
          type="button"
          onClick={onCerrar}
          className="flex h-9 w-9 items-center justify-center rounded-full text-wine transition-colors hover:bg-wine-soft/60"
          aria-label="Cerrar detalle y volver a la lista"
          title="Volver a la lista"
        >
          <Icon name="arrow_back" size={20} />
        </button>
        <span className="text-label-md uppercase tracking-[0.06em] text-on-surface-variant">Detalle del salón</span>
      </div>

      <div className="flex-1 px-4 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-wine-soft to-rose-wash font-display text-[20px] font-semibold text-wine">
            {salon.name
              .split(/\s+/)
              .slice(0, 2)
              .map((p) => p[0])
              .join('')
              .toUpperCase()}
          </div>
          <div className="min-w-0">
            <h2 ref={titulo} tabIndex={-1} className="font-display text-headline-md text-wine focus:outline-none">
              {salon.name}
            </h2>
            <p className="mt-0.5 text-body-sm text-on-surface-variant">
              {[salon.area, salon.address].filter(Boolean).join(' · ') || 'Dirección por confirmar'}
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-label-sm font-semibold ${
              salon.hasMap ? 'bg-emerald/10 text-emerald' : 'bg-surface-container text-on-surface-variant'
            }`}
          >
            <Icon name={salon.hasMap ? 'location_on' : 'location_off'} size={12} />
            {salon.hasMap ? 'En el mapa' : 'Sin mapa'}
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-label-sm font-semibold ${
              estado.tono === 'abierto'
                ? 'bg-emerald/10 text-emerald'
                : 'bg-surface-container text-on-surface-variant'
            }`}
          >
            {estado.etiqueta}
          </span>
          {salon.serviceMode === 'a_domicilio' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-wine-soft/70 px-2 py-0.5 text-label-sm font-semibold text-wine">
              A domicilio
            </span>
          )}
        </div>

        <dl className="mt-4 space-y-2 text-body-sm">
          {salon.listedHours && (
            <div className="flex gap-2">
              <dt className="flex items-center gap-1.5 text-on-surface-variant">
                <Icon name="schedule" size={16} className="text-wine" />
                Horario
              </dt>
              <dd className="text-on-surface">
                {salon.listedHours}
                {estado.detalle ? <span className="block text-on-surface-variant">{estado.detalle}</span> : null}
              </dd>
            </div>
          )}
          {!salon.listedHours && (
            <div className="flex gap-2">
              <dt className="text-on-surface-variant">Horario</dt>
              <dd className="text-on-surface-variant">Por consultar con el establecimiento</dd>
            </div>
          )}

          <div className="flex gap-2">
            <dt className="flex items-center gap-1.5 text-on-surface-variant">
              <Icon name="sell" size={16} className="text-wine" />
              Precio
            </dt>
            <dd className={precio !== null ? 'font-semibold text-wine' : 'text-on-surface-variant'}>
              {precio !== null ? `Desde ${formatoPrecio(precio)}` : 'Precio a consultar'}
            </dd>
          </div>

          {salon.locationPrecision === 'referencia_de_directorio' && (
            <div className="flex gap-2">
              <dt className="text-on-surface-variant">Ubicación</dt>
              <dd className="text-on-surface-variant">Referencial, según el directorio</dd>
            </div>
          )}
        </dl>

        {salon.services.length > 0 && (
          <section className="mt-5">
            <h3 className="text-headline-sm text-on-surface">Servicios publicados</h3>
            <ul className="mt-2 space-y-2">
              {salon.services.map((servicio) => {
                const detalle = precioServicio(servicio);
                return (
                  <li
                    key={`${servicio.name}-${servicio.sourceUrl}`}
                    className="rounded-md border border-wine-soft bg-surface-container-lowest p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-label-lg font-semibold text-on-surface">{servicio.name}</p>
                      <p className="shrink-0 text-label-md font-bold text-wine">{detalle.valor}</p>
                    </div>
                    {detalle.nota && (
                      <p className="mt-1 inline-flex rounded bg-wine-soft/60 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.04em] text-on-surface-variant">
                        {detalle.nota}
                      </p>
                    )}
                    {servicio.note && <p className="mt-1 text-body-sm text-on-surface-variant">{servicio.note}</p>}
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          {salon.whatsappUrl && (
            <a
              href={salon.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-full bg-wine px-4 text-label-md font-semibold text-on-primary transition-colors hover:bg-wine-deep"
            >
              <Icon name="chat" size={18} />
              WhatsApp
            </a>
          )}
          {tel && (
            <a
              href={tel}
              className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-full border border-wine px-4 text-label-md font-semibold text-wine transition-colors hover:bg-wine-soft/50"
            >
              <Icon name="call" size={18} />
              Llamar
            </a>
          )}
          {salon.hasMap && (
            <a
              href={enlaceRuta(salon.latitude as number, salon.longitude as number)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-full border border-wine px-4 text-label-md font-semibold text-wine transition-colors hover:bg-wine-soft/50"
            >
              <Icon name="directions" size={18} />
              Cómo llegar
            </a>
          )}
          {!salon.hasMap && salon.mapUrl && (
            <a
              href={salon.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-full border border-wine px-4 text-label-md font-semibold text-wine transition-colors hover:bg-wine-soft/50"
            >
              <Icon name="map" size={18} />
              Ver en Google Maps
            </a>
          )}
        </div>

        {(consultado || salon.sources.length > 0) && (
          <footer className="mt-6 border-t border-wine-soft pt-3 text-body-sm text-on-surface-variant">
            {consultado && <p>Información consultada el {consultado}.</p>}
            {salon.sources.length > 0 && (
              <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                <span>Fuente{salon.sources.length > 1 ? 's' : ''}:</span>
                {salon.sources.slice(0, 3).map((url) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 text-wine underline decoration-wine/40 underline-offset-2 hover:decoration-wine"
                    title={url}
                  >
                    {nombreFuente(url)}
                    <Icon name="open_in_new" size={12} />
                  </a>
                ))}
              </p>
            )}
          </footer>
        )}
      </div>
    </div>
  );
}
