import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { Icon } from '@/components/Icon';
import { formatoPrecioCorto } from '@/lib/format';
import { precioDesde } from '@/lib/mappers';
import type { Salon } from '@/types/domain';

const CENTRO_IQUITOS: [number, number] = [-3.7437, -73.2516];

type SalonMapProps = {
  salones: Salon[];
  /** Salón resaltado (hover o selección): cambia el marcador activo. */
  activo: Salon | null;
  /** Salón al que se desplaza el mapa cuando el usuario elige uno. */
  enfocar: Salon | null;
  onSeleccionar: (salon: Salon) => void;
};

function crearIcono(salon: Salon, activo: boolean): L.DivIcon {
  const precio = precioDesde(salon);
  const tienePrecio = precio !== null;

  const ancho = tienePrecio ? 72 : 48;
  const alto = tienePrecio ? 78 : 56;

  const html = `
    <div class="bf-pin${activo ? ' is-active' : ''}">
      ${activo ? '<span class="bf-pin__halo" aria-hidden="true"></span>' : ''}
      ${tienePrecio ? `<span class="bf-pin__price" aria-hidden="true">${formatoPrecioCorto(precio)}</span>` : ''}
      <span class="bf-pin__body" aria-hidden="true"><img class="bf-pin__logo" src="/brand/glowly-isotipo-dark.png" alt="" width="300" height="319" /></span>
      <span class="bf-pin__tail" aria-hidden="true"></span>
    </div>
  `;

  return L.divIcon({
    className: 'bf-pin-wrapper',
    html,
    iconSize: [ancho, alto],
    iconAnchor: [ancho / 2, alto],
  });
}

