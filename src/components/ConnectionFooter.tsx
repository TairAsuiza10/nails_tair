import type { EstadoCarga } from '@/hooks/useSalones';

type ConnectionFooterProps = {
  estado: EstadoCarga;
  actualizadoEn: Date | null;
  total: number;
};

const horaCorta = new Intl.DateTimeFormat('es-PE', { hour: '2-digit', minute: '2-digit' });

export function ConnectionFooter({ estado, actualizadoEn, total }: ConnectionFooterProps) {
  const punto =
    estado === 'listo' ? 'bg-emerald' : estado === 'error' ? 'bg-error' : 'bg-outline';

  const texto =
    estado === 'listo'
      ? actualizadoEn
        ? `Datos en vivo · ${horaCorta.format(actualizadoEn)}`
        : 'Datos en vivo'
      : estado === 'error'
        ? 'Sin conexión con Supabase'
        : 'Conectando…';

  return (
    <footer className="flex shrink-0 items-center justify-between gap-2 border-t border-wine-soft/70 bg-surface-container/70 px-3 py-2 text-label-sm text-on-surface-variant">
      <span className="flex items-center gap-1.5" role="status" aria-live="polite">
        <span
          aria-hidden="true"
          className={`h-1.5 w-1.5 rounded-full ${punto} ${estado === 'cargando' ? 'animate-pulse' : ''}`}
        />
        <span>{texto}</span>
      </span>
      <span className="font-medium text-on-surface-variant">
        {estado === 'listo' ? `${total} salones` : null}
      </span>
    </footer>
  );
}
