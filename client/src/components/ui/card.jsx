// Neo-brutalist Card (monochrome).
// Bold black border with a hard drop shadow on a white surface.

export function Card({ className = "", ...props }) {
  return (
    <div
      className={`border-2 border-black bg-white shadow-[8px_8px_0_0_#000] ${className}`}
      {...props}
    />
  );
}
