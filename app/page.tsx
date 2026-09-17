"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Greeting from "@/components/Greeting";
import Question from "@/components/Question";
import Scheduler from "@/components/Scheduler";
import ThankYou from "@/components/ThankYou";
import type { DatePlan } from "@/lib/types";

type Step = "greeting" | "question" | "scheduler" | "thanks";

const stepVariants = {
  initial: { opacity: 0, y: 24, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -24, scale: 0.98 },
};

export default function Home() {
  const [step, setStep] = useState<Step>("greeting");
  const [plan, setPlan] = useState<DatePlan | null>(null);

  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-xl flex-col items-center [justify-content:safe_center] px-5 py-12">
      <AnimatePresence mode="wait">
        <motion.section
          key={step}
          variants={stepVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          {step === "greeting" && (
            <Greeting onDone={() => setStep("question")} />
          )}

          {step === "question" && (
            <Question onYes={() => setStep("scheduler")} />
          )}

          {step === "scheduler" && (
            <Scheduler
              onSubmit={(data) => {
                setPlan(data);
                setStep("thanks");
              }}
            />
          )}

          {step === "thanks" && plan && <ThankYou plan={plan} />}
        </motion.section>
      </AnimatePresence>
    </main>
  );
}
