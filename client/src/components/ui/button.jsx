// Neo-brutalist Button (monochrome).
// Thick black border + hard offset shadow that collapses when pressed.
// variant: "default" (white bg) | "inverse" (black bg) — used for selected chips.

const base =
  "inline-flex items-center justify-center gap-2 border-2 border-black font-bold " +
  "uppercase tracking-wide transition-all select-none " +
  "shadow-[4px_4px_0_0_#000] hover:-translate-x-[1px] hover:-translate-y-[1px] " +
  "hover:shadow-[5px_5px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] " +
  "active:shadow-[1px_1px_0_0_#000] disabled:opacity-40 disabled:pointer-events-none";

const variants = {
  default: "bg-white text-black",
  inverse: "bg-black text-white",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export function Button({
  variant = "default",
  size = "md",
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
