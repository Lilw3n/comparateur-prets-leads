import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { getPrisma } from "@/lib/prisma";

const suggestionSchema = z.object({
  tierListId: z.string().min(1).max(100),
  tierListItemId: z.string().min(1).max(100).optional(),
  title: z.string().max(120).optional(),
  note: z.string().max(300).optional(),
  url: z.string().url().max(500),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Connexion requise." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide." }, { status: 400 });
  }

  const parsed = suggestionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  }

  const prisma = getPrisma();
  const data = parsed.data;
  const tierList = await prisma.tierList.findUnique({
    where: { id: data.tierListId },
    select: { id: true },
  });
  if (!tierList) {
    return NextResponse.json({ error: "Tier list introuvable." }, { status: 404 });
  }

  if (data.tierListItemId) {
    const item = await prisma.tierListItem.findFirst({
      where: { id: data.tierListItemId, tierListId: data.tierListId },
      select: { id: true },
    });
    if (!item) {
      return NextResponse.json({ error: "Item introuvable." }, { status: 404 });
    }
  }

  await prisma.linkSuggestion.create({
    data: {
      tierListId: data.tierListId,
      tierListItemId: data.tierListItemId ?? null,
      url: data.url.trim(),
      title: data.title?.trim() || null,
      note: data.note?.trim() || null,
      submittedById: session.user.id,
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}

