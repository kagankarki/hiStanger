"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];
const WEEKDAYS = ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pa"];

const pad = (n: number) => String(n).padStart(2, "0");
const toISO = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d={dir === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function DatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (iso: string) => void;
}) {
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const selected = useMemo(() => {
    if (!value) return null;
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d);
  }, [value]);

  const [view, setView] = useState(() => {
    const base = selected ?? today;
    return { y: base.getFullYear(), m: base.getMonth() };
  });
  const [dir, setDir] = useState(0);

  const firstOffset = (new Date(view.y, view.m, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const prevDisabled =
    view.y === today.getFullYear() && view.m === today.getMonth();

  const go = (delta: number) => {
    if (delta < 0 && prevDisabled) return;
    setDir(delta);
    setView((v) => {
      let m = v.m + delta;
      let y = v.y;
      if (m < 0) {
        m = 11;
        y -= 1;
      } else if (m > 11) {
        m = 0;
        y += 1;
      }
      return { y, m };
    });
  };

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-espresso-600">
        Tarih
      </label>
      <div className="rounded-2xl border border-espresso-200 bg-white/80 p-3">
        <div className="mb-2 flex items-center justify-between px-1">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={prevDisabled}
            aria-label="Önceki ay"
            className="focus-ring flex h-8 w-8 items-center justify-center rounded-full text-espresso-600 transition hover:bg-espresso-100 disabled:opacity-25"
          >
            <Chevron dir="left" />
          </button>
          <div className="overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={`${view.y}-${view.m}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="block text-sm font-semibold text-espresso-800"
              >
                {MONTHS[view.m]} {view.y}
              </motion.span>
            </AnimatePresence>
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Sonraki ay"
            className="focus-ring flex h-8 w-8 items-center justify-center rounded-full text-espresso-600 transition hover:bg-espresso-100"
          >
            <Chevron dir="right" />
          </button>
        </div>

        <div className="mb-1 grid grid-cols-7 gap-1">
          {WEEKDAYS.map((w) => (
            <div
              key={w}
              className="py-1 text-center text-xs font-medium text-espresso-500/70"
            >
              {w}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${view.y}-${view.m}-grid`}
            initial={{ opacity: 0, x: dir >= 0 ? 18 : -18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir >= 0 ? -18 : 18 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-7 gap-1"
          >
            {cells.map((day, i) => {
              if (day === null) return <div key={`e${i}`} />;
              const date = new Date(view.y, view.m, day);
              const isPast = date < today;
              const isSelected =
                selected &&
                selected.getFullYear() === view.y &&
                selected.getMonth() === view.m &&
                selected.getDate() === day;
              const isToday =
                today.getFullYear() === view.y &&
                today.getMonth() === view.m &&
                today.getDate() === day;

              return (
                <button
                  key={day}
                  type="button"
                  disabled={isPast}
                  onClick={() => onChange(toISO(view.y, view.m, day))}
                  className={[
                    "focus-ring mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm transition",
                    isSelected
                      ? "bg-espresso-700 font-semibold text-cream-50 shadow-md shadow-espresso-700/30"
                      : isPast
                        ? "cursor-not-allowed text-espresso-500/30"
                        : "text-espresso-700 hover:bg-espresso-100",
                    !isSelected && isToday ? "ring-1 ring-espresso-500/50" : "",
                  ].join(" ")}
                >
                  {day}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