const iconoUbicacion = L.divIcon({
  className: 'bf-user-wrapper',
  html: `
    <span class="bf-user">
      <span class="bf-user__halo" aria-hidden="true"></span>
      <span class="bf-user__dot"></span>
    </span>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

/** Ajusta la vista a los marcadores una sola vez, al entrar. */
function AjustarVista({ puntos }: { puntos: [number, number][] }) {
  const map = useMap();
  const hecho = useRef(false);

  useEffect(() => {
    if (hecho.current) return;
    if (puntos.length === 0) return;

    if (puntos.length === 1) {
      map.setView(puntos[0], 15);
    } else {
      map.fitBounds(L.latLngBounds(puntos), { padding: [72, 72], maxZoom: 15 });
    }
    hecho.current = true;
  }, [map, puntos]);

  return null;
}

/** Centra el mapa cuando cambia el salón activo (hover o clic en tarjeta). */
function CentrarEn({ salon }: { salon: Salon | null }) {
  const map = useMap();

  useEffect(() => {
    if (!salon || salon.latitude === null || salon.longitude === null) return;
    map.panTo([salon.latitude, salon.longitude], { animate: true, duration: 0.45 });
  }, [map, salon]);

  return null;
}

export function SalonMap({ salones, activo, enfocar, onSeleccionar }: SalonMapProps) {
  const mapaRef = useRef<L.Map | null>(null);
  const [ubicacion, setUbicacion] = useState<{ lat: number; lng: number } | null>(null);
  const [avisoUbicacion, setAvisoUbicacion] = useState<string | null>(null);

  const conMapa = useMemo(() => salones.filter((s) => s.hasMap), [salones]);
  const puntos = useMemo(
    () => conMapa.map((s) => [s.latitude as number, s.longitude as number] as [number, number]),
    [conMapa],
  );

  // Los iconos se generan una vez por salón y variante (normal / activo),
  // no en cada render, para evitar que Leaflet recree los marcadores.
  const iconos = useMemo(() => {
    const normales = new Map<string, L.DivIcon>();
    const activos = new Map<string, L.DivIcon>();
    for (const salon of conMapa) {
      normales.set(salon.id, crearIcono(salon, false));
      activos.set(salon.id, crearIcono(salon, true));
    }
    return { normales, activos };
  }, [conMapa]);

  const recentrar = () => {
    const map = mapaRef.current;
    if (!map) return;
    if (puntos.length === 0) {
      map.setView(CENTRO_IQUITOS, 14);
      return;
    }
    if (puntos.length === 1) {
      map.setView(puntos[0], 15);
      return;
    }
    map.fitBounds(L.latLngBounds(puntos), { padding: [72, 72], maxZoom: 15 });
  };

  const pedirUbicacion = () => {
    if (!('geolocation' in navigator)) {
      setAvisoUbicacion('Tu navegador no permite geolocalización.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (posicion) => {
        const punto = { lat: posicion.coords.latitude, lng: posicion.coords.longitude };
        setUbicacion(punto);
        setAvisoUbicacion(null);
        mapaRef.current?.setView([punto.lat, punto.lng], 15, { animate: true });
      },
      () => {
        setAvisoUbicacion('No pudimos obtener tu ubicación. Puedes buscar por zona.');
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 },
    );
  };

  return (
    <div className="relative h-full w-full">
      <MapContainer
        ref={mapaRef}
        center={CENTRO_IQUITOS}
        zoom={14}
        zoomControl={false}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>'
          maxZoom={19}
        />

        <AjustarVista puntos={puntos} />
        <CentrarEn salon={enfocar} />

        {conMapa.map((salon) => {
          const precio = precioDesde(salon);
          const titulo = `${salon.name}${precio !== null ? ` · Desde ${formatoPrecioCorto(precio)}` : ''}`;
          return (
            <Marker
              key={salon.id}
              position={[salon.latitude as number, salon.longitude as number]}
              icon={
                (activo?.id === salon.id ? iconos.activos.get(salon.id) : iconos.normales.get(salon.id)) ??
                iconos.normales.get(salon.id)
              }
              zIndexOffset={activo?.id === salon.id ? 1000 : 0}
              title={titulo}
              alt={`Salón ${titulo}`}
              keyboard
              eventHandlers={{ click: () => onSeleccionar(salon) }}
            />
          );
        })}

        {ubicacion && (
          <Marker position={[ubicacion.lat, ubicacion.lng]} icon={iconoUbicacion} title="Tu ubicación" alt="Tu ubicación" />
        )}
      </MapContainer>

      {/* Velo claro que suaviza el ruido de las calles hacia la paleta del diseño */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[350] bg-canvas/[0.18] mix-blend-screen" />

      <div className="absolute right-4 top-4 z-[1000] flex flex-col gap-2">
        <div className="flex flex-col overflow-hidden rounded-md border border-outline-variant/40 bg-surface-container-lowest/95 shadow-e2 backdrop-blur">
          <button
            type="button"
            onClick={() => mapaRef.current?.zoomIn()}
            className="flex h-10 w-10 items-center justify-center text-wine transition-colors hover:bg-surface-container-low"
            aria-label="Acercar el mapa"
            title="Acercar"
          >
            <Icon name="add" size={20} />
          </button>
          <span aria-hidden="true" className="h-px w-full bg-outline-variant/40" />
          <button
            type="button"
            onClick={() => mapaRef.current?.zoomOut()}
            className="flex h-10 w-10 items-center justify-center text-wine transition-colors hover:bg-surface-container-low"
            aria-label="Alejar el mapa"
            title="Alejar"
          >
            <Icon name="remove" size={20} />
          </button>
        </div>

        <button
          type="button"
          onClick={recentrar}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-outline-variant/40 bg-surface-container-lowest/95 text-wine shadow-e2 backdrop-blur transition-colors hover:bg-surface-container-low"
          aria-label="Centrar en los salones de Iquitos"
          title="Recentrar en Iquitos"
        >
          <Icon name="near_me" size={20} />
        </button>

        <button
          type="button"
          onClick={pedirUbicacion}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-outline-variant/40 bg-surface-container-lowest/95 text-wine shadow-e2 backdrop-blur transition-colors hover:bg-surface-container-low"
          aria-label="Usar mi ubicación"
          title="Mi ubicación"
        >
          <Icon name="my_location" size={20} />
        </button>
      </div>

      {avisoUbicacion && (
        <div
          role="status"
          className="absolute left-4 top-4 z-[1000] max-w-[260px] rounded-md border border-wine-soft bg-surface-container-lowest/95 px-3 py-2 text-body-sm text-on-surface-variant shadow-e2 backdrop-blur"
        >
          {avisoUbicacion}
        </div>
      )}

      <div className="pointer-events-none absolute bottom-4 right-4 z-[900] hidden items-center gap-2 rounded-md border border-outline-variant/40 bg-surface-container-lowest/90 px-3 py-1.5 text-body-sm text-on-surface-variant shadow-e1 backdrop-blur sm:flex">
        <Icon name="explore" size={16} className="text-wine" />
        <span>{conMapa.length} salones en el mapa</span>
      </div>
    </div>
  );
}
