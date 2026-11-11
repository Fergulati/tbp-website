#!/usr/bin/env node
/**
 * Build the clip-search index.
 *
 * Reads every transcript in data/transcripts/ (written by fetch_captions.py and
 * transcribe_audio.py) and indexes each ~25 second segment as its own search
 * record, so a search hit is a moment in an episode rather than a whole episode.
 *
 * Output: public/pagefind/ (static files, loaded in the browser on demand).
 *
 * Usage (from tbp-next/):  node scripts/build-search-index.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import * as pagefind from "pagefind";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TRANSCRIPTS_DIR = path.join(ROOT, "data", "transcripts");
// Content sits beside this app in the repo (../content); a standalone checkout
// keeps it in a sibling tbp-website folder.
const CONTENT_DIR =
  process.env.CONTENT_DIR ||
  [path.resolve(ROOT, "..", "content"), path.resolve(ROOT, "..", "tbp-website", "content")].find(
    (dir) => fs.existsSync(dir),
  );
if (!CONTENT_DIR) throw new Error("content directory not found; set CONTENT_DIR");
const EPISODES_DIR = path.join(CONTENT_DIR, "episodes");
const OUTPUT_DIR = path.join(ROOT, "public", "pagefind");

function walkJson(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkJson(full));
    else if (entry.name.endsWith(".json") && !entry.name.startsWith("_")) out.push(full);
  }
  return out;
}

function toIsoDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

const files = walkJson(TRANSCRIPTS_DIR);
const { index, errors } = await pagefind.createIndex();
if (!index) throw new Error(`pagefind failed to start: ${errors.join("; ")}`);

let episodes = 0;
let clips = 0;
let skipped = 0;

for (const file of files) {
  const transcript = JSON.parse(fs.readFileSync(file, "utf-8"));
  const mdPath = path.join(EPISODES_DIR, `${transcript.slug}.md`);
  if (!fs.existsSync(mdPath)) {
    skipped++;
    continue;
  }
  const { data: fm } = matter(fs.readFileSync(mdPath, "utf-8"));
  if (fm.draft || !fm.title) {
    skipped++;
    continue;
  }

  const parts = transcript.slug.split("/");
  const channel = parts.length > 1 ? parts[0] : "tbp";
  const meta = {
    title: String(fm.title),
    date: toIsoDate(fm.date),
    slug: transcript.slug,
    channel,
  };
  if (transcript.youtubeId) meta.youtubeId = transcript.youtubeId;
  if (fm.audioUrl) meta.audioUrl = String(fm.audioUrl).trim();
  if (fm.thumbnail) meta.image = String(fm.thumbnail);

  for (const [start, text] of transcript.segments) {
    const seconds = Math.max(0, Math.floor(start));
    const result = await index.addCustomRecord({
      url: `/episodes/${transcript.slug}?t=${seconds}`,
      content: text,
      language: "en",
      meta: { ...meta, t: String(seconds) },
      filters: { channel: [channel] },
      sort: { date: meta.date },
    });
    if (result.errors.length) throw new Error(result.errors.join("; "));
    clips++;
  }
  episodes++;
}

fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
const written = await index.writeFiles({ outputPath: OUTPUT_DIR });
if (written.errors.length) throw new Error(written.errors.join("; "));
await pagefind.close();

console.log(
  `Indexed ${clips} clips from ${episodes} episodes (${skipped} skipped) -> ${path.relative(ROOT, OUTPUT_DIR)}`,
);
