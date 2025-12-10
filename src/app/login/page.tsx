"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { signIn } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = signIn(email, password);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      const target = result.data.role === "patient" ? "/patient" : "/pro";
      router.push(target);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-start">
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
          Connexion
        </h1>
        <p className="text-sm leading-relaxed text-slate-300 md:text-base">
          Connectez-vous avec l&apos;un des comptes de démonstration pour accéder
          à l&apos;espace <span className="font-semibold">patient</span> ou
          <span className="font-semibold"> professionnel</span>.
        </p>
        <ul className="text-xs text-slate-400 space-y-1">
          <li>
            <span className="font-semibold">Compte patient</span> :
            <code className="ml-1">patient@example.com</code> /<code className="ml-1">patient123</code>
          </li>
          <li>
            <span className="font-semibold">Compte professionnel</span> :
            <code className="ml-1">pro@example.com</code> /<code className="ml-1">pro123</code>
          </li>
          <li>- Après connexion, vous êtes redirigé vers l&apos;espace adapté.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm"
        >
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="text-xs font-medium uppercase tracking-wide text-slate-400"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/40 focus:border-emerald-400 focus:ring-2"
              placeholder="vous@example.com"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="password"
              className="text-xs font-medium uppercase tracking-wide text-slate-400"
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/40 focus:border-emerald-400 focus:ring-2"
              placeholder="Votre mot de passe"
            />
          </div>

          {error && (
            <p className="text-xs font-medium text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-emerald-950 shadow-sm transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Se connecter
          </button>
        </form>
      </section>
    </div>
  );
}
