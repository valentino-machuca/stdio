"use client";

import * as React from "react";

export type SpiralLoaderProps = {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
};

export function SpiralLoader({ isDark = false, size = 24, className = "", style }: SpiralLoaderProps & { isDark: boolean }) {
  const strokeColor = isDark ? "#254C43" : "#FAFAFA";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={strokeColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{
        animation: "spin 1s linear infinite",
        ...style
      }}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </svg>
  );
}
