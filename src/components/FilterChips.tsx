import { Icon } from '@/components/Icon';
import type { QuickFilterId } from '@/types/domain';

const CHIPS: { id: QuickFilterId; etiqueta: string }[] = [
  { id: 'todos', etiqueta: 'Todos' },
  { id: 'pedicure', etiqueta: 'Pedicure' },
  { id: 'domicilio', etiqueta: 'A domicilio' },
  { id: 'precio', etiqueta: 'Con precio' },
];

type FilterChipsProps = {
  chip: QuickFilterId;
  onChip: (chip: QuickFilterId) => void;
  avanzadosAbiertos: boolean;
  onToggleAvanzados: () => void;
  cantidadAvanzados: number;
};

export function FilterChips({
  chip,
  onChip,
  avanzadosAbiertos,
  onToggleAvanzados,
  cantidadAvanzados,
}: FilterChipsProps) {
  return (
    <div className="flex items-center gap-2">
      <div role="group" aria-label="Filtrar por servicio" className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
        {CHIPS.map((opcion) => {
          const activo = chip === opcion.id;
          return (
            <button
              key={opcion.id}
              type="button"
              aria-pressed={activo}
              onClick={() => onChip(opcion.id)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-label-md transition-colors duration-150 ${
                activo
                  ? 'bg-rose font-semibold text-ink shadow-e1'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-wine-soft/70 hover:text-ink'
              }`}
            >
              {opcion.etiqueta}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onToggleAvanzados}
        aria-expanded={avanzadosAbiertos}
        aria-controls="filtros-avanzados"
        className={`relative ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors ${
          avanzadosAbiertos || cantidadAvanzados > 0
            ? 'border-wine bg-wine text-on-primary'
            : 'border-wine-soft bg-surface-container-lowest text-wine hover:bg-wine-soft/60'
        }`}
        title="Filtros avanzados"
        aria-label={
          cantidadAvanzados > 0 ? `Filtros avanzados, ${cantidadAvanzados} activos` : 'Abrir filtros avanzados'
        }
      >
        <Icon name="tune" size={18} />
        {cantidadAvanzados > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose px-1 text-[10px] font-bold text-ink">
            {cantidadAvanzados}
          </span>
        )}
      </button>
    </div>
  );
}
