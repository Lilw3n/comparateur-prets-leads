"use server";

import { auth } from "@/auth";
import { getPrisma } from "@/lib/prisma";
import { setLiveTvEnabled } from "@/lib/site-config";

const socialSeedUrls = [
  "https://www.youtube.com/shorts/rGv8xVjC6rE",
  "https://www.youtube.com/shorts/Yf4fJ2z2YhQ",
  "https://www.youtube.com/shorts/GhX7LqQhQ6M",
  "https://www.tiktok.com/@animeedits/video/7244312312312312312",
  "https://www.tiktok.com/@amv.only/video/7267812312312312312",
  "https://www.instagram.com/reel/C5tW1k8Nq3b/",
  "https://www.instagram.com/reel/C7L2Xf0pQ1m/",
  "https://x.com/search?q=anime%20edit%20video&src=typed_query&f=live",
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

