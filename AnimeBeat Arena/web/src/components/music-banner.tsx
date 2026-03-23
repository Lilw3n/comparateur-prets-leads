"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";

function getSpotifyEmbed(url: string): string | null {
  const clean = url.trim();
  if (!clean) return null;
  const track = clean.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
  if (track) return `https://open.spotify.com/embed/track/${track[1]}?utm_source=generator`;
  const playlist = clean.match(/spotify\.com\/playlist\/([a-zA-Z0-9]+)/);
  if (playlist) return `https://open.spotify.com/embed/playlist/${playlist[1]}?utm_source=generator`;
  const album = clean.match(/spotify\.com\/album\/([a-zA-Z0-9]+)/);
  if (album) return `https://open.spotify.com/embed/album/${album[1]}?utm_source=generator`;
  return null;
}

function getYoutubeEmbed(url: string): string | null {
  const clean = url.trim();
  if (!clean) return null;
  const watch = clean.match(/[?&]v=([a-zA-Z0-9_-]{6,})/);
  if (watch) return `https://www.youtube.com/embed/${watch[1]}`;
  const short = clean.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;
  const embed = clean.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/);
  if (embed) return `https://www.youtube.com/embed/${embed[1]}`;
  return null;
}

type Source = "spotify" | "youtube";

type Preset = {
  id: string;
  label: string;
  url: string;
};

const SESSION_PLAYLISTS_KEY = "music-banner-session-playlists";

const presets: Preset[] = [
  {
    id: "spotify-main",
    label: "Playlist Spotify - AnimeBeat Arena",
    url: "https://open.spotify.com/playlist/37i9dQZF1DX0hAXqBDwvn9",
  },
  {
    id: "spotify-chill",
    label: "Playlist Spotify - Chill Anime",
    url: "https://open.spotify.com/playlist/37i9dQZF1DX3YSRoSdA634",
  },
  {
    id: "youtube-mix",
    label: "Mix YouTube - Anime OST",
    url: "https://www.youtube.com/watch?v=4i7M4gV6RYk",
  },
];

