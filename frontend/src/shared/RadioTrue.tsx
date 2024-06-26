import React from "react";

const RadioTrue = () => {
  return (
    <svg
      className=" w-6 h-6 lg:w-[28px] lg:h-[28px]"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.5"
        y="0.5"
        width="27"
        height="27"
        rx="13.5"
        stroke="url(#paint0_linear_0_1)"
      />
      <rect
        x="6.5"
        y="6.5"
        width="15"
        height="15"
        rx="7.5"
        fill="url(#paint1_linear_0_1)"
        stroke="url(#paint2_linear_0_1)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_0_1"
          x1="28"
          y1="0"
          x2="0"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#21DBD3" />
          <stop offset="0.9999" stopColor="#18A3DC" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_0_1"
          x1="24.8"
          y1="1.2"
          x2="3.6"
          y2="25.2"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#21DBD3" />
          <stop offset="0.951734" stopColor="#18A3DC" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_0_1"
          x1="22"
          y1="6"
          x2="6"
          y2="22"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#21DBD3" />
          <stop offset="0.9999" stopColor="#18A3DC" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default RadioTrue;
