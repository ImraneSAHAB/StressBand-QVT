"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "../../lib/auth";

const MOCK_DATA = {
  "124578": {
    firstName: "Audrey",
    lastName: "Martin",
    bpm: 102,
    respiration: 22,
    sleepScore: 58,
    sleepDuration: "5 h 40",
    comment:
      "Profil en fin de période chargée, tension physiologique à surveiller.",
  },
  "936421": {
    firstName: "Fabrice",
    lastName: "Durand",
    bpm: 72,
    respiration: 15,
    sleepScore: 86,
    sleepDuration: "7 h 40",
    comment: "Profil globalement stable, bonne récupération nocturne.",
  },
} as const;

type BandId = keyof typeof MOCK_DATA;

type RealtimeStats = {
  bpm: number;
  respiration: number;
  vmcStatus: string;
  stressLabel: string;
};

const HEART_RATE_HIGH = 95;
const RESPIRATION_HIGH = 20;
const SLEEP_SCORE_LOW = 60;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function randomJitter(range: number): number {
  return (Math.random() * 2 - 1) * range;
}

function getCardioPoints(bpm: number): string {
  if (bpm < 80) {
    // Rythme calme : ondes plus basses
    return "0,42 20,42 30,30 40,54 55,42 75,42 90,24 110,60 130,42 150,42 160,32 170,52 190,42 210,42 220,28 235,56 250,42 260,42";
  }
  if (bpm < 110) {
    // Rythme modéré : tracé par défaut
    return "0,40 20,40 30,20 40,60 55,40 75,40 90,10 110,70 130,40 150,40 160,25 170,55 190,40 210,40 220,18 235,62 250,40 260,40";
  }
  // Rythme élevé : pics plus marqués
  return "0,38 20,38 30,14 40,62 55,38 75,38 90,8 110,72 130,38 150,38 160,18 170,58 190,38 210,38 220,10 235,66 250,38 260,38";
}

function getCardioSpeed(bpm: number): number {
  if (bpm < 80) return 3.2; // plus lent, rythme calme
  if (bpm < 110) return 2.6; // rythme modéré
  return 2.0; // plus rapide quand le coeur s'accélère
}