export function MusicBanner() {
  const { data: session } = useSession();
  const isConnected = Boolean(session?.user);
  const isAdmin = session?.user?.role === "ADMIN";
  const [mounted, setMounted] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [savedUrl, setSavedUrl] = useState(presets[0].url);
  const [customPlaylists, setCustomPlaylists] = useState<Preset[]>([]);
  const [dbPlaylists, setDbPlaylists] = useState<Preset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState(presets[0].id);
  const [open, setOpen] = useState(true);
  const [dockLow, setDockLow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const allPlaylists = useMemo(
    () => [...presets, ...dbPlaylists, ...customPlaylists],
    [customPlaylists, dbPlaylists],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const storedDock = window.localStorage.getItem("music-banner-dock-low");
    setDockLow(storedDock === "1");

    const customRaw = window.sessionStorage.getItem(SESSION_PLAYLISTS_KEY);
    let customList: Preset[] = [];
    if (customRaw) {
      try {
        const parsed = JSON.parse(customRaw) as Preset[];
        if (Array.isArray(parsed)) {
          customList = parsed;
          setCustomPlaylists(parsed);
        }
      } catch {
        // ignore broken local data
      }
    }
    const stored = window.localStorage.getItem("music-banner-url");
    if (stored) {
      setSavedUrl(stored);
      const preset = [...presets, ...customList].find((p) => p.url === stored);
      setSelectedPreset(preset?.id ?? "custom");
    } else {
      window.localStorage.setItem("music-banner-url", presets[0].url);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    async function loadDbPlaylists() {
      try {
        const res = await fetch("/api/music-playlists", { cache: "no-store" });
        if (!res.ok) return;
        const payload = (await res.json()) as {
          playlists?: Array<{ id: string; label: string; url: string }>;
        };
        if (!mounted) return;
        const mapped = (payload.playlists ?? []).map((p) => ({
          id: `db-${p.id}`,
          label: `${p.label} (Admin)`,
          url: p.url,
        }));
        setDbPlaylists(mapped);
      } catch {
        // ignore loading issues
      }
    }
    loadDbPlaylists();
    return () => {
      mounted = false;
    };
  }, []);

  const parsed = useMemo(() => {
    const spotify = getSpotifyEmbed(savedUrl);
    if (spotify) return { src: spotify, source: "spotify" as Source };
    const youtube = getYoutubeEmbed(savedUrl);
    if (youtube) return { src: youtube, source: "youtube" as Source };
    return null;
  }, [savedUrl]);

  function applyUrl(raw?: string) {
    const next = (raw ?? urlInput).trim();
    if (!next) {
      setError("Colle un lien Spotify ou YouTube.");
      return;
    }
    const spotify = getSpotifyEmbed(next);
    const youtube = getYoutubeEmbed(next);
    if (!spotify && !youtube) {
      setError("Lien non reconnu. Utilise un lien track/playlist/album Spotify ou vidéo YouTube.");
      return;
    }
    setError(null);
    setSavedUrl(next);
    window.localStorage.setItem("music-banner-url", next);
    setUrlInput("");
    setOpen(true);
  }

  function clearUrl() {
    setSavedUrl("");
    window.localStorage.removeItem("music-banner-url");
    setError(null);
  }

  async function addCustomPlaylist() {
    const label = nameInput.trim();
    const link = urlInput.trim();
    if (!label) {
      setError("Ajoute un nom de playlist.");
      return;
    }
    if (!link) {
      setError("Ajoute un lien Spotify ou YouTube.");
      return;
    }
    const spotify = getSpotifyEmbed(link);
    const youtube = getYoutubeEmbed(link);
    if (!spotify && !youtube) {
      setError("Lien non reconnu. Utilise un lien track/playlist/album Spotify ou vidéo YouTube.");
      return;
    }
    if (!isConnected) {
      setError("Connecte-toi pour ajouter une playlist.");
      return;
    }

    if (isAdmin) {
      try {
        const res = await fetch("/api/music-playlists", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ label, url: link }),
        });
        if (!res.ok) {
          const payload = (await res.json().catch(() => null)) as { error?: string } | null;
          throw new Error(payload?.error ?? "Impossible d'enregistrer en base.");
        }
        const payload = (await res.json()) as { playlist: { id: string; label: string; url: string } };
        const created = {
          id: `db-${payload.playlist.id}`,
          label: `${payload.playlist.label} (Admin)`,
          url: payload.playlist.url,
        };
        setDbPlaylists((prev) => [created, ...prev]);
        setSelectedPreset(created.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur serveur.");
        return;
      }
    } else {
      const id = `session-${Date.now()}`;
      const next: Preset[] = [...customPlaylists, { id, label, url: link }];
      setCustomPlaylists(next);
      window.sessionStorage.setItem(SESSION_PLAYLISTS_KEY, JSON.stringify(next));
      setSelectedPreset(id);
    }

    setError(null);
    setNameInput("");
    applyUrl(link);
  }

  function removeCurrentCustomPlaylist() {
    if (!selectedPreset.startsWith("session-")) return;
    const next = customPlaylists.filter((p) => p.id !== selectedPreset);
    setCustomPlaylists(next);
    window.sessionStorage.setItem(SESSION_PLAYLISTS_KEY, JSON.stringify(next));
    setSelectedPreset(presets[0].id);
    applyUrl(presets[0].url);
  }

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={`fixed inset-x-0 z-50 px-3 sm:px-4 ${dockLow ? "bottom-0 pb-0" : "bottom-0 pb-3 sm:pb-4"}`}
    >
      <div className="glass-panel-strong mx-auto w-full max-w-[96rem] rounded-xl p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <p className="mr-2 font-semibold text-emerald-300">Lecteur musique</p>
          <select
            value={selectedPreset}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedPreset(value);
              if (value !== "custom") {
                const preset = allPlaylists.find((p) => p.id === value);
                if (preset) applyUrl(preset.url);
              }
            }}
            className="rounded-md border border-slate-600 bg-slate-800 px-2 py-1 text-xs text-slate-100"
          >
            {allPlaylists.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.label}
              </option>
            ))}
            <option value="custom">Lien personnalisé</option>
          </select>
          <a
            href={savedUrl || presets[0].url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-500"
          >
            Ouvrir dans Spotify/YouTube
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-md border border-slate-500 px-2.5 py-1 text-xs text-slate-200 hover:bg-slate-800"
          >
            {open ? "Masquer" : "Afficher"}
          </button>
          <button
            type="button"
            onClick={() => {
              const next = !dockLow;
              setDockLow(next);
              window.localStorage.setItem("music-banner-dock-low", next ? "1" : "0");
            }}
            className="rounded-md border border-slate-500 px-2.5 py-1 text-xs text-slate-200 hover:bg-slate-800"
          >
            {dockLow ? "Position normale" : "Descendre"}
          </button>
        </div>

        <p className="mt-1 text-xs text-slate-300/85">
          La musique continue meme si tu reduis la barre.
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <input
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Nom playlist"
            className="w-40 rounded-md border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-cyan-400"
          />
          <input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Colle un lien Spotify ou YouTube"
            className="min-w-[220px] flex-1 rounded-md border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-cyan-400"
          />
          <button
            type="button"
            onClick={() => {
              setSelectedPreset("custom");
              applyUrl();
            }}
            className="rounded-md bg-cyan-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-cyan-500"
          >
            Charger
          </button>
          <button
            type="button"
            onClick={addCustomPlaylist}
            className="rounded-md bg-violet-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-violet-500"
          >
            {isAdmin ? "Ajouter playlist (base admin)" : "Ajouter playlist (session)"}
          </button>
          {selectedPreset.startsWith("session-") ? (
            <button
              type="button"
              onClick={removeCurrentCustomPlaylist}
              className="rounded-md border border-rose-500/60 px-2.5 py-1.5 text-xs text-rose-200 hover:bg-rose-900/30"
            >
              Supprimer playlist
            </button>
          ) : null}
          <button
            type="button"
            onClick={clearUrl}
            className="rounded-md border border-slate-500 px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-800"
          >
            Vider
          </button>
        </div>

        {error ? <p className="mt-2 text-xs text-amber-300">{error}</p> : null}
        {isConnected ? (
          <p className="mt-1 text-[11px] text-slate-300/85">
            {isAdmin
              ? "Mode admin: les playlists ajoutees ici sont enregistrees en base de donnees."
              : "Mode utilisateur connecte: playlists temporaires conservees uniquement pendant la session."}
          </p>
        ) : (
          <p className="mt-1 text-[11px] text-slate-300/85">
            Connecte-toi pour ajouter tes propres playlists.
          </p>
        )}

        {open && parsed ? (
          <div className="mt-3 overflow-hidden rounded-lg border border-slate-600 bg-slate-800/70">
            <iframe
              src={parsed.src}
              title={`Lecteur ${parsed.source}`}
              width="100%"
              height={parsed.source === "spotify" ? 170 : 300}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

