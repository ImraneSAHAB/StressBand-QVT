"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, signOut, type User } from "../lib/auth";

export function HeaderAuthButton() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const current = getCurrentUser();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(current);
  }, []);

  const handleClick = () => {
    const current = getCurrentUser();
    if (!current) {
      router.push("/login");
      return;
    }
    signOut();
    setUser(null);
    router.push("/login");
  };

  const label = user ? "Déconnexion" : "Connexion";

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded-full border border-emerald-400 px-4 py-1.5 text-sm font-medium text-emerald-50 shadow-sm transition hover:bg-emerald-500/10 hover:border-emerald-300"
    >
      {label}
    </button>
  );
}
