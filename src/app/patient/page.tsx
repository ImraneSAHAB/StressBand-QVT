"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "../../lib/auth";

const HEART_RATE_HIGH = 95;
const RESPIRATION_HIGH = 20;
const SLEEP_SCORE_LOW = 60;

const HEART_RATE = 98;
const RESPIRATION = 21;
const SLEEP_SCORE = 62;

export default function PatientPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.replace("/login");
    }
  }, [router]);

  const isBpmHigh = HEART_RATE >= HEART_RATE_HIGH;
  const isRespHigh = RESPIRATION >= RESPIRATION_HIGH;
  const isSleepLow = SLEEP_SCORE <= SLEEP_SCORE_LOW;
  const hasAlert = isBpmHigh || isRespHigh || isSleepLow;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
          Espace patient
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
          Vos données personnelles de bien-être
        </h1>
        <p className="max-w-2xl text-sm text-slate-300 md:text-base">
          Cet espace est réservé aux salariés portant le brassard. Il affiche
          uniquement vos propres indicateurs, à titre informatif.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Fréquence cardiaque moyenne
          </h2>
          <p
            className={`mt-3 text-3xl font-semibold ${
              isBpmHigh ? "text-red-400" : "text-slate-50"
            }`}
          >
            {HEART_RATE} bpm
          </p>
          <p className="mt-1 text-xs text-emerald-400">
            Valeur moyenne observée sur la journée
          </p>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Fréquence respiratoire
          </h2>
          <p
            className={`mt-3 text-3xl font-semibold ${
              isRespHigh ? "text-red-400" : "text-slate-50"
            }`}
          >
            {RESPIRATION} / min
          </p>
          <p className="mt-1 text-xs text-emerald-400">
            Rythme respiratoire moyen sur la journée
          </p>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Qualité du sommeil (score)
          </h2>
          <p
            className={`mt-3 text-3xl font-semibold ${
              isSleepLow ? "text-red-400" : "text-slate-50"
            }`}
          >
            {SLEEP_SCORE} / 100
          </p>
          <p className="mt-1 text-xs text-emerald-400">
            Score calculé sur la dernière nuit
          </p>
        </article>
      </section>

      <section className="space-y-2 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-400 md:text-sm">
        <p>
          Les valeurs ci-dessus sont des exemples simulés. Dans un déploiement
          réel, elles seraient remplacées par les données issues de votre
          brassard connecté.
        </p>
        {hasAlert && (
          <p className="text-xs font-semibold text-amber-300 md:text-sm">
            Pour l&apos;interprétation de ces données, merci de prendre rendez-vous
            avec votre praticien.
          </p>
        )}
      </section>
    </div>
  );
}
