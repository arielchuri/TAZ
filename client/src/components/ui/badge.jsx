// Neo-brutalist Badge (monochrome).
// Small inline label for category tags / urgent flags.
// variant: "default" (white bg) | "inverse" (black bg, e.g. urgent).

const variants = {
  default: "bg-white text-black",
  inverse: "bg-black text-white",
};

export function Badge({ variant = "default", className = "", ...props }) {
  return (
    <span
      className={
        "inline-flex items-center border-2 border-black px-2 py-0.5 " +
        "text-xs font-bold uppercase tracking-wide " +
        variants[variant] + " " + className
      }
      {...props}
    />
  );
}
