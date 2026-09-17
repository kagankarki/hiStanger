"use client";

import { useMemo } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

/** 08:00 → 23:30, every 30 minutes — sensible coffee hours. */
function buildSlots(): string[] {
  const slots: string[] = [];
  for (let h = 8; h <= 23; h++) {
    for (const m of [0, 30]) slots.push(`${pad(h)}:${pad(m)}`);
  }
  return slots;
}

export default function TimePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (time: string) => void;
}) {
  const slots = useMemo(buildSlots, []);

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-espresso-600">
        Saat
      </label>
      <div className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 py-1">
        {slots.map((slot) => {
          const active = value === slot;
          return (
            <button
              key={slot}
              type="button"
              onClick={() => onChange(slot)}
              className={[
                "focus-ring shrink-0 snap-center rounded-2xl border px-4 py-2.5 text-sm tabular-nums transition",
                active
                  ? "border-espresso-700 bg-espresso-700 font-semibold text-cream-50 shadow-md shadow-espresso-700/25"
                  : "border-espresso-200 bg-white/80 text-espresso-700 hover:border-espresso-500",
              ].join(" ")}
            >
              {slot}
            </button>
          );
        })}
      </div>
    </div>
  );
}
