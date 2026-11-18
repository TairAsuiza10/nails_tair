import type { OpeningStatus } from '@/types/domain';
import { normalizar } from '@/lib/normalize';

type DiaHorario =
  | { tipo: 'horas'; abre: number; cierra: number }
  | { tipo: 'cerrado' }
  | { tipo: 'desconocido' };

const NOMBRES_DIA = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

const DIAS_INDICE: Record<string, number> = {
  dom: 0,
  lun: 1,
  mar: 2,
  mie: 3,
  jue: 4,
  vie: 5,
  sab: 6,
};

const RANGO_HORAS = /(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/;
const TOKEN_DIA = /\b(lun|mar|mie|jue|vie|sab|dom)[a-z]*/g;

function aMinutos(hora: string, minuto: string): number {
  return Number(hora) * 60 + Number(minuto);
}

function formatearMinutos(total: number): string {
  const horas = Math.floor(total / 60) % 24;
  const minutos = total % 60;
  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
}

/**
 * Días cubiertos por un segmento como "Lun–sáb" o "Sáb y dom".
 * Devuelve null si no se reconoce ninguno.
 */
function diasDelSegmento(prefijo: string): number[] | null {
  const texto = normalizar(prefijo);
  const coincidencias = [...texto.matchAll(TOKEN_DIA)];

  if (coincidencias.length === 0) return null;

  const indices = coincidencias.map((m) => DIAS_INDICE[m[1]]);

  if (coincidencias.length >= 2) {
    const primero = coincidencias[0];
    const segundo = coincidencias[1];
    const entre = texto.slice((primero.index ?? 0) + primero[0].length, segundo.index ?? 0);

    // "Lun–sáb" / "Lun-vie" → rango continuo
    if (entre.includes('-')) {
      const desde = indices[0];
      const hasta = indices[1];
      const dias: number[] = [];
      let actual = desde;
      for (let i = 0; i < 7; i += 1) {
        dias.push(actual);
        if (actual === hasta) break;
        actual = (actual + 1) % 7;
      }
      return dias;
    }
  }

  return [...new Set(indices)];
}

/**
 * Parser conservador de `listed_hours` (texto libre).
 * Solo reconoce los formatos que existen en la base:
 *   "Lun–sáb 09:00–21:00. Dom 10:00–15:00."
 *   "Lun–vie 13:00–17:00. Sáb 08:30–19:30. Dom cerrado."
 *   "Lun–sáb 09:00–20:00. Domingos previa cita."
 * Cualquier día no reconocido queda como "desconocido", nunca como cerrado.
 */
export function analizarHorario(listedHours: string | null): DiaHorario[] {
  const resultado: DiaHorario[] = Array.from({ length: 7 }, () => ({ tipo: 'desconocido' as const }));
  if (!listedHours) return resultado;

  const limpio = listedHours.replace(/[\u2013\u2014\u2212]/g, '-').replace(/\s+/g, ' ').trim();
  const segmentos = limpio
    .split('.')
    .map((s) => s.trim())
    .filter(Boolean);

  for (const segmento of segmentos) {
    const rango = segmento.match(RANGO_HORAS);
    const prefijo = rango ? segmento.slice(0, rango.index ?? 0) : segmento;
    const dias = diasDelSegmento(prefijo);
    if (!dias) continue;

    if (rango) {
      const abre = aMinutos(rango[1], rango[2]);
      const cierra = aMinutos(rango[3], rango[4]);
      for (const dia of dias) {
        resultado[dia] = { tipo: 'horas', abre, cierra };
      }
      continue;
    }

    const texto = normalizar(segmento);
    if (texto.includes('cerrado')) {
      for (const dia of dias) resultado[dia] = { tipo: 'cerrado' };
    }
    // "previa cita" y similares se quedan como desconocido: no afirmamos nada.
  }

  return resultado;
}

export type AhoraLima = { dia: number; minutos: number };

const DIAS_EN: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

let formateadorLima: Intl.DateTimeFormat | null = null;

/** Hora actual en America/Lima, independiente de la zona del navegador. */
export function ahoraEnLima(fecha: Date = new Date()): AhoraLima {
  formateadorLima ??= new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Lima',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });

  const partes = formateadorLima.formatToParts(fecha);
  const valor = (tipo: string) => partes.find((p) => p.type === tipo)?.value ?? '';

  const dia = DIAS_EN[valor('weekday')] ?? fecha.getUTCDay();
  const hora = Number(valor('hour')) % 24;
  const minuto = Number(valor('minute'));

  return { dia, minutos: hora * 60 + minuto };
}

function proximaApertura(horarios: DiaHorario[], ahora: AhoraLima): string | null {
  for (let offset = 0; offset < 7; offset += 1) {
    const dia = (ahora.dia + offset) % 7;
    const horario = horarios[dia];
    if (horario.tipo !== 'horas') continue;

    if (offset === 0 && ahora.minutos >= horario.abre) continue;

    const hora = formatearMinutos(horario.abre);
    if (offset === 0) return `hoy a las ${hora}`;
    if (offset === 1) return `mañana a las ${hora}`;
    return `el ${NOMBRES_DIA[dia]} a las ${hora}`;
  }
  return null;
}

const DESCONOCIDO: OpeningStatus = { kind: 'unknown' };

/** Calcula el estado de apertura. Si hay cualquier duda, devuelve `unknown`. */
export function evaluarHorario(listedHours: string | null, ahora: AhoraLima = ahoraEnLima()): OpeningStatus {
  if (!listedHours) return DESCONOCIDO;

  const horarios = analizarHorario(listedHours);
  const hoy = horarios[ahora.dia];

  if (hoy.tipo === 'horas') {
    if (ahora.minutos >= hoy.abre && ahora.minutos < hoy.cierra) {
      return { kind: 'open', closesAt: formatearMinutos(hoy.cierra) };
    }
    return { kind: 'closed', opensAt: proximaApertura(horarios, ahora) };
  }

  if (hoy.tipo === 'cerrado') {
    return { kind: 'closed', opensAt: proximaApertura(horarios, ahora) };
  }

  return DESCONOCIDO;
}

export type EstadoLegible = {
  etiqueta: string;
  detalle: string | null;
  tono: 'abierto' | 'cerrado' | 'desconocido';
};

/** Traduce el estado a texto para la interfaz. */
export function estadoLegible(estado: OpeningStatus): EstadoLegible {
  switch (estado.kind) {
    case 'open':
      return { etiqueta: 'Abierto', detalle: `Cierra a las ${estado.closesAt}`, tono: 'abierto' };
    case 'closed':
      return {
        etiqueta: 'Cerrado',
        detalle: estado.opensAt ? `Abre ${estado.opensAt}` : null,
        tono: 'cerrado',
      };
    default:
      return { etiqueta: 'Horario por consultar', detalle: null, tono: 'desconocido' };
  }
}
