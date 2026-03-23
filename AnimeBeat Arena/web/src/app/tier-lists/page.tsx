import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { getPrisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/site-header";
import { PromoBanners } from "@/components/promo-banners";
import { LinkSuggestionForm } from "@/components/link-suggestion-form";

const fallbackTierLists = [
  {
    title: "Dragon Ball Z — Arc Cell",
    category: "Arc",
    anime: "Dragon Ball Z",
    resourceUrl: "https://www.youtube.com/results?search_query=dragon+ball+z+arc+cell",
    items: [
      { label: "Gohan SSJ2", rank: "S", linkUrl: "https://www.youtube.com/results?search_query=gohan+ssj2" },
      { label: "Cell parfait", rank: "A", linkUrl: "https://www.youtube.com/results?search_query=perfect+cell" },
      { label: "Cell Juniors", rank: "B", linkUrl: "https://www.youtube.com/results?search_query=cell+juniors" },
    ],
  },
  {
    title: "Top OST motivation anime",
    category: "OST",
    anime: "Multi-anime",
    resourceUrl: "https://www.youtube.com/results?search_query=anime+ost+motivation",
    items: [
      { label: "You Say Run", rank: "S", linkUrl: "https://www.youtube.com/results?search_query=you+say+run" },
      { label: "Unravel", rank: "A", linkUrl: "https://www.youtube.com/results?search_query=unravel+tokyo+ghoul" },
      { label: "Guren no Yumiya", rank: "A", linkUrl: "https://www.youtube.com/results?search_query=guren+no+yumiya" },
    ],
  },
];

export default async function TierListsPage() {
  const session = await auth();
  const prisma = getPrisma();

  const tierLists = await prisma.tierList.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      createdBy: { select: { name: true, email: true } },
      items: { orderBy: [{ rank: "asc" }, { sortOrder: "asc" }] },
      _count: { select: { votes: true } },
    },
  });

  const approvedSuggestions = await prisma.linkSuggestion.findMany({
    where: { status: "APPROVED" },
    select: { tierListId: true, tierListItemId: true, url: true, title: true },
    orderBy: { createdAt: "desc" },
    take: 300,
  });

  const listSuggestionMap = new Map<string, Array<{ url: string; title: string | null }>>();
  const itemSuggestionMap = new Map<string, Array<{ url: string; title: string | null }>>();
  for (const suggestion of approvedSuggestions) {
    if (suggestion.tierListItemId) {
      const itemLinks = itemSuggestionMap.get(suggestion.tierListItemId) ?? [];
      itemLinks.push({ url: suggestion.url, title: suggestion.title });
      itemSuggestionMap.set(suggestion.tierListItemId, itemLinks);
      continue;
    }
    const listLinks = listSuggestionMap.get(suggestion.tierListId) ?? [];
    listLinks.push({ url: suggestion.url, title: suggestion.title });
    listSuggestionMap.set(suggestion.tierListId, listLinks);
  }

  const listsToRender =
    tierLists.length > 0
      ? tierLists.map((list) => ({
          id: list.id,
          title: list.title,
          category: list.category,
          anime: list.anime ?? "Non précisé",
          resourceUrl: list.resourceUrl,
          author: list.createdBy.name || list.createdBy.email,
          votes: list._count.votes,
          approvedLinks: listSuggestionMap.get(list.id) ?? [],
          items: list.items.map((item) => ({
            id: item.id,
            label: item.label,
            rank: item.rank,
            linkUrl: item.linkUrl,
            approvedLinks: itemSuggestionMap.get(item.id) ?? [],
          })),
        }))
      : fallbackTierLists.map((list) => ({
          id: null,
          ...list,
          author: "Exemple",
          votes: 0,
          approvedLinks: [],
          items: list.items.map((item) => ({ ...item, id: null, approvedLinks: [] })),
        }));

  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <div className="anime-grid pointer-events-none absolute inset-0" />
      <SiteHeader />
      <main className="relative z-10 mx-auto w-full max-w-5xl px-4 py-12">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Tier Lists <span className="neon-text">Anime/Manga</span>
            </h1>
            <p className="muted mt-2">
              Classements communautaires par oeuvre, arc, personnage, OST et plus.
            </p>
          </div>
          {session?.user ? (
            <p className="glass-panel rounded-lg px-3 py-2 text-sm text-zinc-200">
              Connecté en tant que {session.user.email}
            </p>
          ) : (
            <Link
              href="/login?callbackUrl=/tier-lists"
              className="btn-primary rounded-lg px-4 py-2 text-sm font-medium"
            >
              Se connecter pour participer
            </Link>
          )}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {listsToRender.map((list) => (
            <article key={`${list.id ?? "fallback"}-${list.title}-${list.category}`} className="glass-panel rounded-xl p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-semibold">{list.title}</h2>
                <span className="rounded-full border border-indigo-300/35 bg-indigo-500/15 px-2.5 py-1 text-xs font-medium text-indigo-100">
                  {list.category}
                </span>
              </div>
              <p className="muted mt-1 text-sm">
                {list.anime} · par {list.author} · {list.votes} vote(s)
              </p>
              {list.resourceUrl ? (
                <a
                  href={list.resourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex text-xs font-medium text-cyan-200 hover:text-cyan-100"
                >
                  Voir la source principale →
                </a>
              ) : null}
              {list.approvedLinks.length > 0 ? (
                <div className="mt-2 space-y-1">
                  {list.approvedLinks.slice(0, 4).map((link, idx) => (
                    <a
                      key={`${link.url}-${idx}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-xs text-emerald-200 hover:text-emerald-100"
                    >
                      Suggestion validee: {link.title || link.url}
                    </a>
                  ))}
                </div>
              ) : null}
              <ul className="mt-4 space-y-2 text-sm">
                {list.items.map((item, idx) => (
                  <li
                    key={`${item.label}-${idx}`}
                    className="flex items-center justify-between rounded-md border border-zinc-700/40 bg-zinc-900/60 px-3 py-2"
                  >
                    <span className="inline-flex items-center gap-2">
                      <span>{item.label}</span>
                      {item.linkUrl ? (
                        <a
                          href={item.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-medium text-cyan-200 hover:text-cyan-100"
                        >
                          Lien →
                        </a>
                      ) : null}
                      {item.approvedLinks.length > 0 ? (
                        <span className="inline-flex items-center gap-2">
                          {item.approvedLinks.slice(0, 2).map((link, linkIdx) => (
                            <a
                              key={`${link.url}-${linkIdx}`}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-medium text-emerald-200 hover:text-emerald-100"
                            >
                              Suggestion: {link.title || "Lien"}
                            </a>
                          ))}
                        </span>
                      ) : null}
                    </span>
                    <span className="font-semibold text-indigo-300">{item.rank}</span>
                  </li>
                ))}
              </ul>
              {session?.user && list.id ? (
                <LinkSuggestionForm
                  tierListId={list.id}
                  items={list.items
                    .filter((item) => item.id)
                    .map((item) => ({ id: item.id as string, label: item.label }))}
                />
              ) : null}
            </article>
          ))}
        </div>
        <section className="glass-panel mt-6 overflow-hidden rounded-xl p-3">
          <Image
            src="/images/anime-tierlist.svg"
            alt="Visuel anime pour la zone tier list"
            width={1400}
            height={900}
            className="h-auto w-full rounded-lg"
          />
        </section>
        <PromoBanners />
      </main>
    </div>
  );
}

