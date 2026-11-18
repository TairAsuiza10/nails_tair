import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/Icon';

type HeaderProps = {
  consulta: string;
  onConsulta: (valor: string) => void;
};

export function Header({ consulta, onConsulta }: HeaderProps) {
  const [aviso, setAviso] = useState<string | null>(null);
  const temporizador = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (temporizador.current !== null) window.clearTimeout(temporizador.current);
    };
  }, []);

  const proximamente = (mensaje: string) => {
    setAviso(mensaje);
    if (temporizador.current !== null) window.clearTimeout(temporizador.current);
    temporizador.current = window.setTimeout(() => setAviso(null), 2600);
  };

  return (
    <>
      <header className="relative z-30 flex h-16 shrink-0 items-center gap-3 border-b border-wine-soft glass-panel px-4 lg:gap-4 lg:px-6">
        <Link
          to="/"
          className="flex shrink-0 items-center rounded-md"
          aria-label="GLOWLY · Beauty & Discovery Platform · Ir al inicio"
        >
          <img
            src="/brand/glowly-logo-compact.png"
            alt="GLOWLY"
            width={692}
            height={219}
            className="h-8 w-auto sm:h-9"
          />
        </Link>

        <span aria-hidden="true" className="hidden h-8 w-px bg-wine-soft lg:block" />
        <p className="hidden shrink-0 text-label-md text-on-surface-variant lg:block">Iquitos, Perú</p>

        <form
          role="search"
          className="mx-auto hidden w-full max-w-xl md:block"
          onSubmit={(evento) => evento.preventDefault()}
        >
          <div className="flex items-center gap-2 rounded-full border border-outline-variant/50 bg-surface-container-low px-4 py-2 shadow-e1 transition-colors focus-within:border-berry focus-within:bg-surface-container-lowest">
            <Icon name="search" size={20} className="text-outline" />
            <label htmlFor="busqueda-salones" className="sr-only">
              Buscar salones por nombre, zona, dirección o servicio
            </label>
            <input
              id="busqueda-salones"
              type="text"
              value={consulta}
              onChange={(evento) => onConsulta(evento.target.value)}
              placeholder="¿Qué servicio estás buscando?"
              autoComplete="off"
              className="min-w-0 flex-1 border-none bg-transparent p-0 text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-0"
            />
            {consulta.length > 0 && (
              <button
                type="button"
                onClick={() => onConsulta('')}
                className="flex h-8 w-8 items-center justify-center rounded-full text-outline transition-colors hover:bg-surface-container hover:text-on-surface"
                aria-label="Limpiar búsqueda"
              >
                <Icon name="close" size={18} />
              </button>
            )}
            <span aria-hidden="true" className="mx-1 h-5 w-px bg-outline-variant/60" />
            <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-surface-container-lowest px-2.5 py-1 text-label-md text-wine shadow-e1">
              <Icon name="location_on" size={16} filled />
              Iquitos, Loreto
            </span>
          </div>
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => proximamente('Favoritos llegará próximamente')}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-2 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-wine"
            title="Favoritos (próximamente)"
          >
            <Icon name="favorite" size={20} className="text-berry" />
            <span className="hidden text-label-md lg:inline">Favoritos</span>
          </button>

          <button
            type="button"
            onClick={() => proximamente('El panel «Soy un negocio» llegará próximamente')}
            className="hidden items-center rounded-full border border-wine px-4 py-2 text-label-md text-wine transition-colors hover:bg-wine-soft/50 lg:inline-flex"
          >
            Soy un negocio
          </button>

          <button
            type="button"
            onClick={() => proximamente('Tu perfil llegará próximamente')}
            className="ml-1 flex h-9 w-9 items-center justify-center rounded-full border border-wine-soft bg-surface-container text-wine transition-colors hover:bg-wine-soft/60"
            aria-label="Perfil (próximamente)"
            title="Perfil (próximamente)"
          >
            <Icon name="person" size={20} />
          </button>
        </div>
      </header>

      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed left-1/2 top-20 z-50 -translate-x-1/2"
      >
        {aviso && (
          <div className="animate-sheet-up rounded-full bg-ink px-4 py-2 text-body-sm text-white shadow-e2">
            {aviso}
          </div>
        )}
      </div>
    </>
  );
}
