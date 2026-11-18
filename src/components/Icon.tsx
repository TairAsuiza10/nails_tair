type IconProps = {
  name: string;
  /** Tamaño en px. Por defecto 20. */
  size?: number;
  filled?: boolean;
  className?: string;
  /** Si se pasa, el icono es decorativo y se oculta a lectores de pantalla. */
  decorative?: boolean;
};

export function Icon({ name, size = 20, filled = false, className = '', decorative = true }: IconProps) {
  return (
    <span
      aria-hidden={decorative ? 'true' : undefined}
      className={`material-symbols-outlined leading-none ${filled ? 'icon-filled' : ''} ${className}`}
      style={{ fontSize: `${size}px` }}
    >
      {name}
    </span>
  );
}
