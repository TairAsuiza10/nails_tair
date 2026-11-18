import { Icon } from '@/components/Icon';
import type { FiltrosAvanzados } from '@/hooks/useFiltros';

type AdvancedFiltersProps = {
  abierto: boolean;
  filtros: FiltrosAvanzados;
  rangoPrecio: { min: number; max: number } | null;
  opcionesServicio: string[];
  totalConHorario: number;
  onCambio: (filtros: FiltrosAvanzados) => void;
  onLimpiar: () => void;
};

function aNumero(valor: string): number | null {
  if (valor.trim() === '') return null;
  const numero = Number(valor);
  return Number.isFinite(numero) && numero >= 0 ? numero : null;
}

export function AdvancedFilters({
  abierto,
  filtros,
  rangoPrecio,
  opcionesServicio,
  totalConHorario,
  onCambio,
  onLimpiar,
}: AdvancedFiltersProps) {
  const alternarServicio = (nombre: string) => {
    const seleccionados = filtros.servicios.includes(nombre)
      ? filtros.servicios.filter((s) => s !== nombre)
      : [...filtros.servicios, nombre];
    onCambio({ ...filtros, servicios: seleccionados });
  };

  return (
    <div id="filtros-avanzados" hidden={!abierto} className="mt-3 rounded-md border border-wine-soft bg-surface-container-low/60 p-3">
      <fieldset>
        <legend className="flex items-center gap-1.5 text-label-md uppercase tracking-[0.04em] text-on-surface-variant">
          <Icon name="payments" size={16} className="text-wine" />
          Rango de precio
        </legend>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1">
            <label htmlFor="precio-min" className="sr-only">
              Precio mínimo en soles
            </label>
            <input
              id="precio-min"
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              value={filtros.precioMin ?? ''}
              onChange={(evento) => onCambio({ ...filtros, precioMin: aNumero(evento.target.value) })}
              placeholder={rangoPrecio ? `S/ ${rangoPrecio.min}` : 'S/ mín.'}
              className="w-full rounded-md border border-outline-variant/60 bg-surface-container-lowest px-2.5 py-1.5 text-body-sm text-on-surface placeholder:text-outline focus:border-berry focus:outline-none"
            />
          </div>
          <span aria-hidden="true" className="text-on-surface-variant">
            –
          </span>
          <div className="flex-1">
            <label htmlFor="precio-max" className="sr-only">
              Precio máximo en soles
            </label>
            <input
              id="precio-max"
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              value={filtros.precioMax ?? ''}
              onChange={(evento) => onCambio({ ...filtros, precioMax: aNumero(evento.target.value) })}
              placeholder={rangoPrecio ? `S/ ${rangoPrecio.max}` : 'S/ máx.'}
              className="w-full rounded-md border border-outline-variant/60 bg-surface-container-lowest px-2.5 py-1.5 text-body-sm text-on-surface placeholder:text-outline focus:border-berry focus:outline-none"
            />
          </div>
        </div>
        <p className="mt-1.5 text-body-sm text-on-surface-variant">
          Solo se consideran salones con precio publicado.
        </p>
      </fieldset>

      <fieldset className="mt-4">
        <legend className="text-label-md uppercase tracking-[0.04em] text-on-surface-variant">
          Servicios publicados
        </legend>
        <div className="no-scrollbar mt-2 max-h-44 overflow-y-auto pr-1">
          {opcionesServicio.map((nombre) => (
            <label
              key={nombre}
              className="flex cursor-pointer items-start gap-2 rounded-sm px-1 py-1.5 text-body-sm text-on-surface hover:bg-wine-soft/40"
            >
              <input
                type="checkbox"
                checked={filtros.servicios.includes(nombre)}
                onChange={() => alternarServicio(nombre)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded-sm border-outline-variant accent-wine"
              />
              <span>{nombre}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="mt-3 flex cursor-pointer items-start gap-2 rounded-sm px-1 py-1.5 hover:bg-wine-soft/40">
        <input
          type="checkbox"
          checked={filtros.abiertoAhora}
          onChange={(evento) => onCambio({ ...filtros, abiertoAhora: evento.target.checked })}
          className="mt-0.5 h-4 w-4 shrink-0 rounded-sm border-outline-variant accent-wine"
        />
        <span className="text-body-sm text-on-surface">
          Abierto ahora
          <span className="block text-body-sm text-on-surface-variant">
            {totalConHorario > 0
              ? `${totalConHorario} salones publican horario`
              : 'Ningún salón publica horario'}
          </span>
        </span>
      </label>

      <button
        type="button"
        onClick={onLimpiar}
        className="mt-3 w-full rounded-full border border-wine-soft px-3 py-1.5 text-label-md text-wine transition-colors hover:bg-wine-soft/50"
      >
        Limpiar filtros
      </button>
    </div>
  );
}
