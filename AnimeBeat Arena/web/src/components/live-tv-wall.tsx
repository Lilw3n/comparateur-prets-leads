"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { KICK_URL, TIKTOK_URL } from "@/lib/constants";

const TWITCH_CHANNEL = "lilwen54";
const KICK_CHANNEL = "lilwen54";
const TIKTOK_HANDLE = "@idonlikeuspam";

type TvChannel = {
  id: "kick" | "twitch" | "tiktok";
  name: string;
  note: string;
  buildSrc: (host: string) => string;
  profileUrl: string;
};

function normalizeHost(host: string): string {
  if (host === "127.0.0.1") return "localhost";
  return host;
}

export function LiveTvWall() {
  const [active, setActive] = useState<Set<TvChannel["id"]>>(new Set(["kick"]));
  const [layout, setLayout] = useState<"single" | "split2" | "split3">("single");
  const [mainChannel, setMainChannel] = useState<TvChannel["id"]>("kick");
  const [host, setHost] = useState("localhost");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHost(normalizeHost(window.location.hostname));
    }
  }, []);

  const channels = useMemo<TvChannel[]>(() => {
    return [
      {
        id: "kick",
        name: "Kick Live",
        note: "Live principal",
        buildSrc: () => `https://player.kick.com/${KICK_CHANNEL}`,
        profileUrl: KICK_URL,
      },
      {
        id: "twitch",
        name: "Twitch Live",
        note: "Nécessite paramètre parent",
        buildSrc: (currentHost: string) =>
          `https://player.twitch.tv/?channel=${TWITCH_CHANNEL}&parent=${encodeURIComponent(currentHost)}&muted=true`,
        profileUrl: `https://www.twitch.tv/${TWITCH_CHANNEL}`,
      },
      {
        id: "tiktok",
        name: "TikTok Live",
        note: "Intégration parfois bloquée",
        buildSrc: () => `https://www.tiktok.com/${TIKTOK_HANDLE}/live`,
        profileUrl: TIKTOK_URL,
      },
    ];
  }, [host]);

  function toggle(id: TvChannel["id"]) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setMainChannel(id);
  }

  async function toggleFullscreen() {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }

  const activeChannels = channels.filter((c) => active.has(c.id));
  const effectiveMain =
    activeChannels.find((c) => c.id === mainChannel)?.id ?? activeChannels[0]?.id ?? null;
  const primaryChannel = activeChannels.find((c) => c.id === effectiveMain) ?? null;
  const secondaryChannels = activeChannels.filter((c) => c.id !== effectiveMain);
  const splitChannels =
    layout === "split2" ? activeChannels.slice(0, 2) : layout === "split3" ? activeChannels.slice(0, 3) : [];

  return (
    <section className="glass-panel mt-6 rounded-xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">TV Live</h2>
        <p className="muted text-xs">Allume/éteins Kick, Twitch, TikTok directement depuis le site.</p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="muted text-xs">Mode d'affichage :</span>
        <button
          type="button"
          onClick={() => setLayout("single")}
          className={`rounded-md px-3 py-1.5 text-xs font-medium ${layout === "single" ? "btn-primary" : "btn-secondary"}`}
        >
          Grande TV
        </button>
        <button
          type="button"
          onClick={() => setLayout("split2")}
          className={`rounded-md px-3 py-1.5 text-xs font-medium ${layout === "split2" ? "btn-primary" : "btn-secondary"}`}
        >
          2 écrans
        </button>
        <button
          type="button"
          onClick={() => setLayout("split3")}
          className={`rounded-md px-3 py-1.5 text-xs font-medium ${layout === "split3" ? "btn-primary" : "btn-secondary"}`}
        >
          3 écrans
        </button>
        <button type="button" onClick={toggleFullscreen} className="btn-secondary rounded-md px-3 py-1.5 text-xs font-medium">
          Plein écran
        </button>
      </div>

      <div ref={containerRef} className="mt-4">
        {layout === "single" && primaryChannel ? (
          <div className="space-y-3">
            <div className="overflow-hidden rounded-xl border border-zinc-700/70 bg-zinc-950/70">
              <iframe
                title={`${primaryChannel.name} player`}
                src={primaryChannel.buildSrc(host)}
                width="100%"
                height={520}
                allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="muted text-xs">TV principale :</span>
              {activeChannels.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setMainChannel(c.id)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                    effectiveMain === c.id ? "btn-primary" : "btn-secondary"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
            {secondaryChannels.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2">
                {secondaryChannels.map((c) => (
                  <div key={`mini-${c.id}`} className="overflow-hidden rounded-lg border border-zinc-700/70">
                    <iframe
                      title={`${c.name} mini player`}
                      src={c.buildSrc(host)}
                      width="100%"
                      height={230}
                      allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {(layout === "split2" || layout === "split3") && splitChannels.length > 0 ? (
          <div className={`grid gap-3 ${layout === "split2" ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
            {splitChannels.map((channel) => (
              <div key={`split-${channel.id}`} className="overflow-hidden rounded-xl border border-zinc-700/70 bg-zinc-950/70">
                <iframe
                  title={`${channel.name} split player`}
                  src={channel.buildSrc(host)}
                  width="100%"
                  height={340}
                  allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                />
              </div>
            ))}
          </div>
        ) : null}

        {activeChannels.length === 0 ? (
          <div className="muted rounded-lg border border-zinc-700/50 bg-zinc-900/40 px-3 py-4 text-xs">
            Aucune TV allumée. Active au moins une chaîne ci-dessous.
          </div>
        ) : null}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {channels.map((channel) => {
          const isOn = active.has(channel.id);
          return (
            <article key={channel.id} className="glass-panel rounded-xl p-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="font-semibold">{channel.name}</h3>
                  <p className="muted text-xs">{channel.note}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggle(channel.id)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                    isOn ? "btn-primary" : "btn-secondary"
                  }`}
                >
                  {isOn ? "Éteindre" : "Allumer"}
                </button>
              </div>

              <div className="muted mt-3 rounded-lg border border-zinc-700/50 bg-zinc-900/40 px-3 py-4 text-xs">
                {isOn ? "Chaîne active" : "Chaîne en veille"}
              </div>

              <a
                href={channel.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex text-xs font-medium text-indigo-200 hover:text-indigo-100"
              >
                Ouvrir {channel.name} dans un onglet →
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}

