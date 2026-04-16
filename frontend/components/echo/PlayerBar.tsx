"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { usePlayback } from "@/components/echo/PlaybackProvider";
import { HeartIcon, PauseIcon, PlayIcon, VolumeIcon } from "@/components/echo/icons";
import { shellNowPlaying } from "@/lib/echo-data";

type PlayerBarProps = {
  paused?: boolean;
};

export function PlayerBar({ paused = false }: PlayerBarProps) {
  const {
    currentTrack,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    progressPercent,
    togglePlayback,
    seekToPercent,
    volume,
    setVolume,
    error,
  } = usePlayback();

  const displayTitle = currentTrack?.title ?? shellNowPlaying.title;
  const displaySubtitle = currentTrack?.artist ?? shellNowPlaying.subtitle;
  const displayImage = currentTrack?.image ?? shellNowPlaying.image;

  const elapsed = formatClock(currentTime || shellNowPlaying.progress * 240);
  const total = formatClock(duration || 240);

  const sliderStyle = {
    "--value": `${progressPercent}%`,
  } as CSSProperties;

  return (
    <footer className="echo-player-glass fixed bottom-0 left-0 right-0 z-50 h-24 px-5 lg:px-10">
      <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between gap-4">
        <div className="hidden min-w-0 flex-1 items-center gap-4 md:flex">
          <Image
            src={displayImage}
            alt={displayTitle}
            width={56}
            height={56}
            className="h-14 w-14 rounded-lg object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">{displayTitle}</p>
            <p className="truncate text-xs text-[var(--on-surface-variant)]">{displaySubtitle}</p>
          </div>
          <button type="button" className="text-[var(--on-surface-variant)] hover:text-[var(--tertiary)]" aria-label="Favorite">
            <HeartIcon className="size-4" />
          </button>
        </div>

        <div className="mx-auto flex w-full max-w-[640px] flex-col items-center gap-2">
          <div className="flex items-center gap-8 text-[var(--on-surface-variant)]">
            <button type="button" className="h-11 w-11 rounded-full hover:bg-white/10" aria-label="Previous" />
            <button
              type="button"
              disabled={!currentTrack || isLoading}
              onClick={() => {
                void togglePlayback();
              }}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--primary),var(--primary-dim))] text-[var(--on-primary)]"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <PauseIcon className="size-4" /> : <PlayIcon className="size-4" />}
            </button>
            <button type="button" className="h-11 w-11 rounded-full hover:bg-white/10" aria-label="Next" />
          </div>

          <div className="flex w-full items-center gap-3">
            <span className="w-10 text-right text-[10px] text-[var(--outline-variant)]">{elapsed}</span>
            <label className="group relative flex-1">
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(progressPercent)}
                onChange={(event) => {
                  seekToPercent(Number(event.target.value));
                }}
                className="echo-range"
                style={sliderStyle}
                aria-label="Track progress"
              />
            </label>
            <span className="w-10 text-[10px] text-[var(--outline-variant)]">{total}</span>
          </div>
        </div>

        <div className="hidden flex-1 items-center justify-end gap-4 md:flex">
          <button type="button" className="text-[var(--on-surface-variant)] hover:text-white" aria-label="Volume">
            <VolumeIcon className="size-4" />
          </button>
          <div className="h-1 w-24 rounded-full bg-[var(--surface-container-highest)]">
            <div className="h-full rounded-full bg-[var(--on-surface-variant)]" style={{ width: `${Math.round(volume * 100)}%` }} />
          </div>
          <label className="sr-only" htmlFor="volume-range">Set volume</label>
          <input
            id="volume-range"
            type="range"
            min={0}
            max={100}
            value={Math.round(volume * 100)}
            onChange={(event) => setVolume(Number(event.target.value) / 100)}
            className="hidden"
          />
        </div>

        <div className="sr-only" aria-live="polite">
          {error ? `Playback error: ${error}` : "Playback ready"}
        </div>
      </div>
    </footer>
  );
}

function formatClock(value: number): string {
  const safe = Math.max(0, Math.floor(value));
  const mins = Math.floor(safe / 60);
  const secs = String(safe % 60).padStart(2, "0");
  return `${mins}:${secs}`;
}
