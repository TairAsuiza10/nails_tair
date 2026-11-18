/**
 * Acceso tipado a las variables de entorno.
 * Los valores viven en `.env` (ignorado por git). `.env.example` documenta los nombres.
 */

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseUrl = typeof rawUrl === 'string' ? rawUrl.trim() : '';
export const supabaseAnonKey = typeof rawKey === 'string' ? rawKey.trim() : '';

export const isSupabaseConfigured = supabaseUrl.length > 0 && supabaseAnonKey.length > 0;

export const envErrorMessage = isSupabaseConfigured
  ? null
  : 'Falta configurar Supabase. Crea un archivo .env en la raíz del proyecto con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY (puedes partir de .env.example).';
