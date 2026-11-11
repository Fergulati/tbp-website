"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

/* Pagefind is a static index in /public/pagefind, loaded in the browser on demand. */
interface PagefindResultData {
  url: string;
  excerpt: string;
  meta: Record<string, string>;
}
interface PagefindApi {
  init: () => Promise<void>;
  debouncedSearch: (
    query: string,
    options?: Record<string, unknown>,
    debounceMs?: number,
  ) => Promise<{ results: { id: string; data: () => Promise<PagefindResultData> }[] } | null>;
}

interface Clip {
  id: string;
  title: string;
  slug: string;
  date: string;
  seconds: number;
  excerpt: string;
  youtubeId?: string;
  audioUrl?: string;
}

const PAGE_SIZE = 8;
const SUGGESTIONS = ["quantum computing", "lightning network", "DAO", "privacy", "stablecoins"];

let pagefindPromise: Promise<PagefindApi> | null = null;
function loadPagefind(): Promise<PagefindApi> {
  if (!pagefindPromise) {
    const path = "/pagefind/pagefind.js";
    pagefindPromise = import(/* webpackIgnore: true */ path).then(async (mod: PagefindApi) => {
      await mod.init();
      return mod;
    });
    pagefindPromise.catch(() => {
      pagefindPromise = null;
    });
  }
  return pagefindPromise;
}

