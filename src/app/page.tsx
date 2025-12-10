"use client";

import Link from "next/link";
import { getCurrentUser } from "../lib/auth";

export default function Home() {
  const user = getCurrentUser();
  const target = user ? (user.role === "patient" ? "/patient" : "/pro") : "/login";
  const label = user ? "Accéder à mon espace" : "Connexion";

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-50 md:text-4xl">
          Suivi du bien-être au travail avec le brassard StressBand
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
          Ce prototype de site, réalisé dans le cadre d&apos;un projet
          d&apos;école, permet de visualiser les données de qualité de vie au
          travail (BPM, respiration, rythme du sommeil) recueillies par un
          brassard connecté.
        </p>
        <Link
          href={target}
          className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2 text-sm font-medium text-emerald-950 shadow-sm transition hover:bg-emerald-400"
        >
          {label}
        </Link>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-emerald-400">
            Espace patient
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Visualisez uniquement <span className="font-semibold">vos propres données</span> :
            fréquence cardiaque, respiration et qualité du sommeil, sous forme de
            fiche synthétique facile à lire.
          </p>
          <p className="mt-3 text-xs text-slate-400">
            Accès protégé, pensé pour rassurer le salarié et l&apos;aider à
            suivre son bien-être au quotidien.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-emerald-400">
            Espace professionnel
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            En saisissant l&apos;<span className="font-semibold">ID du brassard</span>, un
            professionnel peut consulter une fiche résumée avec les principaux
            indicateurs physiologiques.
          </p>
          <p className="mt-3 text-xs text-slate-400">
            Idéal pour les équipes QVT, RH ou médecine du travail dans un cadre
            d&apos;accompagnement global.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-400 md:text-sm">
        Ce site est une maquette pédagogique : les données affichées sont
        simulées pour illustrer le fonctionnement et ne correspondent à aucun
        patient réel.
      </section>
    </div>
  );
}
