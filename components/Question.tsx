"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CoffeeMark from "./CoffeeMark";

/** Funny messages shown as the "Hayır" button keeps escaping. */
const NO_MESSAGES = [
  "Mala yatma, yanlışlıkla bastın herhalde 😅",
  "Emin misin? Bir daha düşün 🤔",
  "Bu buton biraz utangaç oldu…",
  "Kahve çok güzel olacak ama 👀",
  "Yapma ya 🥲",
  "Tamam tamam, son şansın: Evet 😌",
];

export default function Question({ onYes }: { onYes: () => void }) {
  const [attempts, setAttempts] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const arenaRef = useRef<HTMLDivElement>(null);
  const noRef = useRef<HTMLButtonElement>(null);

  // Hayır shrinks and dodges with every interaction.
  const noScale = Math.max(0.25, 1 - attempts * 0.16);
  const yesScale = Math.min(1.35, 1 + attempts * 0.07);
  const message =
    attempts > 0 ? NO_MESSAGES[(attempts - 1) % NO_MESSAGES.length] : "";

  // Move the button to a random spot that always stays inside the arena —
  // this keeps it reachable-but-annoying on phones as well as desktop.
  const dodge = () => {
    const arena = arenaRef.current;
    const btn = noRef.current;
    if (arena && btn) {
      const a = arena.getBoundingClientRect();
      const b = btn.getBoundingClientRect();
      // Home position = current on-screen position minus the applied offset.
      const homeLeft = b.left - offset.x;
      const homeTop = b.top - offset.y;
      const minX = a.left - homeLeft;
      const maxX = a.right - b.width - homeLeft;
      const minY = a.top - homeTop;
      const maxY = a.bottom - b.height - homeTop;
      setOffset({
        x: Math.round(minX + Math.random() * Math.max(0, maxX - minX)),
        y: Math.round(minY + Math.random() * Math.max(0, maxY - minY)),
      });
    } else {
      setOffset({
        x: Math.round((Math.random() * 2 - 1) * 90),
        y: Math.round((Math.random() * 2 - 1) * 40),
      });
    }
    setAttempts((a) => a + 1);
  };

  return (
    <div className="flex flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, y: [0, -6, 0] }}
        transition={{
          scale: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
          opacity: { duration: 0.7 },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        }}
        className="mb-8"
      >
        <CoffeeMark size={76} />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md text-balance text-3xl font-semibold tracking-tight text-espresso-800 sm:text-4xl"
      >
        Benimle bir kahve içmeye ne dersin?
      </motion.h2>

      {/* funny message region — reserved height so layout doesn't jump */}
      <div className="mt-5 flex h-8 items-center justify-center px-4">
        <AnimatePresence mode="wait">
          {message && (
            <motion.p
              key={message}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="text-sm font-medium text-espresso-500"
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* arena — the Hayır button can roam anywhere inside this box */}
      <div
        ref={arenaRef}
        className="relative mt-6 flex min-h-[8rem] w-full items-center justify-center gap-4"
      >
        <motion.button
          onClick={onYes}
          animate={{ scale: yesScale }}
          whileHover={{ scale: yesScale * 1.04 }}
          whileTap={{ scale: yesScale * 0.96 }}
          transition={{ type: "spring", stiffness: 320, damping: 20 }}
          className="focus-ring z-10 rounded-full bg-espresso-700 px-9 py-3.5 text-base font-semibold text-cream-50 shadow-lg shadow-espresso-700/25 hover:bg-espresso-800"
        >
          Evet
        </motion.button>

        <motion.button
          ref={noRef}
          onMouseEnter={dodge}
          onPointerDown={(e) => {
            // Escape on touch before the tap can land.
            e.preventDefault();
            dodge();
          }}
          onClick={dodge}
          animate={{ x: offset.x, y: offset.y, scale: noScale }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          style={{
            touchAction: "manipulation",
            pointerEvents: noScale <= 0.3 ? "none" : "auto",
          }}
          className="focus-ring select-none rounded-full border border-espresso-200 bg-white/70 px-9 py-3.5 text-base font-medium text-espresso-600 backdrop-blur"
        >
          Hayır
        </motion.button>
      </div>
    </div>
  );
}
