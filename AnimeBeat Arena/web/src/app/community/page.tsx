import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { PromoBanners } from "@/components/promo-banners";
import { DISCORD_INVITE_URL } from "@/lib/constants";

const weeklySchedule = [
  { day: "Lundi", event: "Tier list live: openings anime", channel: "#tier-list-live" },
  { day: "Mercredi", event: "Soirée cinéma anime", channel: "#cinema-anime" },
  { day: "Vendredi", event: "Débat arc vs arc", channel: "#debats-anime" },
  { day: "Dimanche", event: "Bilan motivation + objectifs", channel: "#motivation-sport" },
];

export default function CommunityPage() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <div className="anime-grid pointer-events-none absolute inset-0" />
      <SiteHeader />
      <main className="relative z-10 mx-auto w-full max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Communauté Anime + <span className="neon-text">Discord</span>
        </h1>
        <p className="muted mt-2 max-w-2xl">
          Organisation des events communautaires: tier lists, sessions cinema anime, watch party et espaces
          de sociabilisation.
        </p>

        <section className="glass-panel-strong mt-8 rounded-xl p-5">
          <h2 className="text-lg font-semibold text-indigo-100">Discord Officiel</h2>
          <p className="mt-2 text-sm text-indigo-100/85">
            Rejoins le serveur pour participer aux events et proposer tes propres channels anime/manga.
          </p>
          <a
            href={DISCORD_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-4 inline-flex rounded-lg px-4 py-2 text-sm font-medium"
          >
            Rejoindre le Discord
          </a>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Planning type des channels</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {weeklySchedule.map((slot) => (
              <article key={`${slot.day}-${slot.channel}`} className="glass-panel rounded-xl p-4">
                <p className="muted text-sm font-medium">{slot.day}</p>
                <h3 className="mt-1 font-semibold">{slot.event}</h3>
                <p className="muted mt-1 text-sm">{slot.channel}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="glass-panel mt-10 rounded-xl p-5">
          <h2 className="text-xl font-semibold">Canaux recommandés</h2>
          <ul className="mt-3 grid gap-2 text-sm text-zinc-200 sm:grid-cols-2">
            <li>#annonces</li>
            <li>#tier-list-live</li>
            <li>#cinema-anime</li>
            <li>#watch-party</li>
            <li>#mangas-scans</li>
            <li>#ost-and-playlists</li>
            <li>#motivation-sport</li>
            <li>#entraide-sociale</li>
          </ul>
        </section>
        <section className="glass-panel mt-6 overflow-hidden rounded-xl p-3">
          <Image
            src="/images/decor/hinata.png"
            alt="Groupe de fans en soirée anime"
            width={1400}
            height={900}
            className="h-auto w-full rounded-lg object-cover"
          />
        </section>
        <PromoBanners />
      </main>
    </div>
  );
}

