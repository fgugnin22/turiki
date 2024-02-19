import React from "react";
import "./everything.css";
const TriangleLoader = () => {
  return (
    <svg
      style={{
        animation: "loading 2s infinite"
      }}
      width="72"
      height="47"
      viewBox="0 0 72 47"
      fill="none"
    >
      <path
        d="M37.8215 44.8122C36.8159 46.0401 34.9355 46.0323 33.9401 44.7961L1.55074 4.56925C0.230747 2.92985 1.40363 0.492662 3.50837 0.501403L68.6201 0.771805C70.7248 0.780546 71.8774 3.22739 70.5438 4.85576L37.8215 44.8122Z"
        fill="url(#paint0_linear_662_1789)"
        fillOpacity="1"
        stroke="url(#paint1_linear_662_1789)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_662_1789"
          x1="8"
          y1="48"
          x2="70"
          y2="3"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#21DBD3" />
          <stop offset="1" stopColor="#18A3DC" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_662_1789"
          x1="12.5"
          y1="48"
          x2="81"
          y2="-2.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#21DBD3" />
          <stop offset="1" stopColor="#18A3DC" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default TriangleLoader;
