"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import CoffeeMark from "./CoffeeMark";
import { savePlan } from "@/lib/firebase";
import type { DatePlan } from "@/lib/types";

function formatDate(iso: string): string {
  try {
    const d = new Date(`${iso}T00:00:00`);
    return new Intl.DateTimeFormat("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
    }).format(d);
  } catch {
    return iso;
  }
}

export default function ThankYou({ plan }: { plan: DatePlan }) {
  const [status, setStatus] = useState<"saving" | "done">("saving");
  const prettyDate = useMemo(() => formatDate(plan.date), [plan.date]);

  useEffect(() => {
    let active = true;
    savePlan(plan).finally(() => {
      // Small delay so the transition feels intentional, not flickery.
      setTimeout(() => active && setStatus("done"), 600);
    });
    return () => {
      active = false;
    };
  }, [plan]);

  return (
    <div className="flex flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotate: -8 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 16 }}
        className="mb-8"
      >
        <CoffeeMark size={88} />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-4xl font-semibold tracking-tight text-espresso-800 sm:text-5xl"
      >
        Teşekkürler Ece Nehir
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.6 }}
        className="mt-4 max-w-sm text-balance text-base text-espresso-500"
      >
        Görüşmek için sabırsızlanıyorum. İşte planımız:
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="glass mt-8 w-full rounded-3xl p-6 text-left sm:p-7"
      >
        <Row label="Tarih" value={prettyDate} />
        <Divider />
        <Row label="Saat" value={plan.time} />
        <Divider />
        <Row label="Mekan" value={plan.place} href={plan.mapsUrl} />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-6 text-sm text-espresso-500"
      >
        {status === "saving" ? "Kaydediliyor…" : "Sonra görüşürüz ☕️"}
      </motion.p>
    </div>
  );
}

function Row({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string | null;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <span className="shrink-0 text-sm font-medium text-espresso-500">
        {label}
      </span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring inline-flex items-center gap-1 rounded text-right font-semibold text-espresso-700 underline decoration-espresso-300 underline-offset-4 transition hover:text-espresso-800"
        >
          <span className="truncate">{value}</span>
          <span aria-hidden>↗</span>
        </a>
      ) : (
        <span className="text-right font-semibold text-espresso-800">
          {value}
        </span>
      )}
    </div>
  );
}

function Divider() {
  return <div className="my-3 h-px w-full bg-espresso-200/70" />;
}
