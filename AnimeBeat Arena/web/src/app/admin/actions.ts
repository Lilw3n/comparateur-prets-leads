"use server";

import { auth } from "@/auth";
import { getPrisma } from "@/lib/prisma";
import { setLiveTvEnabled } from "@/lib/site-config";

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

