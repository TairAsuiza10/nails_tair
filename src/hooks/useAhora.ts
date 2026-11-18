import { useEffect, useState } from 'react';
import { ahoraEnLima, type AhoraLima } from '@/lib/horario';

/**
 * Hora de Lima que se refresca cada minuto, para que "Abierto/Cerrado"
 * no se quede congelado en una pestaña abierta.
 */
export function useAhora(intervaloMs = 60_000): AhoraLima {
  const [ahora, setAhora] = useState<AhoraLima>(() => ahoraEnLima());

  useEffect(() => {
    const id = window.setInterval(() => setAhora(ahoraEnLima()), intervaloMs);
    return () => window.clearInterval(id);
  }, [intervaloMs]);

  return ahora;
}
