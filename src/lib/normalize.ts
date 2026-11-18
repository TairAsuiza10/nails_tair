/**
 * Normaliza texto para búsquedas: sin acentos, sin diéresis, minúsculas
 * y espacios colapsados. "Pedicüre" → "pedicure".
 */
export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Reduce una palabra a su raíz quitando la vocal final, para que
 * "pedicura", "pedicure" y "pedicuro" se encuentren entre sí.
 */
function raiz(palabra: string): string {
  if (palabra.length >= 5 && /[aeo]$/.test(palabra)) {
    return palabra.slice(0, -1);
  }
  return palabra;
}

/**
 * ¿La consulta aparece en el texto? Compara palabra por palabra por raíz,
 * de modo que "pedicura" encuentra "Pedicüre" y "unas" encuentra "uñas".
 */
export function coincide(textoNormalizado: string, consultaNormalizada: string): boolean {
  if (!consultaNormalizada) return true;
  if (textoNormalizado.includes(consultaNormalizada)) return true;

  const palabrasTexto = textoNormalizado.split(/[^a-z0-9ñ]+/).filter(Boolean);
  const raicesTexto = palabrasTexto.map(raiz);

  return consultaNormalizada
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => {
      const raizToken = raiz(token);
      return (
        palabrasTexto.some((palabra) => palabra.startsWith(raizToken)) ||
        raicesTexto.some((r) => r.startsWith(raizToken))
      );
    });
}
