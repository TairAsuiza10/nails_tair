import type { Database } from '@/types/database';

/* ------------------------------------------------------------------ */
/* Filas tal cual vienen de Supabase                                   */
/* ------------------------------------------------------------------ */

export type ProviderRow = Database['public']['Tables']['pedicure_providers']['Row'];
export type ServiceRow = Database['public']['Tables']['pedicure_services']['Row'];
export type SourceRow = Database['public']['Tables']['pedicure_sources']['Row'];
export type DirectoryRow = Database['public']['Views']['pedicure_directory']['Row'];
export type MapRow = Database['public']['Views']['pedicure_map']['Row'];

/* ------------------------------------------------------------------ */
/* Enumeraciones reales del esquema (texto libre, documentado aquí)     */
/* ------------------------------------------------------------------ */

/** `pedicure_providers.service_mode` */
export type ServiceMode = 'en_local' | 'a_domicilio' | 'por_consultar';

/** `pedicure_services.price_status` */
export type PriceStatus =
  | 'anunciado'
  | 'por_consultar'
  | 'importe_del_anuncio'
  | 'promocion_vencida_desde'
  | 'paquete_sin_vigencia_confirmada';

/** `pedicure_providers.location_precision` */
export type LocationPrecision = 'referencia_de_directorio';

/**
 * Las columnas son texto libre en la base. Estos alias conservan los valores
 * conocidos para autocompletado sin romper si aparece uno nuevo.
 */
export type ServiceModeValue = ServiceMode | (string & {});
export type PriceStatusValue = PriceStatus | (string & {});

/* ------------------------------------------------------------------ */
/* Modelo de dominio usado por la interfaz                             */
/* ------------------------------------------------------------------ */

export type SalonService = {
  /** `pedicure_services.name` */
  name: string;
  /** `pedicure_services.price_pen` — puede ser null */
  pricePen: number | null;
  /** `pedicure_services.price_status` */
  priceStatus: PriceStatusValue | null;
  /** `pedicure_services.note` */
  note: string | null;
  /** `pedicure_services.source_url` */
  sourceUrl: string;
};

export type Salon = {
  /** `pedicure_providers.id` */
  id: string;
  /** `pedicure_providers.name` */
  name: string;
  /** `pedicure_providers.service_mode` */
  serviceMode: ServiceModeValue | null;
  /** `pedicure_providers.listed_area` */
  area: string | null;
  /** `pedicure_providers.address` */
  address: string | null;
  /** `pedicure_providers.map_url` (Google Maps) */
  mapUrl: string | null;
  /** `pedicure_providers.phone` */
  phone: string | null;
  /** `pedicure_providers.whatsapp_url` */
  whatsappUrl: string | null;
  /** `pedicure_providers.contact_url` */
  contactUrl: string | null;
  /** `pedicure_providers.listed_hours` (texto libre) */
  listedHours: string | null;
  /** `pedicure_providers.notes` */
  notes: string | null;
  /** `pedicure_providers.latitude` */
  latitude: number | null;
  /** `pedicure_providers.longitude` */
  longitude: number | null;
  /** `pedicure_providers.location_precision` — true si `referencia_de_directorio` */
  locationPrecision: LocationPrecision | string | null;
  /** `pedicure_providers.source_checked_on` (ISO date) */
  sourceCheckedOn: string | null;
  /** `pedicure_directory.lowest_advertised_price_pen` */
  lowestAdvertisedPricePen: number | null;
  /** Derivado: tiene coordenadas válidas para el mapa. No se inventa posición. */
  hasMap: boolean;
  /** `pedicure_services` del salón */
  services: SalonService[];
  /** `pedicure_sources.url` */
  sources: string[];
};

/** Estado de apertura calculado desde `listed_hours`. */
export type OpeningStatus =
  | { kind: 'open'; closesAt: string }
  | { kind: 'closed'; opensAt: string | null }
  | { kind: 'unknown' };

/* ------------------------------------------------------------------ */
/* Filtros de la vista explorador                                      */
/* ------------------------------------------------------------------ */

export type QuickFilterId = 'todos' | 'pedicure' | 'domicilio' | 'precio';

export type PriceRange = {
  min: number | null;
  max: number | null;
};
