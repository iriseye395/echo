import Image from "next/image";
import { HeartIcon, PauseIcon, PlayIcon, VolumeIcon } from "@/components/echo/icons";
import { shellNowPlaying } from "@/lib/echo-data";

type PlayerBarProps = {
  paused?: boolean;
};

export function PlayerBar({ paused = false }: PlayerBarProps) {
  return (
    <footer className="echo-player-glass fixed bottom-0 left-0 right-0 z-50 h-24 px-5 lg:px-10">
      <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between gap-4">
        <div className="hidden min-w-0 flex-1 items-center gap-4 md:flex">
          <Image
            src={shellNowPlaying.image}
            alt={shellNowPlaying.title}
            width={56}
            height={56}
            className="h-14 w-14 rounded-lg object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">{shellNowPlaying.title}</p>
            <p className="truncate text-xs text-[var(--on-surface-variant)]">{shellNowPlaying.subtitle}</p>
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
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--primary),var(--primary-dim))] text-[var(--on-primary)]"
              aria-label={paused ? "Play" : "Pause"}
            >
              {paused ? <PlayIcon className="size-4" /> : <PauseIcon className="size-4" />}
            </button>
            <button type="button" className="h-11 w-11 rounded-full hover:bg-white/10" aria-label="Next" />
          </div>

          <div className="flex w-full items-center gap-3">
            <span className="w-10 text-right text-[10px] text-[var(--outline-variant)]">{shellNowPlaying.elapsed}</span>
            <label className="group relative flex-1">
              <input
                type="range"
                min={0}
                max={100}
                defaultValue={Math.round(shellNowPlaying.progress * 100)}
                className="echo-range"
                aria-label="Track progress"
              />
            </label>
            <span className="w-10 text-[10px] text-[var(--outline-variant)]">{shellNowPlaying.total}</span>
          </div>
        </div>

        <div className="hidden flex-1 items-center justify-end gap-4 md:flex">
          <button type="button" className="text-[var(--on-surface-variant)] hover:text-white" aria-label="Volume">
            <VolumeIcon className="size-4" />
          </button>
          <div className="h-1 w-24 rounded-full bg-[var(--surface-container-highest)]">
            <div className="h-full w-3/4 rounded-full bg-[var(--on-surface-variant)]" />
          </div>
        </div>
      </div>
    </footer>
  );
}
