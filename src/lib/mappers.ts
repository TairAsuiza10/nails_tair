import type {
  DirectoryRow,
  PriceStatusValue,
  Salon,
  SalonService,
  ServiceModeValue,
  ServiceRow,
  SourceRow,
} from '@/types/domain';

function coordenadaValida(lat: number | null, lng: number | null): boolean {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

function aServicio(row: ServiceRow): SalonService {
  return {
    name: row.name,
    pricePen: row.price_pen,
    priceStatus: (row.price_status as PriceStatusValue | null) ?? null,
    note: row.note,
    sourceUrl: row.source_url,
  };
}

/**
 * Une las tres tablas en el modelo de dominio.
 * No inventa datos: los campos ausentes quedan en `null`.
 */
export function construirSalones(
  directorio: DirectoryRow[],
  servicios: ServiceRow[],
  fuentes: SourceRow[],
): Salon[] {
  const serviciosPorSalon = new Map<string, SalonService[]>();
  for (const fila of servicios) {
    const lista = serviciosPorSalon.get(fila.provider_id) ?? [];
    lista.push(aServicio(fila));
    serviciosPorSalon.set(fila.provider_id, lista);
  }

  const fuentesPorSalon = new Map<string, string[]>();
  for (const fila of fuentes) {
    const lista = fuentesPorSalon.get(fila.provider_id) ?? [];
    lista.push(fila.url);
    fuentesPorSalon.set(fila.provider_id, lista);
  }

  const salones: Salon[] = [];

  for (const fila of directorio) {
    if (!fila.id || !fila.name) continue;

    salones.push({
      id: fila.id,
      name: fila.name,
      serviceMode: (fila.service_mode as ServiceModeValue | null) ?? null,
      area: fila.listed_area,
      address: fila.address,
      mapUrl: fila.map_url,
      phone: fila.phone,
      whatsappUrl: fila.whatsapp_url,
      contactUrl: fila.contact_url,
      listedHours: fila.listed_hours,
      notes: fila.notes,
      latitude: fila.latitude,
      longitude: fila.longitude,
      locationPrecision: fila.location_precision,
      sourceCheckedOn: fila.source_checked_on,
      lowestAdvertisedPricePen: fila.lowest_advertised_price_pen,
      hasMap: coordenadaValida(fila.latitude, fila.longitude),
      services: (serviciosPorSalon.get(fila.id) ?? []).sort((a, b) => a.name.localeCompare(b.name, 'es')),
      sources: fuentesPorSalon.get(fila.id) ?? [],
    });
  }

  return salones.sort((a, b) => a.name.localeCompare(b.name, 'es'));
}

/** Precio "desde" real: del directorio o el menor precio anunciado de sus servicios. */
export function precioDesde(salon: Salon): number | null {
  if (salon.lowestAdvertisedPricePen !== null) return salon.lowestAdvertisedPricePen;

  const anunciados = salon.services
    .filter((s) => s.priceStatus === 'anunciado' && s.pricePen !== null)
    .map((s) => s.pricePen as number);

  return anunciados.length > 0 ? Math.min(...anunciados) : null;
}

/** ¿Hay algún servicio con precio publicado y vigente? */
export function tienePrecioPublicado(salon: Salon): boolean {
  return salon.lowestAdvertisedPricePen !== null || salon.services.some((s) => s.priceStatus === 'anunciado' && s.pricePen !== null);
}

/** Texto buscable: nombre, zona, dirección y servicios. */
export function textoBuscable(salon: Salon): string {
  return [salon.name, salon.area, salon.address, ...salon.services.map((s) => s.name)]
    .filter((v): v is string => Boolean(v))
    .join(' ');
}

/** Enlace de contacto preferente: WhatsApp → teléfono → contacto genérico. */
export function enlaceContacto(salon: Salon): string | null {
  if (salon.whatsappUrl) return salon.whatsappUrl;
  if (salon.contactUrl) return salon.contactUrl;
  if (salon.phone) return `tel:${salon.phone.replace(/[^\d+]/g, '')}`;
  return null;
}
