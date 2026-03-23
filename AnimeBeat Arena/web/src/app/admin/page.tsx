import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignOutButton } from "@/components/sign-out-button";
import { getPrisma } from "@/lib/prisma";
import { getSiteConfig } from "@/lib/site-config";
import { importSocialSuggestionsAction, reviewSuggestionAction, updateLiveTvAction } from "./actions";

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
  const suggestionModel = (
    prisma as unknown as {
      linkSuggestion?: {
        findMany: (args: {
          where: { status: "PENDING" };
          orderBy: { createdAt: "asc" };
          take: number;
          include: {
            submittedBy: { select: { email: true; name: true } };
            tierList: { select: { title: true } };
            tierListItem: { select: { label: true } };
          };
        }) => Promise<
          Array<{
            id: string;
            title: string | null;
            url: string;
            note: string | null;
            submittedBy: { email: string; name: string | null };
            tierList: { title: string };
            tierListItem: { label: string } | null;
          }>
        >;
      };
    }
  ).linkSuggestion;
  const pendingSuggestions = suggestionModel?.findMany
    ? await suggestionModel.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "asc" },
        take: 100,
        include: {
          submittedBy: { select: { email: true, name: true } },
          tierList: { select: { title: true } },
          tierListItem: { select: { label: true } },
        },
      })
    : [];
  const tierLists = await prisma.tierList.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { id: true, title: true, category: true },
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
        <h2 className="text-lg font-semibold">Import social edits en suggestions</h2>
        <p className="muted mt-1 text-sm">
          Importe des liens TikTok, YouTube Shorts, Instagram Reels, X en attente de validation.
        </p>
        <form action={importSocialSuggestionsAction} className="mt-4 space-y-3">
          <select
            name="tierListId"
            required
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
          >
            <option value="">Choisir une tier list cible</option>
            {tierLists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.title} ({list.category})
              </option>
            ))}
          </select>
          <textarea
            name="rawUrls"
            rows={4}
            placeholder="Colle tes URLs ici (1 URL par ligne) puis choisis import perso."
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              name="source"
              value="seed"
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500"
            >
              Import examples social
            </button>
            <button
              type="submit"
              name="source"
              value="custom"
              className="rounded-md bg-zinc-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700"
            >
              Import mes URLs
            </button>
          </div>
        </form>
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
                  Tier list: {suggestion.tierList.title}
                  {suggestion.tierListItem ? ` · Item: ${suggestion.tierListItem.label}` : " · Cible: liste complete"}
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
