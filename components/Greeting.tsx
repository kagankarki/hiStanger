"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CoffeeMark from "./CoffeeMark";

const LINES = [
  "Merhaba Ece Nehir",
  "Çok güzelsin",
  "Aslında küçük bir sorum var…",
];

/** Auto-plays a sequence of lines, then reveals a Devam button. */
export default function Greeting({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const isLast = index >= LINES.length - 1;

  useEffect(() => {
    if (isLast) return;
    const t = setTimeout(() => setIndex((i) => i + 1), 2100);
    return () => clearTimeout(t);
  }, [index, isLast]);

  return (
    <div className="flex flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10"
      >
        <CoffeeMark size={84} />
      </motion.div>

      <div className="flex min-h-[7.5rem] items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.h1
            key={index}
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-md text-balance text-4xl font-semibold tracking-tight text-espresso-800 sm:text-5xl"
          >
            {LINES[index]}
          </motion.h1>
        </AnimatePresence>
      </div>

      {/* progress dots */}
      <div className="mt-8 flex items-center gap-2">
        {LINES.map((_, i) => (
          <motion.span
            key={i}
            className="h-1.5 rounded-full bg-espresso-500"
            animate={{
              width: i === index ? 22 : 6,
              opacity: i <= index ? 1 : 0.3,
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </div>

      <AnimatePresence>
        {isLast && (
          <motion.button
            key="devam"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onDone}
            className="focus-ring mt-12 rounded-full bg-espresso-700 px-8 py-3.5 text-base font-medium text-cream-50 shadow-lg shadow-espresso-700/20 transition-colors hover:bg-espresso-800"
          >
            Devam et
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
