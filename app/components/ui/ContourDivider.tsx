// Three offset wavy strokes standing in for a flat border between
// sections — like elevation contours on a survey map, staying in the
// "technical drawing" register instead of a soft illustrated wave.
export function ContourDivider() {
  return (
    <svg
      viewBox="0 0 1200 48"
      preserveAspectRatio="none"
      className="block h-8 w-full text-border"
      aria-hidden="true"
    >
      <path
        d="M0,24 C 200,4 400,44 600,24 C 800,4 1000,44 1200,24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.5"
      />
      <path
        d="M0,32 C 200,14 400,50 600,32 C 800,14 1000,50 1200,32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
      />
      <path
        d="M0,16 C 200,-2 400,36 600,16 C 800,-2 1000,36 1200,16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.2"
      />
    </svg>
  );
}
