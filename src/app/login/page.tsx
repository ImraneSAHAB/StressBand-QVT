import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-start">
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
          Choisissez votre type de connexion
        </h1>
        <p className="text-sm leading-relaxed text-slate-300 md:text-base">
          Deux espaces distincts sont disponibles pour respecter la
          confidentialité : un espace <span className="font-semibold">patient</span> pour
          consulter ses propres données, et un espace
          <span className="font-semibold"> professionnel</span> pour suivre les indicateurs
          via l&apos;ID du brassard.
        </p>
      </section>

      <section className="space-y-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-emerald-400">Connexion patient</h2>
          <p className="mt-2 text-sm text-slate-300">
            Accédez à une fiche claire récapitulant vos
            indicateurs liés au bien-être au travail.
          </p>
          <Link
            href="/patient"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-medium text-emerald-950 shadow-sm transition hover:bg-emerald-400"
          >
            Accéder à l&apos;espace patient
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-emerald-400">
            Connexion professionnelle
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Pour les équipes QVT, RH ou médicales : accédez à une fiche
            synthétique des données en saisissant l&apos;ID du brassard.
          </p>
          <Link
            href="/pro"
            className="mt-4 inline-flex items-center justify-center rounded-full border border-emerald-500 px-4 py-1.5 text-sm font-medium text-emerald-100 shadow-sm transition hover:bg-emerald-500/10"
          >
            Accéder à l&apos;espace professionnel
          </Link>
        </div>
      </section>
    </div>
  );
}
