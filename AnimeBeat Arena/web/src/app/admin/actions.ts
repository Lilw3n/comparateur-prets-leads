"use server";

import { auth } from "@/auth";
import { getPrisma } from "@/lib/prisma";
import { setLiveTvEnabled } from "@/lib/site-config";
import { TierRank } from "@/generated/prisma";

/** Exemples d’URLs (formats Shorts / Reels / TikTok / X) — à valider ou remplacer par les tiennes. */
const socialSeedUrls = [
  "https://www.youtube.com/shorts/SXHMnicI6Pg",
  "https://www.youtube.com/shorts/9bZkp7q19f0",
  "https://www.youtube.com/shorts/jNQXAC9IVRw",
  "https://www.youtube.com/shorts/L_jWHffIx5E",
  "https://www.tiktok.com/@tiktok/video/7300000000000000000",
  "https://www.tiktok.com/@anime/video/7310000000000000000",
  "https://www.instagram.com/reel/C0abcdefghijklmnopqrstuvwxyz1234567890ab/",
  "https://www.instagram.com/reel/D0abcdefghijklmnopqrstuvwxyz1234567890ab/",
  "https://x.com/i/status/1900000000000000000",
  "https://x.com/i/status/1900000000000000001",
  "https://www.youtube.com/shorts/60ItHLz5WEA",
  "https://www.youtube.com/shorts/uelHwf8o7_U",
];

function inferPlatform(url: string): "YouTube Shorts" | "TikTok" | "Instagram" | "X" | "Web" {
  const lower = url.toLowerCase();
  if (lower.includes("youtube.com/shorts") || lower.includes("youtu.be")) return "YouTube Shorts";
  if (lower.includes("tiktok.com")) return "TikTok";
  if (lower.includes("instagram.com/reel")) return "Instagram";
  if (lower.includes("x.com") || lower.includes("twitter.com")) return "X";
  return "Web";
}

export async function updateLiveTvAction(formData: FormData) {
  const enabled = formData.get("liveTvEnabled") === "on";
  await setLiveTvEnabled(enabled);
}

export async function seedDefaultTierListsAction() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Acces refuse.");
  }
  const prisma = getPrisma();
  const existing = await prisma.tierList.count();
  if (existing > 0) {
    throw new Error("Des tier lists existent deja. Importe des suggestions sur une liste existante.");
  }
  await prisma.tierList.create({
    data: {
      title: "Dragon Ball Z — Arc Cell",
      category: "Arc",
      anime: "Dragon Ball Z",
      resourceUrl: "https://www.youtube.com/results?search_query=dragon+ball+z+arc+cell",
      createdById: session.user.id,
      items: {
        create: [
          {
            label: "Gohan SSJ2",
            rank: TierRank.S,
            linkUrl: "https://www.youtube.com/results?search_query=gohan+ssj2",
            sortOrder: 0,
          },
          {
            label: "Cell parfait",
            rank: TierRank.A,
            linkUrl: "https://www.youtube.com/results?search_query=perfect+cell",
            sortOrder: 1,
          },
          {
            label: "Cell Juniors",
            rank: TierRank.B,
            linkUrl: "https://www.youtube.com/results?search_query=cell+juniors",
            sortOrder: 2,
          },
        ],
      },
    },
  });
  await prisma.tierList.create({
    data: {
      title: "Top OST motivation anime",
      category: "OST",
      anime: "Multi-anime",
      resourceUrl: "https://www.youtube.com/results?search_query=anime+ost+motivation",
      createdById: session.user.id,
      items: {
        create: [
          {
            label: "You Say Run",
            rank: TierRank.S,
            linkUrl: "https://www.youtube.com/results?search_query=you+say+run",
            sortOrder: 0,
          },
          {
            label: "Unravel",
            rank: TierRank.A,
            linkUrl: "https://www.youtube.com/results?search_query=unravel+tokyo+ghoul",
            sortOrder: 1,
          },
          {
            label: "Guren no Yumiya",
            rank: TierRank.A,
            linkUrl: "https://www.youtube.com/results?search_query=guren+no+yumiya",
            sortOrder: 2,
          },
        ],
      },
    },
  });
}

export async function reviewSuggestionAction(formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Acces refuse.");
  }

  const suggestionId = String(formData.get("suggestionId") ?? "");
  const decision = String(formData.get("decision") ?? "");
  if (!suggestionId || (decision !== "APPROVED" && decision !== "REJECTED")) {
    throw new Error("Parametres invalides.");
  }

  const prisma = getPrisma();
  await prisma.linkSuggestion.update({
    where: { id: suggestionId },
    data: {
      status: decision,
      reviewedById: session.user.id,
      reviewedAt: new Date(),
    },
  });
}

export async function importSocialSuggestionsAction(formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Acces refuse.");
  }

  const tierListId = String(formData.get("tierListId") ?? "").trim();
  if (!tierListId) {
    throw new Error("Tier list obligatoire.");
  }

  const rawUrls = String(formData.get("rawUrls") ?? "").trim();
  const source = String(formData.get("source") ?? "seed");
  const urls = (source === "seed" ? socialSeedUrls : rawUrls.split(/\r?\n/))
    .map((u) => u.trim())
    .filter(Boolean)
    .filter((u, i, arr) => arr.indexOf(u) === i)
    .slice(0, 50);

  if (urls.length === 0) {
    throw new Error("Aucune URL a importer.");
  }

  const prisma = getPrisma();
  const tierList = await prisma.tierList.findUnique({
    where: { id: tierListId },
    select: { id: true },
  });
  if (!tierList) {
    throw new Error("Tier list introuvable.");
  }

  await prisma.linkSuggestion.createMany({
    data: urls.map((url) => ({
      tierListId,
      url,
      title: `${inferPlatform(url)} edit suggestion`,
      note: "Import admin social edits",
      submittedById: session.user.id,
      status: "PENDING",
    })),
  });
}

