import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { PromoBanners } from "@/components/promo-banners";
import { LiveTvWall } from "@/components/live-tv-wall";
import { DISCORD_INVITE_URL } from "@/lib/constants";
import { getSiteConfig } from "@/lib/site-config";

export default async function Home() {
  const config = await getSiteConfig();
  return (
    <div className="relative flex flex-1 flex-col">
      <div className="anime-grid pointer-events-none absolute inset-0" />
      <SiteHeader />
      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-14">
        <div className="glass-panel-strong rounded-2xl p-8 sm:p-10">
          <p className="mb-3 inline-flex rounded-full border border-indigo-300/40 bg-indigo-500/15 px-3 py-1 text-xs font-medium text-indigo-100">
            Univers anime • motivation • communauté
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            Un hub <span className="neon-text">moderne</span> pour la culture anime.
          </h1>
          <p className="muted mt-5 max-w-2xl text-lg leading-relaxed">
          Le hub anime/manga orienté motivation, sociabilisation et progression. Tu peux déjà explorer la
          communauté, préparer des events Discord et publier des tier lists d&apos;anime, arcs et OST.
          </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="btn-primary rounded-lg px-5 py-2.5 text-sm font-medium"
          >
            Tableau de bord
          </Link>
          <Link
            href="/register"
            className="btn-secondary rounded-lg px-5 py-2.5 text-sm font-medium"
          >
            Créer un compte
          </Link>
          <Link
            href="/tier-lists"
            className="btn-secondary rounded-lg px-5 py-2.5 text-sm font-medium"
          >
            Voir les tier lists
          </Link>
          <a
            href={DISCORD_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary rounded-lg px-5 py-2.5 text-sm font-medium"
          >
            Rejoindre le Discord
          </a>
        </div>
        </div>
        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <article className="glass-panel rounded-xl p-5">
            <h2 className="font-semibold">Tier Lists</h2>
            <p className="muted mt-2 text-sm">
              Classez vos anime, arcs et OST en S/A/B/C/D et votez sur les listes de la communauté.
            </p>
          </article>
          <article className="glass-panel rounded-xl p-5">
            <h2 className="font-semibold">Communauté + Cinéma Discord</h2>
            <p className="muted mt-2 text-sm">
              Organisez des soirées anime, débats, watch party et sessions sociales sur le serveur Discord.
            </p>
          </article>
        </section>
        <section className="glass-panel mt-6 overflow-hidden rounded-xl p-3">
          <Image
            src="/images/anime-hero.svg"
            alt="Visuel anime stylisé du projet"
            width={1600}
            height={900}
            className="h-auto w-full rounded-lg"
            priority
          />
        </section>
        <section className="glass-panel mt-6 rounded-xl p-5">
          <h2 className="text-xl font-semibold">Diffusion & replays: TikTok / Kick / Patreon</h2>
          <p className="muted mt-2 text-sm">
            On mise sur une stratégie multi-plateforme: TikTok pour la découverte, Kick pour les lives anime,
            Patreon pour les replays premium, Discord pour l&apos;organisation communautaire.
          </p>
          <Link
            href="/platforms"
            className="btn-secondary mt-4 inline-flex rounded-lg px-4 py-2 text-sm font-medium"
          >
            Voir la stratégie plateformes
          </Link>
        </section>
        {config.liveTvEnabled ? <LiveTvWall /> : null}
        <PromoBanners />
      </main>
    </div>
  );
}