export default function ProPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.replace("/login");
    }
  }, [router]);

  const [braceletId, setBraceletId] = useState<BandId | "">("124578");
  const [activeId, setActiveId] = useState<BandId | null>("124578");
  const [view, setView] = useState<"summary" | "realtime">("summary");
  const [realtime, setRealtime] = useState<RealtimeStats | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!braceletId) return;
    setActiveId(braceletId);
  };

  const data = activeId ? MOCK_DATA[activeId] : null;

  useEffect(() => {
    if (!data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRealtime(null);
      return;
    }

    setRealtime({
      bpm: data.bpm,
      respiration: data.respiration,
      vmcStatus: "VMC stable",
      stressLabel: "Aucun pic de stress détecté",
    });

    const interval = setInterval(() => {
      setRealtime((current) => {
        if (!current) return current;

        const bpm = clamp(
          data.bpm + Math.round(randomJitter(8)),
          55,
          135,
        );
        const respiration = clamp(
          data.respiration + Math.round(randomJitter(3)),
          10,
          26,
        );

        const vmcStatus = bpm > 110 ? "Surveillance renforcée" : "VMC stable";
        const stressLabel =
          bpm > 120
            ? "Pic de stress probable"
            : bpm > 100
              ? "Tension à surveiller"
              : "Aucun pic de stress détecté";

        return {
          bpm,
          respiration,
          vmcStatus,
          stressLabel,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [data]);

  const isBpmHigh = data && data.bpm >= HEART_RATE_HIGH;
  const isRespirationHigh = data && data.respiration >= RESPIRATION_HIGH;
  const isSleepLow = data && data.sleepScore <= SLEEP_SCORE_LOW;
  const hasAlert = Boolean(isBpmHigh || isRespirationHigh || isSleepLow);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
            Espace professionnel
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
            Suivi brassard & fiche patient
          </h1>
          <p className="max-w-2xl text-sm text-slate-300 md:text-base">
            En saisissant l&apos;ID d&apos;un brassard, vous accédez au profil du
            patient suivi et à une fiche synthétique des principaux indicateurs
            physiologiques liés à la qualité de vie au travail.
          </p>
        </div>

        {data && (
          <div className="inline-flex rounded-full bg-slate-900/70 p-1 text-xs">
            <button
              type="button"
              onClick={() => setView("summary")}
              className={`rounded-full px-3 py-1 font-medium transition ${
                view === "summary"
                  ? "bg-emerald-500 text-emerald-950"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              Fiche synthétique
            </button>
            <button
              type="button"
              onClick={() => setView("realtime")}
              className={`rounded-full px-3 py-1 font-medium transition ${
                view === "realtime"
                  ? "bg-emerald-500 text-emerald-950"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              Vue temps réel
            </button>
          </div>
        )}
      </header>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:flex-row md:items-end"
      >
        <div className="flex-1">
          <label
            htmlFor="braceletId"
            className="text-xs font-medium uppercase tracking-wide text-slate-400"
          >
            ID du brassard
          </label>
          <input
            id="braceletId"
            value={braceletId}
            onChange={(event) =>
              setBraceletId(event.target.value as BandId | "")
            }
            placeholder="Ex : 124578"
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/40 focus:border-emerald-400 focus:ring-2"
          />
          <p className="mt-1 text-[11px] text-slate-400">
            Exemples disponibles dans la maquette : <code>124578</code>,
            <code className="ml-1">936421</code>.
          </p>
        </div>

        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-emerald-950 shadow-sm transition hover:bg-emerald-400"
        >
          Afficher la fiche
        </button>
      </form>

      {data && (
        <section className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
          {view === "summary" ? (
            <>
              {/* FICHE SYNTHÉTIQUE */}
              <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Patient suivi
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-50">
                      {data.firstName} {data.lastName}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      ID brassard : {activeId}
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300">
                    Fiche synthétique QVT
                  </span>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-xl bg-slate-950/60 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Fréquence cardiaque
                    </p>
                    <p
                      className={`mt-2 text-2xl font-semibold ${
                        isBpmHigh ? "text-red-400" : "text-slate-50"
                      }`}
                    >
                      {data.bpm} <span className="text-sm font-normal">bpm</span>
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-950/60 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Respiration
                    </p>
                    <p
                      className={`mt-2 text-2xl font-semibold ${
                        isRespirationHigh ? "text-red-400" : "text-slate-50"
                      }`}
                    >
                      {data.respiration}
                      <span className="ml-1 text-sm font-normal">/ min</span>
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-950/60 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Score sommeil
                    </p>
                    <p
                      className={`mt-2 text-2xl font-semibold ${
                        isSleepLow ? "text-red-400" : "text-slate-50"
                      }`}
                    >
                      {data.sleepScore}
                      <span className="ml-1 text-sm font-normal">/ 100</span>
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Durée : {data.sleepDuration}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 md:text-sm">
                  {data.comment}
                </p>

                {hasAlert && (
                  <p className="mt-2 text-xs font-semibold text-amber-300 md:text-sm">
                    Pour l&apos;interprétation de ces données, merci de prendre
                    rendez-vous avec votre praticien.
                  </p>
                )}
              </article>

              <article className="space-y-3 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-400 md:text-sm">
                <p>
                  Les données affichées sont issues d&apos;un jeu de test simulé
                  pour le projet d&apos;école. Dans une application réelle, le
                  brassard transmettrait ces informations de manière sécurisée.
                </p>
                <p>
                  Cette fiche a pour objectif de donner une vue rapide du
                  niveau de charge physiologique d&apos;un salarié, afin
                  d&apos;alimenter une réflexion plus globale sur la qualité de vie
                  au travail.
                </p>
              </article>
            </>
          ) : (
            <>
              {/* VUE TEMPS RÉEL : CARDIO + GRAPHIQUES */}
              <article className="space-y-4 rounded-2xl border border-emerald-600/60 bg-slate-950/80 p-5">
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
                      Vue temps réel
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-50">
                      {data.firstName} {data.lastName} • {activeId}
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300">
                    Cardiogramme & graphiques
                  </span>
                </div>

                {realtime && (
                  <div className="space-y-5">
                    {/* Cardiogramme */}
                    <div className="rounded-2xl bg-slate-900/80 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                          Cardiogramme (battements par minute)
                        </p>
                        <p
                          className={`text-3xl font-semibold ${
                            realtime.bpm >= HEART_RATE_HIGH
                              ? "text-red-400"
                              : "text-emerald-300"
                          }`}
                        >
                          {realtime.bpm}
                          <span className="ml-1 text-sm font-normal">bpm</span>
                        </p>
                      </div>
                      <div className="mt-3 h-28 w-full overflow-hidden rounded-xl bg-slate-950/90 cardio-grid">
                        <svg
                          viewBox="0 0 260 80"
                          className="h-full w-full"
                          preserveAspectRatio="none"
                        >
                          <g
                            className="cardio-track"
                            style={{
                              // vitesse d'animation du balayage liée au BPM
                              // @ts-expect-error variable CSS personnalisée
                              "--cardioSpeed": `${getCardioSpeed(realtime.bpm)}s`,
                            }}
                          >
                            <polyline
                              className="cardio-line"
                              fill="none"
                              stroke={
                                realtime.bpm >= HEART_RATE_HIGH
                                  ? "#f87171"
                                  : "#4ade80"
                              }
                              strokeWidth="2"
                              points={getCardioPoints(realtime.bpm)}
                            />
                            <polyline
                              className="cardio-line"
                              fill="none"
                              stroke={
                                realtime.bpm >= HEART_RATE_HIGH
                                  ? "#f87171"
                                  : "#4ade80"
                              }
                              strokeWidth="2"
                              points={getCardioPoints(realtime.bpm)}
                              transform="translate(260 0)"
                            />
                          </g>
                        </svg>
                      </div>
                    </div>

                    {/* Graphiques respiration + VMC/stress */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl bg-slate-900/80 p-4">
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            Fréquence respiratoire
                          </p>
                          <p
                            className={`text-2xl font-semibold ${
                              realtime.respiration >= RESPIRATION_HIGH
                                ? "text-red-400"
                                : "text-emerald-300"
                            }`}
                          >
                            {realtime.respiration}
                            <span className="ml-1 text-sm font-normal">
                              / min
                            </span>
                          </p>
                        </div>
                        <div className="mt-3 flex h-20 items-end justify-between gap-1">
                          {Array.from({ length: 16 }).map((_, index) => (
                            <div
                              key={index}
                              className="bar-pulse w-full rounded-t-full bg-gradient-to-t from-sky-500/60 via-sky-300/70 to-sky-200/90"
                              style={{
                                animationDelay: `${(index % 4) * 0.15}s`,
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3 rounded-2xl bg-slate-900/80 p-4">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            Rythme du sommeil (statut VMC)
                          </p>
                          <p className="mt-2 text-base font-semibold text-emerald-300">
                            {realtime.vmcStatus}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            Pic de stress
                          </p>
                          <p className="mt-2 text-xs text-slate-200 md:text-sm">
                            {realtime.stressLabel}
                          </p>
                        </div>
                        {realtime.bpm >= HEART_RATE_HIGH && (
                          <p className="mt-1 text-[11px] font-semibold text-amber-300">
                            Pour l&apos;interprétation de ces données, merci de
                            prendre rendez-vous avec votre praticien.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </article>

              <article className="space-y-3 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-400 md:text-sm">
                <p>
                  La vue temps réel présente un cardiogramme stylisé et des
                  graphiques simulant l&apos;évolution des battements par minute
                  et de la fréquence respiratoire.
                </p>
                <p>
                  Dans un contexte réel, ces courbes seraient alimentées par des
                  données issues du brassard et interprétées par un
                  professionnel de santé.
                </p>
              </article>
            </>
          )}
        </section>
      )}
    </div>
  );
}