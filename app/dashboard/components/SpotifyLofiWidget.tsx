"use client";

// Simple Spotify embed for a lofi beats playlist.
// Uses Spotify's public embed, so no OAuth is required.

export default function SpotifyLofiWidget() {
  return (
    <div className="mt-4">
      <p className="mb-2 font-mono text-[11px] tracking-widest text-white/40">
        LOFI FOCUS
      </p>
      <iframe
        // Spotify editorial "lofi beats" playlist (stable, public)
        src="https://open.spotify.com/embed/playlist/37i9dQZF1DXc8kgYqQLMfH?utm_source=generator"
        width="100%"
        height="360"
        className="w-full rounded-xl border border-white/10"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    </div>
  );
}

