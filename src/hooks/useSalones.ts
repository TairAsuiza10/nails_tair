import { useCallback, useEffect, useRef, useState } from 'react';
import { requireSupabase } from '@/lib/supabase';
import { construirSalones } from '@/lib/mappers';
import { envErrorMessage, isSupabaseConfigured } from '@/lib/env';
import type { Salon } from '@/types/domain';

export type EstadoCarga = 'cargando' | 'listo' | 'error';

export type ResultadoSalones = {
  salones: Salon[];
  estado: EstadoCarga;
  error: string | null;
  latenciaMs: number | null;
  actualizadoEn: Date | null;
  recargar: () => void;
};

/**
 * Carga una sola vez el directorio, los servicios y las fuentes,
 * y los combina en el modelo `Salon`. El filtrado posterior es en cliente.
 */
export function useSalones(): ResultadoSalones {
  const [salones, setSalones] = useState<Salon[]>([]);
  const [estado, setEstado] = useState<EstadoCarga>('cargando');
  const [error, setError] = useState<string | null>(null);
  const [latenciaMs, setLatenciaMs] = useState<number | null>(null);
  const [actualizadoEn, setActualizadoEn] = useState<Date | null>(null);
  const intento = useRef(0);

  const cargar = useCallback(async () => {
    intento.current += 1;
    const actual = intento.current;

    if (!isSupabaseConfigured) {
      setSalones([]);
      setError(envErrorMessage ?? 'Supabase no está configurado.');
      setEstado('error');
      return;
    }

    setEstado('cargando');
    setError(null);

    const inicio = performance.now();

    try {
      const cliente = requireSupabase();

      const [directorio, servicios, fuentes] = await Promise.all([
        cliente.from('pedicure_directory').select('*'),
        cliente.from('pedicure_services').select('*'),
        cliente.from('pedicure_sources').select('*'),
      ]);

      const primerError = directorio.error ?? servicios.error ?? fuentes.error;
      if (primerError) throw new Error(primerError.message);

      if (actual !== intento.current) return;

      setSalones(construirSalones(directorio.data ?? [], servicios.data ?? [], fuentes.data ?? []));
      setLatenciaMs(Math.round(performance.now() - inicio));
      setActualizadoEn(new Date());
      setEstado('listo');
    } catch (causa) {
      if (actual !== intento.current) return;
      setError(
        causa instanceof Error
          ? import.meta.env.DEV
            ? `No pudimos cargar los salones (${causa.message}). Revisa tu conexión e inténtalo de nuevo.`
            : 'No pudimos cargar los salones. Revisa tu conexión e inténtalo de nuevo.'
          : 'No pudimos cargar los salones. Revisa tu conexión e inténtalo de nuevo.',
      );
      setEstado('error');
    }
  }, []);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  return {
    salones,
    estado,
    error,
    latenciaMs,
    actualizadoEn,
    recargar: () => {
      void cargar();
    },
  };
}
