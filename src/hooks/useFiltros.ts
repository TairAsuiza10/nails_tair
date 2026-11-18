import { useEffect, useMemo, useState } from 'react';
import { coincide, normalizar } from '@/lib/normalize';
import { evaluarHorario } from '@/lib/horario';
import { precioDesde, textoBuscable, tienePrecioPublicado } from '@/lib/mappers';
import { useAhora } from '@/hooks/useAhora';
import type { QuickFilterId, Salon } from '@/types/domain';

export type FiltrosAvanzados = {
  precioMin: number | null;
  precioMax: number | null;
  servicios: string[];
  abiertoAhora: boolean;
};

export const FILTROS_AVANZADOS_VACIOS: FiltrosAvanzados = {
  precioMin: null,
  precioMax: null,
  servicios: [],
  abiertoAhora: false,
};

export const DEBOUNCE_MS = 300;

type UseFiltros = {
  consulta: string;
  setConsulta: (valor: string) => void;
  consultaAplicada: string;
  chip: QuickFilterId;
  setChip: (chip: QuickFilterId) => void;
  avanzados: FiltrosAvanzados;
  setAvanzados: (filtros: FiltrosAvanzados) => void;
  resultados: Salon[];
  total: number;
  hayFiltrosActivos: boolean;
  limpiarTodo: () => void;
  limpiarAvanzados: () => void;
  opcionesServicio: string[];
  rangoPrecio: { min: number; max: number } | null;
  totalConHorario: number;
};

function cumpleChip(salon: Salon, chip: QuickFilterId): boolean {
  switch (chip) {
    case 'pedicure':
      return (
        /pedicur/.test(normalizar(salon.name)) ||
        salon.services.some((s) => /pedicur/.test(normalizar(s.name)))
      );
    case 'domicilio':
      return (
        salon.serviceMode === 'a_domicilio' ||
        salon.services.some((s) => /domicilio/.test(normalizar(s.name)))
      );
    case 'precio':
      return tienePrecioPublicado(salon);
    default:
      return true;
  }
}

/**
 * Búsqueda y filtros en cliente. La consulta se aplica con 300 ms de debounce;
 * chips y filtros avanzados se aplican al instante.
 */
export function useFiltros(salones: Salon[]): UseFiltros {
  const [consulta, setConsulta] = useState('');
  const [consultaAplicada, setConsultaAplicada] = useState('');
  const [chip, setChip] = useState<QuickFilterId>('todos');
  const [avanzados, setAvanzados] = useState<FiltrosAvanzados>(FILTROS_AVANZADOS_VACIOS);
  const ahora = useAhora();

  useEffect(() => {
    const id = window.setTimeout(() => setConsultaAplicada(consulta), DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [consulta]);

  const opcionesServicio = useMemo(() => {
    const nombres = new Set<string>();
    for (const salon of salones) for (const servicio of salon.services) nombres.add(servicio.name);
    return [...nombres].sort((a, b) => a.localeCompare(b, 'es'));
  }, [salones]);

  const rangoPrecio = useMemo(() => {
    const precios = salones.map(precioDesde).filter((p): p is number => p !== null);
    if (precios.length === 0) return null;
    return { min: Math.min(...precios), max: Math.max(...precios) };
  }, [salones]);

  const totalConHorario = useMemo(
    () => salones.filter((s) => evaluarHorario(s.listedHours, ahora).kind !== 'unknown').length,
    [salones, ahora],
  );

  const resultados = useMemo(() => {
    const consultaNormalizada = normalizar(consultaAplicada);

    return salones.filter((salon) => {
      if (!cumpleChip(salon, chip)) return false;

      if (consultaNormalizada && !coincide(normalizar(textoBuscable(salon)), consultaNormalizada)) {
        return false;
      }

      if (avanzados.precioMin !== null || avanzados.precioMax !== null) {
        const precio = precioDesde(salon);
        if (precio === null) return false;
        if (avanzados.precioMin !== null && precio < avanzados.precioMin) return false;
        if (avanzados.precioMax !== null && precio > avanzados.precioMax) return false;
      }

      if (avanzados.servicios.length > 0) {
        const tieneAlguno = salon.services.some((s) => avanzados.servicios.includes(s.name));
        if (!tieneAlguno) return false;
      }

      if (avanzados.abiertoAhora) {
        const estado = evaluarHorario(salon.listedHours, ahora);
        if (estado.kind !== 'open') return false;
      }

      return true;
    });
  }, [salones, chip, consultaAplicada, avanzados, ahora]);

  const hayFiltrosActivos =
    chip !== 'todos' ||
    consultaAplicada.trim().length > 0 ||
    avanzados.precioMin !== null ||
    avanzados.precioMax !== null ||
    avanzados.servicios.length > 0 ||
    avanzados.abiertoAhora;

  return {
    consulta,
    setConsulta,
    consultaAplicada,
    chip,
    setChip,
    avanzados,
    setAvanzados,
    resultados,
    total: salones.length,
    hayFiltrosActivos,
    limpiarTodo: () => {
      setConsulta('');
      setConsultaAplicada('');
      setChip('todos');
      setAvanzados(FILTROS_AVANZADOS_VACIOS);
    },
    limpiarAvanzados: () => setAvanzados(FILTROS_AVANZADOS_VACIOS),
    opcionesServicio,
    rangoPrecio,
    totalConHorario,
  };
}