function formatTimestamp(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  return `${h > 0 ? `${h}:` : ""}${mm}:${String(s).padStart(2, "0")}`;
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const date = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

interface ClipSearchProps {
  /** Keep the query in the URL (?q=) so searches can be shared. Use on /search only. */
  syncUrl?: boolean;
  autoFocus?: boolean;
  /** One line shown under the search box before anything is typed. */
  hint?: string;
}

export function ClipSearch({ syncUrl = false, autoFocus = false, hint }: ClipSearchProps) {
  const [query, setQuery] = useState("");
  const [clips, setClips] = useState<Clip[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<"idle" | "searching" | "done" | "error">("idle");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const pending = useRef<{ id: string; data: () => Promise<PagefindResultData> }[]>([]);
  const latestQuery = useRef("");

  const loadMore = useCallback(async () => {
    const batch = pending.current.splice(0, PAGE_SIZE);
    const loaded = await Promise.all(batch.map((r) => r.data()));
    const next: Clip[] = loaded.map((data, i) => ({
      id: batch[i].id,
      title: data.meta.title ?? "Untitled episode",
      slug: data.meta.slug ?? "",
      date: data.meta.date ?? "",
      seconds: Number(data.meta.t ?? 0),
      excerpt: data.excerpt,
      youtubeId: data.meta.youtubeId,
      audioUrl: data.meta.audioUrl,
    }));
    setClips((current) => [...current, ...next]);
  }, []);

  const runSearch = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      latestQuery.current = trimmed;
      if (syncUrl) {
        const url = trimmed ? `?q=${encodeURIComponent(trimmed)}` : window.location.pathname;
        window.history.replaceState(null, "", url);
      }
      if (trimmed.length < 2) {
        pending.current = [];
        setClips([]);
        setTotal(0);
        setPlayingId(null);
        setStatus("idle");
        return;
      }
      setStatus("searching");
      try {
        const pagefind = await loadPagefind();
        const search = await pagefind.debouncedSearch(trimmed, {}, 250);
        // null means a newer keystroke superseded this search.
        if (!search || latestQuery.current !== trimmed) return;
        pending.current = [...search.results];
        setTotal(search.results.length);
        setClips([]);
        setPlayingId(null);
        await loadMore();
        setStatus("done");
      } catch {
        setStatus("error");
      }
    },
    [loadMore, syncUrl],
  );

  // Pick up a shared ?q= link on first load.
  useEffect(() => {
    if (!syncUrl) return;
    const initial = new URLSearchParams(window.location.search).get("q");
    if (initial) {
      setQuery(initial);
      void runSearch(initial);
    }
  }, [syncUrl, runSearch]);

  const onChange = (text: string) => {
    setQuery(text);
    void runSearch(text);
  };

  return (
    <div className="w-full">
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          void runSearch(query);
        }}
        className="flex items-center gap-3 rounded-full border-2 border-foreground bg-background py-2 pl-5 pr-2 sm:pl-7"
      >
        <svg
          className="h-5 w-5 flex-shrink-0 text-foreground"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.2}
          stroke="currentColor"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => void loadPagefind().catch(() => {})}
          autoFocus={autoFocus}
          placeholder="Search what was said"
          aria-label="Search episode transcripts"
          className="min-w-0 flex-1 bg-transparent py-3 text-lg text-foreground placeholder:text-muted focus:outline-none sm:text-xl"
        />
        <button
          type="submit"
          className="flex-shrink-0 rounded-full bg-brand px-5 py-3.5 text-base font-semibold text-foreground transition-colors hover:bg-brand-hover sm:px-7"
        >
          Search
        </button>
      </form>

      {status === "idle" && (
        <div className="mt-5 flex flex-col items-center gap-4">
          {hint && <p className="text-[13px] text-muted">{hint}</p>}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-[13px] text-muted">Try</span>
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => onChange(suggestion)}
                className="rounded-full border border-border px-3.5 py-1.5 text-[13px] font-medium text-foreground transition-colors hover:border-foreground"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      <div aria-live="polite" className="mt-10 text-left">
        {status === "searching" && <p className="text-center text-sm text-muted">Searching…</p>}
        {status === "error" && (
          <p className="text-center text-sm text-muted">
            Search isn’t available right now. Please try again in a moment.
          </p>
        )}
        {status === "done" && total === 0 && (
          <p className="text-center text-sm text-muted">
            No moments found for “{query.trim()}”. Try a different word or phrase.
          </p>
        )}
        {status === "done" && total > 0 && (
          <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-muted">
            {total.toLocaleString()} moment{total === 1 ? "" : "s"} for “{query.trim()}”
          </p>
        )}

        {clips.length > 0 && (
          <ul>
            {clips.map((clip) => {
              const playing = playingId === clip.id;
              const canPlay = Boolean(clip.youtubeId || clip.audioUrl);
              const stamp = formatTimestamp(clip.seconds);
              return (
                <li key={clip.id} className="border-b border-border py-6">
                  <div className="flex flex-col items-start gap-4 sm:flex-row sm:gap-7">
                    <button
                      type="button"
                      disabled={!canPlay}
                      onClick={() => setPlayingId(playing ? null : clip.id)}
                      aria-label={playing ? `Close player at ${stamp}` : `Play from ${stamp} in ${clip.title}`}
                      className="flex flex-shrink-0 items-center gap-2.5 rounded-full bg-foreground py-3 pl-3.5 pr-[18px] font-mono text-[15px] text-background transition-opacity hover:opacity-85 disabled:opacity-30"
                    >
                      {playing ? (
                        <svg className="h-4 w-4 text-brand" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4 text-brand" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                      {stamp}
                    </button>

                    <div className="min-w-0 flex-1">
                      <p
                        className="clip-excerpt text-lg leading-relaxed text-foreground"
                        dangerouslySetInnerHTML={{ __html: `“…${clip.excerpt}…”` }}
                      />
                      <p className="mt-2 text-sm text-muted">
                        <Link
                          href={`/episodes/${clip.slug}?t=${clip.seconds}`}
                          className="font-semibold text-foreground transition-colors hover:text-accent"
                        >
                          {clip.title}
                        </Link>
                        {formatDate(clip.date) && <> · {formatDate(clip.date)}</>}
                      </p>
                    </div>
                  </div>

                  {playing && clip.youtubeId && (
                    <div className="relative mt-5 aspect-video w-full overflow-hidden rounded-2xl bg-foreground">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${clip.youtubeId}?start=${clip.seconds}&autoplay=1`}
                        title={`${clip.title} at ${stamp}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 h-full w-full border-0"
                      />
                    </div>
                  )}
                  {playing && !clip.youtubeId && clip.audioUrl && (
                    <audio
                      controls
                      autoPlay
                      preload="metadata"
                      src={`${clip.audioUrl}#t=${clip.seconds}`}
                      className="mt-5 w-full"
                      aria-label={`${clip.title} at ${stamp}`}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {status === "done" && clips.length < total && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => void loadMore()}
              className="rounded-full border-2 border-foreground px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              Show more moments
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
