import { useCallback, useEffect, useMemo, useRef, useState, lazy, Suspense } from 'react';
import { Header } from '@/components/Header';
import { FilterChips } from '@/components/FilterChips';
import { AdvancedFilters } from '@/components/AdvancedFilters';
import { SalonList } from '@/components/SalonList';
import { MapFloatingCard } from '@/components/MapFloatingCard';
import { SalonDetailPanel } from '@/components/SalonDetailPanel';
import { ConnectionFooter } from '@/components/ConnectionFooter';
import { Icon } from '@/components/Icon';
import { useSalones } from '@/hooks/useSalones';
import { useFiltros } from '@/hooks/useFiltros';
import { useAhora } from '@/hooks/useAhora';
import type { Salon } from '@/types/domain';

// Leaflet solo se descarga cuando hace falta pintar el mapa.
const SalonMap = lazy(() =>
  import('@/components/SalonMap').then((modulo) => ({ default: modulo.SalonMap })),
);

export default function Explorador() {
  const { salones, estado, error, actualizadoEn, recargar } = useSalones();
  const filtros = useFiltros(salones);
  const ahora = useAhora();

  const [activoId, setActivoId] = useState<string | null>(null);
  const [resaltadoId, setResaltadoId] = useState<string | null>(null);
  const [detalle, setDetalle] = useState<Salon | null>(null);
  const [avanzadosAbiertos, setAvanzadosAbiertos] = useState(false);
  const contenedorLista = useRef<HTMLDivElement>(null);

  const totales = useMemo(() => {
    const enMapa = salones.filter((s) => s.hasMap).length;
    return { total: salones.length, enMapa, sinMapa: salones.length - enMapa };
  }, [salones]);

  const salonActivo = useMemo(() => {
    const id = resaltadoId ?? activoId;
    return id ? (salones.find((s) => s.id === id) ?? null) : null;
  }, [activoId, resaltadoId, salones]);

  const salonSeleccionado = useMemo(
    () => (activoId ? (filtros.resultados.find((s) => s.id === activoId) ?? null) : null),
    [activoId, filtros.resultados],
  );

  // Si el filtro oculta el salón seleccionado, se limpia la tarjeta flotante.
  useEffect(() => {
    if (activoId && !filtros.resultados.some((s) => s.id === activoId)) {
      setActivoId(null);
    }
  }, [activoId, filtros.resultados]);

  useEffect(() => {
    const alPresionar = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape' && !detalle) setActivoId(null);
    };
    window.addEventListener('keydown', alPresionar);
    return () => window.removeEventListener('keydown', alPresionar);
  }, [detalle]);

  const seleccionarDesdeMapa = useCallback((salon: Salon) => {
    if (!salon.hasMap) {
      setDetalle(salon);
      return;
    }
    setActivoId(salon.id);
    setResaltadoId(null);

    const tarjeta = document.getElementById(`salon-${salon.id}`);
    tarjeta?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, []);

  const verDetalles = useCallback((salon: Salon) => {
    setDetalle(salon);
    if (salon.hasMap) setActivoId(salon.id);
  }, []);

  const cerrarDetalle = useCallback(() => {
    const id = detalle?.id;
    setDetalle(null);
    if (!id) return;
    window.requestAnimationFrame(() => {
      document
        .getElementById(`salon-${id}`)
        ?.querySelector<HTMLButtonElement>('button[aria-label^="Ver detalles"]')
        ?.focus();
    });
  }, [detalle]);

  const cantidadAvanzados =
    (filtros.avanzados.precioMin !== null || filtros.avanzados.precioMax !== null ? 1 : 0) +
    (filtros.avanzados.servicios.length > 0 ? 1 : 0) +
    (filtros.avanzados.abiertoAhora ? 1 : 0);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-canvas">
      <Header consulta={filtros.consulta} onConsulta={filtros.setConsulta} />

      <div className="flex min-h-0 flex-1">
        <aside
          aria-label="Listado de salones"
          className="relative hidden w-[38%] min-w-[360px] max-w-[460px] shrink-0 flex-col border-r border-outline-variant/30 bg-surface-container-low md:flex"
        >
          <div className="shrink-0 border-b border-wine-soft/70 px-4 pb-3 pt-4">
            <p className="flex items-center gap-2 text-label-sm uppercase tracking-[0.16em] text-on-surface-variant">
              <span aria-hidden="true" className="h-px w-5 bg-berry" />
              Beauty &amp; Discovery Platform
            </p>
            <h1 className="mt-1.5 text-headline-sm text-on-surface">Encuentra tu próximo salón</h1>
            <p className="mt-0.5 text-body-sm text-on-surface-variant">
              Salones de uñas, pedicure y cuidado de manos y pies en Iquitos
            </p>

            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              {estado === 'listo' ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-wine-soft/60 px-2.5 py-1 text-label-sm font-semibold text-wine">
                  <Icon name="storefront" size={14} />
                  {totales.total} salones · {totales.enMapa} en el mapa
                </span>
              ) : (
                <span
                  aria-hidden="true"
                  className={`h-[22px] animate-pulse rounded-full bg-wine-soft/60 ${estado === 'error' ? 'w-[132px] opacity-40' : 'w-[132px]'}`}
                />
              )}
              {filtros.hayFiltrosActivos && estado === 'listo' && (
                <span role="status" aria-live="polite" className="text-label-sm text-on-surface-variant">
                  {filtros.resultados.length} resultados
                </span>
              )}
            </div>

            <div className="mt-3">
              <FilterChips
                chip={filtros.chip}
                onChip={filtros.setChip}
                avanzadosAbiertos={avanzadosAbiertos}
                onToggleAvanzados={() => setAvanzadosAbiertos((valor) => !valor)}
                cantidadAvanzados={cantidadAvanzados}
              />
            </div>

            <AdvancedFilters
              abierto={avanzadosAbiertos}
              filtros={filtros.avanzados}
              rangoPrecio={filtros.rangoPrecio}
              opcionesServicio={filtros.opcionesServicio}
              totalConHorario={filtros.totalConHorario}
              onCambio={filtros.setAvanzados}
              onLimpiar={filtros.limpiarAvanzados}
            />
          </div>

          <div
            ref={contenedorLista}
            onMouseLeave={() => setResaltadoId(null)}
            className="flex-1 overflow-y-auto px-4 py-3"
          >
            {totales.sinMapa > 0 && estado === 'listo' && (
              <div className="mb-3 flex items-start gap-2 rounded-md border border-wine-soft/70 bg-surface-container-low/70 px-3 py-2 text-body-sm text-on-surface-variant">
                <Icon name="location_off" size={16} className="mt-0.5 shrink-0 text-outline" />
                <p>
                  <span className="font-semibold text-on-surface">{totales.sinMapa} salones</span> aún no
                  tienen ubicación en el mapa. Puedes verlos y contactarlos desde esta lista.
                </p>
              </div>
            )}

            <SalonList
              estado={estado}
              error={error}
              resultados={filtros.resultados}
              activoId={activoId}
              ahora={ahora}
              hayFiltros={filtros.hayFiltrosActivos}
              onResaltar={(salon) => {
                if (salon.hasMap) setResaltadoId(salon.id);
              }}
              onSeleccionar={seleccionarDesdeMapa}
              onVerDetalles={verDetalles}
              onReintentar={recargar}
              onQuitarFiltros={filtros.limpiarTodo}
            />
          </div>

          <ConnectionFooter estado={estado} actualizadoEn={actualizadoEn} total={totales.total} />

          {detalle && <SalonDetailPanel salon={detalle} ahora={ahora} onCerrar={cerrarDetalle} />}
        </aside>

        <main className="relative min-w-0 flex-1" aria-label="Mapa de salones">
          <Suspense
            fallback={
              <div
                className="flex h-full w-full flex-col items-center justify-center gap-3 bg-surface-container-low"
                role="status"
              >
                <img
                  src="/brand/glowly-isotipo.png"
                  alt=""
                  width={300}
                  height={319}
                  className="h-16 w-auto animate-pulse"
                />
                <p className="text-label-sm uppercase tracking-[0.16em] text-on-surface-variant">
                  Beauty &amp; Discovery Platform
                </p>
                <span className="sr-only">Cargando mapa…</span>
              </div>
            }
          >
            <SalonMap
              salones={filtros.resultados}
              activo={salonActivo}
              enfocar={salonSeleccionado}
              onSeleccionar={seleccionarDesdeMapa}
            />
          </Suspense>

          {!detalle && salonSeleccionado && salonSeleccionado.hasMap && (
            <MapFloatingCard
              salon={salonSeleccionado}
              ahora={ahora}
              onCerrar={() => setActivoId(null)}
              onVerDetalles={verDetalles}
            />
          )}
        </main>
      </div>
    </div>
  );
}
