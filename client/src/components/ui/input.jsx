// Neo-brutalist Input (monochrome).
// Single-line text input with a thick black border and inset focus shadow.

export function Input({ className = "", type = "text", ...props }) {
  return (
    <input
      type={type}
      className={
        "w-full border-2 border-black bg-white px-3 py-2 text-base text-black " +
        "placeholder:text-neutral-500 focus:outline-none " +
        "focus:shadow-[4px_4px_0_0_#000] " + className
      }
      {...props}
    />
  );
}
