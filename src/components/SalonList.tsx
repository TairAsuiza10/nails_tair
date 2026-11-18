import { Icon } from '@/components/Icon';
import { SalonCard } from '@/components/SalonCard';
import type { AhoraLima } from '@/lib/horario';
import type { Salon } from '@/types/domain';
import type { EstadoCarga } from '@/hooks/useSalones';

function SkeletonCard() {
  return (
    <div className="rounded-lg border border-wine-soft bg-canvas p-3.5 shadow-e1" aria-hidden="true">
      <div className="flex gap-3.5">
        <div className="h-[88px] w-[88px] shrink-0 animate-pulse rounded-md bg-surface-container-high" />
        <div className="flex-1 space-y-2 py-1">
          <div className="h-3.5 w-3/4 animate-pulse rounded-full bg-surface-container-high" />
          <div className="h-3 w-1/2 animate-pulse rounded-full bg-surface-container" />
          <div className="flex gap-1.5 pt-1">
            <div className="h-4 w-20 animate-pulse rounded bg-surface-container" />
            <div className="h-4 w-16 animate-pulse rounded bg-surface-container" />
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-wine-soft/70 pt-2.5">
        <div className="h-3.5 w-24 animate-pulse rounded-full bg-surface-container" />
        <div className="h-7 w-24 animate-pulse rounded-md bg-surface-container-high" />
      </div>
    </div>
  );
}

function EstadoVacio({ onQuitarFiltros, conFiltros }: { onQuitarFiltros: () => void; conFiltros: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-wine-soft/60 text-wine">
        <Icon name="search_off" size={24} />
      </div>
      <p className="mt-3 text-headline-sm text-on-surface">Sin resultados</p>
      <p className="mt-1 max-w-[260px] text-body-sm text-on-surface-variant">
        {conFiltros
          ? 'Ningún salón coincide con los filtros actuales. Prueba con menos criterios.'
          : 'Todavía no hay salones publicados para mostrar.'}
      </p>
      {conFiltros && (
        <button
          type="button"
          onClick={onQuitarFiltros}
          className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-wine px-5 text-label-md font-semibold text-on-primary transition-colors hover:bg-wine-deep"
        >
          <Icon name="filter_alt_off" size={18} />
          Quitar filtros
        </button>
      )}
    </div>
  );
}

function EstadoError({ mensaje, onReintentar }: { mensaje: string; onReintentar: () => void }) {
  return (
    <div className="m-1 rounded-lg border border-error/25 bg-error-container/50 p-4" role="alert">
      <div className="flex items-start gap-2">
        <Icon name="cloud_off" size={20} className="mt-0.5 shrink-0 text-error" />
        <div>
          <p className="text-label-lg font-semibold text-on-error-container">No pudimos cargar los salones</p>
          <p className="mt-1 text-body-sm text-on-error-container/90">{mensaje}</p>
          <button
            type="button"
            onClick={onReintentar}
            className="mt-3 inline-flex min-h-[40px] items-center gap-2 rounded-full bg-wine px-4 text-label-md font-semibold text-on-primary transition-colors hover:bg-wine-deep"
          >
            <Icon name="refresh" size={18} />
            Reintentar
          </button>
        </div>
      </div>
    </div>
  );
}

type SalonListProps = {
  estado: EstadoCarga;
  error: string | null;
  resultados: Salon[];
  activoId: string | null;
  ahora: AhoraLima;
  hayFiltros: boolean;
  onResaltar: (salon: Salon) => void;
  onSeleccionar: (salon: Salon) => void;
  onVerDetalles: (salon: Salon) => void;
  onReintentar: () => void;
  onQuitarFiltros: () => void;
};

export function SalonList({
  estado,
  error,
  resultados,
  activoId,
  ahora,
  hayFiltros,
  onResaltar,
  onSeleccionar,
  onVerDetalles,
  onReintentar,
  onQuitarFiltros,
}: SalonListProps) {
  if (estado === 'error') {
    return <EstadoError mensaje={error ?? 'Error de conexión con Supabase.'} onReintentar={onReintentar} />;
  }

  if (estado === 'cargando') {
    return (
      <div className="space-y-3" role="status" aria-label="Cargando salones">
        {Array.from({ length: 4 }).map((_, indice) => (
          <SkeletonCard key={indice} />
        ))}
        <span className="sr-only">Cargando salones…</span>
      </div>
    );
  }

  if (resultados.length === 0) {
    return <EstadoVacio onQuitarFiltros={onQuitarFiltros} conFiltros={hayFiltros} />;
  }

  return (
    <div className="space-y-3">
      {resultados.map((salon) => (
        <SalonCard
          key={salon.id}
          salon={salon}
          activo={activoId === salon.id}
          ahora={ahora}
          onResaltar={onResaltar}
          onSeleccionar={onSeleccionar}
          onVerDetalles={onVerDetalles}
        />
      ))}
    </div>
  );
}
