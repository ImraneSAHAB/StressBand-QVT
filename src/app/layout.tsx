import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { HeaderAuthButton } from "../components/HeaderAuthButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StressBand QVT",
  description: "Suivi du bien-être au travail via brassard connecté",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-50`}
      >
        <div className="min-h-screen">
          <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/logo-qvt.svg"
                  alt="Logo StressBand QVT"
                  width={32}
                  height={32}
                  className="rounded-md"
                />
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold tracking-wide text-emerald-400">
                    StressBand QVT
                  </span>
                  <span className="text-xs text-slate-400">
                    Qualité de vie au travail
                  </span>
                </div>
              </Link>
              <HeaderAuthButton />
            </div>
          </header>
          <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
