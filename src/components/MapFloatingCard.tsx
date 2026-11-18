import { Icon } from '@/components/Icon';
import { estadoLegible, evaluarHorario, type AhoraLima } from '@/lib/horario';
import { enlaceRuta, formatoPrecio } from '@/lib/format';
import { precioDesde } from '@/lib/mappers';
import type { Salon } from '@/types/domain';

type MapFloatingCardProps = {
  salon: Salon;
  ahora: AhoraLima;
  onCerrar: () => void;
  onVerDetalles: (salon: Salon) => void;
};

export function MapFloatingCard({ salon, ahora, onCerrar, onVerDetalles }: MapFloatingCardProps) {
  const precio = precioDesde(salon);
  const estado = estadoLegible(evaluarHorario(salon.listedHours, ahora));

  const tono =
    estado.tono === 'abierto'
      ? 'bg-emerald/10 text-emerald'
      : estado.tono === 'cerrado'
        ? 'bg-surface-container text-on-surface-variant'
        : 'bg-surface-container text-on-surface-variant';

  return (
    <div className="animate-sheet-up absolute bottom-4 left-4 z-[1000] w-[min(340px,calc(100%-2rem))] rounded-xl border border-wine-soft bg-surface-container-lowest/95 p-3.5 shadow-e3 backdrop-blur">
      <div className="flex items-start justify-between gap-2">
        <span className="rounded-full bg-wine-soft/70 px-2 py-0.5 text-label-sm uppercase tracking-[0.06em] text-wine">
          En el mapa
        </span>
        <button
          type="button"
          onClick={onCerrar}
          className="flex h-7 w-7 items-center justify-center rounded-full text-outline transition-colors hover:bg-surface-container hover:text-on-surface"
          aria-label="Cerrar tarjeta del salón"
        >
          <Icon name="close" size={16} />
        </button>
      </div>

      <h3 className="mt-1.5 truncate text-[15px] font-bold text-on-surface">{salon.name}</h3>
      <p className="mt-0.5 flex items-center gap-1 truncate text-body-sm text-on-surface-variant">
        <Icon name="location_on" size={14} className="shrink-0 text-wine" />
        <span className="truncate">
          {[salon.address, salon.area].filter(Boolean).join(' · ') || 'Ubicación referencial'}
        </span>
      </p>

      <div className="mt-2 flex items-center justify-between gap-2">
        <span className={`text-label-md ${precio !== null ? 'font-bold text-wine' : 'italic text-on-surface-variant'}`}>
          {precio !== null ? `Desde ${formatoPrecio(precio)}` : 'Precio a consultar'}
        </span>
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${tono}`}>{estado.etiqueta}</span>
      </div>

      {estado.detalle && <p className="mt-0.5 text-right text-[11px] text-on-surface-variant">{estado.detalle}</p>}

      {salon.locationPrecision === 'referencia_de_directorio' && (
        <p className="mt-1 text-[11px] text-on-surface-variant">Ubicación referencial del directorio.</p>
      )}

      <div className="mt-3 flex items-center gap-2 border-t border-wine-soft/70 pt-2.5">
        <button
          type="button"
          onClick={() => onVerDetalles(salon)}
          className="flex-1 rounded-md bg-wine px-3 py-2 text-label-md font-semibold text-on-primary transition-colors hover:bg-wine-deep"
        >
          Ver detalles completos
        </button>
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
      </div>
    </div>
  );
}
