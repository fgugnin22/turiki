export const Angle = ({ color }: { color: string }) => (
  <svg
    className="absolute z-30 right-2 top-2 hidden lg:block"
    width="12"
    height="13"
    viewBox="0 0 12 13"
    fill="none"
  >
    <path
      d="M10.6413 0.46167H1.59531C0.718152 0.46167 0.266014 1.51048 0.86824 2.14823L9.91421 11.7279C10.5354 12.3857 11.6413 11.9461 11.6413 11.0413V1.46167C11.6413 0.909385 11.1936 0.46167 10.6413 0.46167Z"
      fill={color}
    />
  </svg>
);
