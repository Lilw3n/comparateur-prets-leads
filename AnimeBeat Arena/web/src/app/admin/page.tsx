import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignOutButton } from "@/components/sign-out-button";
import { getPrisma } from "@/lib/prisma";
import { getSiteConfig } from "@/lib/site-config";
import { AdminSocialImportForm } from "@/components/admin-social-import-form";
import {
  createGlobalMusicPlaylistAction,
  deleteGlobalMusicPlaylistAction,
  reviewSuggestionAction,
  seedDefaultTierListsAction,
  updateLiveTvAction,
} from "./actions";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }
  const user = session?.user;
  const config = await getSiteConfig();
  const prisma = getPrisma();
  const pendingSuggestions = await prisma.linkSuggestion.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    take: 100,
    include: {
      submittedBy: { select: { email: true, name: true } },
      tierList: { select: { title: true } },
      tierListItem: { select: { label: true } },
    },
  });
  const tierLists = await prisma.tierList.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      title: true,
      category: true,
      items: { orderBy: [{ rank: "asc" }, { sortOrder: "asc" }], select: { id: true, label: true } },
    },
  });
  const globalMusicPlaylists = await prisma.musicPlaylist.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      label: true,
      url: true,
      createdAt: true,
      createdBy: { select: { email: true } },
    },
  });

  return (
    <div className="mx-auto flex min-h-full max-w-2xl flex-1 flex-col gap-8 px-4 py-16">
      <div>
        <p className="text-sm font-medium text-violet-300">Admin</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">
          Espace administrateur
        </h1>
        <p className="mt-2 text-zinc-300">
          Connecté en tant que {user?.email} ({user?.role})
        </p>
      </div>
      <p className="text-sm text-zinc-300">
        Tu pourras ajouter ici modération, contenus, stats, etc.
      </p>
      <section className="glass-panel rounded-xl p-5">
        <h2 className="text-lg font-semibold">Panneau diffusion</h2>
        <p className="muted mt-1 text-sm">
          Active ou coupe globalement la TV Live (Kick / Twitch / TikTok) sur le site.
        </p>
        <form action={updateLiveTvAction} className="mt-4 flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 text-sm">
            <input
              type="checkbox"
              name="liveTvEnabled"
              defaultChecked={config.liveTvEnabled}
              className="h-4 w-4 accent-indigo-600"
            />
            TV Live ON/OFF
          </label>
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Enregistrer
          </button>
          <span className="text-xs text-zinc-300">
            Etat actuel : {config.liveTvEnabled ? "ON" : "OFF"}
          </span>
        </form>
      </section>
      <section className="glass-panel rounded-xl p-5">
        <h2 className="text-lg font-semibold">Playlists musique (tous les utilisateurs)</h2>
        <p className="muted mt-1 text-sm">
          Chaque playlist est enregistrée en base et proposée dans le lecteur en bas de page à{" "}
          <strong className="text-zinc-200">tous les visiteurs</strong> (connectés ou non). Les utilisateurs peuvent
          toujours ajouter des playlists personnelles en session.
        </p>
        <form action={createGlobalMusicPlaylistAction} className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="min-w-[140px] flex-1">
            <label htmlFor="pl-label" className="block text-xs text-zinc-400">
              Nom affiché
            </label>
            <input
              id="pl-label"
              name="label"
              required
              maxLength={120}
              placeholder="Ex. OST shonen"
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
            />
          </div>
          <div className="min-w-[200px] flex-[2]">
            <label htmlFor="pl-url" className="block text-xs text-zinc-400">
              Lien Spotify ou YouTube
            </label>
            <input
              id="pl-url"
              name="url"
              type="url"
              required
              maxLength={500}
              placeholder="https://open.spotify.com/playlist/..."
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
          >
            Enregistrer en base
          </button>
        </form>
        {globalMusicPlaylists.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-400">Aucune playlist globale pour le moment.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {globalMusicPlaylists.map((pl) => (
              <li
                key={pl.id}
                className="flex flex-col gap-2 rounded-lg border border-zinc-700 p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium text-zinc-100">{pl.label}</p>
                  <p className="mt-1 break-all text-xs text-zinc-400">{pl.url}</p>
                  <p className="mt-1 text-[11px] text-zinc-500">
                    Ajouté le {pl.createdAt.toLocaleDateString("fr-FR")} par {pl.createdBy.email}
                  </p>
                </div>
                <form action={deleteGlobalMusicPlaylistAction}>
                  <input type="hidden" name="playlistId" value={pl.id} />
                  <button
                    type="submit"
                    className="rounded-md border border-rose-500/50 px-3 py-1.5 text-xs text-rose-200 hover:bg-rose-950/40"
                  >
                    Supprimer
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
      {tierLists.length === 0 ? (
        <section className="glass-panel rounded-xl p-5 border-amber-500/40">
          <h2 className="text-lg font-semibold text-amber-100">Aucune tier list en base</h2>
          <p className="muted mt-1 text-sm">
            Sans tier list, tu ne peux pas importer de suggestions (Shorts / Reels / TikTok). Crée d’abord des
            listes d’exemple, puis reviens importer ci-dessous.
          </p>
          <form action={seedDefaultTierListsAction} className="mt-4">
            <button
              type="submit"
              className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500"
            >
              Créer 2 tier lists d’exemple (DB vide)
            </button>
          </form>
        </section>
      ) : null}
      <section className="glass-panel rounded-xl p-5">
        <h2 className="text-lg font-semibold">Import social edits en suggestions</h2>
        <p className="muted mt-1 text-sm">
          Les liens importés arrivent en <strong className="text-zinc-200">PENDING</strong> : tu les vois
          uniquement ici (section « Validation »), pas sur la page publique tant qu’ils ne sont pas approuvés.
        </p>
        <AdminSocialImportForm tierLists={tierLists} />
      </section>
      <section className="glass-panel rounded-xl p-5">
        <h2 className="text-lg font-semibold">Validation liens communautaires</h2>
        <p className="muted mt-1 text-sm">
          Les utilisateurs peuvent proposer des liens. Ils restent caches tant qu'ils ne sont pas valides ici.
        </p>
        {pendingSuggestions.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-300">Aucune suggestion en attente.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {pendingSuggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                className="rounded-lg border border-zinc-700 p-3 text-sm"
              >
                <p className="font-medium text-zinc-100">
                  {suggestion.title || "Lien sans titre"}
                </p>
                <p className="mt-1 break-all text-xs text-zinc-300">{suggestion.url}</p>
                <p className="mt-1 text-xs text-zinc-300">
                  {suggestion.kind === "HOME_TEASER"
                    ? "Cible : teaser page d'accueil"
                    : suggestion.tierList
                      ? `Tier list : ${suggestion.tierList.title}${
                          suggestion.tierListItem
                            ? ` · Element : ${suggestion.tierListItem.label}`
                            : " · Liste entiere"
                        }`
                      : "Cible inconnue"}
                </p>
                <p className="mt-0.5 text-[11px] uppercase tracking-wide text-zinc-500">
                  Type :{" "}
                  {suggestion.kind === "HOME_TEASER"
                    ? "Teaser"
                    : suggestion.kind === "LIST_ITEM"
                      ? "Element"
                      : "Tier list"}
                </p>
                <p className="mt-1 text-xs text-zinc-300">
                  Propose par {suggestion.submittedBy.name || suggestion.submittedBy.email}
                </p>
                {suggestion.note ? (
                  <p className="mt-1 text-xs italic text-zinc-400">Note: {suggestion.note}</p>
                ) : null}
                <form action={reviewSuggestionAction} className="mt-3 flex flex-wrap gap-2">
                  <input type="hidden" name="suggestionId" value={suggestion.id} />
                  <button
                    type="submit"
                    name="decision"
                    value="APPROVED"
                    className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500"
                  >
                    Approuver
                  </button>
                  <button
                    type="submit"
                    name="decision"
                    value="REJECTED"
                    className="rounded-md bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-500"
                  >
                    Rejeter
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/dashboard"
          className="rounded-lg border border-zinc-600 px-4 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-800/60"
        >
          Tableau de bord
        </Link>
        <SignOutButton />
      </div>
    </div>
  );
}
