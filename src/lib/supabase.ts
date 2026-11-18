import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { envErrorMessage, isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from '@/lib/env';

/**
 * Cliente Supabase (solo llave anónima, respeta RLS).
 * Es `null` si faltan las variables de entorno: usa `requireSupabase()`
 * dentro de código que ya maneja estados de error.
 */
export const supabase: SupabaseClient<Database> | null = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        headers: { 'x-application-name': 'glowly-web' },
      },
    })
  : null;

export function requireSupabase(): SupabaseClient<Database> {
  if (!supabase) {
    throw new Error(envErrorMessage ?? 'Supabase no está configurado.');
  }
  return supabase;
}

/** Tablas y vistas disponibles en el esquema público. */
export const TABLES = {
  providers: 'pedicure_providers',
  services: 'pedicure_services',
  sources: 'pedicure_sources',
  directory: 'pedicure_directory',
  map: 'pedicure_map',
} as const;
