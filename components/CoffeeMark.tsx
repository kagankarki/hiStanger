"use client";

import { motion } from "framer-motion";

/**
 * A calm, minimal coffee cup with a gently rising steam line.
 * Used as the visual anchor throughout the flow (no hearts).
 */
export default function CoffeeMark({ size = 72 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className="drop-shadow-[0_8px_20px_rgba(80,60,44,0.18)]"
    >
      {/* steam */}
      <motion.path
        d="M26 14c2-3-2-5 0-8"
        stroke="#b39a80"
        strokeWidth="2.2"
        strokeLinecap="round"
        initial={{ opacity: 0, pathLength: 0 }}
        animate={{ opacity: [0, 0.9, 0.4], pathLength: 1, y: [-1, -3, -1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M34 14c2-3-2-5 0-8"
        stroke="#c9b49b"
        strokeWidth="2.2"
        strokeLinecap="round"
        initial={{ opacity: 0, pathLength: 0 }}
        animate={{ opacity: [0, 0.8, 0.3], pathLength: 1, y: [-1, -4, -1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      />
      {/* cup */}
      <path
        d="M14 26h30v10a13 13 0 0 1-13 13h-4A13 13 0 0 1 14 36V26Z"
        fill="#ffffff"
        stroke="#503c2c"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {/* coffee surface */}
      <path
        d="M17.5 29.5h23"
        stroke="#8a6d52"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* handle */}
      <path
        d="M44 29h4a6 6 0 0 1 0 12h-3"
        fill="none"
        stroke="#503c2c"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* saucer */}
      <path
        d="M12 54h34"
        stroke="#503c2c"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
