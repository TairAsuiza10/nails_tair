const precioFormatter = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const precioCortoFormatter = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** "S/ 20.00" */
export function formatoPrecio(valor: number): string {
  return precioFormatter.format(valor).replace('PEN', 'S/').trim();
}

/** "S/ 20" — para los marcadores del mapa */
export function formatoPrecioCorto(valor: number): string {
  return precioCortoFormatter.format(valor).replace('PEN', 'S/').trim();
}

const PARTICULAS = new Set(['de', 'del', 'la', 'el', 'los', 'las', 'y', 'e', 'en', 'por', 'a', 'by', 'the']);

/** Iniciales para el placeholder de las tarjetas (no hay fotos en la base). */
export function iniciales(nombre: string): string {
  const palabras = nombre
    .replace(/[•·|/\\]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .filter((palabra) => !PARTICULAS.has(palabra.toLowerCase()));

  if (palabras.length === 0) return '?';
  if (palabras.length === 1) return palabras[0].slice(0, 2).toUpperCase();
  return (palabras[0][0] + palabras[1][0]).toUpperCase();
}

/** Enlace de llamada seguro: solo si el teléfono tiene dígitos. */
export function enlaceTel(telefono: string | null): string | null {
  if (!telefono) return null;
  const limpio = telefono.replace(/[^\d+]/g, '');
  return limpio.replace(/\D/g, '').length >= 6 ? `tel:${limpio}` : null;
}

/** Ruta en Google Maps usando las coordenadas reales. */
export function enlaceRuta(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

/** Fecha legible: "12 de noviembre de 2026" */
export function formatoFecha(iso: string | null): string | null {
  if (!iso) return null;
  const fecha = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(fecha.getTime())) return null;
  return new Intl.DateTimeFormat('es-PE', { dateStyle: 'long' }).format(fecha);
}
